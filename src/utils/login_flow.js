import https from 'node:https';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const api = require('../../api/config.json');
import querystring from 'node:querystring';
import fs from 'fs/promises';
import cookiefile from 'cookiefile';
import os from 'os';
import { fileURLToPath } from 'url';
import { Curl } from './curl.js';
const path = require('path');
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cookiePath = path.join(__dirname, '..', '..', '..', '..', 'cookie.txt');


function readCookie() {
    const cookiemap = new cookiefile.CookieMap(cookiePath);
    const allCookies = cookiemap.toRequestHeader().replace('Cookie: ', '');
    return allCookies;
}

async function cropCsrf() {
    let data = await fs.readFile(cookiePath, 'utf-8');
    const regex = /^#HttpOnly(?:_.*?)?\t(?:TRUE|FALSE)\t\/\t(?:TRUE|FALSE)\t\d+\t(.*?)\t(.*?)$/gm;

    let match;
    let cookies = [];

    while ((match = regex.exec(data))) {
        const name = match[1];
        const value = match[2];
        cookies.push({ name, value });
    }

    const token = cookies.filter((c) => {
        return c.name.includes('token');
    })[0].value.split('%')[0];

    return token;
}


function request({ method, path, host, body = undefined, headers }) {
    return new Promise((resolve, reject) => {
        const req = https.request({
            host,
            path,
            method,
            headers
        }, (res) => {
            let content = '';
            res.on('data', (data) => {
                content += data;
            });

            res.on('end', () => {
                if (res.statusCode > 303 || res.statusCode < 200) {
                    reject({ status: res.statusCode, headers: res.headers, data: content });
                }
                resolve({ status: res.statusCode, headers: res.headers, data: content });
            });

            res.on('error', (err) => {
                reject(err);
            });
        });

        if (body) {
            req.write(body);
        };

        req.end();
    })
};

function parseCookies(cookies) {
    return cookies.map((cookie) => {
        return cookie.split(';')[0];
    }).join(';');
};

async function authorize({ email, password }) {
    try {
        const curl = new Curl();
        await curl.get('https://chat.openai.com/api/auth/session');

        const allCookies = readCookie();

        const token = await cropCsrf(allCookies);

        const getAuthUrl = await curl.post('https://chat.openai.com/api/auth/signin/auth0?prompt=login', querystring.stringify({
            "callbackUrl": "/",
            "csrfToken": token,
            "json": true
        }), {
            headers: {
                'Cookie': allCookies,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const authUrl = new URL(getAuthUrl.data.url);

        const authCookies = readCookie();

        const auth = api.login.auth;

        const authUrlPath = authUrl.pathname + authUrl.search;

        const resp = await request({ method: auth.method, host: authUrl.host, path: authUrlPath });
        let redirectUrl;
        if (resp.status === 302) {
            redirectUrl = resp.headers.location;
        };

        const cookies = parseCookies(resp.headers['set-cookie']);

        const loginIdentifierVerify = await request({
            method: 'GET', host: auth.host, path: redirectUrl, headers: {
                'Cookie': cookies
            }
        });

        const formData = {
            "username": email,
            'js-available': true,
            'webauthn-available': true,
            'is-brave': true,
            'webauthn-platform-available': false,
            "action": 'default'
        };

        let loginHeaders = {
            'Cookie': cookies,
            'Referer': 'https://' + auth.host + redirectUrl,
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Content-Type': 'application/x-www-form-urlencoded'
        };

        if (loginIdentifierVerify.status === 200) {
            const loginIdentifierResponse = await request({
                method: 'POST', host: auth.host, path: redirectUrl, headers: loginHeaders, body: querystring.stringify(formData)
            });


            const passwordAuthUrl = loginIdentifierResponse.headers.location;

            const passwordAuth = await request({
                method: 'POST', host: auth.host, path: passwordAuthUrl, headers: loginHeaders, body: querystring.stringify({
                    "username": email,
                    "action": formData.action,
                    "password": password
                })
            });

            const passwordAuthCookies = parseCookies(passwordAuth.headers['set-cookie']);

            const resumeAuthUrl = await passwordAuth.headers.location;

            const resumeAuth = await request({
                method: 'GET', host: auth.host, path: resumeAuthUrl, headers: {
                    ...loginHeaders, 'Cookie': passwordAuthCookies, 'Referer': 'https://' + auth.host + passwordAuthUrl
                }
            });

            const resumeAuthCookies = parseCookies(resumeAuth.headers['set-cookie']);

            const authCodeUrl = resumeAuth.headers.location;

            const authCode = await curl.get(authCodeUrl, {
                headers: {
                    'Cookie': authCookies
                }
            });

            const sessionCookies = readCookie();

            const session = await curl.get('https://chat.openai.com/api/auth/session', {
                header: {
                    'Cookie': sessionCookies
                }
            });

            const sessionFilePath = path.join(os.tmpdir(), '.gpt-js-session.json');


            await fs.writeFile(sessionFilePath, JSON.stringify(session.data));
            try {
                await fs.access(cookiePath)
                await fs.unlink(cookiePath);
            }
            catch (err) {
                console.log('cookie file does not exist')
            }

            return session.data;
        }

        else {
            try {
                await fs.access(cookiePath)
                await fs.unlink(cookiePath);
            }
            catch (err) {
                console.log('cookie file does not exist')
            }
            throw new Error('something went wrong with login flow.');
        };

    }
    catch (err) {
        try {
            await fs.access(cookiePath)
            await fs.unlink(cookiePath);
        }
        catch (err) {
            console.log('cookie file does not exist')
        }
        throw err;
    }
};

export default authorize;