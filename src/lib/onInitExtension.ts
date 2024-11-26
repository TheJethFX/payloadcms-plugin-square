import { Payload } from 'payload';
import { SquarePluginOptions } from '../types.js';
import { listSquareCatalog } from './square.js';

export async function syncCategories(payload: Payload, options: SquarePluginOptions) {
	try {
		const categories = await listSquareCatalog(options).then((data) =>
			data.filter((object) => object.type === 'CATEGORY'),
		);
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
				where: {
					squareId: {
						equals: object.id,
					},
				},
			});

			if (existing.docs.length > 0) {
				await payload.update({
					collection: 'square-categories',
					id: existing.docs[0].id,
					data: {
						squareId: object.id,
						name: object.categoryData?.name || undefined,
						updatedAt: object.updatedAt && object.updatedAt,
					},
					overrideAccess: true,
				});
			} else {
				await payload.create({
					collection: 'square-categories',
					data: {
						squareId: object.id,
						name: object.categoryData?.name,
						updatedAt: object.updatedAt && object.updatedAt,
					},
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
		const items = await listSquareCatalog(options).then((data) =>
			data.filter((object) => object.type === 'ITEM'),
		);
		const squareItemIds = items.map((item) => item.id);

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
			const categoryId = object.itemData?.reportingCategory
				? object.itemData.reportingCategory.id
				: null;

			if (categoryId) {
				const categories = await payload.find({
					collection: 'square-categories',
					where: {
						squareId: {
							in: categoryId,
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
					squareId: object.id,
					name: object.itemData?.name || undefined,
					imageIds:
						object.itemData?.imageIds?.map((value) => {
							return { id: value };
						}) || [],
					category: categories.docs[0]?.id,
					updatedAt: object.updatedAt && object.updatedAt,
				};

				if (existing.docs.length > 0) {
					await payload.update({
						collection: 'square-items',
						id: existing.docs[0].id,
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
	try {
		await syncCategories(payload, options);
		await syncItems(payload, options);
	} catch (error) {
		if (options.debug) {
			console.error('Failed to fetch Square catalog:', error);
		}
	}
}
