"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.strHasExpr = strHasExpr;
exports.quasiToStr = quasiToStr;
exports.getQuasiStr = getQuasiStr;
exports.ast2Str = ast2Str;
exports.strToQuasi = strToQuasi;
exports.rmDirSync = rmDirSync;
exports.hasExpressions = hasExpressions;
exports.getMembersPath = getMembersPath;
exports.template2Msgid = template2Msgid;
exports.isInDisabledScope = isInDisabledScope;
exports.hasDisablingComment = hasDisablingComment;
exports.isTtagImport = isTtagImport;
exports.isTtagRequire = isTtagRequire;
exports.hasImportSpecifier = hasImportSpecifier;
exports.dedentStr = dedentStr;
exports.poReferenceComparator = poReferenceComparator;
exports.createFnStub = createFnStub;
exports.validateAndFormatMsgid = exports.getMsgidNumbered = exports.getMsgid = void 0;

var _child_process = require("child_process");

var bt = _interopRequireWildcard(require("@babel/types"));

var _dedent = _interopRequireDefault(require("dedent"));

var _generator = _interopRequireDefault(require("@babel/generator"));

var _template = _interopRequireDefault(require("@babel/template"));

var _defaults = require("./defaults");

var _errors = require("./errors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var disableRegExp = new RegExp("\\b".concat(_defaults.DISABLE_COMMENT, "\\b"));
var exprReg = /\$\{\s?[\w\W]+?\s}/g;

function strHasExpr(str) {
  return exprReg.test(str);
}

function quasiToStr(str) {
  return str.replace(/^`|`$/g, '');
}

function getQuasiStr(node) {
  return quasiToStr((0, _generator["default"])(node.quasi).code);
}

function ast2Str(ast) {
  return (0, _generator["default"])(ast).code;
}

function strToQuasi(str) {
  return "`".concat(str, "`");
}

function rmDirSync(path) {
  (0, _child_process.execSync)("rm -rf ".concat(path));
}

function hasExpressions(node) {
  return Boolean(node.quasi.expressions.length);
}

function getMembersPath(_ref) {
  var object = _ref.object,
      computed = _ref.computed,
      property = _ref.property;

  /* eslint-disable no-use-before-define */
  var obj = bt.isMemberExpression(object) ? getMembersPath(object) : expr2str(object);
  return computed ? "".concat(obj, "[").concat(expr2str(property), "]") : "".concat(obj, ".").concat(property.name);
}

function expr2str(expr) {
  var str;

  if (bt.isIdentifier(expr)) {
    str = expr.name;
  } else if (bt.isMemberExpression(expr)) {
    str = getMembersPath(expr);
  } else if (bt.isNumericLiteral(expr)) {
    str = expr.value;
  } else if (bt.isStringLiteral(expr)) {
    str = expr.extra.raw;
  } else if (bt.isThisExpression(expr)) {
    str = 'this';
  } else {
    throw new _errors.ValidationError("You can not use ".concat(expr.type, " '${").concat(ast2Str(expr), "}' in localized strings"));
  }

  return str;
}

var getMsgid = function getMsgid(str, exprs) {
  return str.reduce(function (s, l, i) {
    var expr = exprs[i];
    return expr === undefined ? s + l : "".concat(s).concat(l, "${ ").concat(expr2str(expr), " }");
  }, '');
};

exports.getMsgid = getMsgid;

var getMsgidNumbered = function getMsgidNumbered(str, exprs) {
  return str.reduce(function (s, l, i) {
    var expr = exprs[i];
    return expr === undefined ? s + l : "".concat(s).concat(l, "${ ").concat(i, " }");
  }, '');
};

exports.getMsgidNumbered = getMsgidNumbered;

var validateAndFormatMsgid = function validateAndFormatMsgid(msgid, exprNames) {
  var msgidAST = _template["default"].ast(strToQuasi(msgid));

  var msgidExprs = new Set(msgidAST.expression.expressions.map(ast2Str));
  exprNames.forEach(function (exprName) {
    if (!msgidExprs.has(exprName)) {
      throw new _errors.NoExpressionError("Expression '".concat(exprName, "' is not found in the localized string '").concat(msgid, "'."));
    }
  }); // need to regenerate template to fix spaces between in ${}
  // because translator can accidentally add extra space or remove

  return (0, _generator["default"])(msgidAST).code.replace(/;$/, '');
};

exports.validateAndFormatMsgid = validateAndFormatMsgid;

function template2Msgid(node, context) {
  var strs = node.quasi.quasis.map(function (_ref2) {
    var cooked = _ref2.value.cooked;
    return cooked;
  });
  var exprs = node.quasi.expressions || [];

  if (exprs.length) {
    return context.isNumberedExpressions() ? getMsgidNumbered(strs, exprs) : getMsgid(strs, exprs);
  }

  return node.quasi.quasis[0].value.cooked;
}

function isInDisabledScope(node, disabledScopes) {
  var scope = node.scope;

  while (scope) {
    if (disabledScopes.has(scope.uid)) {
      return true;
    }

    scope = scope.parent;
  }

  return false;
}

function hasDisablingComment(node) {
  if (!node.body || !node.body.length) {
    return false;
  }

  var _iterator = _createForOfIteratorHelper(node.body),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var leadingComments = _step.value.leadingComments;

      if (!leadingComments) {
        continue;
      }

      var _iterator2 = _createForOfIteratorHelper(leadingComments),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var value = _step2.value.value;

          if (value.match(disableRegExp)) {
            return true;
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return false;
}

function isTtagImport(node) {
  return node.source.value === _defaults.ID_MAP.TTAGID || node.source.value === _defaults.TTAG_MACRO_ID || node.source.value === _defaults.INTERNAL_TTAG_MACRO_ID;
}

function isTtagRequire(node) {
  return bt.isCallExpression(node.init) && node.init.callee.name === 'require' && bt.isObjectPattern(node.id) && node.init.arguments.length === 1 && (node.init.arguments[0].value === _defaults.ID_MAP.TTAGID || node.init.arguments[0].value === _defaults.TTAG_MACRO_ID || node.init.arguments[0].value === _defaults.INTERNAL_TTAG_MACRO_ID);
}

function hasImportSpecifier(node) {
  return node.specifiers && node.specifiers.some(bt.isImportSpecifier);
}

function dedentStr(str) {
  if (str.match(/\n/) !== null) {
    return (0, _dedent["default"])(str);
  }

  return str;
}

function poReferenceComparator(firstPoRef, secondPoRef) {
  if (/.*:\d+$/.test(firstPoRef)) {
    // reference has a form path/to/file.js:line_number
    var firstIdx = firstPoRef.lastIndexOf(':');
    var firstFileRef = firstPoRef.substring(0, firstIdx);
    var firstLineNum = Number(firstPoRef.substring(firstIdx + 1));
    var secondIdx = secondPoRef.lastIndexOf(':');
    var secondFileRef = secondPoRef.substring(0, secondIdx);
    var secondLineNum = Number(secondPoRef.substring(secondIdx + 1));

    if (firstFileRef !== secondFileRef) {
      if (firstFileRef < secondFileRef) {
        return -1;
      }

      return 1;
    } // else


    if (firstLineNum < secondLineNum) {
      return -1;
    }

    if (firstLineNum > secondLineNum) {
      return 1;
    }

    return 0;
  } // else
  // reference has a form path/to/file.js


  if (firstPoRef < secondPoRef) {
    return -1;
  }

  if (firstPoRef > secondPoRef) {
    return 1;
  }

  return 0;
}

function createFnStub(name) {
  return (0, _template["default"])('function NAME(){}')({
    NAME: name
  });
}