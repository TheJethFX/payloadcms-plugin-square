import { ApiError, type CatalogObject, type Error as SquareError } from 'square';

import type { SquarePluginOptions } from '../types.js';

import { createSquareClient } from './client.js';

const handleSquareError = (error: unknown): never => {
	if (error instanceof ApiError) {
		const details = error.result.errors
			.map((e: SquareError) => `${e.category}: ${e.detail}`)
			.join(', ');
		throw new Error(`Square API error: ${details}`);
	}
	throw error;
};

export async function listSquareCatalog(
	options: SquarePluginOptions,
): Promise<CatalogObject[] | undefined> {
	const client = createSquareClient(options);
	try {
		const response = await client.catalogApi.listCatalog('', 'CATEGORY,ITEM');
		return response.result.objects || [];
	} catch (error) {
		handleSquareError(error);
	}
}

export async function listSquareCategoriesItems(
	options: SquarePluginOptions,
	categoryIds: string[],
): Promise<CatalogObject[] | undefined> {
	const client = createSquareClient(options);
	try {
		const response = await client.catalogApi.searchCatalogItems({ categoryIds });
		return response.result.items || [];
	} catch (error) {
		handleSquareError(error);
	}
}
