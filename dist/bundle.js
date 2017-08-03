(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("graphql"), require("immutable"), require("normalizr"), require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["graphql", "immutable", "normalizr", "react"], factory);
	else if(typeof exports === 'object')
		exports["ReduxDataFetching"] = factory(require("graphql"), require("immutable"), require("normalizr"), require("react"));
	else
		root["ReduxDataFetching"] = factory(root[undefined], root[undefined], root[undefined], root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_11__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

"use babel";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.isEntity = isEntity;
exports.createEntitiesForTypes = createEntitiesForTypes;
exports.getRecordSchemaForType = getRecordSchemaForType;
exports.createRecordsForTypes = createRecordsForTypes;
exports.getDefinitionOfType = getDefinitionOfType;
exports.addDefinitionsForTypes = addDefinitionsForTypes;
exports.getConvertersFromSchema = getConvertersFromSchema;
exports.getDataFromResponse = getDataFromResponse;
exports.graphQLizr = graphQLizr;
exports.graphQLRecordr = graphQLRecordr;
exports.convertsEntityToRecord = convertsEntityToRecord;
exports.convertsNormalizedEntitiesToRecords = convertsNormalizedEntitiesToRecords;
exports.convertsGraphQLResultToRootEntitiesIDs = convertsGraphQLResultToRootEntitiesIDs;
exports.convertsGraphQLQueryResultToRecords = convertsGraphQLQueryResultToRecords;
exports.convertsGraphQLResultToRecords = convertsGraphQLResultToRecords;

var _normalizr = __webpack_require__(3);

var _graphql = __webpack_require__(1);

var _immutable = __webpack_require__(2);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function isGraphQLIntegratedType(typeName) {
  return ["String", "Boolean", "Int", "ID", "Float", "__Schema", "__Type", "__TypeKind", "__Field", "__InputValue", "__EnumValue", "__Directive", "__DirectiveLocation"].includes(typeName);
}

function isEntity(graphQLType) {
  var markers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ["id"];

  return graphQLType instanceof _graphql.GraphQLObjectType && Object.keys(graphQLType.getFields()).reduce(function (red, fieldName) {
    return red || markers.includes(fieldName);
  }, false);
}

function createEntitiesForTypes(typesMap, markers) {
  return Object.keys(typesMap).reduce(function (red, typeName) {
    return isGraphQLIntegratedType(typeName) || !isEntity(typesMap[typeName], markers) ? red : Object.assign(red, _defineProperty({}, typeName, new _normalizr.schema.Entity(typeName)), {});
  }, {});
}

function getRecordSchemaForType(type) {
  return Object.keys(type.getFields()).reduce(function (red, fieldName) {
    return Object.assign({}, red, _defineProperty({}, fieldName, undefined));
  }, {});
}

function createRecordsForTypes(typesMap) {
  return Object.keys(typesMap).reduce(function (red, typeName) {
    return isGraphQLIntegratedType(typeName) || !(typesMap[typeName] instanceof _graphql.GraphQLObjectType) ? red : Object.assign(red, _defineProperty({}, typeName, (0, _immutable.Record)(getRecordSchemaForType(typesMap[typeName]), typeName)));
  }, {});
}

function getDefinitionOfType(graphQLType, entities) {
  if (graphQLType instanceof _graphql.GraphQLObjectType) {
    var fields = Object.keys(graphQLType.getFields()).reduce(function (red, fieldName) {
      // $FlowFixMe
      var field = graphQLType.getFields()[fieldName];
      // $FlowFixMe
      if (field.type.name in entities) return Object.assign({}, red, _defineProperty({}, fieldName, entities[field.type.name]));else {
        var definition = getDefinitionOfType(field.type, entities);
        if (definition) return Object.assign({}, red, _defineProperty({}, fieldName, definition));else return red;
      }
    }, {});
    if (Object.keys(fields).length > 0) return fields;else return undefined;
  } else if (graphQLType instanceof _graphql.GraphQLList) {
    if (graphQLType.ofType.name in entities) return [entities[graphQLType.ofType.name]];else return undefined;
  } else {
    return undefined;
  }
}

function addDefinitionsForTypes(typesMap, entities) {
  Object.keys(typesMap).forEach(function (typeName) {
    if (isGraphQLIntegratedType(typeName) === false && entities[typeName] instanceof _normalizr.schema.Entity) {
      var definition = getDefinitionOfType(typesMap[typeName], entities);
      entities[typeName].define(definition || {});
    }
  });
}

function getConvertersFromSchema(schema) {
  return Object.keys(schema.getQueryType().getFields()).reduce(function (red, field) {
    var type = schema.getQueryType().getFields()[field].type;
    var entityType = void 0;
    if (type instanceof _graphql.GraphQLList) entityType = (0, _graphql.getNamedType)(type).name;else if (type instanceof _graphql.GraphQLEnumType) entityType = type.name;else entityType = (0, _graphql.getNamedType)(type).name;
    return Object.assign({}, red, _defineProperty({}, field, entityType));
  }, {});
}

function getDataFromResponse(converters, data) {
  return Object.keys(data).reduce(function (red, key) {
    return Object.assign({}, red, _defineProperty({}, converters[key], Array.isArray(data[key]) ? data[key] : [data[key]]));
  }, {});
}

function graphQLizr(schema) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$markers = _ref.markers,
      markers = _ref$markers === undefined ? ["id"] : _ref$markers;

  var entities = createEntitiesForTypes(schema._typeMap, markers);
  var converters = getConvertersFromSchema(schema);
  addDefinitionsForTypes(schema.getTypeMap(), entities);
  return { entities: entities, converters: converters };
}

function graphQLRecordr(schema) {
  var records = createRecordsForTypes(schema.getTypeMap());
  return records;
}

function convertsEntityToRecord(entity, type, graphQLSchema, recordsTypes) {
  if ((typeof entity === "undefined" ? "undefined" : _typeof(entity)) !== "object" || entity == null) return entity;
  if (Array.isArray(entity) === true) {
    console.error("Trying to convert", entity, "into a Record of type", type);
    throw new Error("ILS is trying to convert an Array in a Record which is impossible, you may have called packageData with wrong types (Array instead of Object) or something wrong with the normalization");
  }
  var graphQLType = graphQLSchema.getType(type);
  // $FlowFixMe
  return new recordsTypes[type](Object.keys(entity).reduce(function (red, key) {
    if (graphQLType instanceof _graphql.GraphQLObjectType && graphQLType.getFields()[key] == null) {
      console.warn("Trying to assign field", key, "to entity of type", type, "but it doesn't exist in the graphql data model. You may want to update the schema to have this new field. Aborting assignment");
      return red;
    }
    // $FlowFixMe
    var field = entity[key];
    if ((typeof field === "undefined" ? "undefined" : _typeof(field)) == "object" && Array.isArray(field) == false && field != null) {
      if (graphQLSchema.getTypeMap()[type] == null || !(graphQLSchema.getTypeMap()[type] instanceof _graphql.GraphQLObjectType) ||
      // $FlowFixMe
      graphQLSchema.getTypeMap()[type].getFields()[key] == null) {
        console.error("Error trying to convert entity", entity, "to record of type", type);
        throw new Error("Error has been detected when trying to access the field with key " + key + ", if key is a number you may have wrapped data, sent to packageData, in an array where you shouldn't");
      }
      return Object.assign({}, red, _defineProperty({}, key, convertsEntityToRecord(field,
      // $FlowFixMe
      graphQLSchema.getTypeMap()[type].getFields()[key].type.name, graphQLSchema, recordsTypes)));
    } else if ((typeof field === "undefined" ? "undefined" : _typeof(field)) == "object" && Array.isArray(field) === true) {
      return Object.assign({}, red, _defineProperty({}, key, field.map(function (v) {
        return (typeof v === "undefined" ? "undefined" : _typeof(v)) === "object" ? convertsEntityToRecord(v,
        // $FlowFixMe
        graphQLSchema.getTypeMap()[type].getFields()[key].type.ofType.name, graphQLSchema, recordsTypes) : v;
      })));
    } else {
      return Object.assign({}, red, _defineProperty({}, key, field));
    }
  }, {}));
}

function convertsNormalizedEntitiesToRecords(entities, recordsTypes, graphQLSchema) {
  return Object.keys(entities).reduce(function (red, typeName) {
    return Object.assign({}, red, _defineProperty({}, typeName, Object.keys(entities[typeName]).reduce(function (reduction, entityId) {
      return Object.assign({}, reduction, _defineProperty({}, entityId, convertsEntityToRecord(entities[typeName][entityId], typeName, graphQLSchema, recordsTypes)));
    }, {})));
  }, {});
}

function convertsGraphQLResultToRootEntitiesIDs(result) {
  return Object.keys(result).reduce(function (red, key) {
    if (!Array.isArray(result[key]) && result[key] == null) return red;
    return red.set(key, Array.isArray(result[key]) ? result[key].filter(function (entity) {
      return entity != null;
    }).map(function (entity) {
      return entity.id;
    }) : result[key].id);
  }, (0, _immutable.Map)());
}

function convertsGraphQLQueryResultToRecords(result, associatedQuery, schema, recordTypes) {
  if (Array.isArray(result)) return (0, _immutable.List)(result).map(function (v) {
    return convertsGraphQLQueryResultToRecords(v, associatedQuery, schema, recordTypes);
  });else if ((typeof result === "undefined" ? "undefined" : _typeof(result)) === "object" && result !== null) {
    return convertsEntityToRecord(result, (0, _graphql.getNamedType)(associatedQuery.type).name, schema, recordTypes);
  } else {
    return result;
  }
}

function convertsGraphQLResultToRecords(result, schema, recordTypes) {
  var rootQuery = schema.getQueryType();
  var queries = rootQuery.getFields();
  return Object.keys(result).reduce(function (red, key) {
    var field = result[key];
    var associatedQuery = queries[key];
    var convertedField = convertsGraphQLQueryResultToRecords(field, associatedQuery, schema, recordTypes);
    return _extends({}, red, _defineProperty({}, key, convertedField));
  }, {});
}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

"use babel";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataReducerRecord = exports.QueryRecord = exports.ResultsRecord = exports.QUERY_PROGRESS_FAILED = exports.QUERY_PROGRESS_SUCCEED = exports.QUERY_PROGRESS_PENDING = exports.QUERY_PROGRESS_NOT_STARTED = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = configureReducer;

var _immutable = __webpack_require__(2);

var _normalizr = __webpack_require__(3);

var _graphqlTypesConverters = __webpack_require__(0);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var QUERY_PROGRESS_NOT_STARTED = exports.QUERY_PROGRESS_NOT_STARTED = "not started";
var QUERY_PROGRESS_PENDING = exports.QUERY_PROGRESS_PENDING = "pending";
var QUERY_PROGRESS_SUCCEED = exports.QUERY_PROGRESS_SUCCEED = "succeed";
var QUERY_PROGRESS_FAILED = exports.QUERY_PROGRESS_FAILED = "failed";

var ResultsRecord = exports.ResultsRecord = (0, _immutable.Record)({ byQuery: (0, _immutable.Map)(), byEntity: (0, _immutable.Map)() });
var QueryRecord = exports.QueryRecord = (0, _immutable.Record)({
  results: new ResultsRecord(),
  progress: QUERY_PROGRESS_NOT_STARTED
});
var DataReducerRecord = exports.DataReducerRecord = (0, _immutable.Record)({
  entities: (0, _immutable.Map)(),
  queries: (0, _immutable.Map)()
});

function configureReducer(normalizrTypes, recordsTypes, graphQLSchema) {
  function warnBadIDRequest(type, supposedId) {
    console.warn("You're trying to delete a key of bad type for type", type, ":", supposedId, ".Keys must be of type number, string or identified object eg: {id: 'key'}. Aborting request");
  }

  function getID(data) {
    if (typeof data === "string") return data;else if (typeof data === "number") return data.toString();else if ((typeof data === "undefined" ? "undefined" : _typeof(data)) === "object" && data !== null) {
      return getID(data.id);
    } else {
      return null;
    }
  }

  return function reducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new DataReducerRecord();
    var action = arguments[1];

    switch (action.type) {
      case "DATA_RECEIVED":
        var normalizrModel = Object.keys(action.payload.entities).reduce(function (red, key) {
          var type = normalizrTypes[key];
          if (type === undefined) throw new Error("You can't normalize a type which is not an Entity. An Entity is a type with an id attribut. You may have defined a GraphQL root query type with a route that has a type without any id.");
          return Object.assign({}, red, _defineProperty({}, key, _typeof(action.payload.entities[key]) == "object" && Array.isArray(action.payload.entities[key]) ? [type] : type));
        }, {});
        var normalized = (0, _normalizr.normalize)(JSON.parse(JSON.stringify(action.payload.entities)), normalizrModel);
        return state.update("entities", function (entities) {
          return entities.mergeDeepWith(function (a, b) {
            return b === undefined ? a : b;
          }, (0, _graphqlTypesConverters.convertsNormalizedEntitiesToRecords)(normalized.entities, recordsTypes, graphQLSchema));
        }).update("queries", function (queries) {
          return action.payload.query ? queries.set(action.payload.query.request.hash, new QueryRecord({
            results: new ResultsRecord({
              byQuery: (0, _graphqlTypesConverters.convertsGraphQLResultToRootEntitiesIDs)(action.payload.query.response.raw)
            }),
            progress: QUERY_PROGRESS_SUCCEED
          })) : queries;
        });
      case "DATA_REMOVED":
        return Object.keys(action.payload).reduce(function (red, key) {
          if (_typeof(action.payload[key]) == "object" && Array.isArray(action.payload[key])) {
            return action.payload[key].reduce(function (reduction, value) {
              var id = getID(value);
              if (id == null) {
                warnBadIDRequest(key, value);
                return reduction;
              } else {
                return reduction.deleteIn(["entities", key, id]);
              }
            }, red);
          } else {
            var _id = getID(action.payload[key]);
            if (_id == null) {
              warnBadIDRequest(key, action.payload[key]);
              return red;
            } else {
              // $FlowFixMe
              return red.deleteIn(["entities", key, _id]);
            }
          }
        }, state);
      case "QUERY_STARTED":
        return state.update("queries", function (queries) {
          return queries.update(action.payload.query.request.hash, function () {
            var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new QueryRecord();
            return query.set("progress", QUERY_PROGRESS_PENDING);
          });
        });
      case "QUERY_FAILED":
        return state.update("queries", function (queries) {
          return queries.update(action.payload.query.request.hash, function (query) {
            return query.set("progress", QUERY_PROGRESS_FAILED);
          });
        });
      default:
        return state;
    }
  };
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hashString = hashString;
function hashString(str) {
  var hash = 0;
  if (str.length == 0) return hash;
  for (var i = 0; i < str.length; i++) {
    var char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _configurer = __webpack_require__(7);

Object.defineProperty(exports, "configure", {
  enumerable: true,
  get: function get() {
    return _configurer.configure;
  }
});

var _reducer = __webpack_require__(4);

Object.defineProperty(exports, "QUERY_PROGRESS_NOT_STARTED", {
  enumerable: true,
  get: function get() {
    return _reducer.QUERY_PROGRESS_NOT_STARTED;
  }
});
Object.defineProperty(exports, "QUERY_PROGRESS_PENDING", {
  enumerable: true,
  get: function get() {
    return _reducer.QUERY_PROGRESS_PENDING;
  }
});
Object.defineProperty(exports, "QUERY_PROGRESS_SUCCEED", {
  enumerable: true,
  get: function get() {
    return _reducer.QUERY_PROGRESS_SUCCEED;
  }
});
Object.defineProperty(exports, "QUERY_PROGRESS_FAILED", {
  enumerable: true,
  get: function get() {
    return _reducer.QUERY_PROGRESS_FAILED;
  }
});

var _graphqlTypesConverters = __webpack_require__(0);

Object.defineProperty(exports, "graphQLizr", {
  enumerable: true,
  get: function get() {
    return _graphqlTypesConverters.graphQLizr;
  }
});
Object.defineProperty(exports, "graphQLRecordr", {
  enumerable: true,
  get: function get() {
    return _graphqlTypesConverters.graphQLRecordr;
  }
});

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

"use babel";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configure = configure;

var _normalizr = __webpack_require__(3);

var _graphql = __webpack_require__(1);

var _middleware = __webpack_require__(8);

var _middleware2 = _interopRequireDefault(_middleware);

var _reducer = __webpack_require__(4);

var _reducer2 = _interopRequireDefault(_reducer);

var _actions = __webpack_require__(9);

var _actions2 = _interopRequireDefault(_actions);

var _hoc = __webpack_require__(10);

var _hoc2 = _interopRequireDefault(_hoc);

var _graphqlTypesConverters = __webpack_require__(0);

var _selectors = __webpack_require__(12);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function configure(graphQLSchema, context) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref$__debug = _ref.__debug,
      __debug = _ref$__debug === undefined ? false : _ref$__debug;

  var graphQLCompiledSchema = typeof graphQLSchema === "string" ? (0, _graphql.buildSchema)(graphQLSchema) : graphQLSchema;
  var selectorSchema = (0, _selectors.convertsTypesSchemaToSelectorSchema)(graphQLCompiledSchema, { __debug: __debug });
  var normalizrModel = (0, _graphqlTypesConverters.graphQLizr)(graphQLCompiledSchema);
  var recordsModel = (0, _graphqlTypesConverters.graphQLRecordr)(graphQLCompiledSchema);
  var actions = (0, _actions2.default)();
  var middleware = (0, _middleware2.default)(graphQLCompiledSchema, actions, normalizrModel, context);
  var reducer = (0, _reducer2.default)(normalizrModel.entities, recordsModel, graphQLCompiledSchema);
  var GraphQLConnecter = (0, _hoc2.default)({
    selectorSchema: selectorSchema,
    typesSchema: graphQLCompiledSchema,
    recordTypes: recordsModel
  });
  return {
    actions: actions,
    middleware: middleware,
    reducer: reducer,
    normalizrModel: normalizrModel,
    recordsModel: recordsModel,
    selectorSchema: selectorSchema,
    GraphQLConnecter: GraphQLConnecter
  };
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (schema, actions, normalizrModel, context) {
  return function (store) {
    return function (next) {
      return function (action) {
        if (action.graphql) {
          var hash = (0, _utils.hashString)(action.payload);
          var request = {
            ql: action.payload,
            hash: hash
          };
          store.dispatch(actions.queryStarted({ request: request }));
          (0, _graphql.graphql)(schema, action.payload, undefined, {
            store: store,
            dependencies: context
          }).then(function (result) {
            if (result.errors === undefined) {
              store.dispatch(actions.packageData((0, _graphqlTypesConverters.getDataFromResponse)(normalizrModel.converters, result.data), {
                request: request,
                response: {
                  raw: result.data
                }
              }));
            } else {
              console.error("GraphQL query", action.payload, "has failed.\n", "errors:", result.errors);
              store.dispatch(actions.queryFailed({ request: request }, result.errors));
            }
          });
        } else {
          return next(action);
        }
      };
    };
  };
};

var _utils = __webpack_require__(5);

var _graphql = __webpack_require__(1);

var _graphqlTypesConverters = __webpack_require__(0);

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

"use babel";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = configureActions;

function configureActions() {
  return {
    packageData: function packageData(data, query) {
      return {
        type: "DATA_RECEIVED",
        payload: {
          entities: data,
          query: query
        }
      };
    },
    queryStarted: function queryStarted(query) {
      return {
        type: "QUERY_STARTED",
        payload: {
          query: query
        }
      };
    },
    removeData: function removeData(identifiers) {
      return {
        type: "DATA_REMOVED",
        payload: identifiers
      };
    },
    queryFailed: function queryFailed(query, errors) {
      return {
        type: "QUERY_FAILED",
        payload: {
          query: query,
          errors: errors
        }
      };
    }
  };
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

"use babel";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = configureConnecter;

var _react = __webpack_require__(11);

var _react2 = _interopRequireDefault(_react);

var _graphql = __webpack_require__(1);

var _immutable = __webpack_require__(2);

var _graphqlTypesConverters = __webpack_require__(0);

var _utils = __webpack_require__(5);

var _reducer = __webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function configureConnecter() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      typesSchema = _ref.typesSchema,
      selectorSchema = _ref.selectorSchema,
      recordTypes = _ref.recordTypes,
      _ref$reducerName = _ref.reducerName,
      reducerName = _ref$reducerName === undefined ? "data" : _ref$reducerName;

  if (typesSchema === undefined) {
    throw new Error("You have to define a type schema, type schema is currently " + typesSchema);
  }
  if (selectorSchema === undefined) {
    throw new Error("You have to define a selector schema, selector schema is currently " + selectorSchema);
  }
  return function GraphQLConnecter(mapPropsToNeeds) {
    var mapCacheToProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
      return {};
    };
    var shouldRefetch = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {
      return false;
    };

    var _ref2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
        _ref2$queryProgressPr = _ref2.queryProgressPropName,
        queryProgressPropName = _ref2$queryProgressPr === undefined ? "queryProgress" : _ref2$queryProgressPr;

    return function (WrappedComponent) {
      return function (_React$Component) {
        _inherits(GraphQLContainer, _React$Component);

        function GraphQLContainer(props) {
          _classCallCheck(this, GraphQLContainer);

          var _this = _possibleConstructorReturn(this, (GraphQLContainer.__proto__ || Object.getPrototypeOf(GraphQLContainer)).call(this, props));

          _this.state = {
            selectedData: {}
          };
          return _this;
        }

        _createClass(GraphQLContainer, [{
          key: "componentDidMount",
          value: function componentDidMount() {
            this.getNeeds();
            this.selectData(this.props);
          }
        }, {
          key: "getReducer",
          value: function getReducer(props) {
            return props[reducerName];
          }
        }, {
          key: "entityOfTypeAndIDHasChanged",
          value: function entityOfTypeAndIDHasChanged(props, nextProps, entityName, id) {
            return this.getReducer(props).getIn([entityName, id]) !== this.getReducer(nextProps).getIn([entityName, id]);
          }
        }, {
          key: "entitiesOfTypeHasChangedForQuery",
          value: function entitiesOfTypeHasChangedForQuery(props, nextProps, typeName, results) {
            var _this2 = this;

            return results.reduce(function (red, id) {
              if (red === true) return true;else {
                return _this2.entityOfTypeAndIDHasChanged(props, nextProps, typeName, id);
              }
            }, false);
          }
        }, {
          key: "dataForQueryHasChanged",
          value: function dataForQueryHasChanged(props, nextProps, query) {
            var _this3 = this;

            return query.results.byQuery.reduce(function (red, queryResults, queryName) {
              var associatedQueryType = typesSchema.getQueryType().getFields()[queryName];
              var entityName = (0, _graphql.getNamedType)(associatedQueryType.type).name;
              if (Array.isArray(queryResults) || _immutable.List.isList(queryResults)) {
                return _this3.entitiesOfTypeHasChangedForQuery(props, nextProps, entityName, queryResults);
              } else {
                return _this3.entityOfTypeAndIDHasChanged(props, nextProps, entityName, queryResults);
              }
            });
          }
        }, {
          key: "mustReselectData",
          value: function mustReselectData(props, nextProps) {
            var currentReducer = this.getReducer(props);
            var nextReducer = this.getReducer(nextProps);
            var currentNeeds = mapPropsToNeeds(props);
            var nextNeeds = mapPropsToNeeds(nextProps);
            if (nextNeeds !== currentNeeds) return true;
            var hash = currentNeeds != null ? (0, _utils.hashString)(currentNeeds) : null;
            if (hash != null) {
              var nextQuery = nextReducer.getIn(["queries", hash]);
              var currentQuery = currentReducer.getIn(["queries", hash]);
              if (nextQuery !== currentQuery) return true;else if (nextReducer.entities !== currentReducer.entities) {
                return true;
                // return this.dataForQueryHasChanged(props, nextProps, nextQuery);
              } else {
                return false;
              }
            } else {
              return false;
            }
          }
        }, {
          key: "componentWillReceiveProps",
          value: function componentWillReceiveProps(nextProps) {
            if (this.mustReselectData(this.props, nextProps)) {
              this.selectData(nextProps);
            }
          }
        }, {
          key: "componentDidUpdate",
          value: function componentDidUpdate(prevProps) {
            if (mapPropsToNeeds(this.props) != mapPropsToNeeds(prevProps) || shouldRefetch(this.props, prevProps)) {
              this.getNeeds();
            }
          }
        }, {
          key: "warnAgainstEmptyQuery",
          value: function warnAgainstEmptyQuery() {
            console.warn("You have defined as needs {}, which is a wrong graphql query. If you want to avoid fetching, return null instead");
          }
        }, {
          key: "selectData",
          value: function selectData(props) {
            var _this4 = this;

            var query = mapPropsToNeeds(props);
            var reducer = this.getReducer(props);
            if (query === "{}" || query === "{ }") {
              this.warnAgainstEmptyQuery();
            } else if (query != null) {
              var hash = (0, _utils.hashString)(query);
              if (props.__debug) {
                console.log("SELECTING data for hash", hash, " -- date:", Date.now());
              }
              (0, _graphql.graphql)(selectorSchema, query, null, {
                db: reducer,
                queryHash: hash
              }).then(function (result) {
                if (result.errors !== undefined || result.data == null) {
                  console.error("GraphQLConnecter: Impossible to select data. needs:", query, "errors:", result.errors);
                } else {
                  if (props.__debug) {
                    console.log("SELECTED data", result.data, "for hash", hash, "with reducer", reducer, " -- date:", Date.now());
                  }
                  var convertedData = (0, _graphqlTypesConverters.convertsGraphQLResultToRecords)(result.data, typesSchema, recordTypes);
                  var reducerChanged = _this4.getReducer(props) !== reducer;
                  if (props.__debug) {
                    console.log("CONVERTED data", result.data, "into", convertedData, "for hash", "with reducer", reducer, reducerChanged ? "but reducer has changed to" : "", reducerChanged ? _this4.getReducer(props) : "", reducerChanged ? "relaunching selection" : "");
                  }
                  if (reducerChanged) {
                    _this4.selectData(props);
                  } else {
                    _this4.setState(function (state) {
                      return { selectedData: convertedData };
                    });
                  }
                }
              });
            }
          }
        }, {
          key: "getNeeds",
          value: function getNeeds() {
            var needs = mapPropsToNeeds(this.props);
            if (needs === "{}" || needs === "{ }") {
              this.warnAgainstEmptyQuery();
            } else if (needs != null) {
              this.props.dispatch({
                type: "GRAPHQL_FETCH",
                graphql: true,
                payload: needs
              });
            }
          }
        }, {
          key: "render",
          value: function render() {
            var _this5 = this;

            var reducer = this.getReducer(this.props);
            if (!reducer) throw new Error("GraphQLConnecter must get the cache reducer as a props named '" + reducerName + "'");
            if (!this.props.dispatch) throw new Error("GraphQLConnecter must get the dispatch function as props");
            var needs = mapPropsToNeeds(this.props);
            var queryProgress = needs !== null ? reducer.getIn(["queries", (0, _utils.hashString)(needs), "progress"], _reducer.QUERY_PROGRESS_NOT_STARTED) : _reducer.QUERY_PROGRESS_NOT_STARTED;
            return _react2.default.createElement(WrappedComponent, _extends({}, this.props, this.state.selectedData, mapCacheToProps(this.props.data, this.props, this.state.selectedData), _defineProperty({}, queryProgressPropName, queryProgress), {
              refetch: function refetch() {
                return _this5.getNeeds();
              }
            }));
          }
        }]);

        return GraphQLContainer;
      }(_react2.default.Component);
    };
  };
}

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_11__;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.convertsFieldToSelectorField = convertsFieldToSelectorField;
exports.convertsTypeToSelectorType = convertsTypeToSelectorType;
exports.convertsTypeMapToSelectorTypeMap = convertsTypeMapToSelectorTypeMap;
exports.convertsRootQueryToSelectorRootQuery = convertsRootQueryToSelectorRootQuery;
exports.convertsTypesSchemaToSelectorSchema = convertsTypesSchemaToSelectorSchema;

var _immutable = __webpack_require__(2);

var _graphql = __webpack_require__(1);

var _graphqlTypesConverters = __webpack_require__(0);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function getResolveQuery(entityName) {
  return function resolveQuery(parent, args, context, _ref) {
    var rootValue = _ref.rootValue,
        fieldName = _ref.fieldName,
        returnType = _ref.returnType,
        path = _ref.path;

    if (context == null || context.db == null || context.queryHash == null) throw new Error("You have to pass database (entities and results) as db and graphql query as queryHash in contextValue");
    var queryResult = context.db.getIn(["queries", context.queryHash, "results", "byQuery", path !== undefined ? path.key : fieldName]);
    if (queryResult == null) {
      if (returnType instanceof _graphql.GraphQLList) return [];else return null;
    }
    if (returnType instanceof _graphql.GraphQLList) {
      var _typeName = getEntityTypeNameFromSelectorTypeName((0, _graphql.getNamedType)(returnType.ofType).name);
      return queryResult.map(function (id) {
        return context.db.getIn(["entities", _typeName, id.toString()]);
      });
    } else if (queryResult != null) {
      return context.db.getIn(["entities", getEntityTypeNameFromSelectorTypeName((0, _graphql.getNamedType)(returnType).name), queryResult.toString()]);
    } else {
      return null;
    }
  };
}

function getResolveEntity(entityName) {
  return function resolveEntity(parent, args, context) {
    var _ref2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
        rootValue = _ref2.rootValue,
        fieldName = _ref2.fieldName,
        returnType = _ref2.returnType;

    var fieldValue = parent[fieldName];
    if (returnType instanceof _graphql.GraphQLList && fieldValue != null) {
      return fieldValue.map(function (id) {
        return context.db.getIn(["entities", entityName, id.toString()]);
      });
    } else if (fieldValue != null) {
      return context.db.getIn(["entities", entityName, fieldValue.toString()]);
    } else {
      return null;
    }
  };
}

function getSelectorTypeName(name) {
  return name + "Selector";
}

function getEntityTypeNameFromSelectorTypeName(name) {
  return name.substring(0, name.length - 8);
}

function getSelectorTypeFromType(type, typesMap) {
  if (type instanceof _graphql.GraphQLList) return new _graphql.GraphQLList(getSelectorTypeFromType(type.ofType, typesMap));else if (type instanceof _graphql.GraphQLObjectType) {
    var _typeName2 = getSelectorTypeName((0, _graphql.getNamedType)(type).name);
    if (typesMap[_typeName2] == null) {
      throw new Error("Something went wrong in schema conversions. Trying to access " + _typeName2 + " type is impossible in Selectors Schema TypeMap");
    }
    // $FlowFixMe
    return typesMap[_typeName2];
  } else {
    return type;
  }
}

function convertsArgsArrayToArgsMap(args) {
  return args.reduce(function (red, arg) {
    return _extends({}, red, _defineProperty({}, arg.name, arg));
  }, {});
}

function convertsFieldToSelectorField(query, typesMap, type) {
  var resolver = void 0;
  var name = void 0;
  switch (type) {
    case "entity":
      name = getSelectorTypeName(query.name);
      resolver = getResolveEntity((0, _graphql.getNamedType)(query.type).name);
      break;
    case "query":
      name = getSelectorTypeName(query.name);
      resolver = getResolveQuery((0, _graphql.getNamedType)(query.type).name);
      break;
    default:
      name = query.name;
  }
  return {
    description: query.description,
    args: convertsArgsArrayToArgsMap(query.args),
    type: getSelectorTypeFromType(query.type, typesMap),
    resolve: resolver
  };
}

function convertsTypeToSelectorType(type, typeMap) {
  var selectorName = getSelectorTypeName(type.name);
  return new _graphql.GraphQLObjectType({
    name: selectorName,
    fields: function fields() {
      return Object.keys(type.getFields()).reduce(function (red, key) {
        return _extends({}, red, _defineProperty({}, key, (0, _graphqlTypesConverters.isEntity)((0, _graphql.getNamedType)(type.getFields()[key].type)) ? convertsFieldToSelectorField(type.getFields()[key], typeMap, "entity") : convertsFieldToSelectorField(type.getFields()[key], typeMap, "scalar")));
      }, {});
    }
  });
}

function convertsTypeMapToSelectorTypeMap(typeMap) {
  var newTypeMap = {};
  Object.keys(typeMap).forEach(function (key) {
    var type = typeMap[key];
    if (
    /*isEntity(type) === true &&*/type instanceof _graphql.GraphQLObjectType && !key.startsWith("__")) {
      newTypeMap[getSelectorTypeName(key)] = convertsTypeToSelectorType(type, newTypeMap);
    } else {
      newTypeMap[key] = type;
    }
  });
  return newTypeMap;
}

function convertsRootQueryToSelectorRootQuery(rootQuery, selectorTypeMap) {
  return new _graphql.GraphQLObjectType({
    name: "SelectorsRootQueryType",
    fields: Object.keys(rootQuery.getFields()).reduce(function (red, key) {
      return _extends({}, red, _defineProperty({}, key, convertsFieldToSelectorField(rootQuery.getFields()[key], selectorTypeMap, "query")));
    }, {})
  });
}

function convertsTypesSchemaToSelectorSchema(schema) {
  var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref3$markers = _ref3.markers,
      markers = _ref3$markers === undefined ? ["id"] : _ref3$markers,
      _ref3$__debug = _ref3.__debug,
      __debug = _ref3$__debug === undefined ? false : _ref3$__debug;

  var typesMap = schema.getTypeMap();
  var selectorTypesMap = convertsTypeMapToSelectorTypeMap(typesMap);
  if (__debug) {
    console.log("DataModel TypeMap:", typesMap, "\nSelector TypeMap:", selectorTypesMap);
  }
  var typesQuery = schema.getQueryType();
  var selectorTypesQuery = convertsRootQueryToSelectorRootQuery(typesQuery, selectorTypesMap);
  var selectorSchema = new _graphql.GraphQLSchema({
    query: selectorTypesQuery
  });
  return selectorSchema;
}

/***/ })
/******/ ]);
});
//# sourceMappingURL=bundle.js.map