"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LOCATION = exports.DEFAULT_POT_OUTPUT = exports.INTERNAL_TTAG_MACRO_ID = exports.TTAG_MACRO_ID = exports.ID_MAP = exports.DISABLE_COMMENT = exports.UNRESOLVED_ACTION = exports.PO_PRIMITIVES = exports.ALIAS_TO_FUNC_MAP = exports.FUNC_TO_ALIAS_MAP = exports.DEFAULT_HEADERS = void 0;
var DEFAULT_HEADERS = {
  'content-type': 'text/plain; charset=UTF-8',
  'plural-forms': 'nplurals=2; plural=(n!=1);'
}; // TODO: setup default aliases from extractors

exports.DEFAULT_HEADERS = DEFAULT_HEADERS;
var FUNC_TO_ALIAS_MAP = {
  'tag-gettext': 't',
  'jsxtag-gettext': 'jt',
  gettext: ['gettext', '_'],
  ngettext: 'ngettext',
  msgid: 'msgid',
  context: 'c'
};
exports.FUNC_TO_ALIAS_MAP = FUNC_TO_ALIAS_MAP;
var ALIAS_TO_FUNC_MAP = Object.keys(FUNC_TO_ALIAS_MAP).reduce(function (obj, key) {
  var value = FUNC_TO_ALIAS_MAP[key];

  if (Array.isArray(value)) {
    value.forEach(function (alias) {
      obj[alias] = key;
    });
  } else {
    obj[value] = key;
  }

  return obj;
}, {});
exports.ALIAS_TO_FUNC_MAP = ALIAS_TO_FUNC_MAP;
var PO_PRIMITIVES = {
  MSGSTR: 'msgstr',
  MSGID: 'msgid',
  MSGCTXT: 'msgctxt',
  MSGID_PLURAL: 'msgid_plural'
};
exports.PO_PRIMITIVES = PO_PRIMITIVES;
var UNRESOLVED_ACTION = {
  FAIL: 'fail',
  WARN: 'warn',
  SKIP: 'skip'
};
exports.UNRESOLVED_ACTION = UNRESOLVED_ACTION;
var DISABLE_COMMENT = 'disable ttag';
exports.DISABLE_COMMENT = DISABLE_COMMENT;
var ID_MAP = {
  TTAGID: 'ttag'
};
exports.ID_MAP = ID_MAP;
var TTAG_MACRO_ID = 'ttag.macro';
exports.TTAG_MACRO_ID = TTAG_MACRO_ID;
var INTERNAL_TTAG_MACRO_ID = 'babel-plugin-ttag/dist/ttag.macro';
exports.INTERNAL_TTAG_MACRO_ID = INTERNAL_TTAG_MACRO_ID;
var DEFAULT_POT_OUTPUT = 'polyglot_result.pot';
exports.DEFAULT_POT_OUTPUT = DEFAULT_POT_OUTPUT;
var LOCATION = {
  FULL: 'full',
  FILE: 'file',
  NEVER: 'never'
};
exports.LOCATION = LOCATION;