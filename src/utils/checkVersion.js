// Check environment
const isDev = import.meta.env.DEV;

/* global __APP_VERSION__ */
const CURRENT_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '1.1.4'; // Single Source of Truth
const REMOTE_VERSION_URL = 'https://kanishdk.github.io/Syndicate-os/version.json';

/**
 * Check if a new version is available
 * @returns {Promise<{updateAvailable: boolean, localVersion: string, remoteVersion: string|null, error: string|null}>}
 */
export async function checkForUpdates() {
    try {
        // Fetch remote version.json with cache-busting
        const response = await fetch(`${REMOTE_VERSION_URL}?t=${Date.now()}`, {
            cache: 'no-cache',
            headers: {
                'Cache-Control': 'no-cache'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const remoteData = await response.json();
        const remoteVersion = remoteData.version;

        // Compare versions
        const updateAvailable = remoteVersion !== CURRENT_VERSION;

        return {
            updateAvailable,
            localVersion: CURRENT_VERSION,
            remoteVersion,
            error: null
        };
    } catch (error) {
        console.warn('[Version Check] Failed to check for updates:', error);
        return {
            updateAvailable: false,
            localVersion: CURRENT_VERSION,
            remoteVersion: null,
            error: error.message
        };
    }
}

/**
 * Compare two semantic version strings
 * @param {string} v1 - First version (e.g., "1.1.2")
 * @param {string} v2 - Second version (e.g., "1.2.0")
 * @returns {number} - Returns 1 if v1 > v2, -1 if v1 < v2, 0 if equal
 */
export function compareVersions(v1, v2) {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);

    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
        const part1 = parts1[i] || 0;
        const part2 = parts2[i] || 0;

        if (part1 > part2) return 1;
        if (part1 < part2) return -1;
    }

    return 0;
}
