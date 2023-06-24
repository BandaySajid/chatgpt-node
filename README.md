# chatgpt-node

## Overview

chatgpt-node is a Node.js library that provides access to the ChatGPT web-API for free. While ChatGPT provides an API to access its model, it is a paid service, making it inaccessible for everyone. The chatgpt-node library aims to bridge this gap by allowing developers to authenticate/login via web-api and start conversations with the ChatGPT model, enabling them to integrate chatbot functionality into their applications, websites, and more.


## NOTE

Currently, signin functionality is supported only with OPENAI : Auth0 :  email and password. `GOOGLE, MICROSOFT, APPLE` Oauth login is not supported. 

## Features

- Seamless authentication process with ChatGPT.
- Start and maintain conversations with the ChatGPT model.
- Retrieve responses in real-time via stream or as a complete response.

## Installation

To use chatgpt-node in your Node.js project, you can install it via npm:

```shell
node setup.js
```

Running `setup.js` will install all the required dependencies for windows and linux.

```shell
npm install chatgpt-node
```

## Usage

To use chatgpt-node, you need to create an instance of the `Gpt` class by providing your ChatGPT email and password:

```javascript
const { Gpt } = require("chatgpt-node");

const user = new Gpt({
  email: process.env.EMAIL, //your_chat_gpt_email
  password: process.env.PASSWORD, //your_chat_gpt_password
});
```

### Starting a Conversation

To start a conversation with the ChatGPT model, you can use the `conversation` method of the `Gpt` instance. The method takes an object with the following options:

- `message` (required): The message to send to the ChatGPT model.
- `stream` (optional): If set to `true`, a stream will be returned instead of the whole response. Defaults to `false`.
- `randomParentId` (optional): If set to `true`, a new chat with a random `parent_message_id` will be started for each message. If set to `false`, the `parent_message_id` will remain the same for subsequent messages. Defaults to `false`.

`stream=false`

```javascript
(async function () {
  try {
    const authenticated = await user.authenticate();
    if (!authenticated) {
      throw "not authenticated";
    }
    const chat = await user.conversation({ message: "Who is this?" });
    console.log(chat);
  } catch (err) {
    console.log("error:", err.message);
  }
})();
```

`stream=true`

```javascript
(async function () {
  try {
    const authenticated = await user.authenticate();
    if (!authenticated) {
      throw "not authenticated";
    }
    const chat = await user.conversation({
      message: "Who is this?",
      stream: true,
    });
    chat.on("data", (data) => {
      console.log(data.toString());
    });
  } catch (err) {
    console.log("error:", err.message);
  }
})();
```

### Response

If the `stream` option is set to `false`, the `conversation` method will return the complete response in one go. The response object will have the following structure:

```javascript
{
    status: 'message',
    message: 'I am chat-gpt based on the GPT-3 model.'
}
```

If the `stream` option is set to `true`, the response will be received as a stream of messages. Each message object in the stream will have the same structure as above.

```javascript
{
    status: 'message',
    message: 'I am chat-gpt'
}

{
    status: 'message',
    message: 'I am chat-gpt based on the GPT-3 model'
}

```

As you see the stream returns the same data again and with the next part as well, so make sure to parse the data correctly.

### Contributing

Contributions to chatgpt-node are welcome! If you encounter any issues, have feature suggestions, or would like to contribute code, please follow the guidelines in the CONTRIBUTING.md file.

## License

This project is licensed under the [MIT License](https://github.com/BandaySajid/chatgpt-node/blob/main/LICENSE).

## Acknowledgements

The chatgpt-node library was developed by `Sajid Banday`. It includes the use of [curl-impersonate](https://github.com/lwthiker/curl-impersonate) tool by [lwthiker](https://github.com/lwthiker), which helped to bypass Cloudflare detection for accessing resources. Special thanks to the community.

## Privacy and Data Usage

chatgpt-node respects user privacy and does not store or transmit any user data. It is designed to solely facilitate communication with the ChatGPT web / eventstream API and does not retain any information or perform any data processing beyond the scope of the library's functionality.

Please note that chatgpt-node does not modify or analyze the content of the messages sent by users. It acts as a bridge between the user and the ChatGPT web / eventstream API, transmitting messages and receiving responses without any interference or manipulation of the data.

The session data / token is saved in a local file to maintain the session, make sure to not include it anywhere.
