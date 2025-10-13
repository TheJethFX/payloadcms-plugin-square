import type { Square } from 'square'
import type { SquareImage } from 'src/types/index.js'

/**
 * Maps a Square CatalogObject (image type) to a SquareImage
 * @param object - Square catalog object of type IMAGE
 * @returns Mapped SquareImage object
 */
export function mapSquareImage(object: Square.CatalogObjectImage): SquareImage {
  return {
    squareId: object.id || '',
    url: object.imageData?.url || '',
  }
}

/**
 * Creates a map of image IDs to URLs from related objects
 * @param relatedObjects - Array of related catalog objects from Square API
 * @returns Map of Square image ID to image URL
 */
export function createImageUrlMap(relatedObjects: Square.CatalogObject[]): Map<string, string> {
  return new Map(
    relatedObjects
      .filter((item) => item.type === 'IMAGE')
      .map((item) => {
        const image = mapSquareImage(item as Square.CatalogObjectImage)
        return [image.squareId, image.url || '']
      }),
  )
}
