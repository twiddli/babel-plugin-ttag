"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExtractor = getExtractor;
exports.extractPoEntry = void 0;

var _path = _interopRequireDefault(require("path"));

var _poHelpers = require("./po-helpers");

var _utils = require("./utils");

var _defaults = require("./defaults");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var MSGID = _defaults.PO_PRIMITIVES.MSGID,
    MSGSTR = _defaults.PO_PRIMITIVES.MSGSTR,
    MSGCTXT = _defaults.PO_PRIMITIVES.MSGCTXT;

function defaultExtract(msgid) {
  var _ref;

  return _ref = {}, _defineProperty(_ref, MSGID, msgid), _defineProperty(_ref, MSGSTR, ''), _ref;
}

function getExtractor(nodePath, context) {
  var extractors = context.getExtractors();
  return extractors.find(function (ext) {
    return ext.match(nodePath.node, context);
  });
}

var extractPoEntry = function extractPoEntry(extractor, nodePath, context, state) {
  var node = nodePath.node;
  var filename = state.file.opts.filename;
  var poEntry;

  if (extractor.extract) {
    poEntry = extractor.extract(nodePath.node, context);
  } else {
    var msgid = context.isDedent() ? (0, _utils.dedentStr)(extractor.getMsgid(nodePath.node, context)) : extractor.getMsgid(nodePath.node, context);
    poEntry = defaultExtract(msgid);
  }

  if (nodePath._C3PO_GETTEXT_CONTEXT) {
    poEntry[MSGCTXT] = nodePath._C3PO_GETTEXT_CONTEXT;
  }

  var location = context.getLocation();

  if (filename && filename !== 'unknown') {
    var base = "".concat(process.cwd()).concat(_path["default"].sep);
    (0, _poHelpers.applyReference)(poEntry, node, filename.replace(base, ''), location);
  }

  if (context.devCommentsEnabled()) {
    var maybeTag = context.getAddComments();
    var tag = null;

    if (typeof maybeTag === 'string') {
      tag = maybeTag;
    }

    (0, _poHelpers.applyExtractedComments)(poEntry, nodePath, tag);
  }

  (0, _poHelpers.applyFormat)(poEntry);
  return poEntry;
};

exports.extractPoEntry = extractPoEntry;