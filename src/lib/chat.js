import { exec } from 'child_process';
import { Readable } from 'stream';
import generateRandomId from '../utils/generateRandomId.js';
import { getBypassPath, parseHeaders, parseMessage } from '../utils/parser.js';
let bypassPath = getBypassPath();
import { Curl } from "../utils/curl.js";
import EventEmitter from 'events';
const curl = new Curl();

class eventEmitter extends EventEmitter { };

const myEmitter = new eventEmitter();

export default function chat({ stream, url, headers, parent_message_id, conversation_id, message }) {
    let readableStream = undefined;
    let message_id;

    if (stream) {
        readableStream = new Readable({
            read() { }
        });
    };

    let convId = undefined;
    const body = {
        action: 'next',
        messages: [
            {
                id: generateRandomId(),
                author: { role: 'user' },
                content: { content_type: 'text', parts: [parseMessage(message)] },
                metadata: {}
            }
        ],
        parent_message_id: parent_message_id,
        model: 'text-davinci-002-render-sha',
        timezone_offset_min: -330,
        history_and_training_disabled: false,
        arkose_token: null
    };

    if (conversation_id) {
        body.conversation_id = conversation_id;
        convId = conversation_id;
    };

    const cmd = `${bypassPath} -s -X POST ${url} ${parseHeaders(headers)} -d "${JSON.stringify(body).replace(/"/g, '\\"')}"`;
    const curlProcess = exec(cmd, async () => {
        try {
            headers.Accept = "*/*"
            const convResp = await curl.get('https://chat.openai.com/backend-api/conversations?offset=0&limit=28&order=updated', {
                headers: headers
            });

            convId = convResp.data["items"][0]?.id;

            const titleResp = await curl.post(`https://chat.openai.com/backend-api/conversation/gen_title/${convId}`, {
                message_id: message_id
            }, {
                headers: headers
            });

            conversation_id = convId;

            myEmitter.emit('conv_id', conversation_id, message_id);
        }
        catch (err) {
            console.log('an error when generating title', err);
        };

    });
    if (stream) {
        let content = '';

        curlProcess.stdout.on('data', (chunk) => {
            let jsonData = chunk.toString().split('data: ');
            jsonData = jsonData.map(str => str.replace(/\n/g, ''));

            let validJson = [];
            jsonData.map((elem) => {
                try {
                    message_id = JSON.parse(elem).message_id;
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
                    content += parsed.slice(content.length);
                    readableStream.push(JSON.stringify({ status: 'message', message: content }));
                }
                catch (err) {

                }
            }
        });

        curlProcess.stdout.on('end', () => {
            readableStream.emit('end');
        })

        curlProcess.stderr.on('data', (err) => {
            readableStream.emit('error', err);
        });

        return { readableStream, myEmitter };
    }
    else {

        const finalData = new Promise((resolve, reject) => {
            let contentArray = [];
            let nonStreamContent = '';

            curlProcess.stdout.on('data', (chunk) => {
                let jsonData = chunk.toString().split('data: ');
                jsonData = jsonData.map(str => str.replace(/\n/g, ''));

                let validJson = [];
                jsonData.map((elem) => {
                    try {
                        message_id = JSON.parse(elem).message_id;
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

        return {
            conversation_id: convId, finalData, message_id
        }
    }
};


