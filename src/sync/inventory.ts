import type { Payload } from 'payload'
import type { SquarePluginOptions } from 'src/types/index.js'

import { batchRetrieveInventoryCounts } from 'src/square/api.js'

/**
 * Syncs inventory counts from Square to Payload
 * Fetches all item variations and their inventory counts in batches
 * @param payload - Payload instance
 * @param options - Plugin configuration options
 */
export async function syncInventory(payload: Payload, options: SquarePluginOptions): Promise<void> {
  try {
    // Get all items from Payload
    const items = await payload.find({
      collection: 'square-items',
      limit: 1000,
      overrideAccess: true,
    })

    // Extract all variation IDs from all items
    const variationIds: string[] = []
    for (const item of items.docs) {
      const itemData = item as Record<string, unknown>
      const variations = (itemData.variations as Array<{ squareId?: string }>) || []
      for (const variation of variations) {
        if (variation.squareId) {
          variationIds.push(variation.squareId)
        }
      }
    }

    if (variationIds.length === 0) {
      if (options.debug) {
        // eslint-disable-next-line no-console
        console.log('No variations found to sync inventory for')
      }
      return
    }

    // Fetch inventory counts in batches of 100 (Square API limit)
    const batchSize = 100
    const inventoryCounts = []

    for (let i = 0; i < variationIds.length; i += batchSize) {
      const batch = variationIds.slice(i, i + batchSize)
      const counts = await batchRetrieveInventoryCounts(batch, undefined, options)
      if (counts) {
        inventoryCounts.push(...counts)
      }
    }

    // Delete all existing inventory records
    await payload.delete({
      collection: 'square-inventory',
      overrideAccess: true,
      where: {},
    })

    // Create new inventory records
    for (const count of inventoryCounts) {
      if (!count.catalogObjectId || !count.locationId) {
        continue
      }

      await payload.create({
        collection: 'square-inventory',
        data: {
          calculatedAt: count.calculatedAt || new Date().toISOString(),
          catalogObjectId: count.catalogObjectId,
          locationId: count.locationId,
          quantity: count.quantity || '0',
          state: count.state || 'IN_STOCK',
        },
        overrideAccess: true,
      })
    }

    if (options.debug) {
      // eslint-disable-next-line no-console
      console.log(`Synced ${inventoryCounts.length} inventory counts`)
    }
  } catch (error) {
    if (options.debug) {
      // eslint-disable-next-line no-console
      console.error('Failed to sync Square inventory:', error)
    }
  }
}
