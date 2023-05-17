"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isContextTagCall = isContextTagCall;
exports.isContextFnCall = isContextFnCall;
exports.isValidFnCallContext = isValidFnCallContext;
exports.isValidTagContext = isValidTagContext;

var t = _interopRequireWildcard(require("@babel/types"));

var _utils = require("./utils");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var NAME = 'context';

function isContextTagCall(node, context) {
  return t.isTaggedTemplateExpression(node) && t.isMemberExpression(node.tag) && t.isCallExpression(node.tag.object) && t.isIdentifier(node.tag.object.callee) && context.hasAliasForFunc(NAME, node.tag.object.callee.name);
}

function isContextFnCall(node, context) {
  return t.isCallExpression(node) && t.isMemberExpression(node.callee) && t.isCallExpression(node.callee.object) && t.isIdentifier(node.callee.object.callee) && context.hasAliasForFunc(NAME, node.callee.object.callee.name);
}

function isValidFnCallContext(nodePath) {
  var node = nodePath.node;
  var argsLength = node.callee.object.arguments.length;

  if (argsLength !== 1) {
    throw nodePath.buildCodeFrameError("Context function accepts only 1 argument but has ".concat(argsLength, " instead."));
  }

  var contextStr = node.callee.object.arguments[0];

  if (!t.isLiteral(contextStr)) {
    throw nodePath.buildCodeFrameError("Expected string as a context argument. Actual - \"".concat((0, _utils.ast2Str)(contextStr), "\"."));
  }

  return true;
}

function isValidTagContext(nodePath) {
  var node = nodePath.node;
  var argsLength = node.tag.object.arguments.length;

  if (argsLength !== 1) {
    throw nodePath.buildCodeFrameError("Context function accepts only 1 argument but has ".concat(argsLength, " instead."));
  }

  var contextStr = node.tag.object.arguments[0];

  if (!t.isLiteral(contextStr)) {
    throw nodePath.buildCodeFrameError("Expected string as a context argument. Actual - \"".concat((0, _utils.ast2Str)(contextStr), "\"."));
  }

  return true;
}