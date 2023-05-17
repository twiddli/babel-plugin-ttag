"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveEntries = resolveEntries;

var _errors = require("./errors");

var _utils = require("./utils");

var _poHelpers = require("./po-helpers");

function replaceNode(nodePath, resultNode) {
  if (resultNode !== undefined) {
    if (nodePath._C3PO_GETTEXT_CONTEXT) {
      nodePath.node = nodePath._ORIGINAL_NODE;
    }

    nodePath.replaceWith(resultNode);
  }
}

function resolveEntries(extractor, nodePath, context, state) {
  try {
    var gettextContext = nodePath._C3PO_GETTEXT_CONTEXT || '';
    var translations = context.getTranslations(gettextContext);
    var msgid = context.isDedent() ? (0, _utils.dedentStr)(extractor.getMsgid(nodePath.node, context)) : extractor.getMsgid(nodePath.node, context);
    var translationObj = translations[msgid];

    if (!translationObj) {
      throw new _errors.NoTranslationError("No \"".concat(msgid, "\" in \"").concat(context.getPoFilePath(), "\" file"));
    }

    if (!(0, _poHelpers.hasTranslations)(translationObj) || (0, _poHelpers.isFuzzy)(translationObj)) {
      throw new _errors.NoTranslationError("No translation for \"".concat(msgid, "\" in \"").concat(context.getPoFilePath(), "\" file"));
    }

    var resultNode = extractor.resolve(nodePath.node, translationObj, context, state);
    replaceNode(nodePath, resultNode);
  } catch (err) {
    if (err instanceof _errors.NoTranslationError) {
      context.noTranslationAction(err.message);

      if (extractor.resolveDefault) {
        var _resultNode = extractor.resolveDefault(nodePath.node, context, state);

        replaceNode(nodePath, _resultNode);
      }

      return;
    }

    throw err;
  }
}