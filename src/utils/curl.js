import { exec } from 'child_process';
import qs from 'querystring';
import { getBypassPath } from './parser.js';

function requestError(data) {
    throw new Error(`Request Error: ${JSON.stringify(data)}`)
}

class Curl {
    constructor() {
        this.curlPath = getBypassPath();
    }

    async get(url, opts = {}) {
        const headers = opts.headers ? Object.entries(opts.headers).map(([key, value]) => `-H '${key}: ${value}'`).join(' ') : '';
        const params = opts.params ? `?${qs.stringify(opts.params)}` : '';
        const curlString = `${this._getCurlExec()} -c cookie.txt ${headers} -i -L${this.proxy ? ` -x ${this.proxy}` : ''} --connect-timeout 30 --max-time 30 -k ${url}${params}`;
        const { stdout, stderr, code, error } = await this.shell(curlString);
        if (code === 0) {
            const payload = this._stdToOutPut(stdout);
            try {
                payload.body = JSON.parse(payload.body);
            } catch (err) { }
            if ([200, 201, 301, 302].includes(payload.status)) {
                return {
                    data: payload.body,
                    headers: payload.headers,
                    status: payload.status,
                };
            } else {
                throw new requestError({
                    data: payload.body,
                    headers: payload.headers,
                    status: payload.status,
                });
            }
        } else {
            throw new Error(`${this._stdErrorToOutPut(stderr)} ${error ? `- ${error}` : ''}`);
        }
    }

    async post(url, data, opts = {}) {
        const headers = opts.headers ? Object.entries(opts.headers).map(([key, value]) => `-H '${key}: ${value}'`).join(' ') : '';
        const params = opts.params ? `?${qs.stringify(opts.params)}` : '';
        const curlString = `${this._getCurlExec()} -c cookie.txt ${headers} -i -L -X POST -d '${data}'${this.proxy ? ` -x ${this.proxy}` : ''} --connect-timeout 30 --max-time 30 -k ${url}${params}`;
        const { stdout, stderr, code, error } = await this.shell(curlString);
        if (code === 0) {
            const payload = this._stdToOutPut(stdout);
            try {
                payload.body = JSON.parse(payload.body);
            } catch (err) { }
            if ([200, 201, 301, 302].includes(payload.status)) {
                return {
                    data: payload.body,
                    headers: payload.headers,
                    status: payload.status,
                };
            } else {
                throw new requestError({
                    data: payload.body,
                    headers: payload.headers,
                    status: payload.status,
                });
            }
        } else {
            throw new Error(`${this._stdErrorToOutPut(stderr)} ${error ? `- ${error}` : ''}`);
        }
    }

    shell(cmd) {
        return new Promise((resolve) => {
            exec(cmd, (err, stdout, stderr) => {
                resolve({
                    stdout,
                    stderr,
                    code: err ? err.code : 0,
                    error: err,
                });
            });
        });
    }

    _stdErrorToOutPut(std) {
        return std;
    }

    _stdToOutPut(std) {
        const payload = std.split(/\r\n/);
        payload.reverse();
        const body = payload[0];
        const headers = {};
        let status;
        let isPage = 0;
        for (let i = 0; i < payload.length; i++) {
            if (payload[i] === '') {
                isPage++;
            }
            if (isPage === 1 && payload[i] !== '') {
                const header = payload[i];
                if (header.toLowerCase().includes('http/')) {
                    const [, stt] = header.split(' ');
                    status = Number(stt.trim());
                } else {
                    const [field, value] = header.split(': ');
                    if (field.toLowerCase() === 'set-cookie') {
                        if (!headers[field]) {
                            headers[field] = [];
                        }
                        headers[field].push(value);
                    } else if (headers[field]) {
                        // If the header field already exists, append the new value
                        headers[field] += `, ${value}`;
                    } else {
                        headers[field] = value;
                    }
                }
            }
            if (isPage === 2) {
                break;
            }
        }
        return {
            body,
            headers,
            status,
        };
    }


    _getCurlExec() {
        return `${this.curlPath}`;
    }
};

export { Curl };