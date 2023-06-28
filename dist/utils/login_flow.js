"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _nodeHttps = _interopRequireDefault(require("node:https"));
var _nodeModule = require("node:module");
var _nodeQuerystring = _interopRequireDefault(require("node:querystring"));
var _promises = _interopRequireDefault(require("fs/promises"));
var _cookiefile = _interopRequireDefault(require("cookiefile"));
var _os = _interopRequireDefault(require("os"));
var _url = require("url");
var _curl = require("./curl.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var _require = (0, _nodeModule.createRequire)(import.meta.url);
var api = _require('../../api/config.json');
var path = _require('path');
var _filename = (0, _url.fileURLToPath)(import.meta.url);
var _dirname = path.dirname(_filename);
var cookiePath = path.join(_dirname, '..', '..', '..', '..', 'cookie.txt');
function readCookie() {
  var cookiemap = new _cookiefile["default"].CookieMap(cookiePath);
  var allCookies = cookiemap.toRequestHeader().replace('Cookie: ', '');
  return allCookies;
}
function cropCsrf() {
  return _cropCsrf.apply(this, arguments);
}
function _cropCsrf() {
  _cropCsrf = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    var data, regex, match, cookies, name, value, token;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return _promises["default"].readFile(cookiePath, 'utf-8');
        case 2:
          data = _context.sent;
          regex = /^#HttpOnly(?:_.*?)?\t(?:TRUE|FALSE)\t\/\t(?:TRUE|FALSE)\t\d+\t(.*?)\t(.*?)$/gm;
          cookies = [];
          while (match = regex.exec(data)) {
            name = match[1];
            value = match[2];
            cookies.push({
              name: name,
              value: value
            });
          }
          token = cookies.filter(function (c) {
            return c.name.includes('token');
          })[0].value.split('%')[0];
          return _context.abrupt("return", token);
        case 8:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _cropCsrf.apply(this, arguments);
}
function request(_ref) {
  var method = _ref.method,
    path = _ref.path,
    host = _ref.host,
    _ref$body = _ref.body,
    body = _ref$body === void 0 ? undefined : _ref$body,
    headers = _ref.headers;
  return new Promise(function (resolve, reject) {
    var req = _nodeHttps["default"].request({
      host: host,
      path: path,
      method: method,
      headers: headers
    }, function (res) {
      var content = '';
      res.on('data', function (data) {
        content += data;
      });
      res.on('end', function () {
        if (res.statusCode > 303 || res.statusCode < 200) {
          reject({
            status: res.statusCode,
            headers: res.headers,
            data: content
          });
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: content
        });
      });
      res.on('error', function (err) {
        reject(err);
      });
    });
    if (body) {
      req.write(body);
    }
    ;
    req.end();
  });
}
;
function parseCookies(cookies) {
  return cookies.map(function (cookie) {
    return cookie.split(';')[0];
  }).join(';');
}
;
function authorize(_x) {
  return _authorize.apply(this, arguments);
}
function _authorize() {
  _authorize = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(_ref2) {
    var email, password, curl, allCookies, token, getAuthUrl, authUrl, authCookies, auth, authUrlPath, resp, redirectUrl, cookies, loginIdentifierVerify, formData, loginHeaders, loginIdentifierResponse, passwordAuthUrl, passwordAuth, passwordAuthCookies, resumeAuthUrl, resumeAuth, resumeAuthCookies, authCodeUrl, authCode, sessionCookies, session, sessionFilePath;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          email = _ref2.email, password = _ref2.password;
          _context2.prev = 1;
          curl = new _curl.Curl();
          _context2.next = 5;
          return curl.get('https://chat.openai.com/api/auth/session');
        case 5:
          allCookies = readCookie();
          _context2.next = 8;
          return cropCsrf(allCookies);
        case 8:
          token = _context2.sent;
          _context2.next = 11;
          return curl.post('https://chat.openai.com/api/auth/signin/auth0?prompt=login', _nodeQuerystring["default"].stringify({
            "callbackUrl": "/",
            "csrfToken": token,
            "json": true
          }), {
            headers: {
              'Cookie': allCookies,
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          });
        case 11:
          getAuthUrl = _context2.sent;
          authUrl = new URL(getAuthUrl.data.url);
          authCookies = readCookie();
          auth = api.login.auth;
          authUrlPath = authUrl.pathname + authUrl.search;
          _context2.next = 18;
          return request({
            method: auth.method,
            host: authUrl.host,
            path: authUrlPath
          });
        case 18:
          resp = _context2.sent;
          if (resp.status === 302) {
            redirectUrl = resp.headers.location;
          }
          ;
          cookies = parseCookies(resp.headers['set-cookie']);
          _context2.next = 24;
          return request({
            method: 'GET',
            host: auth.host,
            path: redirectUrl,
            headers: {
              'Cookie': cookies
            }
          });
        case 24:
          loginIdentifierVerify = _context2.sent;
          formData = {
            "username": email,
            'js-available': true,
            'webauthn-available': true,
            'is-brave': true,
            'webauthn-platform-available': false,
            "action": 'default'
          };
          loginHeaders = {
            'Cookie': cookies,
            'Referer': 'https://' + auth.host + redirectUrl,
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Content-Type': 'application/x-www-form-urlencoded'
          };
          if (!(loginIdentifierVerify.status === 200)) {
            _context2.next = 67;
            break;
          }
          _context2.next = 30;
          return request({
            method: 'POST',
            host: auth.host,
            path: redirectUrl,
            headers: loginHeaders,
            body: _nodeQuerystring["default"].stringify(formData)
          });
        case 30:
          loginIdentifierResponse = _context2.sent;
          passwordAuthUrl = loginIdentifierResponse.headers.location;
          _context2.next = 34;
          return request({
            method: 'POST',
            host: auth.host,
            path: passwordAuthUrl,
            headers: loginHeaders,
            body: _nodeQuerystring["default"].stringify({
              "username": email,
              "action": formData.action,
              "password": password
            })
          });
        case 34:
          passwordAuth = _context2.sent;
          passwordAuthCookies = parseCookies(passwordAuth.headers['set-cookie']);
          _context2.next = 38;
          return passwordAuth.headers.location;
        case 38:
          resumeAuthUrl = _context2.sent;
          _context2.next = 41;
          return request({
            method: 'GET',
            host: auth.host,
            path: resumeAuthUrl,
            headers: _objectSpread(_objectSpread({}, loginHeaders), {}, {
              'Cookie': passwordAuthCookies,
              'Referer': 'https://' + auth.host + passwordAuthUrl
            })
          });
        case 41:
          resumeAuth = _context2.sent;
          resumeAuthCookies = parseCookies(resumeAuth.headers['set-cookie']);
          authCodeUrl = resumeAuth.headers.location;
          _context2.next = 46;
          return curl.get(authCodeUrl, {
            headers: {
              'Cookie': authCookies
            }
          });
        case 46:
          authCode = _context2.sent;
          sessionCookies = readCookie();
          _context2.next = 50;
          return curl.get('https://chat.openai.com/api/auth/session', {
            header: {
              'Cookie': sessionCookies
            }
          });
        case 50:
          session = _context2.sent;
          sessionFilePath = path.join(_os["default"].tmpdir(), '.gpt-js-session.json');
          _context2.next = 54;
          return _promises["default"].writeFile(sessionFilePath, JSON.stringify(session.data));
        case 54:
          _context2.prev = 54;
          _context2.next = 57;
          return _promises["default"].access(cookiePath);
        case 57:
          _context2.next = 59;
          return _promises["default"].unlink(cookiePath);
        case 59:
          _context2.next = 64;
          break;
        case 61:
          _context2.prev = 61;
          _context2.t0 = _context2["catch"](54);
          console.log('cookie file does not exist');
        case 64:
          return _context2.abrupt("return", session.data);
        case 67:
          _context2.prev = 67;
          _context2.next = 70;
          return _promises["default"].access(cookiePath);
        case 70:
          _context2.next = 72;
          return _promises["default"].unlink(cookiePath);
        case 72:
          _context2.next = 77;
          break;
        case 74:
          _context2.prev = 74;
          _context2.t1 = _context2["catch"](67);
          console.log('cookie file does not exist');
        case 77:
          throw new Error('something went wrong with login flow.');
        case 78:
          ;
          _context2.next = 94;
          break;
        case 81:
          _context2.prev = 81;
          _context2.t2 = _context2["catch"](1);
          _context2.prev = 83;
          _context2.next = 86;
          return _promises["default"].access(cookiePath);
        case 86:
          _context2.next = 88;
          return _promises["default"].unlink(cookiePath);
        case 88:
          _context2.next = 93;
          break;
        case 90:
          _context2.prev = 90;
          _context2.t3 = _context2["catch"](83);
          console.log('cookie file does not exist');
        case 93:
          throw _context2.t2;
        case 94:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[1, 81], [54, 61], [67, 74], [83, 90]]);
  }));
  return _authorize.apply(this, arguments);
}
;
var _default = authorize;
exports["default"] = _default;