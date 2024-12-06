import type { CollectionConfig } from 'payload';

export const Categories = (): CollectionConfig => ({
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
			filterOptions: ({ data }) => ({
				squareCategoryId: {
					equals: data?.squareId,
				},
			}),
			hasMany: true,
			label: 'Items',
			relationTo: 'square-items',
		},
	],
	labels: {
		plural: 'Categories',
		singular: 'Category',
	},
	timestamps: false,
});
