"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildPotData = buildPotData;
exports.applyReference = applyReference;
exports.applyExtractedComments = applyExtractedComments;
exports.applyFormat = applyFormat;
exports.makePotStr = makePotStr;
exports.parsePoData = parsePoData;
exports.getPluralFunc = getPluralFunc;
exports.getNPlurals = getNPlurals;
exports.hasTranslations = hasTranslations;
exports.isFuzzy = isFuzzy;
exports.pluralFnBody = pluralFnBody;
exports.makePluralFunc = makePluralFunc;
exports.getDefaultPoData = getDefaultPoData;
exports.hasUsefulInfo = hasUsefulInfo;

var bt = _interopRequireWildcard(require("@babel/types"));

var _fs = _interopRequireDefault(require("fs"));

var _gettextParser = _interopRequireDefault(require("gettext-parser"));

var _dedent = _interopRequireDefault(require("dedent"));

var _defaults = require("./defaults");

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function buildPotData(translations) {
  var data = {
    charset: 'UTF-8',
    headers: _defaults.DEFAULT_HEADERS,
    translations: {
      '': {}
    }
  };

  var _iterator = _createForOfIteratorHelper(translations),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var trans = _step.value;
      var ctx = trans[_defaults.PO_PRIMITIVES.MSGCTXT] || '';

      if (!data.translations[ctx]) {
        data.translations[ctx] = {};
      }

      if (!data.translations[ctx][trans.msgid]) {
        data.translations[ctx][trans.msgid] = trans;
        continue;
      }

      var oldTrans = data.translations[ctx][trans.msgid]; // merge references

      if (oldTrans.comments && oldTrans.comments.reference && trans.comments && trans.comments.reference && !oldTrans.comments.reference.includes(trans.comments.reference)) {
        oldTrans.comments.reference = "".concat(oldTrans.comments.reference, "\n").concat(trans.comments.reference);
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return data;
}

function applyReference(poEntry, node, filepath, location) {
  if (!poEntry.comments) {
    poEntry.comments = {};
  }

  var reference = null;

  switch (location) {
    case _defaults.LOCATION.FILE:
      reference = filepath;
      break;

    case _defaults.LOCATION.NEVER:
      reference = null;
      break;

    default:
      reference = "".concat(filepath, ":").concat(node.loc.start.line);
  }

  poEntry.comments.reference = reference;
  return poEntry;
}
/**
 *  Find comments linked to a translation string
 *  Some comments are hidden inside expressions, ex: when you put a comment before
 *  the string inside JSX.
 *  <p>
 *      {
 *          // translator: message
 *          c('helle').t`world`
 *      }
 *  </p>
 *  So we need to look for the parent container of the current TaggedTemplateExpression
 *  to find the comments
 *  @param Object NodePath current processing AST node
 *  @param Array comments current comments found via NodePath.node.leadingComments
 *  @returns Array comments
*/


var extractComment = function extractComment(nodePath) {
  var _nodePath$parent;

  var comments = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  // Can be null cf https://github.com/babel/babel/blob/main/packages/babel-types/scripts/generators/typescript-legacy.js#L39
  if (comments === null || comments === void 0 ? void 0 : comments.length) {
    return comments;
  }

  if (((_nodePath$parent = nodePath.parent) === null || _nodePath$parent === void 0 ? void 0 : _nodePath$parent.type) === 'JSXExpressionContainer') {
    return nodePath.parent.expression.leadingComments || [];
  }

  return [];
};

var tagRegex = {};

function applyExtractedComments(poEntry, nodePath, tag) {
  if (!poEntry.comments) {
    poEntry.comments = {};
  }

  var node = nodePath.node;

  if (!(bt.isStatement(node) || bt.isDeclaration(node))) {
    // Collect parents' comments
    //
    applyExtractedComments(poEntry, nodePath.parentPath, tag);
  }

  var comments = extractComment(nodePath, node.leadingComments);
  var transComments = comments ? comments.map(function (c) {
    return c.value;
  }) : [];

  if (tag) {
    if (!tagRegex[tag]) {
      tagRegex[tag] = new RegExp("^\\s*".concat(tag, "\\s*(.*?)\\s*$"));
    }

    transComments = transComments.map(function (c) {
      return c.match(tagRegex[tag]);
    }).filter(function (match) {
      return Boolean(match);
    }).map(function (c) {
      return (0, _dedent["default"])(c[1]);
    });
  }

  if (transComments.length === 0) return;

  if (poEntry.comments.extracted) {
    poEntry.comments.extracted += '\n';
  } else {
    poEntry.comments.extracted = '';
  }

  poEntry.comments.extracted += transComments.join('\n');
}

function applyFormat(poEntry) {
  var msgid = poEntry[_defaults.PO_PRIMITIVES.MSGID];
  var hasExprs = (0, _utils.strHasExpr)(msgid);

  if (!hasExprs) {
    return poEntry;
  }

  if (!poEntry.comments) {
    poEntry.comments = {};
  }

  if (poEntry.comments.flag) {
    poEntry.comments.flag = "".concat(poEntry.comments.flag, "\njavascript-format");
  } else {
    poEntry.comments.flag = 'javascript-format';
  }

  return poEntry;
}

function makePotStr(data) {
  return _gettextParser["default"].po.compile(data);
}

var poDataCache = {}; // This function must use cache, because:
// 1. readFileSync is blocking operation (babel transforms are sync for now)
// 2. po data parse is quite CPU intensive operation that can also block

function parsePoData(filepath) {
  if (poDataCache[filepath]) return poDataCache[filepath];

  var poRaw = _fs["default"].readFileSync(filepath);

  var parsedPo = _gettextParser["default"].po.parse(poRaw.toString());

  var translations = parsedPo.translations;
  var headers = parsedPo.headers;
  var data = {
    translations: translations,
    headers: headers
  };
  poDataCache[filepath] = data;
  return data;
}

var pluralRegex = /\splural ?=?([\s\S]*);?/;

function getPluralFunc(headers) {
  try {
    var pluralHeader = headers['plural-forms'] || headers['Plural-Forms'];
    var pluralFn = pluralRegex.exec(pluralHeader)[1];

    if (pluralFn[pluralFn.length - 1] === ';') {
      pluralFn = pluralFn.slice(0, -1);
    }

    return pluralFn;
  } catch (err) {
    throw new Error("Failed to parse plural func from headers \"".concat(JSON.stringify(headers), "\"\n"));
  }
}

function getNPlurals(headers) {
  var pluralHeader = headers['plural-forms'] || headers['Plural-Forms'];
  var nplurals = /nplurals ?= ?(\d)/.exec(pluralHeader)[1];
  return parseInt(nplurals, 10);
}

function hasTranslations(translationObj) {
  return translationObj[_defaults.PO_PRIMITIVES.MSGSTR].reduce(function (r, t) {
    return r && t.length;
  }, true);
}

function isFuzzy(translationObj) {
  return translationObj && translationObj.comments && translationObj.comments.flag === 'fuzzy';
}

function pluralFnBody(pluralStr) {
  return "return args[+ (".concat(pluralStr, ")];");
}

var fnCache = {};

function makePluralFunc(pluralStr) {
  /* eslint-disable no-new-func */
  var fn = fnCache[pluralStr];

  if (!fn) {
    fn = new Function('n', 'args', pluralFnBody(pluralStr));
    fnCache[pluralStr] = fn;
  }

  return fn;
}

function getDefaultPoData(headers) {
  return {
    headers: headers,
    translations: {
      '': {}
    }
  };
}

var nonTextRegexp = /\${.*?}|\d|\s|[.,\/#!$%\^&\*;{}=\-_`~()]/g;

function hasUsefulInfo(text) {
  var withoutExpressions = text.replace(nonTextRegexp, '');
  return Boolean(withoutExpressions.match(/\S/));
}