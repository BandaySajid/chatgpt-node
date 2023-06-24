import { exec } from 'child_process';
import { Transform } from 'stream';
import generateRandomId from '../utils/generateRandomId.js';
import { getBypassPath, parseHeaders, parseMessage } from '../utils/parser.js';
let bypassPath = getBypassPath();

export default function chat({ stream, url, headers, parent_message_id, message }) {
    const body = {
        "action": "next",
        "messages": [
            {
                "id": generateRandomId(),
                "author": { "role": "user" },
                "content": { "content_type": "text", "parts": [parseMessage(message)] },
                "metadata": {}
            }
        ],
        "parent_message_id": parent_message_id,
        "model": "text-davinci-002-render-sha",
        "timezone_offset_min": -330,
        "history_and_training_disabled": false,
        "arkose_token": null
    };

    const cmd = `${bypassPath} -s -X POST ${url} ${parseHeaders(headers)} -d "${JSON.stringify(body)}"`;
    const curlProcess = exec(cmd, () => {
    })
    if (stream) {
        let content = '';
        const transFormStream = new Transform({
            transform(chunk, encoding, cb) {
                let jsonData = chunk.toString().split('data: ');
                jsonData = jsonData.map(str => str.replace(/\n/g, ''));

                let validJson = [];
                jsonData.map((elem) => {
                    try {
                        JSON.parse(elem);
                        validJson.push(elem);
                    }
                    catch (err) {
                    }
                });

                let main;
                if (validJson.includes('DONE')) {
                    main = validJson[validJson.length - 2];
                }
                else {
                    main = validJson[validJson.length - 1];
                }
                if (validJson.length > 0) {
                    const parsed = JSON.parse(main).message.content.parts[0];
                    content += parsed.slice(content.length);
                    cb(null, JSON.stringify({ status: 'message', message: content }));
                }
            }
        });

        curlProcess.stdout.pipe(transFormStream);
        return transFormStream;
    }
    else {

        return new Promise((resolve, reject) => {

            let contentArray = [];
            let nonStreamContent = '';

            curlProcess.stdout.on('data', (chunk) => {
                let jsonData = chunk.toString().split('data: ');
                jsonData = jsonData.map(str => str.replace(/\n/g, ''));

                let validJson = [];
                jsonData.map((elem) => {
                    try {
                        JSON.parse(elem);
                        validJson.push(elem);
                    }
                    catch (err) {
                    }
                });

                let main;
                if (validJson.includes('DONE')) {
                    main = validJson[validJson.length - 2];
                }
                else {
                    main = validJson[validJson.length - 1];
                }
                if (validJson.length > 0) {
                    try {
                        const parsed = JSON.parse(main).message.content.parts[0];
                        nonStreamContent += parsed.slice(nonStreamContent.length);
                        contentArray.push(JSON.stringify({ status: 'message', message: nonStreamContent }));
                    }
                    catch (err) {
                        reject(new Error(`error while parsing message, try again. Error : ${err.message}`));
                    }
                }
            });

            curlProcess.stdout.on('end', () => {
                resolve(contentArray[contentArray.length - 1]);
            })

            curlProcess.stderr.on('data', (err) => {
                reject(err);
            });

        });
    }
};


