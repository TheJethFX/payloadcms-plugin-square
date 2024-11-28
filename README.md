# Payload Square Plugin

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

A plugin for [Payload](https://payloadcms.com) to connect [Square](https://squareup.com/) to your Payload project.

## Installation

```bash
npm install payload-plugin-square
```

## Example Usage

```typescript
// In your Payload config file (payload.config.ts)
import { squarePlugin } from 'payload-plugin-square';

export default {
	plugins: [
		squarePlugin({
			accessToken: process.env.SQUARE_ACCESS_TOKEN,
			debug: true,
			enabled: true
		}),
	],
};
```

## Options

| Option      | Type     | Required | Description                                                                                   |
|-------------|----------|----------|--------------------------------------------------------------------------------------------
| `accessToken` | `string` | Yes      | Your Square access token. You can find this in your [Square Developer Dashboard](https://developer.squareup.com/apps). |
| `debug`       | `boolean`| No       | If set to `true`, logs debug information to the console. Defaults to `false`.                           |
| `enabled`     | `boolean`| No       | If set to `false`, the plugin will not run. Defaults to `true`.                                         |


## Contributing

If you want to contribute to this project, please read the [CONTRIBUTING](./CONTRIBUTING.md) file.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/payloadcms-plugin-square?style=flat&colorA=080f12&colorB=4974a5
[npm-version-href]: https://npmjs.com/package/payloadcms-plugin-square
[npm-downloads-src]: https://img.shields.io/npm/dm/payloadcms-plugin-square?style=flat&colorA=080f12&colorB=4974a5
[npm-downloads-href]: https://npmjs.com/package/payloadcms-plugin-square
[license-src]: https://img.shields.io/github/license/thejethfx/payloadcms-plugin-square.svg?style=flat&colorA=080f12&colorB=4974a5
[license-href]: https://github.com/w3cj/payloadcms-plugin-square/blob/main/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=4974a5
[jsdocs-href]: https://www.jsdocs.io/package/payloadcms-plugin-square
