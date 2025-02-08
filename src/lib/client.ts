import { SquareClient, SquareEnvironment } from 'square';

import type { SquarePluginOptions } from '../types.js';

export function createSquareClient(options: SquarePluginOptions) {
	return new SquareClient({
		token: options.accessToken,
		environment: options.environment || SquareEnvironment.Production,
	});
}
