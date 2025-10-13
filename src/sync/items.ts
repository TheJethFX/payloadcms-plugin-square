import type { Payload } from 'payload'
import type { SquarePluginOptions } from 'src/types/index.js'

import { Square } from 'square'
import { listSquareCatalogObjects } from 'src/square/api.js'
import {
  createImageUrlMap,
  createItemVariationsMap,
  createMeasurementUnitMap,
} from 'src/square/mappers/index.js'

/**
 * Syncs Square items (with variations) to Payload CMS
 * @param payload - Payload CMS instance
 * @param options - Plugin configuration options
 */
export async function syncItems(payload: Payload, options: SquarePluginOptions): Promise<void> {
  try {
    const response = await listSquareCatalogObjects(Square.CatalogObjectType.Item, options).then(
      (data) => data ?? {},
    )
    const items =
      (response.objects?.filter((obj) => obj.type === 'ITEM') as Square.CatalogObjectItem[]) || []
    const relatedObjects = response.relatedObjects ?? []
    const squareItemIds = items.map((item) => item.id)

    // Create lookup maps for related data
    const imageUrlMap = createImageUrlMap(relatedObjects)
    const measurementUnitMap = createMeasurementUnitMap(relatedObjects)
    const variationsMap = createItemVariationsMap(items, imageUrlMap, measurementUnitMap)

    // Delete items that don't exist in Square anymore
    await payload.delete({
      collection: 'square-items',
      where: {
        squareId: {
          not_in: squareItemIds,
        },
      },
    })

    // Update or create items
    for (const object of items) {
      const squareCategoryId = object.itemData?.reportingCategory?.id
        ? object.itemData.reportingCategory.id
        : null

      if (squareCategoryId) {
        const categories = await payload.find({
          collection: 'square-categories',
          where: {
            squareId: {
              in: squareCategoryId,
            },
          },
        })

        const existing = await payload.find({
          collection: 'square-items',
          where: {
            squareId: {
              equals: object.id,
            },
          },
        })

        const modifierListInfo = object.itemData?.modifierListInfo || []
        const modifierLists = modifierListInfo.map((info) => ({
          enabled: info.enabled ?? true,
          modifierListId: info.modifierListId || '',
        }))

        const itemData = {
          name: object.itemData?.name || 'N/A',
          category: categories.docs[0] || null,
          categoryId: categories.docs[0]?.id.toString(),
          categoryName: categories.docs[0]?.name || 'N/A',
          display: !object.itemData?.isArchived || true,
          modifierLists,
          squareCategoryId,
          squareId: object.id,
          updatedAt: object.updatedAt && object.updatedAt,
          variations: variationsMap.get(object.id) || [],
        }

        if (existing.docs.length > 0) {
          await payload.update({
            id: existing.docs[0].id,
            collection: 'square-items',
            data: itemData,
            overrideAccess: true,
          })
        } else {
          await payload.create({
            collection: 'square-items',
            data: itemData,
            overrideAccess: true,
          })
        }
      }
    }
  } catch (error) {
    if (options.debug) {
      console.error('Failed to sync Square items:', error)
    }
  }
}
