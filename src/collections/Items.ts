import type { CollectionConfig, PayloadRequest } from 'payload'

import type { SquarePluginOptions } from '../types/index.js'

import { ItemVariations } from '../collections/ItemVariations.js'
import { syncItems } from '../sync/items.js'

export const Items = (pluginOptions: SquarePluginOptions): CollectionConfig => ({
  slug: 'square-items',
  access: {
    create: () => false,
    delete: () => false,
    read: () => true,
    update: () => true,
  },
  admin: {
    components: {
      beforeList: [
        {
          path: 'payloadcms-plugin-square/rsc#RefreshButtonServer',
          serverProps: {
            collection: {
              slug: 'square-items',
              label: 'Items',
            },
            label: 'Refresh Items',
          },
        },
      ],
    },
    description: 'Items synchronized from Square.',
    group: 'Square',
    useAsTitle: 'name',
  },
  endpoints: [
    {
      handler: async (req: PayloadRequest) => {
        const { payload } = req

        try {
          await syncItems(payload, pluginOptions)

          return Response.json({
            message: 'Items refreshed successfully',
            status: 200,
          })
        } catch (error: any) {
          return Response.json({
            error: error.message,
            message: 'Failed to refresh items',
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
      name: 'squareId',
      type: 'text',
      admin: {
        readOnly: true,
      },
      label: 'Square ID',
      required: true,
    },
    {
      name: 'squareCategoryId',
      type: 'text',
      admin: {
        hidden: true,
        readOnly: true,
      },
      label: 'Square Category ID',
      required: true,
    },
    {
      name: 'name',
      type: 'text',
      admin: {
        readOnly: true,
      },
      label: 'Name',
      required: true,
    },
    {
      name: 'variations',
      type: 'array',
      admin: {
        readOnly: true,
      },
      fields: ItemVariations().fields,
      label: 'Variations',
    },
    {
      name: 'updatedAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
      label: 'Updated At',
      required: true,
    },
    {
      name: 'display',
      type: 'checkbox',
      defaultValue: true,
      label: 'Display',
    },
    {
      name: 'category',
      type: 'relationship',
      admin: {
        readOnly: true,
      },
      hasMany: false,
      label: 'Category',
      relationTo: 'square-categories',
    },
    {
      name: 'modifierLists',
      type: 'array',
      admin: {
        readOnly: true,
      },
      fields: [
        {
          name: 'modifierListId',
          type: 'text',
          label: 'Modifier List ID',
        },
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
          label: 'Enabled',
        },
      ],
      label: 'Modifier Lists',
    },
  ],
  labels: {
    plural: 'Items',
    singular: 'Item',
  },
  timestamps: false,
})
