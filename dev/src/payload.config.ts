import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { buildConfig } from 'payload';
import { squarePlugin } from 'payloadcms-plugin-square';
import { Environment } from 'square';
import { fileURLToPath } from 'url';

import { testEmailAdapter } from './emailAdapter';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
	admin: {
		autoLogin: {
			email: 'dev@payloadcms.com',
			password: 'test',
		},
		importMap: {
			baseDir: path.resolve(dirname, 'src'),
		},
		user: 'users',
	},
	collections: [
		{
			slug: 'users',
			auth: true,
			fields: [],
		},
		{
			slug: 'pages',
			admin: {
				useAsTitle: 'title',
			},
			fields: [
				{
					name: 'title',
					type: 'text',
				},
				{
					name: 'content',
					type: 'richText',
				},
			],
		},
		{
			slug: 'media',
			fields: [
				{
					name: 'text',
					type: 'text',
				},
			],
			upload: true,
		},
	],
	db: mongooseAdapter({
		url: process.env.DATABASE_URI || 'mongodb://127.0.0.1/plugin-development',
	}),
	editor: lexicalEditor(),
	email: testEmailAdapter,
	async onInit(payload) {
		const existingUsers = await payload.find({
			collection: 'users',
			limit: 1,
		});

		if (existingUsers.docs.length === 0) {
			await payload.create({
				collection: 'users',
				data: {
					email: 'dev@payloadcms.com',
					password: 'test',
				},
			});
		}
	},
	plugins: [
		squarePlugin({
			accessToken: process.env.SQUARE_ACCESS_TOKEN || '',
			debug: true,
			enabled: true,
			environment: Environment.Production,
		}),
	],
	secret: process.env.PAYLOAD_SECRET || 'SOME_SECRET',
	typescript: {
		outputFile: path.resolve(dirname, 'payload-types.ts'),
	},
});
