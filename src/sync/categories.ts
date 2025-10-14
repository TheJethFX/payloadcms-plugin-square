import type { Payload } from 'payload'

import { Square } from 'square'

import type { SquarePluginOptions } from '../types/index.js'

import { listSquareCatalogObjects } from '../square/api.js'

/**
 * Syncs Square categories to Payload CMS
 * @param payload - Payload CMS instance
 * @param options - Plugin configuration options
 */
export async function syncCategories(
  payload: Payload,
  options: SquarePluginOptions,
): Promise<void> {
  try {
    const response = await listSquareCatalogObjects(
      Square.CatalogObjectType.Category,
      options,
    ).then((data) => data ?? {})
    const categories: Square.CatalogObjectCategory[] = response.objects ?? []
    const squareCategoryIds = categories.map((cat) => cat.id)

    // Delete categories that don't exist in Square anymore
    await payload.delete({
      collection: 'square-categories',
      where: {
        squareId: {
          not_in: squareCategoryIds,
        },
      },
    })

    // Update or create categories
    for (const object of categories) {
      const existing = await payload.find({
        collection: 'square-categories',
        where: { squareId: { equals: object.id } },
      })

      const categoryData = {
        name: object.categoryData?.name || 'N/A',
        squareId: object.id || 'N/A',
        updatedAt: object.updatedAt && object.updatedAt,
      }

      if (existing.docs.length > 0) {
        await payload.update({
          id: existing.docs[0].id,
          collection: 'square-categories',
          data: categoryData,
          overrideAccess: true,
        })
      } else {
        await payload.create({
          collection: 'square-categories',
          data: categoryData,
          overrideAccess: true,
        })
      }
    }
  } catch (error) {
    if (options.debug) {
      console.error('Failed to sync Square categories:', error)
    }
  }
}
