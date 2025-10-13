import type { SquarePluginOptions } from 'src/types/index.js'

import { SquareClient, SquareEnvironment } from 'square'

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
