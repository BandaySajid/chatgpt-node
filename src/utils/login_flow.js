import https from 'node:https';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const api = require('../../api/config.json');
import querystring from 'node:querystring';
import { exec } from 'node:child_process';
import fs from 'fs/promises';
import cookiefile from 'cookiefile';
import os from 'os';

function curl({ url, body, cookie, auth = false }) {
    return new Promise((resolve, reject) => {
        if (body) {
            exec(`./bypass/curl_chrome104 -c cookie.txt -X POST "${url}" -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8" -H "Cookie: ${cookie}" -H "Content-Type: application/x-www-form-urlencoded" -d '${body}'`, (err, stdout, stderr) => {
                if (err) {
                    reject(err);
                }
                resolve(stdout);
            });
        }
        else {
            if (auth) {
                exec(`./bypass/curl_chrome104 "${url}" -c cookie.txt -H 'Cookie: ${cookie}'`, (err, stdout, stderr) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(stdout);
                });
            }
            else {
                exec(`./bypass/curl_chrome104 -c cookie.txt "${url}"`, (err, stdout, stderr) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(stdout);
                });
            }
        }
    })
};

function readCookie() {
    const cookiemap = new cookiefile.CookieMap('cookie.txt');
    const allCookies = cookiemap.toRequestHeader().replace('Cookie: ', '');
    return allCookies;
}

async function cropCsrf() {
    let data = await fs.readFile('cookie.txt', 'utf-8');
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
                if(res.statusCode > 303 || res.statusCode < 200){
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
        await curl({ url: 'https://chat.openai.com/api/auth/session' });

        const allCookies = readCookie();

        const token = await cropCsrf(allCookies);


        const getAuthUrl = await curl({
            url: 'https://chat.openai.com/api/auth/signin/auth0?prompt=login', body: querystring.stringify({
                "callbackUrl": "/",
                "csrfToken": token,
                "json": true
            }), cookie: `${allCookies}`
        });

        const authUrl = new URL(JSON.parse(getAuthUrl).url);

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

            const authCode = await curl({ url: authCodeUrl, cookie: authCookies, auth: true });

            const sessionCookies = readCookie();

            const session = await curl({ url: 'https://chat.openai.com/api/auth/session', cookie: sessionCookies, auth: true });

            await fs.writeFile(`${os.homedir()}/.gpt-js-session.json`, JSON.stringify(JSON.parse(session)));
            await fs.unlink('cookie.txt');

            return session;
        }

        else {
            await fs.unlink('cookie.txt');
            throw new Error('something went wrong with login flow.');
        };

    }
    catch (err) {
        await fs.unlink('cookie.txt');
        throw err;
    }
};

export default authorize;