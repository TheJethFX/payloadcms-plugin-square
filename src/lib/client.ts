import { Client, Environment } from 'square';

import type { SquarePluginOptions } from '../types.js';

export function createSquareClient(options: SquarePluginOptions) {
	return new Client({
		additionalHeaders: {
			'Content-Type': 'application/json',
		},
		bearerAuthCredentials: {
			accessToken: options.accessToken,
		},
		environment: options.environment || Environment.Production,
	});
}
