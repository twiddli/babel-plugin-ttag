"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isStarted = isStarted;
exports["default"] = ttagPlugin;

var bt = _interopRequireWildcard(require("@babel/types"));

var _fs = _interopRequireDefault(require("fs"));

var _mkdirp = _interopRequireDefault(require("mkdirp"));

var _path = _interopRequireDefault(require("path"));

var _defaults = require("./defaults");

var _poHelpers = require("./po-helpers");

var _extract = require("./extract");

var _utils = require("./utils");

var _resolve = require("./resolve");

var _errors = require("./errors");

var _context = _interopRequireDefault(require("./context"));

var _gettextContext = require("./gettext-context");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var started = false;

function isStarted() {
  return started;
}

var potEntries = [];

function ttagPlugin() {
  var context;
  var disabledScopes = new Set();

  function tryMatchTag(cb) {
    return function (nodePath, state) {
      var node = nodePath.node;

      if ((0, _gettextContext.isContextTagCall)(node, context) && (0, _gettextContext.isValidTagContext)(nodePath)) {
        nodePath._C3PO_GETTEXT_CONTEXT = node.tag.object.arguments[0].value;
        nodePath._ORIGINAL_NODE = node;
        nodePath.node = bt.taggedTemplateExpression(node.tag.property, node.quasi);
        nodePath.node.loc = node.loc;
      }

      cb(nodePath, state);
    };
  }

  function tryMatchCall(cb) {
    return function (nodePath, state) {
      var node = nodePath.node;

      if ((0, _gettextContext.isContextFnCall)(node, context) && (0, _gettextContext.isValidFnCallContext)(nodePath)) {
        nodePath._C3PO_GETTEXT_CONTEXT = node.callee.object.arguments[0].value;
        nodePath._ORIGINAL_NODE = node;
        nodePath.node = bt.callExpression(node.callee.property, node.arguments);
        nodePath.node.loc = node.loc;
      }

      cb(nodePath, state);
    };
  }

  function extractOrResolve(nodePath, state) {
    if ((0, _utils.isInDisabledScope)(nodePath, disabledScopes)) {
      return;
    }

    var extractor = (0, _extract.getExtractor)(nodePath, context);

    if (!extractor) {
      return;
    }

    var aliases = context.getAliasesForFunc(extractor.name);
    var hasImport = aliases.find(context.hasImport);

    if (!hasImport // can be used in scope of context without import
    && !nodePath._C3PO_GETTEXT_CONTEXT) {
      return;
    }

    try {
      try {
        extractor.validate(nodePath.node, context);
      } catch (err) {
        if (err instanceof _errors.ValidationError) {
          context.validationFailureAction(extractor.name, err.message);
          return;
        }

        throw err;
      }

      if (context.isExtractMode()) {
        var poEntry = (0, _extract.extractPoEntry)(extractor, nodePath, context, state);
        poEntry && potEntries.push(poEntry);
      }

      if (context.isResolveMode()) {
        (0, _resolve.resolveEntries)(extractor, nodePath, context, state);
      }
    } catch (err) {
      // TODO: handle specific instances of errors
      throw nodePath.buildCodeFrameError("".concat(err.message, "\n").concat(err.stack));
    }
  }

  return {
    post: function post() {
      if (context && context.isExtractMode() && potEntries.length) {
        var poData = (0, _poHelpers.buildPotData)(potEntries); // Here we sort reference entries, this could be useful
        // with conf. options extract.location: 'file' and sortByMsgid
        // which simplifies merge of .po files from different
        // branches of SCM such as git or mercurial.

        var ctxs = Object.keys(poData.translations);

        var _loop = function _loop() {
          var ctx = _ctxs[_i];
          var poEntries = poData.translations[ctx];
          Object.keys(poEntries).forEach(function (k) {
            var poEntry = poEntries[k]; // poEntry has a form:
            // {
            //     msgid: 'message identifier',
            //     msgstr: 'translation string',
            //     comments: {
            //         reference: 'path/to/file.js:line_num\npath/file.js:line_num'
            //     }
            // }

            if (poEntry.comments && poEntry.comments.reference) {
              poEntry.comments.reference = poEntry.comments.reference.split('\n').sort(_utils.poReferenceComparator).join('\n');
            }
          });

          if (context.isSortedByMsgid()) {
            var oldPoData = poData.translations[ctx];
            var newContext = {};
            var keys = Object.keys(oldPoData).sort();
            keys.forEach(function (k) {
              newContext[k] = oldPoData[k];
            });
            poData.translations[ctx] = newContext;
          }
        };

        for (var _i = 0, _ctxs = ctxs; _i < _ctxs.length; _i++) {
          _loop();
        }

        if (context.isSortedByMsgctxt()) {
          var unorderedTranslations = poData.translations;
          poData.translations = {};

          var _iterator = _createForOfIteratorHelper(Object.keys(unorderedTranslations).sort()),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var ctx = _step.value;
              poData.translations[ctx] = unorderedTranslations[ctx];
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        }

        var potStr = (0, _poHelpers.makePotStr)(poData);
        var filepath = context.getOutputFilepath();

        var dirPath = _path["default"].dirname(filepath);

        _mkdirp["default"].sync(dirPath);

        _fs["default"].writeFileSync(filepath, potStr);
      }
    },
    visitor: {
      TaggedTemplateExpression: tryMatchTag(extractOrResolve),
      CallExpression: tryMatchCall(extractOrResolve),
      Program: function Program(nodePath, state) {
        started = true;

        if (!context) {
          context = new _context["default"](state.opts);
        } else {
          context.clear();
        }

        disabledScopes = new Set();

        if ((0, _utils.hasDisablingComment)(nodePath.node)) {
          disabledScopes.add(nodePath.scope.uid);
        }
      },
      BlockStatement: function BlockStatement(nodePath) {
        if ((0, _utils.hasDisablingComment)(nodePath.node)) {
          disabledScopes.add(nodePath.scope.uid);
        }
      },
      VariableDeclaration: function VariableDeclaration(nodePath, state) {
        nodePath.node.declarations.forEach(function (node) {
          if (!(0, _utils.isTtagRequire)(node)) return;
          var stubs = []; // require calls

          node.id.properties.map(function (_ref) {
            var keyName = _ref.key.name,
                valueName = _ref.value.name;
            return [keyName, valueName];
          }).filter(function (_ref2) {
            var _ref3 = _slicedToArray(_ref2, 2),
                keyName = _ref3[0],
                valueName = _ref3[1];

            var hasAlias = _defaults.ALIAS_TO_FUNC_MAP[keyName];

            if (!hasAlias) {
              stubs.push(valueName);
            }

            return hasAlias;
          }).forEach(function (_ref4) {
            var _ref5 = _slicedToArray(_ref4, 2),
                keyName = _ref5[0],
                valueName = _ref5[1];

            if (keyName !== valueName) {
              // if alias
              context.addAlias(_defaults.ALIAS_TO_FUNC_MAP[keyName], valueName);
              context.addImport(valueName);
            } else {
              context.addImport(keyName);
            }
          });

          if (context.isResolveMode()) {
            stubs.forEach(function (stub) {
              state.file.path.unshiftContainer('body', (0, _utils.createFnStub)(stub));
            });
            nodePath.remove();
          }
        });
      },
      ImportDeclaration: function ImportDeclaration(nodePath, state) {
        var _state$opts;

        if ((_state$opts = state.opts) === null || _state$opts === void 0 ? void 0 : _state$opts.moduleName) {
          _defaults.ID_MAP.TTAGID = state.opts.moduleName;
        }

        var node = nodePath.node;
        if (!(0, _utils.isTtagImport)(node)) return;

        if (!context) {
          context = new _context["default"](state.opts);
        }

        var stubs = [];

        if ((0, _utils.hasImportSpecifier)(node)) {
          node.specifiers.filter(bt.isImportSpecifier).filter(function (_ref6) {
            var imported = _ref6.imported,
                local = _ref6.local;
            var hasAlias = _defaults.ALIAS_TO_FUNC_MAP[imported.name];

            if (!hasAlias) {
              stubs.push(local.name);
            }

            return hasAlias;
          }).forEach(function (_ref7) {
            var imported = _ref7.imported,
                local = _ref7.local;
            context.addAlias(_defaults.ALIAS_TO_FUNC_MAP[imported.name], local.name);
            context.addImport(local.name);
          });
        } else {
          throw new Error('You should use ttag imports in form: "import { t } from \'ttag\'"');
        }

        if (context.isResolveMode()) {
          stubs.forEach(function (stub) {
            state.file.path.unshiftContainer('body', (0, _utils.createFnStub)(stub));
          });
          nodePath.remove();
        }
      }
    }
  };
}