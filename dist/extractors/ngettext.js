"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var t = _interopRequireWildcard(require("@babel/types"));

var _template = _interopRequireDefault(require("@babel/template"));

var _defaults = require("../defaults");

var _utils = require("../utils");

var _poHelpers = require("../po-helpers");

var _errors = require("../errors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var NAME = 'ngettext';
var MSGID = _defaults.PO_PRIMITIVES.MSGID,
    MSGSTR = _defaults.PO_PRIMITIVES.MSGSTR,
    MSGID_PLURAL = _defaults.PO_PRIMITIVES.MSGID_PLURAL;

function getMsgid(node, context) {
  var _node$arguments$slice = node.arguments.slice(0, -1),
      _node$arguments$slice2 = _toArray(_node$arguments$slice),
      msgidTag = _node$arguments$slice2[0],
      _ = _node$arguments$slice2.slice(1);

  return (0, _utils.template2Msgid)(msgidTag, context);
}

function validateNPlural(exp) {
  if (!t.isIdentifier(exp) && !t.isNumericLiteral(exp) && !t.isMemberExpression(exp)) {
    throw new _errors.ValidationError("".concat(exp.type, " '").concat((0, _utils.ast2Str)(exp), "' can not be used as plural argument"));
  }
}

var validate = function validate(node, context) {
  var msgidTag = node.arguments[0];
  var msgidAliases = context.getAliasesForFunc('msgid');

  if (!t.isTaggedTemplateExpression(msgidTag)) {
    throw new _errors.ValidationError(msgidAliases.length > 1 ? "First argument must be tagged template expression. You should use one of '".concat(msgidAliases, "' tag") : "First argument must be tagged template expression. You should use '".concat(msgidAliases[0], "' tag"));
  }

  if (!context.hasAliasForFunc('msgid', msgidTag.tag.name)) {
    throw new _errors.ValidationError(msgidAliases.length > 1 ? "Expected one of '".concat(msgidAliases, "' for the first argument but not '").concat(msgidTag.tag.name, "'") : "Expected '".concat(msgidAliases[0], "' for the first argument but not '").concat(msgidTag.tag.name, "'"));
  }

  var tags = node.arguments.slice(1, -1); // will throw validation error if tags has expressions with wrong format

  tags.forEach(function (quasi) {
    return (0, _utils.template2Msgid)({
      quasi: quasi
    }, context);
  });

  if (!context.isNumberedExpressions()) {
    validateNPlural(node.arguments[node.arguments.length - 1]);
  }

  var msgid = (0, _utils.template2Msgid)(msgidTag, context);

  if (!(0, _poHelpers.hasUsefulInfo)(msgid)) {
    throw new _errors.ValidationError("Can not translate '".concat((0, _utils.getQuasiStr)(msgidTag), "'"));
  }
};

function match(node, context) {
  return t.isCallExpression(node) && t.isIdentifier(node.callee) && context.hasAliasForFunc(NAME, node.callee.name) && node.arguments.length > 0 && t.isTaggedTemplateExpression(node.arguments[0]);
}

function extract(node, context) {
  var _translate;

  var tags = node.arguments.slice(0, -1);
  var msgid = context.isDedent() ? (0, _utils.dedentStr)((0, _utils.template2Msgid)(tags[0], context)) : (0, _utils.template2Msgid)(tags[0], context);
  var nplurals = context.getPluralsCount();

  if (tags.length !== nplurals) {
    throw new _errors.ValidationError("Expected to have ".concat(nplurals, " plural forms but have ").concat(tags.length, " instead"));
  } // TODO: handle case when only 1 plural form


  var msgidPlural = context.isDedent() ? (0, _utils.dedentStr)((0, _utils.template2Msgid)({
    quasi: tags[1]
  }, context)) : (0, _utils.template2Msgid)({
    quasi: tags[1]
  }, context);
  var translate = (_translate = {}, _defineProperty(_translate, MSGID, msgid), _defineProperty(_translate, MSGID_PLURAL, msgidPlural), _defineProperty(_translate, MSGSTR, []), _translate);

  for (var i = 0; i < nplurals; i++) {
    translate[MSGSTR][i] = '';
  }

  return translate;
}

function ngettextTemplate(ngettext, pluralForm) {
  return (0, _template["default"])("function NGETTEXT(n, args) { ".concat((0, _poHelpers.pluralFnBody)(pluralForm), " }"))({
    NGETTEXT: ngettext
  });
}

function getNgettextUID(state, pluralFunc) {
  /* eslint-disable no-underscore-dangle */
  if (!state.file.__ngettextUid) {
    var uid = state.file.scope.generateUidIdentifier('tag_ngettext');
    state.file.path.unshiftContainer('body', ngettextTemplate(uid, pluralFunc));
    state.file.__ngettextUid = uid;
  }

  return state.file.__ngettextUid;
}

function resolveDefault(node, context, state) {
  var tagArg = node.arguments[node.arguments.length - 1];
  node.arguments[0] = node.arguments[0].quasi;
  var args = node.arguments.slice(0, -1).map(function (quasi) {
    var quasiStr = (0, _utils.getQuasiStr)({
      quasi: quasi
    });
    var dedentedStr = context.isDedent() ? (0, _utils.dedentStr)(quasiStr) : quasiStr;
    return _template["default"].ast((0, _utils.strToQuasi)(dedentedStr)).expression;
  });
  var nplurals = context.getPluralsCount();

  while (nplurals > args.length) {
    var last = args[args.length - 1];
    args.push(t.templateLiteral(last.quasis, last.expressions));
  }

  return (0, _template["default"])('NGETTEXT(N, ARGS)')({
    NGETTEXT: getNgettextUID(state, context.getPluralFormula()),
    N: tagArg,
    ARGS: t.arrayExpression(args)
  });
}

function resolve(node, translationObj, context, state) {
  var _node$arguments$slice3 = node.arguments.slice(0, -1),
      _node$arguments$slice4 = _toArray(_node$arguments$slice3),
      msgidTag = _node$arguments$slice4[0],
      _ = _node$arguments$slice4.slice(1);

  var args = translationObj[MSGSTR];
  var tagArg = node.arguments[node.arguments.length - 1];
  var exprs = msgidTag.quasi.expressions.map(_utils.ast2Str);

  if (t.isLiteral(tagArg)) {
    var pluralFn = (0, _poHelpers.makePluralFunc)(context.getPluralFormula());
    var orig = (0, _utils.validateAndFormatMsgid)(pluralFn(tagArg.value, args), exprs);
    return _template["default"].ast(orig);
  }

  return (0, _template["default"])('NGETTEXT(N, ARGS)')({
    NGETTEXT: getNgettextUID(state, context.getPluralFormula()),
    N: tagArg,
    ARGS: t.arrayExpression(args.map(function (l) {
      var quasis;
      var expressions;

      if (context.isNumberedExpressions()) {
        var transNode = _template["default"].ast((0, _utils.strToQuasi)(l));

        quasis = transNode.expression.quasis;
        expressions = transNode.expression.expressions.map(function (_ref) {
          var value = _ref.value;
          return value;
        }).map(function (i) {
          return msgidTag.quasi.expressions[i];
        });
      } else {
        var _transNode = _template["default"].ast((0, _utils.validateAndFormatMsgid)(l, exprs));

        quasis = _transNode.expression.quasis;
        expressions = _transNode.expression.expressions;
      }

      return t.templateLiteral(quasis, expressions);
    }))
  });
}

var _default = {
  match: match,
  extract: extract,
  resolve: resolve,
  name: NAME,
  validate: validate,
  resolveDefault: resolveDefault,
  getMsgid: getMsgid
};
exports["default"] = _default;