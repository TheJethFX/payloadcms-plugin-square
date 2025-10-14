#!/usr/bin/env node
/**
 * Prepares package.json for publishing by copying it to dist/
 * and updating paths to point to the current directory instead of dist/
 */
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

// Read the original package.json
const pkgPath = join(rootDir, 'package.json')
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))

// Create a new package.json for dist with updated paths
const distPkg = {
  ...pkg,
  main: './index.js',
  types: './index.d.ts',
  exports: {
    '.': {
      import: './index.js',
      types: './index.d.ts',
      default: './index.js',
    },
    './types': {
      import: './exports/types.js',
      types: './exports/types.d.ts',
      default: './exports/types.js',
    },
    './client': {
      import: './exports/client.js',
      types: './exports/client.d.ts',
      default: './exports/client.js',
    },
    './rsc': {
      import: './exports/rsc.js',
      types: './exports/rsc.d.ts',
      default: './exports/rsc.js',
    },
  },
  typesVersions: {
    '*': {
      client: ['exports/client.d.ts'],
      types: ['exports/types.d.ts'],
      rsc: ['exports/rsc.d.ts'],
      '*': ['*'],
    },
  },
  // Since we're publishing from dist/, include all files in dist
  files: ['**/*'],
}

// Remove publishConfig and dev dependencies
delete distPkg.publishConfig
delete distPkg.devDependencies
delete distPkg.scripts

// Write to dist/package.json
const distPkgPath = join(rootDir, 'dist', 'package.json')
writeFileSync(distPkgPath, JSON.stringify(distPkg, null, 2) + '\n')

console.log('✅ Created dist/package.json with updated paths')
