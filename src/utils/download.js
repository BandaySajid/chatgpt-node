import axios from 'axios';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import tar from 'tar';
import fs from 'fs'

const outputFile = 'curl-impersonate.tar.gz';

// Function to download the file
async function downloadFile(url, outputFile) {
    const response = await axios.get(url, { responseType: 'stream' });
    const outputStream = createWriteStream(outputFile);

    await promisify(pipeline)(response.data, outputStream);
}

// Function to extract the file
async function extractFile(inputFile, outputFolder) {
    await tar.x({ file: inputFile, cwd: outputFolder });
}

// Main execution
export default async function main(url, os) {
    try {
        let extractedFolder;

        if (os === 'windows') {
            extractedFolder = 'bypass\\windows';
        }
        else {
            extractedFolder = 'bypass/linux';
        };

        // Create the output folder if it doesn't exist
        fs.mkdirSync(extractedFolder, { recursive: true });

        // Download the file
        await downloadFile(url, outputFile);

        // Extract the file
        await extractFile(outputFile, extractedFolder);

        // Remove the archive file
        fs.unlinkSync(outputFile);

        console.log('setup done.');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}