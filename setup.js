import { exec } from 'child_process';
import os from 'os';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
import { fileURLToPath } from 'url';
const path = require('path');
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import downloadFile from './src/utils/download.js';

function runScript() {
    const isWindows = os.platform() === 'win32';

    if (isWindows) {
        downloadFile('https://github.com/BandaySajid/chatgpt-node/releases/download/v1.0.8/curl-impersonate-win.zip', 'windows');
    } else {
        downloadFile('https://github.com/lwthiker/curl-impersonate/releases/download/v0.5.4/curl-impersonate-v0.5.4.x86_64-linux-gnu.tar.gz', 'linux');
    }
}

runScript();