import type { Environment } from 'square';

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
	 * @default Environment.Sandbox
	 */
	environment?: Environment;
}

export interface SquareCategory {
	name: string;
	squareId: string;
	type: string;
}

export interface CreateSquareCategory {
	name: string;
}
