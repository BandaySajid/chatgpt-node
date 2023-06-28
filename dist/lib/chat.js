"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = chat;
var _child_process = require("child_process");
var _stream = require("stream");
var _generateRandomId = _interopRequireDefault(require("../utils/generateRandomId.js"));
var _parser = require("../utils/parser.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var bypassPath = (0, _parser.getBypassPath)();
function chat(_ref) {
  var stream = _ref.stream,
    url = _ref.url,
    headers = _ref.headers,
    parent_message_id = _ref.parent_message_id,
    message = _ref.message;
  var body = {
    action: 'next',
    messages: [{
      id: (0, _generateRandomId["default"])(),
      author: {
        role: 'user'
      },
      content: {
        content_type: 'text',
        parts: [(0, _parser.parseMessage)(message)]
      },
      metadata: {}
    }],
    parent_message_id: parent_message_id,
    model: 'text-davinci-002-render-sha',
    timezone_offset_min: -330,
    history_and_training_disabled: false,
    arkose_token: null
  };
  var cmd = "".concat(bypassPath, " -s -X POST ").concat(url, " ").concat((0, _parser.parseHeaders)(headers), " -d \"").concat(JSON.stringify(body).replace(/"/g, '\\"'), "\"");
  var curlProcess = (0, _child_process.exec)(cmd, function () {});
  if (stream) {
    var content = '';
    var transFormStream = new _stream.Transform({
      transform: function transform(chunk, encoding, cb) {
        var jsonData = chunk.toString().split('data: ');
        jsonData = jsonData.map(function (str) {
          return str.replace(/\n/g, '');
        });
        var validJson = [];
        jsonData.map(function (elem) {
          try {
            JSON.parse(elem);
            validJson.push(elem);
          } catch (err) {}
        });
        var main;
        if (validJson.includes('DONE')) {
          main = validJson[validJson.length - 2];
        } else {
          main = validJson[validJson.length - 1];
        }
        if (validJson.length > 0) {
          var parsed = JSON.parse(main).message.content.parts[0];
          content += parsed.slice(content.length);
          cb(null, JSON.stringify({
            status: 'message',
            message: content
          }));
        }
      }
    });
    curlProcess.stdout.pipe(transFormStream);
    return transFormStream;
  } else {
    return new Promise(function (resolve, reject) {
      var contentArray = [];
      var nonStreamContent = '';
      curlProcess.stdout.on('data', function (chunk) {
        var jsonData = chunk.toString().split('data: ');
        jsonData = jsonData.map(function (str) {
          return str.replace(/\n/g, '');
        });
        var validJson = [];
        jsonData.map(function (elem) {
          try {
            JSON.parse(elem);
            validJson.push(elem);
          } catch (err) {}
        });
        var main;
        if (validJson.includes('DONE')) {
          main = validJson[validJson.length - 2];
        } else {
          main = validJson[validJson.length - 1];
        }
        if (validJson.length > 0) {
          try {
            var parsed = JSON.parse(main).message.content.parts[0];
            nonStreamContent += parsed.slice(nonStreamContent.length);
            contentArray.push(JSON.stringify({
              status: 'message',
              message: nonStreamContent
            }));
          } catch (err) {}
        }
      });
      curlProcess.stdout.on('end', function () {
        resolve(contentArray[contentArray.length - 1]);
      });
      curlProcess.stderr.on('data', function (err) {
        reject(err);
      });
    });
  }
}
;