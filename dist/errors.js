"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValidationError = ValidationError;
exports.NoTranslationError = NoTranslationError;
exports.NoExpressionError = NoExpressionError;
exports.ConfigError = exports.ConfigValidationError = void 0;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var ConfigValidationError = /*#__PURE__*/function (_Error) {
  _inherits(ConfigValidationError, _Error);

  var _super = _createSuper(ConfigValidationError);

  function ConfigValidationError() {
    _classCallCheck(this, ConfigValidationError);

    return _super.apply(this, arguments);
  }

  return ConfigValidationError;
}( /*#__PURE__*/_wrapNativeSuper(Error));

exports.ConfigValidationError = ConfigValidationError;

var ConfigError = /*#__PURE__*/function (_Error2) {
  _inherits(ConfigError, _Error2);

  var _super2 = _createSuper(ConfigError);

  function ConfigError() {
    _classCallCheck(this, ConfigError);

    return _super2.apply(this, arguments);
  }

  return ConfigError;
}( /*#__PURE__*/_wrapNativeSuper(Error));

exports.ConfigError = ConfigError;

function ValidationError(message) {
  this.name = 'ValidationError';
  this.message = message;
  this.stack = new Error().stack;
}

ValidationError.prototype = Object.create(Error.prototype);
ValidationError.prototype.constructor = ValidationError;

function NoTranslationError(message) {
  this.name = 'NoTranslationError';
  this.message = message;
  this.stack = new Error().stack;
}

NoTranslationError.prototype = Object.create(Error.prototype);
NoTranslationError.prototype.constructor = NoTranslationError;

function NoExpressionError(message) {
  this.name = 'NoExpressionError';
  this.message = message;
  this.stack = new Error().stack;
}

NoExpressionError.prototype = Object.create(Error.prototype);
NoExpressionError.prototype.constructor = NoExpressionError;