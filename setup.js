import { exec } from 'child_process';
import os from 'os';

function runScript() {
    const isWindows = os.platform() === 'win32';

    if (isWindows) {
        exec('scripts/script.bat', (err, stdout, stderr) => {
            if (err) {
                console.error('Error:', err.message);
            } else {
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