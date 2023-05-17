"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var t = _interopRequireWildcard(require("@babel/types"));

var _tagGettext = _interopRequireDefault(require("./tag-gettext"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var NAME = 'jsxtag-gettext';

function match(node, context) {
  return t.isTaggedTemplateExpression(node) && context.hasAliasForFunc(NAME, node.tag.name);
}

function templateLiteral2Array(_ref) {
  var quasis = _ref.quasis,
      expressions = _ref.expressions;
  var items = [];
  quasis.forEach(function (quasi, i) {
    if (quasi.value.cooked !== '') {
      items.push(t.stringLiteral(quasi.value.cooked));
    }

    if (expressions[i]) {
      items.push(expressions[i]);
    }
  });
  return items;
}

function resolveDefault(node, context) {
  var resolved = _tagGettext["default"].resolveDefault(node, context);

  if (t.isTemplateLiteral(resolved)) {
    return t.arrayExpression(templateLiteral2Array(resolved));
  }

  return t.arrayExpression([resolved]);
}

function resolve(node, translation, context) {
  var resolved = _tagGettext["default"].resolve(node, translation, context);

  if (t.isTemplateLiteral(resolved)) {
    return t.arrayExpression(templateLiteral2Array(resolved));
  }

  return t.arrayExpression([resolved]);
}

var _default = _objectSpread(_objectSpread({}, _tagGettext["default"]), {}, {
  resolve: resolve,
  resolveDefault: resolveDefault,
  match: match,
  name: NAME
});

exports["default"] = _default;