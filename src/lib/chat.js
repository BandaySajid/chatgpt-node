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

function chat({ stream, url, headers, parent_message_id, conversation_id, message }) {
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

            const titleResp = await curl.post(`https://chat.openai.com/backend-api/conversation/gen_title/${convId}`, JSON.stringify({
                message_id: message_id
            }), {
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

            for (const elem of jsonData) {
                try {
                    const parsedElem = JSON.parse(elem);
                    message_id = parsedElem.message.id;

                    const messageContent = parsedElem.message.content.parts[0];
                    content += messageContent.slice(content.length);
                    if (parsedElem.message.status === 'finished_successfully') {
                        readableStream.push(JSON.stringify({ status: parsedElem.message.status, message: content }));
                        break;
                    }
                    readableStream.push(JSON.stringify({ status: parsedElem.message.status, message: content }));
                }
                catch (err) {
                    //invalid json
                }
            }
        });

        curlProcess.stdout.on('end', () => {
            readableStream.emit('end');
        })

        curlProcess.stderr.on('data', (err) => {
            readableStream.emit('error', err);
        });

        return { readableStream };
    }
    else {

        const finalData = new Promise((resolve, reject) => {
            let contentArray = [];
            let nonStreamContent = '';

            curlProcess.stdout.on('data', (chunk) => {
                let jsonData = chunk.toString().split('data: ');
                jsonData = jsonData.map(str => str.replace(/\n/g, ''));

                for (const elem of jsonData) {
                    try {
                        const parsedElem = JSON.parse(elem);
                        if (parsedElem.message.status === 'finished_successfully') {
                            break;
                        }
                        message_id = parsedElem.message.id;

                        const messageContent = parsedElem.message.content.parts[0];
                        nonStreamContent += messageContent.slice(nonStreamContent.length);
                        contentArray.push(JSON.stringify({ status: parsedElem.message.status, message: nonStreamContent }));
                    }
                    catch (err) {
                        //invalid json
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

export { chat, myEmitter };

