import type { CollectionConfig, PayloadRequest } from 'payload';

import { ItemVariations } from './ItemVariations';
import { syncItems } from '../lib/onInitExtension';
import { SquarePluginOptions } from '../types';

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
					path: 'payloadcms-plugin-square/client#RefreshButton',
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
			path: '/refresh',
			method: 'get',
			handler: async (req: PayloadRequest) => {
				const { payload } = req;

				try {
					// Add your Square API refresh logic here
					await syncItems(payload, pluginOptions);

					return Response.json({
						status: 200,
						message: 'Items refreshed successfully',
					});
				} catch (error: any) {
					return Response.json({
						status: 500,
						message: 'Failed to refresh items',
						error: error.message,
					});
				}
			},
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
	],
	labels: {
		plural: 'Items',
		singular: 'Item',
	},
	timestamps: false,
});
