import { Square } from 'square';
import type { SquareImage } from '../types';

export function mapSquareCatalogObjectToSquareImage(
	object: Square.CatalogObjectImage,
): SquareImage {
	return {
		squareId: object.id || '',
		url: object.imageData?.url || '',
	};
}
