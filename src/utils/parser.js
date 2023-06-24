function parseCmd(cmd) {
    if (process.platform === 'win32') {
        return `cmd.exe /c "${cmd}"`
    } else {
        return cmd;
    }
};

function parseHeaders(headers) {
    let newHeaders = [];
    for (const h in headers) {
        newHeaders.push(`${h}: ${headers[h]}`);
    }
    let finalString = '';
    newHeaders.map((header) => {
        finalString += ` -H '${header}' `
    });
    return finalString;
};

function parseMessage(message) {
    let parsedMessage = message.replace(/[,"']/g, "");
    return parsedMessage;
};

export { parseCmd, parseHeaders, parseMessage };