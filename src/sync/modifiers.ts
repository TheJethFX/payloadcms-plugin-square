import type { Payload } from 'payload'
import type { SquarePluginOptions } from 'src/types/index.js'

import { Square } from 'square'
import { listSquareCatalogObjects } from 'src/square/api.js'
import { createModifierListMap } from 'src/square/mappers/index.js'

/**
 * Syncs Square modifier lists and modifiers to Payload CMS
 * @param payload - Payload CMS instance
 * @param options - Plugin configuration options
 */
export async function syncModifiers(payload: Payload, options: SquarePluginOptions): Promise<void> {
  try {
    const response = await listSquareCatalogObjects(
      Square.CatalogObjectType.ModifierList,
      options,
    ).then((data) => data ?? {})

    const modifierLists = response.objects?.filter((obj) => obj.type === 'MODIFIER_LIST') || []

    const relatedObjects = response.relatedObjects ?? []
    const allObjects = [...modifierLists, ...relatedObjects] as Square.CatalogObject[]
    const modifierListMap = createModifierListMap(allObjects)
    const squareModifierListIds = Array.from(modifierListMap.keys())

    // Delete modifier lists that don't exist in Square anymore
    await payload.delete({
      collection: 'square-modifier-lists',
      overrideAccess: true,
      where: {
        squareId: {
          not_in: squareModifierListIds,
        },
      },
    })

    // Update or create modifier lists
    for (const [squareId, modifierList] of modifierListMap.entries()) {
      const existing = await payload.find({
        collection: 'square-modifier-lists',
        where: { squareId: { equals: squareId } },
      })

      if (existing.docs.length > 0) {
        await payload.update({
          id: existing.docs[0].id,
          collection: 'square-modifier-lists',
          data: modifierList,
          overrideAccess: true,
        })
      } else {
        await payload.create({
          collection: 'square-modifier-lists',
          data: modifierList,
          overrideAccess: true,
        })
      }
    }
  } catch (error) {
    if (options.debug) {
      console.error('Failed to sync Square modifiers:', error)
    }
  }
}
