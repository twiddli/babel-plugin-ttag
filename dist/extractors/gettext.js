"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var t = _interopRequireWildcard(require("@babel/types"));

var _utils = require("../utils");

var _errors = require("../errors");

var _defaults = require("../defaults");

var _poHelpers = require("../po-helpers");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var MSGSTR = _defaults.PO_PRIMITIVES.MSGSTR;
var NAME = 'gettext';

function getMsgid(node) {
  return node.arguments[0].value;
}

var validate = function validate(node) {
  var arg = node.arguments[0];

  if (!t.isLiteral(arg)) {
    throw new _errors.ValidationError("You can not use ".concat(arg.type, " '").concat((0, _utils.ast2Str)(arg), "' as an argument to gettext"));
  }

  if (arg.type === 'TemplateLiteral') {
    throw new _errors.ValidationError('You can not use template literal as an argument to gettext');
  }

  if (!(0, _poHelpers.hasUsefulInfo)(arg.value)) {
    throw new _errors.ValidationError("Can not translate '".concat(arg.value, "'"));
  }
};

function match(node, context) {
  return t.isCallExpression(node) && t.isIdentifier(node.callee) && context.hasAliasForFunc(NAME, node.callee.name) && node.arguments.length > 0;
}

function resolveDefault(node) {
  return node.arguments[0];
}

function resolve(node, translation) {
  var transStr = translation[MSGSTR][0];
  return t.stringLiteral(transStr);
}

var _default = {
  match: match,
  resolve: resolve,
  resolveDefault: resolveDefault,
  validate: validate,
  name: NAME,
  getMsgid: getMsgid
};
exports["default"] = _default;