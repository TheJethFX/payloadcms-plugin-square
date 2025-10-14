import type { CollectionConfig, PayloadRequest } from 'payload'

import type { SquarePluginOptions } from '../types/index.js'

import { syncModifiers } from '../sync/modifiers.js'

export const ModifierLists = (pluginOptions: SquarePluginOptions): CollectionConfig => ({
  slug: 'square-modifier-lists',
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
              slug: 'square-modifier-lists',
              label: 'Modifier Lists',
            },
            label: 'Refresh Modifier Lists',
          },
        },
      ],
    },
    description: 'Modifier lists synchronized from Square.',
    group: 'Square',
    useAsTitle: 'name',
  },
  endpoints: [
    {
      handler: async (req: PayloadRequest) => {
        const { payload } = req

        try {
          await syncModifiers(payload, pluginOptions)

          return Response.json({
            message: 'Modifier lists refreshed successfully',
            status: 200,
          })
        } catch (error: unknown) {
          return Response.json({
            error: error instanceof Error ? error.message : 'Unknown error',
            message: 'Failed to refresh modifier lists',
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
      unique: true,
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
      name: 'selectionType',
      type: 'select',
      admin: {
        readOnly: true,
      },
      label: 'Selection Type',
      options: [
        { label: 'Multiple', value: 'MULTIPLE' },
        { label: 'Single', value: 'SINGLE' },
      ],
    },
    {
      name: 'ordinal',
      type: 'number',
      admin: {
        readOnly: true,
      },
      label: 'Display Order',
    },
    {
      name: 'modifiers',
      type: 'array',
      admin: {
        readOnly: true,
      },
      fields: [
        {
          name: 'squareId',
          type: 'text',
          label: 'Square ID',
        },
        {
          name: 'modifierListId',
          type: 'text',
          label: 'Modifier List ID',
        },
        {
          name: 'name',
          type: 'text',
          label: 'Name',
        },
        {
          name: 'priceMoney',
          type: 'group',
          fields: [
            {
              name: 'amount',
              type: 'number',
              label: 'Amount (cents)',
            },
            {
              name: 'currency',
              type: 'text',
              label: 'Currency',
            },
          ],
        },
        {
          name: 'onByDefault',
          type: 'checkbox',
          label: 'On by Default',
        },
        {
          name: 'ordinal',
          type: 'number',
          label: 'Display Order',
        },
      ],
      label: 'Modifiers',
    },
  ],
  labels: {
    plural: 'Modifier Lists',
    singular: 'Modifier List',
  },
})
