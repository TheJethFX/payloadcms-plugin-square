import { CollectionConfig } from 'payload';
import { syncCategories } from '../lib/onInitExtension';
import { SquarePluginOptions } from '../types';

export const SquareCategories = (options: SquarePluginOptions): CollectionConfig => ({
	slug: 'square-categories',
	admin: {
		useAsTitle: 'name',
		description: 'Categories synchronized from Square',
	},
	access: {
		read: () => true,
		create: () => false,
		update: () => true,
		delete: () => false,
	},
	fields: [
		{
			name: 'squareId',
			label: 'Square ID',
			type: 'text',
			required: true,
			admin: {
				readOnly: true,
			},
		},
		{
			name: 'name',
			label: 'Name',
			type: 'text',
			required: true,
			admin: {
				readOnly: true,
			},
		},
		{
			name: 'updatedAt',
			label: 'Updated At',
			type: 'date',
			required: true,
			admin: {
				readOnly: true,
			},
		},
		{
			name: 'display',
			label: 'Display',
			type: 'checkbox',
			defaultValue: true,
		},
		{
			name: 'items',
			label: 'Items',
			type: 'relationship',
			relationTo: 'square-items',
			hasMany: true,
		},
	],
	timestamps: false,
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
});
