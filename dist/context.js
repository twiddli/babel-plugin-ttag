"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _pluralForms = require("plural-forms");

var _defaults = require("./defaults");

var _tagGettext = _interopRequireDefault(require("./extractors/tag-gettext"));

var _jsxtagGettext = _interopRequireDefault(require("./extractors/jsxtag-gettext"));

var _gettext = _interopRequireDefault(require("./extractors/gettext"));

var _ngettext = _interopRequireDefault(require("./extractors/ngettext"));

var _poHelpers = require("./po-helpers");

var _errors = require("./errors");

var _config = require("./config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var FAIL = _defaults.UNRESOLVED_ACTION.FAIL,
    WARN = _defaults.UNRESOLVED_ACTION.WARN,
    SKIP = _defaults.UNRESOLVED_ACTION.SKIP;
var DEFAULT_EXTRACTORS = [_tagGettext["default"], _jsxtagGettext["default"], _gettext["default"], _ngettext["default"]];

function logAction(message) {
  var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : SKIP;

  /* eslint-disable no-console */
  switch (level) {
    case FAIL:
      throw new Error(message);

    case SKIP:
      break;

    case WARN:
      // TODO: use logger that can log to console or file or stdout
      console.warn(message);
      break;

    default:
      // TODO: use logger that can log to console or file or stdout
      console.warn(message);
  }
}

var C3poContext = /*#__PURE__*/function () {
  function C3poContext(config) {
    var _this = this;

    _classCallCheck(this, C3poContext);

    _defineProperty(this, "hasImport", function (alias) {
      var isInDiscover = _this.config.discover && _this.config.discover.indexOf(alias) !== -1;
      return _this.imports.has(alias) || isInDiscover;
    });

    this.config = config || {};

    var _validateConfig = (0, _config.validateConfig)(this.config, _config.configSchema),
        _validateConfig2 = _slicedToArray(_validateConfig, 2),
        validationResult = _validateConfig2[0],
        errorsText = _validateConfig2[1];

    if (!validationResult) {
      throw new _errors.ConfigValidationError(errorsText);
    }

    this.clear();

    if (this.config.moduleName) {
      _defaults.ID_MAP.TTAGID = this.config.moduleName;
    }

    if (!this.config.defaultLang) {
      this.config.defaultLang = 'en';
    }

    this.setPoData();
    Object.freeze(this.config);
  }

  _createClass(C3poContext, [{
    key: "clear",
    value: function clear() {
      this.aliases = {};
      this.imports = new Set();
    }
  }, {
    key: "getAliasesForFunc",
    value: function getAliasesForFunc(ttagFuncName) {
      // TODO: implement possibility to overwrite or add aliases in config;
      var defaultAlias = _defaults.FUNC_TO_ALIAS_MAP[ttagFuncName];
      var alias = this.aliases[ttagFuncName] || defaultAlias;

      if (!alias) {
        throw new _errors.ConfigError("Alias for function ".concat(ttagFuncName, " was not found ").concat(JSON.stringify(_defaults.FUNC_TO_ALIAS_MAP)));
      }

      return Array.isArray(alias) ? alias : [alias];
    }
  }, {
    key: "hasAliasForFunc",
    value: function hasAliasForFunc(ttagFuncName, fn) {
      var aliases = this.getAliasesForFunc(ttagFuncName);
      return aliases.includes(fn);
    }
  }, {
    key: "setAliases",
    value: function setAliases(aliases) {
      this.aliases = aliases;
    }
  }, {
    key: "addAlias",
    value: function addAlias(funcName, alias) {
      if (this.aliases[funcName]) {
        this.aliases[funcName].push(alias);
      } else {
        this.aliases[funcName] = [alias];
      }
    }
  }, {
    key: "setImports",
    value: function setImports(imports) {
      this.imports = imports;
    }
  }, {
    key: "addImport",
    value: function addImport(importName) {
      this.imports.add(importName);
    }
  }, {
    key: "getExtractors",
    value: function getExtractors() {
      // TODO: implement possibility to specify additional extractors in config;
      return DEFAULT_EXTRACTORS;
    }
  }, {
    key: "getDefaultHeaders",
    value: function getDefaultHeaders() {
      var headers = _objectSpread({}, _defaults.DEFAULT_HEADERS);

      headers['plural-forms'] = (0, _pluralForms.getPluralFormsHeader)(this.config.defaultLang);
      return headers;
    }
  }, {
    key: "getPluralsCount",
    value: function getPluralsCount() {
      if (this.poData && this.poData.headers) {
        return (0, _poHelpers.getNPlurals)(this.poData.headers);
      }

      return (0, _pluralForms.getNPlurals)(this.config.defaultLang);
    }
  }, {
    key: "getPluralFormula",
    value: function getPluralFormula() {
      if (this.poData && this.poData.headers) {
        return (0, _poHelpers.getPluralFunc)(this.poData.headers);
      }

      return (0, _pluralForms.getFormula)(this.config.defaultLang);
    }
  }, {
    key: "getLocation",
    value: function getLocation() {
      return this.config.extract && this.config.extract.location || _defaults.LOCATION.FULL;
    }
  }, {
    key: "getOutputFilepath",
    value: function getOutputFilepath() {
      return this.config.extract && this.config.extract.output || _defaults.DEFAULT_POT_OUTPUT;
    }
  }, {
    key: "getPoFilePath",
    value: function getPoFilePath() {
      return this.config.resolve && this.config.resolve.translations;
    }
  }, {
    key: "isExtractMode",
    value: function isExtractMode() {
      return Boolean(this.config.extract);
    }
  }, {
    key: "isNumberedExpressions",
    value: function isNumberedExpressions() {
      return Boolean(this.config.numberedExpressions);
    }
  }, {
    key: "isResolveMode",
    value: function isResolveMode() {
      return Boolean(this.config.resolve);
    }
  }, {
    key: "noTranslationAction",
    value: function noTranslationAction(message) {
      if (!this.isResolveMode()) {
        return;
      }

      if (this.config.resolve && this.config.resolve.translations === 'default') {
        return;
      }

      logAction(message, this.config.resolve.unresolved);
    }
  }, {
    key: "validationFailureAction",
    value: function validationFailureAction(funcName, message) {
      var level = this.config.extractors && this.config.extractors[funcName] && this.config.extractors[funcName].invalidFormat || FAIL;
      logAction(message, level);
    }
  }, {
    key: "isDedent",
    value: function isDedent() {
      if (this.config.dedent === undefined) {
        return true;
      }

      return this.config.dedent;
    }
  }, {
    key: "devCommentsEnabled",
    value: function devCommentsEnabled() {
      return Boolean(this.config.addComments);
    }
  }, {
    key: "getAddComments",
    value: function getAddComments() {
      return this.config.addComments;
    }
  }, {
    key: "isSortedByMsgid",
    value: function isSortedByMsgid() {
      return Boolean(this.config.sortByMsgid);
    }
  }, {
    key: "isSortedByMsgctxt",
    value: function isSortedByMsgctxt() {
      return Boolean(this.config.sortByMsgctxt);
    }
  }, {
    key: "setPoData",
    value: function setPoData() {
      var poFilePath = this.getPoFilePath();

      if (!poFilePath || poFilePath === 'default') {
        this.poData = (0, _poHelpers.getDefaultPoData)(this.getDefaultHeaders());
        return;
      }

      this.poData = (0, _poHelpers.parsePoData)(poFilePath);
    }
  }, {
    key: "getTranslations",
    value: function getTranslations() {
      var gettextContext = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      return this.poData.translations[gettextContext] || {};
    }
  }]);

  return C3poContext;
}();

var _default = C3poContext;
exports["default"] = _default;