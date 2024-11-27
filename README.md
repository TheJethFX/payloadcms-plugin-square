# Payload Square Plugin

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
```
