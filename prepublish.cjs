const fs = require('fs');
const path = require('path');

// Resolve the path to package.json
const packageJsonPath = path.resolve(__dirname, 'package.json');

// Read and parse package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

// Update "main" and "types" fields
packageJson.main = './dist/index.js';
packageJson.types = './dist/index.d.ts';

// Conditionally add "exports" from "publishConfig.exports"
if (packageJson.publishConfig?.exports) {
	packageJson.exports = packageJson.publishConfig.exports;
	console.log('Added "exports" field from publishConfig.exports.');
} else {
	console.log('No "exports" field found in publishConfig.');
}

// Write the updated package.json back to the file
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
console.log('Updated "main", "types", and "exports" fields in package.json.');
