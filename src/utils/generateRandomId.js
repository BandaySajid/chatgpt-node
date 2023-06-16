import crypto from 'crypto';

export default function generateRandomId(){
    const id = crypto.randomUUID();
    return id;
};