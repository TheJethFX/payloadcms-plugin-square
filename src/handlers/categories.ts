import type { PayloadHandler } from 'payload';
import type { SquarePluginOptions } from '../types.js';
import { listSquareCatalog } from '../lib/square.js';

export const listCategoriesHandler =
	(options: SquarePluginOptions): PayloadHandler =>
	async (req) => {
		const categories = await listSquareCatalog(options);
		return Response.json(categories);
	};
