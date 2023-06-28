"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = verifySession;
var _nodeModule = require("node:module");
var _os = _interopRequireDefault(require("os"));
var _nodePath = _interopRequireDefault(require("node:path"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var _require = (0, _nodeModule.createRequire)(import.meta.url);
function checkExpired(expiresString) {
  var targetDateTime = new Date(expiresString);
  var currentDateTime = new Date();
  if (currentDateTime >= targetDateTime) {
    return true;
  }
  return false;
}
;
function verifySession(email) {
  try {
    var sessionPath = _nodePath["default"].join(_os["default"].tmpdir(), '.gpt-js-session.json');
    var session = _require(sessionPath);
    if (session === {}) {
      return {
        authenticated: false,
        accessToken: undefined,
        error: null
      };
    }
    var expired = checkExpired(session.expires);
    if (expired) {
      return {
        authenticated: false,
        accessToken: undefined,
        error: 'access token expired'
      };
    }
    ;
    if (email !== session.user.email) {
      return {
        authenticated: false,
        accessToken: undefined,
        error: null
      };
    }
    return {
      authenticated: true,
      accessToken: session.accessToken,
      error: null
    };
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      return {
        authenticated: false,
        accessToken: undefined
      };
    }
    ;
    throw err;
  }
}
;