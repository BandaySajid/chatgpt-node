import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
import { fileURLToPath } from 'url';
const path = require('path');
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import os from 'os';

function parseHeaders(headers) {
    let newHeaders = [];
    for (const h in headers) {
        newHeaders.push(`${h}: ${headers[h]}`);
    }
    let finalString = '';
    newHeaders.map((header) => {
        finalString += ` -H '${header}' `
    });
    return finalString;
};

function parseMessage(message) {
    let parsedMessage = message.replace(/[,"']/g, "");
    return parsedMessage;
};

function getBypassPath() {
    let bypassPath;
    if (os.platform() === 'win32') {
        bypassPath = path.join(__dirname, '..', '..', 'bypass', 'windows', 'curl-impersonate-win', 'curl_chrome104.bat');
    }
    else {
        bypassPath = path.join(__dirname, '..', '..', 'bypass', 'linux', 'curl_chrome104');
    };
    return bypassPath;
}

export { getBypassPath, parseHeaders, parseMessage };