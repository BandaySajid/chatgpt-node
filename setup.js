import { exec } from 'child_process';
import os from 'os';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
import { fileURLToPath } from 'url';
const path = require('path');
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import fs from 'fs';

function runScript() {
    const isWindows = os.platform() === 'win32';

    if (isWindows) {
        exec('scripts\\script.bat', (err, stdout, stderr) => {
            if (err) {
                console.error('Error:', err.message);
            } else {
                // const sourceDirectory = path.join(__dirname, 'bypass', 'windows', 'curl-impersonate-win', 'config');
                // const destinationDirectory = path.join(__dirname, 'config');

                // fs.rename(sourceDirectory, destinationDirectory, (err) => {
                //     if (err) {
                //         console.error('Error moving directory:', err);
                //     }
                // });
                console.log(stdout);
            }
        });
    } else {
        exec('bash scripts/script.sh', (err, stdout, stderr) => {
            if (err) {
                console.error('Error:', err.message);
            } else {
                console.log(stdout);
            }
        });
    }
}

runScript();