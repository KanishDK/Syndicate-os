import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packagePath = path.resolve(__dirname, '../package.json');
const versionJsonPath = path.resolve(__dirname, '../public/version.json');

try {
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const versionData = JSON.parse(fs.readFileSync(versionJsonPath, 'utf8'));

    const newVersionData = {
        ...versionData,
        version: pkg.version,
        date: new Date().toISOString().split('T')[0]
    };

    fs.writeFileSync(versionJsonPath, JSON.stringify(newVersionData, null, 4));
    console.log(`[Version Sync] Successfully updated public/version.json to v${pkg.version}`);
} catch (error) {
    console.error('[Version Sync] Failed to sync version:', error);
    process.exit(1);
}
