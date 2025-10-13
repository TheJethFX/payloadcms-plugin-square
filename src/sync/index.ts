import type { Payload } from 'payload'
import type { SquarePluginOptions } from 'src/types/index.js'

import { syncCategories } from './categories.js'
import { syncItems } from './items.js'

/**
 * Main synchronization entry point
 * Orchestrates syncing all Square catalog data to Payload CMS
 * @param options - Plugin configuration options
 * @param payload - Payload CMS instance
 */
export async function onInitExtension(
  options: SquarePluginOptions,
  payload: Payload,
): Promise<void> {
  if (options.enabled) {
    try {
      await syncCategories(payload, options)
      await syncItems(payload, options)
    } catch (error) {
      if (options.debug) {
        console.error('Failed to fetch Square catalog:', error)
      }
    }
  }
}
