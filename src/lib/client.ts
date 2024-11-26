import { Client, Environment } from 'square';
import type { SquarePluginOptions } from '../types.js';

export function createSquareClient(options: SquarePluginOptions) {
	return new Client({
		bearerAuthCredentials: {
			accessToken: options.accessToken,
		},
		additionalHeaders: {
			'Content-Type': 'application/json',
		},
		environment: options.environment || Environment.Production,
	});
}
