"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBypassPath = getBypassPath;
exports.parseHeaders = parseHeaders;
exports.parseMessage = parseMessage;
var _nodeModule = require("node:module");
var _url = require("url");
var _os = _interopRequireDefault(require("os"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var _require = (0, _nodeModule.createRequire)(import.meta.url);
var path = _require('path');
var _filename = (0, _url.fileURLToPath)(import.meta.url);
var _dirname = path.dirname(_filename);
function parseHeaders(headers) {
  var newHeaders = [];
  for (var h in headers) {
    newHeaders.push("".concat(h, ": ").concat(headers[h]));
  }
  var finalString = '';
  newHeaders.map(function (header) {
    finalString += " -H \"".concat(header, "\" ");
  });
  return finalString;
}
;
function parseMessage(message) {
  var parsedMessage = message.replace(/[,"']/g, "");
  return parsedMessage;
}
;
function getBypassPath() {
  var bypassPath;
  if (_os["default"].platform() === 'win32') {
    bypassPath = path.join(_dirname, '..', '..', 'bypass', 'windows', 'curl-impersonate-win', 'curl_chrome104.bat');
  } else {
    bypassPath = path.join(_dirname, '..', '..', 'bypass', 'linux', 'curl_chrome104');
  }
  ;
  return bypassPath;
}