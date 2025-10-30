import { SquareClient, SquareEnvironment } from 'square'

import type { SquarePluginOptions } from '../types/index.js'

/**
 * Creates and configures a Square API client
 * @param options - Plugin configuration options
 * @returns Configured SquareClient instance
 */
export function createSquareClient(options: SquarePluginOptions): SquareClient {
  return new SquareClient({
    environment: options.environment || SquareEnvironment.Production,
    token: options.accessToken,
  })
}
