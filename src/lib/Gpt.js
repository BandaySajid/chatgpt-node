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

    async authenticate() {
        try {
            const { authenticated, accessToken, error } = verifySession(this.#email);
            if (error) {
                throw new Error(error);
            };
            if (!authenticated) {
                const data = await authorize({ email: this.#email, password: this.#password });
                if (data) {
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
        return chat({ url: this.#chatUrl, headers: this.#headers, stream: stream, parent_message_id: this.#parent_message_id, message });
    };
};

export default Gpt;