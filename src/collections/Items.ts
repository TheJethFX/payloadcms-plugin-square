import type { CollectionConfig } from 'payload';

export const Items = (): CollectionConfig => ({
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
			name: 'categoryName',
			type: 'text',
			admin: {
				readOnly: true,
			},
			label: 'Category Name',
		},
	],
	labels: {
		plural: 'Items',
		singular: 'Item',
	},
	timestamps: false,
});
