import authorize from '../utils/login_flow.js';
import verifySession from '../utils/verify_session.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const api = require('../../api/config.json');
import chat from './chat.js';
import generateRandomId from '../utils/generateRandomId.js';

class Gpt {
    #email;
    #password;
    #headers = api.conversation.headers;
    #chatUrl = api.conversation.url;
    #parent_message_id;
    #conversation_id;
    constructor({ email, password } = {}) {
        if (!email || !password) {
            throw new Error('Email or password not provided');
        };

        if (typeof email !== 'string' || typeof password !== 'string') {
            throw new Error('Email and password should be a string');
        };

        if (email.length < 6 || password.length < 6) {
            throw new Error('Email and password should be at least 6 characters long');
        }

        this.#email = email;
        this.#password = password;

        this.#generateParentId();
    }

    async authenticate(authToken) {
        try {
            if (authToken && authToken.length > 30) {
                this.accessToken = `Bearer ${authToken}`;
                this.#headers.Authorization = this.accessToken;
                return true;
            };
            const { authenticated, accessToken, error } = verifySession(this.#email);
            if (error) {
                throw new Error(error);
            };
            if (!authenticated) {
                let data = await authorize({ email: this.#email, password: this.#password });
                if (data) {
                    data = JSON.parse(data);
                    this.accessToken = 'Bearer ' + data.accessToken;
                    this.#headers.Authorization = this.accessToken;
                    return true;
                }
                throw new Error('Authentication failed: check your credentials');
            }
            this.accessToken = 'Bearer ' + accessToken;
            this.#headers.Authorization = this.accessToken;
            return true;

        }
        catch (err) {
            throw err
        }
    };

    #generateParentId() {
        this.#parent_message_id = generateRandomId();
    };


    async conversation({ stream = false, randomParentId = false, message }) {
        if (!message) {
            throw new Error('Please provide a message!');
        }
        if (randomParentId) {
            this.#generateParentId();
        };

        let final;

        if (stream) {
            const { readableStream, myEmitter } = chat({ url: this.#chatUrl, headers: this.#headers, stream: stream, parent_message_id: this.#parent_message_id, conversation_id: this.#conversation_id, message });
            myEmitter.on('conv_id', (conv_id, message_id) => {
                this.#conversation_id = conv_id;
                this.#parent_message_id = message_id
            });

            this.conv_count++;

            final = readableStream;

        } else {
            const { conversation_id, finalData, message_id } = chat({ url: this.#chatUrl, headers: this.#headers, stream: stream, parent_message_id: this.#parent_message_id, conversation_id: this.#conversation_id, message });
            this.#conversation_id = conversation_id;
            this.#parent_message_id = message_id;

            this.conv_count++;
            final = finalData;
        }


        return final;
    };
};

export default Gpt;