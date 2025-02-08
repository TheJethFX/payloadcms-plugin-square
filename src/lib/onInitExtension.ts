import type { Payload } from 'payload';

import type { SquarePluginOptions } from '../types.js';

import { mapSquareCatalogObjectToSquareImage } from '../utils/squareImageMapper.js';
import { listSquareCatalogObjects } from './square.js';
import { Square } from 'square';

export async function syncCategories(payload: Payload, options: SquarePluginOptions) {
	try {
		const response = await listSquareCatalogObjects(
			Square.CatalogObjectType.Category,
			options,
		).then((data) => data ?? {});
		const categories: Square.CatalogObjectCategory[] = response.objects ?? [];
		const squareCategoryIds = categories.map((cat) => cat.id);

		// Delete categories that don't exist in Square anymore
		await payload.delete({
			collection: 'square-categories',
			where: {
				squareId: {
					not_in: squareCategoryIds,
				},
			},
		});

		// Update or create categories
		for (const object of categories) {
			const existing = await payload.find({
				collection: 'square-categories',
				where: { squareId: { equals: object.id } },
			});

			const categoryData = {
				name: object.categoryData?.name || 'N/A',
				squareId: object.id || 'N/A',
				updatedAt: object.updatedAt && object.updatedAt,
			};

			if (existing.docs.length > 0) {
				await payload.update({
					id: existing.docs[0].id,
					collection: 'square-categories',
					data: categoryData,
					overrideAccess: true,
				});
			} else {
				await payload.create({
					collection: 'square-categories',
					data: categoryData,
					overrideAccess: true,
				});
			}
		}
	} catch (error) {
		if (options.debug) {
			console.error('Failed to sync Square categories:', error);
		}
	}
}

export async function syncItems(payload: Payload, options: SquarePluginOptions) {
	try {
		const response = await listSquareCatalogObjects(
			Square.CatalogObjectType.Item,
			options,
		).then((data) => data ?? {});
		const items =
			(response.objects?.filter(
				(obj) => obj.type === 'ITEM',
			) as Square.CatalogObjectItem[]) || [];
		const relatedObjects = response.relatedObjects ?? [];
		const squareItemIds = items.map((item) => item.id);

		const imageUrlByIdMap = new Map(
			relatedObjects
				.filter((item) => item.type === 'IMAGE')
				.map((item) => {
					const image = mapSquareCatalogObjectToSquareImage(item);

					return [image.squareId, image.url];
				}),
		);

		const measurementUnitByIdMap = new Map(
			relatedObjects
				.filter((item) => item.type === 'MEASUREMENT_UNIT')
				.map((item) => {
					return [
						item.id,
						{
							type: item.measurementUnitData?.measurementUnit?.type || 'N/A',
							precision: Number(item.measurementUnitData?.precision),
							squareId: item.id,
						},
					];
				}),
		);

		const variationsByItemIdMap = new Map(
			items.map((item) => {
				const variations =
					(item.itemData?.variations?.filter(
						(v) => v.type === Square.CatalogObjectType.ItemVariation,
					) as Square.CatalogObjectItemVariation[]) ?? [];
				const mappedVariations = variations.map((variation) => {
					if (variation) {
						console.log('variation', variation);
					}
					return {
						name: variation?.itemVariationData?.name || 'N/A',
						display: variation?.isDeleted,
						images:
							variation?.itemVariationData?.imageIds?.map((value) => {
								return { squareId: value, url: imageUrlByIdMap.get(value) };
							}) || [],
						measurementUnit: variation?.itemVariationData?.measurementUnitId
							? measurementUnitByIdMap.get(
									variation?.itemVariationData?.measurementUnitId,
							  )
							: { type: 'N/A', precision: 0, squareId: 'N/A' },
						ordinal: variation?.itemVariationData?.ordinal || 0,
						priceMoney: {
							amount: Number(variation?.itemVariationData?.priceMoney?.amount || 0),
							currency: variation?.itemVariationData?.priceMoney?.currency || 'CAD',
						},
						pricingType: variation?.itemVariationData?.pricingType || 'FIXED_PRICING',
						squareId: variation.itemVariationData?.itemId || 'N/A',
					};
				});
				return [item.id, mappedVariations];
			}),
		);

		// Delete items that don't exist in Square anymore
		await payload.delete({
			collection: 'square-items',
			where: {
				squareId: {
					not_in: squareItemIds,
				},
			},
		});

		// Update or create items
		for (const object of items) {
			const squareCategoryId = object.itemData?.reportingCategory?.id
				? object.itemData.reportingCategory.id
				: null;

			if (squareCategoryId) {
				const categories = await payload.find({
					collection: 'square-categories',
					where: {
						squareId: {
							in: squareCategoryId,
						},
					},
				});

				const existing = await payload.find({
					collection: 'square-items',
					where: {
						squareId: {
							equals: object.id,
						},
					},
				});

				const itemData = {
					name: object.itemData?.name || 'N/A',
					category: categories.docs[0] || null,
					categoryId: categories.docs[0]?.id.toString(),
					categoryName: categories.docs[0]?.name || 'N/A',
					display: !object.itemData?.isArchived || true,
					squareCategoryId,
					squareId: object.id,
					updatedAt: object.updatedAt && object.updatedAt,
					variations: variationsByItemIdMap.get(object.id) || [],
				};

				if (existing.docs.length > 0) {
					await payload.update({
						id: existing.docs[0].id,
						collection: 'square-items',
						data: itemData,
						overrideAccess: true,
					});
				} else {
					await payload.create({
						collection: 'square-items',
						data: itemData,
						overrideAccess: true,
					});
				}
			}
		}
	} catch (error) {
		if (options.debug) {
			console.error('Failed to sync Square items:', error);
		}
	}
}

export async function onInitExtension(
	options: SquarePluginOptions,
	payload: Payload,
): Promise<void> {
	if (options.enabled) {
		try {
			await syncCategories(payload, options);
			await syncItems(payload, options);
		} catch (error) {
			if (options.debug) {
				console.error('Failed to fetch Square catalog:', error);
			}
		}
	}
}
