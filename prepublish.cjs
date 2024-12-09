const fs = require('fs');

const packageJsonPath = './package.json';
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

if (packageJson.publishConfig && packageJson.publishConfig.exports) {
	packageJson.exports = packageJson.publishConfig.exports;
	fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
	console.log('Exports field added to package.json from publishConfig.exports');
} else {
	console.log('No exports found in publishConfig, skipping.');
}
