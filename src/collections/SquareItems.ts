import { CollectionConfig } from 'payload';
import { SquarePluginOptions } from '../types';
import { syncItems } from '../lib/onInitExtension';

export const SquareItems = (options: SquarePluginOptions): CollectionConfig => ({
	slug: 'square-items',
	admin: {
		useAsTitle: 'name',
		description: 'Items synchronized from Square',
		hidden: true,
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
			name: 'imageIds',
			label: 'Image IDs',
			type: 'array',
			fields: [
				{
					name: 'id',
					label: 'ID',
					type: 'text',
				},
			],
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
			name: 'category',
			label: 'Category',
			type: 'relationship',
			relationTo: 'square-categories',
			hasMany: false,
			admin: {
				readOnly: true,
			},
		},
	],
	timestamps: false,
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
});
