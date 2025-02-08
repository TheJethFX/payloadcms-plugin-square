import type { SquareEnvironment } from 'square';

export interface SquarePluginOptions {
	/**
	 * Square API Access Token
	 * @required
	 */
	accessToken: string;

	/**
	 * Enable or disable debug mode
	 * @default false
	 */
	debug?: boolean;

	/**
	 * Enable or disable the plugin
	 * @default true
	 */
	enabled?: boolean;

	/**
	 * Square API Environment
	 * @default SquareEnvironment.Sandbox
	 */
	environment?: SquareEnvironment;
}

export interface SquareImage {
	/**
	 * The Square ID of the image.
	 */
	squareId: string;

	/**
	 * The URL of the image.
	 */
	url?: string;
}
