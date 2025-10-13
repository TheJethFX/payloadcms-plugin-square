import type { Square } from 'square'
import type { SquarePluginOptions } from 'src/types/index.js'

import { SquareError } from 'square'
import { createSquareClient } from 'src/square/client.js'

/**
 * Handles Square API errors with detailed error messages
 * @param error - Error from Square API
 * @throws Error with formatted error details
 */
const handleSquareError = (error: unknown): never => {
  if (error instanceof SquareError) {
    const details = error.errors
      .map((e: SquareError.BodyError) => `${e.category}: ${e.detail}`)
      .join(', ')
    throw new Error(`Square API error: ${details}`)
  }
  throw error
}

/**
 * Lists catalog objects from Square API
 * @param objectTypes - Single type or array of catalog object types to fetch
 * @param options - Plugin configuration options
 * @returns Search response containing catalog objects and related objects
 * @throws Error if no object types provided or API call fails
 */
export async function listSquareCatalogObjects(
  objectTypes: Square.CatalogObjectType | Square.CatalogObjectType[],
  options: SquarePluginOptions,
): Promise<Square.SearchCatalogObjectsResponse | undefined> {
  const client = createSquareClient(options)
  try {
    if (!objectTypes.length) {
      throw new Error('No Square object types provided.')
    }

    // This is what the Square API uses to paginate results, implement it if needed.
    const cursor = ''

    const types = Array.isArray(objectTypes) ? objectTypes : [objectTypes]
    const response = await client.catalog.search({
      cursor,
      includeRelatedObjects: true,
      objectTypes: types,
    })
    return response || []
  } catch (error) {
    handleSquareError(error)
  }
}
