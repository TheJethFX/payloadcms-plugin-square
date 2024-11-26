import type { CollectionConfig } from 'payload';

import type { SquarePluginOptions } from '../types';

import { syncCategories } from '../lib/onInitExtension';

export const SquareCategories = (options: SquarePluginOptions): CollectionConfig => ({
	slug: 'square-categories',
	access: {
		create: () => false,
		delete: () => false,
		read: () => true,
		update: () => true,
	},
	admin: {
		description: 'Categories synchronized from Square',
		useAsTitle: 'name',
	},
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
			type: 'relationship',
			hasMany: true,
			label: 'Items',
			relationTo: 'square-items',
		},
	],
	hooks: {
		beforeRead: [
			async ({ req }) => {
				if (req.user) {
					// Only sync when accessed via admin panel
					await syncCategories(req.payload, options);
				}
			},
		],
	},
	timestamps: false,
});
