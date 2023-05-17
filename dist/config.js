"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateConfig = validateConfig;
exports.configSchema = void 0;

var _ajv = _interopRequireDefault(require("ajv"));

var _pluralForms = require("plural-forms");

var _defaults = require("./defaults");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var FAIL = _defaults.UNRESOLVED_ACTION.FAIL,
    WARN = _defaults.UNRESOLVED_ACTION.WARN,
    SKIP = _defaults.UNRESOLVED_ACTION.SKIP;
var FULL = _defaults.LOCATION.FULL,
    FILE = _defaults.LOCATION.FILE,
    NEVER = _defaults.LOCATION.NEVER;
var extractConfigSchema = {
  type: ['object', 'null'],
  properties: {
    output: {
      type: 'string'
    },
    location: {
      "enum": [FULL, FILE, NEVER]
    }
  },
  required: ['output'],
  additionalProperties: false
};
var resolveConfigSchema = {
  type: ['object', 'null'],
  properties: {
    translations: {
      type: 'string'
    },
    unresolved: {
      "enum": [FAIL, WARN, SKIP]
    }
  },
  required: ['translations'],
  additionalProperties: false
};
var extractorsSchema = {
  type: 'object',
  additionalProperties: {
    type: 'object',
    properties: {
      invalidFormat: {
        "enum": [FAIL, WARN, SKIP]
      }
    },
    additionalProperties: false
  }
};
var configSchema = {
  type: 'object',
  properties: {
    extract: extractConfigSchema,
    resolve: resolveConfigSchema,
    extractors: extractorsSchema,
    dedent: {
      type: 'boolean'
    },
    discover: {
      type: 'array'
    },
    moduleName: {
      type: 'string'
    },
    defaultLang: {
      "enum": (0, _pluralForms.getAvailLangs)()
    },
    addComments: {
      oneOf: [{
        type: 'boolean'
      }, {
        type: 'string'
      }]
    },
    sortByMsgid: {
      type: 'boolean'
    },
    sortByMsgctxt: {
      type: 'boolean'
    },
    numberedExpressions: {
      type: 'boolean'
    }
  },
  additionalProperties: false
};
exports.configSchema = configSchema;

function validateConfig(config, schema) {
  var ajv = new _ajv["default"]({
    allErrors: true,
    verbose: true,
    v5: true
  });
  var isValid = ajv.validate(schema, config);
  return [isValid, ajv.errorsText(), ajv.errors];
}