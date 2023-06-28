"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = generateRandomId;
var _crypto = _interopRequireDefault(require("crypto"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function generateRandomId() {
  var id = _crypto["default"].randomUUID();
  return id;
}
;