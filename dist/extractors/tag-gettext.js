"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var t = _interopRequireWildcard(require("@babel/types"));

var _template = _interopRequireDefault(require("@babel/template"));

var _utils = require("../utils");

var _defaults = require("../defaults");

var _errors = require("../errors");

var _poHelpers = require("../po-helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var MSGSTR = _defaults.PO_PRIMITIVES.MSGSTR;
var NAME = 'tag-gettext';

var validate = function validate(node, context) {
  var msgid = (0, _utils.template2Msgid)(node, context);

  if (!(0, _poHelpers.hasUsefulInfo)(msgid)) {
    throw new _errors.ValidationError("Can not translate '".concat((0, _utils.getQuasiStr)(node), "'"));
  }
};

function match(node, context) {
  return t.isTaggedTemplateExpression(node) && context.hasAliasForFunc(NAME, node.tag.name);
}

function resolveDefault(node, context) {
  var transStr = context.isDedent() ? (0, _utils.dedentStr)((0, _utils.getQuasiStr)(node)) : (0, _utils.getQuasiStr)(node);

  if ((0, _utils.hasExpressions)(node)) {
    return node.quasi;
  }

  return t.stringLiteral(transStr);
}

function resolve(node, translation, context) {
  var transStr = translation[MSGSTR][0];

  if ((0, _utils.hasExpressions)(node)) {
    var transExpr = _template["default"].ast((0, _utils.strToQuasi)(transStr));

    if (context.isNumberedExpressions()) {
      var _exprs = transExpr.expression.expressions.map(function (_ref) {
        var value = _ref.value;
        return value;
      }).map(function (i) {
        return node.quasi.expressions[i];
      });

      return t.templateLiteral(transExpr.expression.quasis, _exprs);
    }

    var exprs = node.quasi.expressions.map(_utils.ast2Str);
    return _template["default"].ast((0, _utils.validateAndFormatMsgid)(transStr, exprs)).expression;
  }

  return t.stringLiteral(transStr);
}

var _default = {
  match: match,
  resolve: resolve,
  resolveDefault: resolveDefault,
  validate: validate,
  name: NAME,
  getMsgid: _utils.template2Msgid
};
exports["default"] = _default;