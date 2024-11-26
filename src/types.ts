import { Environment } from 'square';

export interface SquarePluginOptions {
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
	 * Square API Access Token
	 * @required
	 */
	accessToken: string;

	/**
	 * Square API Environment
	 * @default Environment.Sandbox
	 */
	environment?: Environment;
}

export interface SquareCategory {
	squareId: string;
	name: string;
	type: string;
}

export interface CreateSquareCategory {
	name: string;
}
