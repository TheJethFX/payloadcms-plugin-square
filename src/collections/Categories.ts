import type { CollectionConfig, PayloadRequest } from 'payload';
import { SquarePluginOptions } from '../types';
import { syncCategories } from '../lib/onInitExtension';

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
					path: 'payloadcms-plugin-square/client#RefreshButton',
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
			path: '/refresh',
			method: 'get',
			handler: async (req: PayloadRequest) => {
				const { payload } = req;

				try {
					await syncCategories(payload, pluginOptions);

					return Response.json({
						status: 200,
						message: 'Categories refreshed successfully',
					});
				} catch (error: any) {
					return Response.json({
						status: 500,
						message: 'Failed to refresh categories',
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
			on: 'category',
			maxDepth: 3,
		},
	],
	labels: {
		plural: 'Categories',
		singular: 'Category',
	},
	timestamps: false,
});
