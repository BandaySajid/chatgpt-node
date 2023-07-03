import fs from 'fs';
import path from 'path';

export default function get(dir) {
    try {
        let env = fs.readFileSync('../../.env', 'utf-8');
        if (env.includes('dev')) {
            return path.join(dir, '..', '..', 'cookie.txt');
        }
        return path.join(dir, '..', '..', '..', '..', 'cookie.txt');
    }
    catch (err) {
        return path.join(dir, '..', '..', '..', '..', 'cookie.txt');
    };
};