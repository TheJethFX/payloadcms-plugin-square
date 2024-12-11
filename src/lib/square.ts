import type { SearchCatalogObjectsResponse, Error as SquareError } from 'square';

import { ApiError } from 'square';

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

export async function listSquareCatalogObjects(
	objectTypes: string | string[],
	options: SquarePluginOptions,
): Promise<SearchCatalogObjectsResponse | undefined> {
	const client = createSquareClient(options);
	try {
		if (!objectTypes.length) {
			throw new Error('No Square object types provided.');
		}

		// This is what the Square API uses to paginate results, implement it if needed.
		const cursor = '';

		const types = Array.isArray(objectTypes) ? objectTypes.join(',') : objectTypes;
		const response = await client.catalogApi.searchCatalogObjects({
			cursor,
			includeRelatedObjects: true,
			objectTypes: [types],
		});
		return response.result || [];
	} catch (error) {
		handleSquareError(error);
	}
}
