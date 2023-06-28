import { createRequire } from 'node:module';
import os from 'os';
const require = createRequire(import.meta.url);
import path from 'node:path';

function checkExpired(expiresString) {
    const targetDateTime = new Date(expiresString);
    const currentDateTime = new Date();

    if (currentDateTime >= targetDateTime) {
        return true;
    }
    return false;
};

export default function verifySession(email) {
    try {
        const sessionPath = path.join(os.tmpdir(), '.gpt-js-session.json');
        const session = require(sessionPath);

        if(Object.keys(session.length <= 0)){
            return {
                authenticated: false, accessToken: undefined, error: null
            };
        }

        const expired = checkExpired(session.expires);

        if (expired) {
            return {
                authenticated: false, accessToken: undefined, error: 'access token expired'
            };
        };

        if (email !== session.user.email) {
            return {
                authenticated: false, accessToken: undefined, error: null
            };
        }

        return {
            authenticated: true, accessToken: session.accessToken, error: null
        };

    }
    catch (err) {
        if (err.code === 'MODULE_NOT_FOUND') {
            return { authenticated: false, accessToken: undefined };
        };
        throw err;
    }
};