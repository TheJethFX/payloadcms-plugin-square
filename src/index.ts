import type { Config } from 'payload'

import type { SquarePluginOptions } from './types/index.js'

import { Categories } from './collections/Categories.js'
import { Inventory } from './collections/Inventory.js'
import { Items } from './collections/Items.js'
import { ItemVariations } from './collections/ItemVariations.js'
import { ModifierLists } from './collections/ModifierLists.js'
import { onInitExtension } from './sync/index.js'
import { handleSquareWebhook } from './webhooks/handler.js'

export const squarePlugin =
  (pluginOptions: SquarePluginOptions) =>
  (incomingConfig: Config): Config => {
    const config = { ...incomingConfig }

    config.admin = {
      ...(config.admin || {}),

      // Add additional admin config here

      components: {
        ...(config.admin?.components || {}),
        // Add additional admin components here
      },
    }

    /**
     * If the plugin is disabled, return the config without modifying it
     *
     * Be cautious when using this if your plugin adds new collections or fields
     * as this could cause issues w/ Postgres migrations
     */
    if (pluginOptions.enabled === false) {
      return config
    }

    if (!pluginOptions.accessToken) {
      throw new Error('Square Plugin: accessToken is required')
    }

    config.collections = [
      ...(config.collections || []),
      Categories(pluginOptions),
      Inventory(pluginOptions),
      Items(pluginOptions),
      ItemVariations(),
      ModifierLists(pluginOptions),
    ]

    config.collections = (config.collections || []).map((collection) => {
      const modifiedCollection = { ...collection }

      // Make changes to the collection here

      modifiedCollection.fields = (modifiedCollection.fields || []).map((field) => {
        const newField = { ...field }

        // Make changes to the fields here

        return newField
      })

      return modifiedCollection
    })

    // Add additional collections here

    config.endpoints = [
      ...(config.endpoints || []),
      // Webhook endpoint for receiving real-time updates from Square
      {
        handler: async (req) => {
          return handleSquareWebhook(req, pluginOptions)
        },
        method: 'post',
        path: '/square-webhook',
      },
    ]

    config.globals = [
      ...(config.globals || []),
      // Add additional globals here
    ]

    config.hooks = {
      ...(config.hooks || {}),
      // Add additional hooks here
    }

    config.onInit = async (payload) => {
      if (incomingConfig.onInit) {
        await incomingConfig.onInit(payload)
      }
      // Add additional onInit code by using the onInitExtension function
      await onInitExtension(pluginOptions, payload)
    }

    return config
  }
