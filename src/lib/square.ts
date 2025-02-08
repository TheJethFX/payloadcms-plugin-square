import { Square, SquareError } from 'square';
import type { SquarePluginOptions } from '../types.js';

import { createSquareClient } from './client.js';

const handleSquareError = (error: unknown): never => {
	if (error instanceof SquareError) {
		const details = error.errors
			.map((e: SquareError.BodyError) => `${e.category}: ${e.detail}`)
			.join(', ');
		throw new Error(`Square API error: ${details}`);
	}
	throw error;
};

export async function listSquareCatalogObjects(
	objectTypes: Square.CatalogObjectType | Square.CatalogObjectType[],
	options: SquarePluginOptions,
): Promise<Square.SearchCatalogObjectsResponse | undefined> {
	const client = createSquareClient(options);
	try {
		if (!objectTypes.length) {
			throw new Error('No Square object types provided.');
		}

		// This is what the Square API uses to paginate results, implement it if needed.
		const cursor = '';

		const types = Array.isArray(objectTypes) ? objectTypes : [objectTypes];
		const response = await client.catalog.search({
			cursor,
			includeRelatedObjects: true,
			objectTypes: types,
		});
		return response || [];
	} catch (error) {
		handleSquareError(error);
	}
}
