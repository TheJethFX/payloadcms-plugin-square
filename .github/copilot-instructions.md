# Copilot Instructions for payloadcms-plugin-square

## Project Overview
This is a **Payload CMS plugin** that syncs Square catalog data (categories, items, variations) into Payload collections. It's a monorepo-style project with the plugin source in `src/` and a development Next.js app in `dev/` for testing.

## Architecture & Key Patterns

### Plugin Structure
- **Entry point**: `src/index.ts` exports `squarePlugin()` function that modifies Payload config
- **Collections**: Three auto-synced collections (`square-categories`, `square-items`, `square-item-variations`) defined in `src/collections/`
- **Sync mechanism**: `onInitExtension()` runs on Payload startup to pull Square catalog data via Square SDK
- **Manual refresh**: Each collection has a `/refresh` endpoint and custom admin UI button (`RefreshButtonServer` → `RefreshButtonClient`)

### Dual Export Strategy
The plugin uses separate export paths for client/server components to support React Server Components:
- `payloadcms-plugin-square` - Main plugin export
- `payloadcms-plugin-square/client` - Client components (e.g., `RefreshButtonClient`)
- `payloadcms-plugin-square/rsc` - Server components (e.g., `RefreshButtonServer`)
- `payloadcms-plugin-square/types` - Type definitions

These are configured in `package.json` `exports` field and switch from `src/` in dev to `dist/` in published package.

### Import Conventions
**Critical**: All relative imports MUST include `.js` extension even for `.ts` files:
```typescript
import { syncCategories } from 'src/sync/categories.js' // ✅ Correct
import { syncCategories } from 'src/sync/categories' // ❌ Wrong
```
This is required for ESM compatibility with `NodeNext` module resolution (see `tsconfig.json`).

### TypeScript Configuration
- **Module system**: ESM with `"module": "NodeNext"` and `"moduleResolution": "nodenext"`
- **Path aliases**: `src/*` maps to `./src/*` for cleaner imports
- **Build**: Types generated separately (`tsc`) from transpiled code (SWC)

## Development Workflows

### Local Development
```bash
pnpm dev                     # Start Next.js dev server with plugin
pnpm dev:generate-types      # Generate Payload types to dev/payload-types.ts
pnpm dev:generate-importmap  # Generate import map for Payload admin UI
```

The `dev/` folder is a full Next.js + Payload app that uses the plugin locally. It uses MongoDB Memory Server for tests.

### Building & Publishing
```bash
pnpm build                   # Full build: copyfiles → types → SWC transpile
pnpm prepublishOnly          # Auto-runs on publish: clean → build
```

**Build process**:
1. `copyfiles` - Copy non-TS assets (CSS, images) from `src/` to `dist/`
2. `build:types` - Generate `.d.ts` files with `tsc`
3. `build:swc` - Transpile TS/TSX to JS with SWC (faster than tsc)

### Testing
```bash
pnpm test        # Run all tests (integration + e2e)
pnpm test:int    # Vitest integration tests
pnpm test:e2e    # Playwright e2e tests
```

- **Integration tests**: Use `vitest` with MongoDB Memory Server
- **E2E tests**: Playwright looks for `**/e2e.spec.{ts,js}` in `dev/` folder
- **Note**: Currently no test files exist in the repo (placeholder configs only)

### Release Process
Uses **semantic-release** with conventional commits:
- Branches: `main` (stable), `next` (prerelease)
- Auto-generates `CHANGELOG.md` and GitHub releases
- Publishes to npm with version bumping based on commit messages

## Key Files & Their Purpose

### Plugin Core
- `src/index.ts` - Plugin factory, injects collections and hooks into Payload config
- `src/types/index.ts` - Centralized type definitions for the plugin

### Square API Integration (`src/square/`)
- `src/square/client.ts` - Creates authenticated Square client instance
- `src/square/api.ts` - Square SDK API wrapper (`listSquareCatalogObjects`, error handling)
- `src/square/mappers/` - Data transformation layer
  - `image.ts` - Image mapping and URL map creation
  - `measurement.ts` - Measurement unit mapping
  - `variation.ts` - Item variation mapping with images and pricing
  - `index.ts` - Exports all mappers

### Sync Operations (`src/sync/`)
- `src/sync/index.ts` - Main `onInitExtension()` orchestrator, runs on Payload startup
- `src/sync/categories.ts` - Category sync logic (fetch, delete stale, upsert)
- `src/sync/items.ts` - Item sync logic with variations, images, and relationships
- `src/sync/helpers.ts` - Shared sync utilities (placeholder for future patterns)

### Collections
Collections are **read-only** in Payload UI (data managed by Square):
- `src/collections/Categories.ts` - Syncs Square categories with `/refresh` endpoint
- `src/collections/Items.ts` - Syncs Square items with variations, images, pricing
- `src/collections/ItemVariations.ts` - Reusable field schema for variations array

Each collection includes:
- Custom admin components (`beforeList` → `RefreshButtonServer`)
- Custom REST endpoint (`/refresh`) to manually trigger sync
- Access control: read-only except updates (for Payload internal use)

### UI Components
- `src/components/RefreshButtonServer.tsx` - RSC wrapper passing props to client component
- `src/components/RefreshButtonClient.tsx` - Client component with loading state, calls `/refresh` endpoint
- `src/components/RefreshButtonClient.module.css` - Component styles

## Common Tasks

### Adding a New Collection
1. Create collection config in `src/collections/` (follow `Categories.ts` pattern)
2. Create sync function in `src/sync/` (e.g., `src/sync/newEntity.ts`)
3. Add mapper functions in `src/square/mappers/` if needed
4. Call sync function from `src/sync/index.ts` in `onInitExtension()`
5. Register collection in `src/index.ts` config.collections array
6. Add `/refresh` endpoint if manual sync needed
7. Optionally add refresh button via `beforeList` component

### Modifying Sync Logic
The sync pattern for all collections (see `src/sync/categories.ts` or `src/sync/items.ts`):
1. Fetch data from Square API via `listSquareCatalogObjects()` from `src/square/api.ts`
2. Create lookup maps using mapper functions from `src/square/mappers/`
3. Delete Payload docs where `squareId` not in fetched IDs
4. Loop through fetched items: find existing by `squareId`, then update or create

Always use `overrideAccess: true` to bypass collection access control during sync.

### Adding Data Mappers
When adding new Square catalog object types:
1. Create mapper in `src/square/mappers/newType.ts`
2. Export mapper from `src/square/mappers/index.ts`
3. Add corresponding types to `src/types/index.ts`
4. Use mapper in sync functions to transform Square data

### Adding Plugin Options
1. Add type to `SquarePluginOptions` in `src/types/index.ts`
2. Validate in plugin factory in `src/index.ts` before returning config
3. Pass options to collections/hooks that need them
4. Update README.md options table

## Environment Variables
Required for dev environment (`.env` in `dev/` folder):
- `SQUARE_ACCESS_TOKEN` - Square API access token
- `DATABASE_URI` - MongoDB connection string (auto-set for tests via Memory Server)
- `PAYLOAD_SECRET` - Payload encryption secret

## Dependencies
- **Payload CMS** (`payload`, `@payloadcms/*`) - Peer dependency, provides CMS framework
- **Square SDK** (`square`) - Peer dependency for Square API integration
- **Next.js** (`next`) - Peer dependency for admin UI (React Server Components)
- **SWC** (`@swc/cli`) - Fast TypeScript transpiler for production builds
- **pnpm** - Required package manager (v9 or v10)

## Common Gotchas
- **Import extensions**: Always use `.js` extension in imports (ESM requirement)
- **Path aliases**: Use `src/*` prefix for internal imports, not relative paths
- **Component exports**: Client components go in `client.ts`, server in `rsc.ts`
- **Access control**: Collections are read-only by default; sync functions use `overrideAccess: true`
- **Build before test**: E2E tests require built dist/ folder if testing published behavior
- **pnpm only**: Project uses pnpm-specific features (workspace protocol, onlyBuiltDependencies)
