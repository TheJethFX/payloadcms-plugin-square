import type { CollectionConfig, PayloadRequest } from 'payload'

import type { SquarePluginOptions } from '../types/index.js'

import { syncInventory } from '../sync/inventory.js'

/**
 * Inventory collection configuration
 * Read-only collection synced from Square inventory counts
 * @param pluginOptions - Plugin configuration
 * @returns Payload collection configuration
 */
export const Inventory = (pluginOptions: SquarePluginOptions): CollectionConfig => ({
  slug: 'square-inventory-counts',
  access: {
    create: () => false,
    delete: () => false,
    read: () => true,
    update: () => false,
  },
  admin: {
    components: {
      beforeList: [
        {
          path: 'payloadcms-plugin-square/rsc#RefreshButtonServer',
          serverProps: {
            collection: {
              slug: 'square-inventory-counts',
              label: 'Inventory Counts',
            },
            label: 'Refresh Inventory Counts',
          },
        },
      ],
    },
    description: 'Inventory counts synchronized from Square.',
    group: 'Square',
    useAsTitle: 'catalogObjectId',
  },
  endpoints: [
    {
      handler: async (req: PayloadRequest) => {
        const { payload } = req

        try {
          await syncInventory(payload, pluginOptions)

          return Response.json({
            message: 'Inventory refreshed successfully',
            status: 200,
          })
        } catch (error: unknown) {
          return Response.json({
            error: error instanceof Error ? error.message : 'Unknown error',
            message: 'Failed to refresh inventory',
            status: 500,
          })
        }
      },
      method: 'get',
      path: '/refresh',
    },
  ],
  fields: [
    {
      name: 'catalogObjectId',
      type: 'text',
      admin: {
        readOnly: true,
      },
      index: true,
      label: 'Catalog Object ID',
      required: true,
    },
    {
      name: 'locationId',
      type: 'text',
      admin: {
        readOnly: true,
      },
      index: true,
      label: 'Location ID',
      required: true,
    },
    {
      name: 'state',
      type: 'select',
      admin: {
        readOnly: true,
      },
      label: 'State',
      options: [
        { label: 'In Stock', value: 'IN_STOCK' },
        { label: 'Ordered from Vendor', value: 'ORDERED_FROM_VENDOR' },
        { label: 'Received from Vendor', value: 'RECEIVED_FROM_VENDOR' },
        { label: 'Reserved for Sale', value: 'RESERVED_FOR_SALE' },
        { label: 'Returned by Customer', value: 'RETURNED_BY_CUSTOMER' },
        { label: 'Sold', value: 'SOLD' },
        { label: 'Sold Online', value: 'SOLD_ONLINE' },
      ],
    },
    {
      name: 'quantity',
      type: 'text',
      admin: {
        readOnly: true,
      },
      label: 'Quantity',
    },
    {
      name: 'calculatedAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
      label: 'Calculated At',
    },
  ],
  labels: {
    plural: 'Inventory Counts',
    singular: 'Inventory Count',
  },
})
