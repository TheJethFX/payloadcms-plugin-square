import type { CollectionConfig, PayloadRequest } from 'payload'
import type { SquarePluginOptions } from 'src/types/index.js'

import { syncCategories } from 'src/sync/categories.js'

export const Categories = (pluginOptions: SquarePluginOptions): CollectionConfig => ({
  slug: 'square-categories',
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
              slug: 'square-categories',
              label: 'Categories',
            },
            label: 'Refresh Categories',
          },
        },
      ],
    },
    description: 'Categories synchronized from Square.',
    group: 'Square',
    useAsTitle: 'name',
  },
  endpoints: [
    {
      handler: async (req: PayloadRequest) => {
        const { payload } = req

        try {
          await syncCategories(payload, pluginOptions)

          return Response.json({
            message: 'Categories refreshed successfully',
            status: 200,
          })
        } catch (error: any) {
          return Response.json({
            error: error.message,
            message: 'Failed to refresh categories',
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
      name: 'name',
      type: 'text',
      admin: {
        readOnly: true,
      },
      label: 'Name',
      required: true,
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
      name: 'items',
      type: 'join',
      collection: 'square-items',
      hasMany: true,
      label: 'Items',
      maxDepth: 3,
      on: 'category',
    },
  ],
  labels: {
    plural: 'Categories',
    singular: 'Category',
  },
  timestamps: false,
})
