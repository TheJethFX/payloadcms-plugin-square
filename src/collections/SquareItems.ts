import type { CollectionConfig } from 'payload';

import type { SquarePluginOptions } from '../types';

import { syncItems } from '../lib/onInitExtension';

export const SquareItems = (options: SquarePluginOptions): CollectionConfig => ({
	slug: 'square-items',
	access: {
		create: () => false,
		delete: () => false,
		read: () => true,
		update: () => true,
	},
	admin: {
		description: 'Items synchronized from Square',
		hidden: true,
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
			name: 'imageIds',
			type: 'array',
			admin: {
				readOnly: true,
			},
			fields: [
				{
					name: 'id',
					type: 'text',
					label: 'ID',
				},
			],
			label: 'Image IDs',
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
	hooks: {
		beforeRead: [
			async ({ req }) => {
				if (req.user) {
					// Only sync when accessed via admin panel
					await syncItems(req.payload, options);
				}
			},
		],
	},
	timestamps: false,
});
