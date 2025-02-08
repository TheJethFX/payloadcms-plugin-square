import type { CollectionConfig } from 'payload';

export const ItemVariations = (): CollectionConfig => ({
	slug: 'square-item-variations',
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
							slug: 'square-item-variations',
							label: 'Item Variations',
						},
						label: 'Refresh Item Variations',
					},
				},
			],
		},
		description: 'Item variations synchronized from Square.',
		group: 'Square',
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
			name: 'ordinal',
			type: 'number',
			admin: {
				readOnly: true,
			},
			label: 'Ordinal',
			required: true,
		},
		{
			name: 'pricingType',
			type: 'text',
			admin: {
				readOnly: true,
			},
			label: 'Pricing Type',
			required: true,
		},
		{
			name: 'priceMoney',
			type: 'group',
			admin: {
				readOnly: true,
			},
			fields: [
				{
					name: 'amount',
					type: 'number',
					label: 'Amount',
					required: true,
				},
				{
					name: 'currency',
					type: 'text',
					label: 'Currency',
					required: true,
				},
			],
			label: 'Price Money',
		},
		{
			name: 'images',
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
					name: 'url',
					type: 'text',
					label: 'URL',
				},
			],
			label: 'Images',
			required: false,
		},
		{
			name: 'measurementUnit',
			type: 'group',
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
					name: 'type',
					type: 'text',
					label: 'Type',
				},
				{
					name: 'weightUnit',
					type: 'text',
					label: 'Weight Unit',
				},
				{
					name: 'precision',
					type: 'number',
					label: 'Precision',
				},
			],
			label: 'Measurement Unit',
		},
	],
	labels: {
		plural: 'Item Variations',
		singular: 'Item Variation',
	},
	timestamps: false,
});
