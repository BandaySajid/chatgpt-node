const { exec } = require('node:child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');

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