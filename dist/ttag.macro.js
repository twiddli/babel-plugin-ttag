"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _babelPluginMacros = require("babel-plugin-macros");

var _defaults = require("./defaults");

var _plugin = _interopRequireWildcard(require("./plugin"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// eslint-disable-line
function ttagMacro(_ref) {
  var references = _ref.references,
      state = _ref.state,
      t = _ref.babel.types,
      _ref$config = _ref.config,
      config = _ref$config === void 0 ? {} : _ref$config;
  var babelPluginTtag = (0, _plugin["default"])();

  if ((0, _plugin.isStarted)()) {
    return {
      keepImports: true
    };
  }

  var program = state.file.path; // replace `babel-plugin-ttag/macro` by `ttag`, add create a node for ttag's imports

  var imports = t.importDeclaration([], t.stringLiteral('ttag')); // then add it to top of the document

  program.node.body.unshift(imports); // references looks like:
  // { default: [path, path], t: [path], ... }

  Object.keys(references).forEach(function (refName) {
    if (!_defaults.ALIAS_TO_FUNC_MAP[refName]) {
      var allowedMethods = Object.keys(_defaults.FUNC_TO_ALIAS_MAP).map(function (k) {
        var funcName = _defaults.FUNC_TO_ALIAS_MAP[k];
        return Array.isArray(funcName) ? funcName.join(', ') : funcName;
      });
      throw new _babelPluginMacros.MacroError("Invalid import: ".concat(refName, ". You can only import ").concat(allowedMethods.join(', '), " from 'babel-plugin-ttag/dist/ttag.macro'."));
    } // generate new identifier and add to imports


    var id;

    if (refName === 'default') {
      id = program.scope.generateUidIdentifier('ttag');
      imports.specifiers.push(t.importDefaultSpecifier(id));
    } else {
      id = program.scope.generateUidIdentifier(refName);
      imports.specifiers.push(t.importSpecifier(id, t.identifier(refName)));
    } // update references with the new identifiers


    references[refName].forEach(function (referencePath) {
      referencePath.node.name = id.name;
    });
  }); // apply babel-plugin-ttag to the file

  var stateWithOpts = _objectSpread(_objectSpread({}, state), {}, {
    opts: config
  });

  program.traverse(babelPluginTtag.visitor, stateWithOpts);
  return {};
}

var _default = (0, _babelPluginMacros.createMacro)(ttagMacro, {
  configName: 'ttag'
});

exports["default"] = _default;