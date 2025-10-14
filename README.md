# Payload Square Plugin

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

A plugin for [Payload](https://payloadcms.com) to connect [Square](https://squareup.com/) to your Payload project.

## Installation

```bash
npm install payloadcms-plugin-square
```

Note that this plugin also requires the [Square Node.js SDK](https://developer.squareup.com/docs/sdks/nodejs/setup-project) to be installed in your project:
  
  ```bash
  npm install square
  ```

## Quick Start

### 1. Install Dependencies

```bash
npm install payloadcms-plugin-square square
# or
pnpm add payloadcms-plugin-square square
```

### 2. Get Your Square Access Token

1. Go to [Square Developer Dashboard](https://developer.squareup.com/apps)
2. Create or select your application
3. Copy your Access Token from the Credentials tab

### 3. Configure the Plugin

```typescript
// payload.config.ts
import { squarePlugin } from 'payloadcms-plugin-square'
import { SquareEnvironment } from 'square'

export default buildConfig({
  plugins: [
    squarePlugin({
      accessToken: process.env.SQUARE_ACCESS_TOKEN || '',
      environment: SquareEnvironment.Production,
      enabled: true,
      debug: true, // Enable debug logging
    }),
  ],
})
```

### 4. Set Environment Variables

```bash
# .env
SQUARE_ACCESS_TOKEN=your_square_access_token_here
```

### 5. Start Your Application

The plugin will automatically sync all Square data on startup!

## Advanced Configuration

### With Webhooks (Recommended for Production)

```typescript
import { squarePlugin } from 'payloadcms-plugin-square'
import { SquareEnvironment } from 'square'

export default buildConfig({
  plugins: [
    squarePlugin({
      accessToken: process.env.SQUARE_ACCESS_TOKEN || '',
      environment: SquareEnvironment.Production,
      debug: false,
      enabled: true,
      webhooks: {
        enabled: true,
        signatureKey: process.env.SQUARE_WEBHOOK_SIGNATURE_KEY || '',
        url: process.env.SQUARE_WEBHOOK_URL || 'https://yourdomain.com/api/square-webhook',
      },
    }),
  ],
})
```

**Environment Variables:**
```bash
# .env
SQUARE_ACCESS_TOKEN=your_square_access_token
SQUARE_WEBHOOK_SIGNATURE_KEY=your_webhook_signature_key
SQUARE_WEBHOOK_URL=https://yourdomain.com/api/square-webhook
```

## Options

| Option      | Type     | Required | Description                                                                                   |
|-------------|----------|----------|-----------------------------------------------------------------------------------------------|
| `accessToken` | `string` | Yes      | Your Square access token. You can find this in your [Square Developer Dashboard](https://developer.squareup.com/apps). |
| `debug`       | `boolean`| No       | If set to `true`, logs debug information to the console. Defaults to `false`.                           |
| `enabled`     | `boolean`| No       | If set to `false`, the plugin will not run. Defaults to `true`.                                         |
| `environment` | `Environment` | No | The Square API environment to use. Defaults to `Environment.Sandbox`. |
| `webhooks`    | `object` | No       | Webhook configuration for real-time updates from Square. See [Webhook Configuration](#webhook-configuration) below. |

### Webhook Configuration

Enable real-time updates from Square by configuring webhooks:

```typescript
squarePlugin({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  webhooks: {
    enabled: true,
    signatureKey: process.env.SQUARE_WEBHOOK_SIGNATURE_KEY,
    url: 'https://yourdomain.com/api/square-webhook',
    events: ['catalog.version.updated', 'inventory.count.updated'] // Optional
  }
})
```

**Webhook Options:**

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `enabled` | `boolean` | Yes | Enable or disable webhook support |
| `signatureKey` | `string` | Yes | Webhook signature key from Square Developer Dashboard |
| `url` | `string` | Yes | The full URL where webhooks will be received (must match Square Dashboard) |
| `events` | `string[]` | No | Array of event types to handle. Defaults to `['catalog.version.updated', 'inventory.count.updated']` |

**Supported Events:**
- `catalog.version.updated` - Automatically resyncs categories, modifiers, and items when catalog changes
- `inventory.count.updated` - Automatically resyncs inventory counts when stock changes

See [WEBHOOK_TROUBLESHOOTING.md](./WEBHOOK_TROUBLESHOOTING.md) for detailed webhook setup and troubleshooting.

## Features

### 📦 Core Sync Features

✅ **Category Sync** - Automatically syncs Square product categories  
✅ **Item Sync** - Syncs items with variations, images, and pricing  
✅ **Variation Support** - Full support for item variations with different prices  
✅ **Image Sync** - Syncs product images from Square  
✅ **Measurement Units** - Handles product measurements and units

### 🔧 Modifiers & Customization

✅ **Modifier Lists** - Sync modifier lists (sizes, add-ons, etc.)  
✅ **Modifier Options** - Full support for single and multi-select modifiers  
✅ **Modifier Pricing** - Handles price adjustments for modifiers  
✅ **Default Selections** - Supports "on by default" modifier options  
✅ **Item Modifier Links** - Items linked to their applicable modifier lists

### 📊 Inventory Management

✅ **Inventory Counts** - Real-time inventory count synchronization  
✅ **Multi-location Support** - Tracks inventory across multiple locations  
✅ **Inventory States** - Supports all inventory states (IN_STOCK, SOLD, RESERVED, etc.)  
✅ **Batch Processing** - Efficient batch API calls for large inventories

### 🔔 Real-time Updates

✅ **Webhook Integration** - Receive real-time updates from Square  
✅ **Signature Verification** - Secure webhook signature validation  
✅ **Auto-sync on Changes** - Automatically resyncs when catalog or inventory changes  
✅ **Event Handling** - Processes catalog and inventory update events

### 🎨 Admin Features

✅ **Manual Refresh Buttons** - Admin UI buttons to manually trigger syncs for each collection  
✅ **Read-only Collections** - Square data is read-only (Square is source of truth)  
✅ **Grouped Collections** - All Square collections organized in admin sidebar  
✅ **Debug Mode** - Detailed logging for troubleshooting

## Collections

The plugin creates the following read-only collections in your Payload CMS:

- **`square-categories`** - Product categories from Square
- **`square-items`** - Products/items with variations, images, and modifier lists
- **`square-item-variations`** - Reusable variation field schema
- **`square-modifier-lists`** - Modifier lists with options (sizes, add-ons, etc.)
- **`square-inventory`** - Inventory counts by location and state

All collections include a manual refresh endpoint at `/api/{collection-slug}/refresh` and a refresh button in the admin UI.

## Sync Behavior

### Initial Sync
On Payload startup (`onInit`), the plugin automatically syncs all data from Square in this order:
1. Categories
2. Modifier Lists
3. Items (with variations)
4. Inventory Counts

### Manual Sync
Each collection has a "Refresh" button in the admin UI that triggers a manual sync for that specific collection.

### Real-time Sync (Webhooks)
When webhooks are enabled and configured:
- **Catalog changes** trigger automatic resync of categories, modifiers, and items
- **Inventory changes** trigger automatic resync of inventory counts

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
