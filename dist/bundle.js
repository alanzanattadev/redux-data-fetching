(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("graphql"), require("immutable"), require("react"), require("normalizr"));
	else if(typeof define === 'function' && define.amd)
		define(["graphql", "immutable", "react", "normalizr"], factory);
	else if(typeof exports === 'object')
		exports["ReduxDataFetching"] = factory(require("graphql"), require("immutable"), require("react"), require("normalizr"));
	else
		root["ReduxDataFetching"] = factory(root[undefined], root[undefined], root["React"], root[undefined]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_6__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

"use babel";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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

var _normalizr = __webpack_require__(6);

var _graphql = __webpack_require__(0);

var _immutable = __webpack_require__(4);

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
  function getNameOfType(type) {
    var entityType = void 0;
    if (type instanceof _graphql.GraphQLList) entityType = (0, _graphql.getNamedType)(type).name;else if (type instanceof _graphql.GraphQLEnumType) entityType = type.name;else entityType = (0, _graphql.getNamedType)(type).name;
    return entityType;
  }

  var queryTypeConverters = Object.keys(schema.getQueryType().getFields()).reduce(function (red, field) {
    var type = schema.getQueryType().getFields()[field].type;
    var entityType = (0, _graphql.getNamedType)(type);
    return Object.assign({}, red, _defineProperty({}, field, entityType));
  }, {});

  var mutationType = schema.getMutationType();
  var mutationTypeConverters = mutationType ? Object.keys(mutationType.getFields()).reduce(function (red, field) {
    var type = mutationType.getFields()[field].type;
    var entityType = (0, _graphql.getNamedType)(type);
    return Object.assign({}, red, _defineProperty({}, field, entityType));
  }, {}) : {};

  return _extends({}, mutationTypeConverters, queryTypeConverters);
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
  if (recordsTypes[type] == null) {
    console.error("You try to convert an entity of type", type, "into a Record but the type doesn't exist.\n", "Types that exist are", recordsTypes, "Entity value:", entity, "\nYou may have actions.packageData({ typeThatDoesntExist: value }).");
    throw new Error("Aborting conversion of entity to immutable Record");
  }
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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mutation = function () {
  function Mutation() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        mutationQL = _ref.mutationQL,
        _ref$variables = _ref.variables,
        variables = _ref$variables === undefined ? {} : _ref$variables,
        _ref$onError = _ref.onError,
        onError = _ref$onError === undefined ? function () {} : _ref$onError,
        _ref$onCompleted = _ref.onCompleted,
        onCompleted = _ref$onCompleted === undefined ? function () {} : _ref$onCompleted,
        operationName = _ref.operationName;

    _classCallCheck(this, Mutation);

    if (mutationQL == null) {
      throw new Error("mutationQL has to be defined in the params of new Mutation: new Mutation({mutationQL: `mutation ...`})");
    }
    this.mutationQL = mutationQL;
    this.variables = variables;
    this.onError = onError;
    this.onCompleted = onCompleted;
    this.operationName = operationName;
  }

  _createClass(Mutation, [{
    key: "setOperationName",
    value: function setOperationName(name) {
      return new Mutation({
        mutationQL: this.mutationQL,
        variables: this.variables,
        onError: this.onError,
        onCompleted: this.onCompleted,
        operationName: name
      });
    }
  }]);

  return Mutation;
}();

exports.default = Mutation;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

"use babel";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataReducerRecord = exports.QueryRecord = exports.ResultsRecord = exports.QUERY_PROGRESS_FAILED = exports.QUERY_PROGRESS_SUCCEED = exports.QUERY_PROGRESS_PENDING = exports.QUERY_PROGRESS_NOT_STARTED = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = configureReducer;

var _immutable = __webpack_require__(4);

var _normalizr = __webpack_require__(6);

var _graphqlTypesConverters = __webpack_require__(1);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var QUERY_PROGRESS_NOT_STARTED = exports.QUERY_PROGRESS_NOT_STARTED = "not started";
var QUERY_PROGRESS_PENDING = exports.QUERY_PROGRESS_PENDING = "pending";
var QUERY_PROGRESS_SUCCEED = exports.QUERY_PROGRESS_SUCCEED = "succeed";
var QUERY_PROGRESS_FAILED = exports.QUERY_PROGRESS_FAILED = "failed";

var ResultsRecord = exports.ResultsRecord = (0, _immutable.Record)({
  raw: null,
  byQuery: (0, _immutable.Map)(),
  byEntity: (0, _immutable.Map)()
});
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
          return action.payload.query ? queries.set(action.payload.query.request.hash.toString(), new QueryRecord({
            results: new ResultsRecord({
              raw: action.payload.query.response.raw,
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
          return queries.update(action.payload.query.request.hash.toString(), function () {
            var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new QueryRecord();
            return query.set("progress", QUERY_PROGRESS_PENDING);
          });
        });
      case "QUERY_FAILED":
        return state.update("queries", function (queries) {
          return queries.update(action.payload.query.request.hash.toString(), function (query) {
            return query.set("progress", QUERY_PROGRESS_FAILED);
          });
        });
      case "QUERY_CACHE_BUSTED":
        return state.update("queries", function (queries) {
          return queries.remove(action.payload.queryID.toString());
        });
      default:
        return state;
    }
  };
}

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TypeInfoWithValuesComparator = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

exports.hashString = hashString;
exports.hashMutationQuery = hashMutationQuery;
exports.generateUUID = generateUUID;
exports.selectedDataHaveChanged = selectedDataHaveChanged;

var _immutable = __webpack_require__(4);

var _graphql = __webpack_require__(0);

var _reducer = __webpack_require__(3);

var _graphqlTypesConverters = __webpack_require__(1);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

function hashMutationQuery(query, id) {
  return hashString("mutation-" + id + "-" + query);
}

function generateUUID() {
  var d = new Date().getTime();
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    d += performance.now(); //use high-precision timer if available
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : r & 0x3 | 0x8).toString(16);
  });
}

var TypeInfoWithValuesComparator = exports.TypeInfoWithValuesComparator = function (_TypeInfo) {
  _inherits(TypeInfoWithValuesComparator, _TypeInfo);

  function TypeInfoWithValuesComparator(_ref) {
    var schema = _ref.schema,
        reducer1 = _ref.reducer1,
        reducer2 = _ref.reducer2,
        queryHash1 = _ref.queryHash1,
        queryHash2 = _ref.queryHash2;

    _classCallCheck(this, TypeInfoWithValuesComparator);

    var _this = _possibleConstructorReturn(this, (TypeInfoWithValuesComparator.__proto__ || Object.getPrototypeOf(TypeInfoWithValuesComparator)).call(this, schema));

    _this._value1Stack = (0, _immutable.Stack)();
    _this._value2Stack = (0, _immutable.Stack)();
    _this._reducer1 = reducer1;
    _this._reducer2 = reducer2;
    _this._queryHash1 = queryHash1;
    _this._queryHash2 = queryHash2;
    _this._shouldBreak = false;
    return _this;
  }

  _createClass(TypeInfoWithValuesComparator, [{
    key: "_getQueryValue",
    value: function _getQueryValue(node, reducer, queryHash) {
      if (reducer == null || queryHash == null) throw new Error("Trying to determine whether selection of data has to be relaunched, but encounterd an error. Missing dependency on reducer or queryHash");
      var queryResult = reducer.getIn(["queries", queryHash, "results", "byQuery", node.alias != null ? node.alias.value : node.name.value]);
      var currentType = this.getType();
      if (queryResult == null) {
        if (currentType instanceof _graphql.GraphQLList) return [];else return null;
      }
      if (currentType instanceof _graphql.GraphQLList) {
        var typeName = (0, _graphql.getNamedType)(currentType.ofType).name;
        return queryResult.map(function (id) {
          return reducer.getIn(["entities", typeName, id.toString()]);
        });
      } else if (queryResult != null) {
        var namedType = (0, _graphql.getNamedType)(currentType);
        if (namedType != undefined) {
          return reducer.getIn(["entities", namedType.name, queryResult.toString()]);
        } else {
          console.error("CurrentType:", currentType);
          throw new Error("Weird behavior has been encountered with an unnamed type as current type");
        }
      } else {
        return null;
      }
    }
  }, {
    key: "_getEntityValue",
    value: function _getEntityValue(node, reducer, lastValue) {
      var _this2 = this;

      if (node.selectionSet != null && (typeof lastValue === "undefined" ? "undefined" : _typeof(lastValue)) === "object" && lastValue != null) {
        var fieldName = node.alias ? node.alias.value : node.name.value;
        if (Array.isArray(lastValue) || _immutable.List.isList(lastValue))
          // $FlowFixMe
          return lastValue.map(function (v) {
            return _this2._getEntityValue(node, reducer, v);
          });
        var fieldValue = lastValue[fieldName];
        var namedType = (0, _graphql.getNamedType)(this.getType());
        if (namedType && (0, _graphqlTypesConverters.isEntity)(namedType) === false) {
          return fieldValue;
        }
        if (this.getType() instanceof _graphql.GraphQLList && fieldValue != null && (Array.isArray(fieldValue) || _immutable.List.isList(fieldValue))) {
          if (namedType) {
            var entityName = namedType.name;
            // $FlowFixMe
            return fieldValue.map(function (id) {
              return reducer.getIn(["entities", entityName, id.toString()]);
            });
          } else {
            console.error("Weird state encountered trying to get the named type of", this.getType(), "at node", node, "knowing that ", fieldValue, "is an Array or a Immutable.List");
            throw new Error("Aborting.");
          }
        } else if (fieldValue != null) {
          if (namedType) {
            var _entityName = namedType.name;
            // $FlowFixMe
            return reducer.getIn(["entities", _entityName, fieldValue.toString()]);
          } else {
            console.error("Weird state encountered trying to get the named type of", this.getType(), "at node", node, "knowing that ", fieldValue, "is an Object or a Immutable.Record");
            throw new Error("Aborting.");
          }
        } else {
          return null;
        }
      } else {
        return lastValue;
      }
    }
  }, {
    key: "_haveChanged",
    value: function _haveChanged(value1, value2) {
      var _this3 = this;

      if ((typeof value1 === "undefined" ? "undefined" : _typeof(value1)) !== (typeof value2 === "undefined" ? "undefined" : _typeof(value2))) return true;
      if (Array.isArray(value1) || _immutable.List.isList(value1)) {
        if (Array.isArray(value2) === true || _immutable.List.isList(value2) === true) {
          // $FlowFixMe
          return value1.some(function (v1, i) {
            return _this3._haveChanged(v1,
            // $FlowFixMe
            Array.isArray(value2) ? value2[i] : value2.get(i));
          });
        } else return true;
      } else if ((typeof value1 === "undefined" ? "undefined" : _typeof(value1)) === "object" && value1 !== null) {
        if (value2 === null) return true;
        return value1 !== value2;
      } else {
        return value1 !== value2;
      }
    }
  }, {
    key: "enter",
    value: function enter(node) {
      _get(TypeInfoWithValuesComparator.prototype.__proto__ || Object.getPrototypeOf(TypeInfoWithValuesComparator.prototype), "enter", this).call(this, node);
      if (node.kind === _graphql.Kind.FIELD) {
        var value1 = void 0;
        var value2 = void 0;
        if (this.getParentType() === this._schema.getQueryType()) {
          value1 = this._getQueryValue(node, this._reducer1, this._queryHash1);
          this._value1Stack = this._value1Stack.unshift(value1);
          value2 = this._getQueryValue(node, this._reducer2, this._queryHash2);
          this._value2Stack = this._value2Stack.push(value2);
        } else {
          value1 = this._getEntityValue(node, this._reducer1, this._value1Stack.peek());
          this._value1Stack = this._value1Stack.push(value1);
          value2 = this._getEntityValue(node, this._reducer2, this._value2Stack.peek());
          this._value2Stack = this._value2Stack.push(value2);
        }
        if (this._shouldBreak === false) {
          this._shouldBreak = this._haveChanged(value1, value2);
        }
      }
    }
  }, {
    key: "leave",
    value: function leave(node) {
      if (node.kind === _graphql.Kind.FIELD) {
        this._value1Stack = this._value1Stack.pop();
        this._value2Stack = this._value2Stack.pop();
      }
      _get(TypeInfoWithValuesComparator.prototype.__proto__ || Object.getPrototypeOf(TypeInfoWithValuesComparator.prototype), "leave", this).call(this, node);
    }
  }, {
    key: "getValue1",
    value: function getValue1() {
      return this._value1Stack.peek();
    }
  }, {
    key: "getValue2",
    value: function getValue2() {
      return this._value2Stack.peek();
    }
  }, {
    key: "shouldBreak",
    value: function shouldBreak() {
      return this._shouldBreak;
    }
  }]);

  return TypeInfoWithValuesComparator;
}(_graphql.TypeInfo);

function selectedDataHaveChanged(_ref2) {
  var query = _ref2.query,
      schema = _ref2.schema,
      queryHash = _ref2.queryHash,
      reducer1 = _ref2.reducer1,
      reducer2 = _ref2.reducer2;

  var typeInfo = new TypeInfoWithValuesComparator({
    schema: schema,
    reducer1: reducer1,
    reducer2: reducer2,
    queryHash1: queryHash,
    queryHash2: queryHash
  });
  var hasChanged = false;
  (0, _graphql.visit)((0, _graphql.parse)(query), (0, _graphql.visitWithTypeInfo)(typeInfo, _defineProperty({}, _graphql.Kind.FIELD, {
    enter: function enter(node) {
      hasChanged = typeInfo.shouldBreak();
    }
  })));
  return hasChanged;
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _TestUtils = __webpack_require__(9);

Object.defineProperty(exports, "createTestLab", {
  enumerable: true,
  get: function get() {
    return _TestUtils.createTestLab;
  }
});

var _configurer = __webpack_require__(20);

Object.defineProperty(exports, "configure", {
  enumerable: true,
  get: function get() {
    return _configurer.configure;
  }
});

var _Mutation = __webpack_require__(2);

Object.defineProperty(exports, "Mutation", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Mutation).default;
  }
});

var _reducer = __webpack_require__(3);

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

var _graphqlTypesConverters = __webpack_require__(1);

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTestLab = createTestLab;

var _react = __webpack_require__(5);

var _react2 = _interopRequireDefault(_react);

var _graphql = __webpack_require__(0);

var _Mutation = __webpack_require__(2);

var _Mutation2 = _interopRequireDefault(_Mutation);

var _recompose = __webpack_require__(10);

var _reducer = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function configureProxies() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      schema = _ref.schema,
      rootValue = _ref.rootValue,
      contextValue = _ref.contextValue;

  return {
    configureDispatchProxy: function configureDispatchProxy() {
      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref2$dispatch = _ref2.dispatch,
          dispatch = _ref2$dispatch === undefined ? function () {} : _ref2$dispatch,
          _ref2$onError = _ref2.onError,
          onError = _ref2$onError === undefined ? function () {} : _ref2$onError,
          _ref2$onSuccess = _ref2.onSuccess,
          onSuccess = _ref2$onSuccess === undefined ? function () {} : _ref2$onSuccess,
          _ref2$onResolve = _ref2.onResolve,
          onResolve = _ref2$onResolve === undefined ? function () {} : _ref2$onResolve;

      return function dispatchProxy(action) {
        if (action.type === "GRAPHQL_MUTATION") {
          var _promise = (0, _graphql.graphql)(schema, action.payload.mutation.mutationQL, rootValue, contextValue, action.payload.mutation.variables);
          onResolve(_promise);
          _promise.then(function (result) {
            if (result.errors && result.errors.length > 0) {
              onError(result.errors);
            } else {
              dispatch(action);
              onSuccess(result.data);
            }
          });
        } else if (action.type === "GRAPHQL_FETCH") {
          var _promise2 = (0, _graphql.graphql)(schema, action.payload, rootValue, contextValue);
          onResolve(_promise2);
          _promise2.then(function (result) {
            if (result.errors && result.errors.length > 0) {
              onError(result.errors);
            } else {
              dispatch(action);
              onSuccess(result.data);
            }
          });
        } else {
          dispatch(action);
        }
      };
    }
  };
}

var MockView = (0, _recompose.compose)((0, _recompose.lifecycle)({
  componentDidMount: function componentDidMount() {
    if (typeof this.props.onMount === "function") {
      this.props.onMount(this.props);
    }
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    var _this = this;

    if (typeof this.props.onPropChange === "function") {
      if (Array.isArray(this.props.watchedProps)) {
        var changed = this.props.watchedProps.reduce(function (red, prop) {
          if (red === true) {
            return red;
          } else {
            return _this.props[prop] !== nextProps[prop];
          }
        }, false);
        if (changed) {
          this.props.onPropChange(nextProps, this.props);
        }
      } else if (typeof this.props.watchedProps === "string") {
        if (nextProps[this.props.watchedProps] !== this.props[this.props.watchedProps]) {
          this.props.onPropChange(nextProps, this.props);
        }
      } else {
        throw new Error("No watch configured. Add watchedProps prop to your TestLab to determine which prop to observe for change");
      }
    }
  }
}))(function MockViewElement() {
  return null;
});

function createTestLab(TestedHOC) {
  var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref3$reducerName = _ref3.reducerName,
      reducerName = _ref3$reducerName === undefined ? "data" : _ref3$reducerName,
      schema = _ref3.schema;

  if (schema == null) {
    throw new Error("You have to give your graphql schema to the lab. createTestLab(HOC, { schema: YOUR-SCHEMA })");
  }
  var Subject = TestedHOC(MockView);
  var proxies = configureProxies({ schema: schema });
  var DataLab = (0, _recompose.compose)((0, _recompose.withPropsOnChange)(["dispatch"], function (_ref4) {
    var dispatch = _ref4.dispatch,
        onResolve = _ref4.onResolve,
        onSuccess = _ref4.onSuccess,
        onError = _ref4.onError;
    return _defineProperty({
      dispatch: proxies.configureDispatchProxy({
        dispatch: dispatch,
        onResolve: onResolve,
        onSuccess: onSuccess,
        onError: onError
      })
    }, reducerName, new _reducer.DataReducerRecord());
  }));
  var SupervisedSubject = (0, _recompose.compose)(DataLab)(Subject);
  return SupervisedSubject;
}

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(process) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapProps", function() { return mapProps; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "withProps", function() { return withProps; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "withPropsOnChange", function() { return withPropsOnChange; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "withHandlers", function() { return withHandlers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defaultProps", function() { return defaultProps; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renameProp", function() { return renameProp; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renameProps", function() { return renameProps; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "flattenProp", function() { return flattenProp; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "withState", function() { return withState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "withStateHandlers", function() { return withStateHandlers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "withReducer", function() { return withReducer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "branch", function() { return branch; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderComponent", function() { return renderComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderNothing", function() { return renderNothing; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shouldUpdate", function() { return shouldUpdate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pure", function() { return pure; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onlyUpdateForKeys", function() { return onlyUpdateForKeys; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onlyUpdateForPropTypes", function() { return onlyUpdateForPropTypes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "withContext", function() { return withContext; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getContext", function() { return getContext; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "lifecycle", function() { return lifecycle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toClass", function() { return toClass; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setStatic", function() { return setStatic; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setPropTypes", function() { return setPropTypes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setDisplayName", function() { return setDisplayName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "compose", function() { return compose; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getDisplayName", function() { return getDisplayName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "wrapDisplayName", function() { return wrapDisplayName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isClassComponent", function() { return isClassComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createEagerElement", function() { return createEagerElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createEagerFactory", function() { return createFactory; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createSink", function() { return createSink; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "componentFromProp", function() { return componentFromProp; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "nest", function() { return nest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hoistStatics", function() { return hoistStatics; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "componentFromStream", function() { return componentFromStream; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "componentFromStreamWithConfig", function() { return componentFromStreamWithConfig; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapPropsStream", function() { return mapPropsStream; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapPropsStreamWithConfig", function() { return mapPropsStreamWithConfig; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createEventHandler", function() { return createEventHandler; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setObservableConfig", function() { return configureObservable; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_fbjs_lib_shallowEqual__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_fbjs_lib_shallowEqual___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_fbjs_lib_shallowEqual__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_hoist_non_react_statics__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_hoist_non_react_statics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_hoist_non_react_statics__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_change_emitter__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_change_emitter___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_change_emitter__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_symbol_observable__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_symbol_observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_symbol_observable__);
/* harmony reexport (default from non-hamory) */ __webpack_require__.d(__webpack_exports__, "shallowEqual", function() { return __WEBPACK_IMPORTED_MODULE_1_fbjs_lib_shallowEqual___default.a; });






var setStatic = function setStatic(key, value) {
  return function (BaseComponent) {
    /* eslint-disable no-param-reassign */
    BaseComponent[key] = value;
    /* eslint-enable no-param-reassign */
    return BaseComponent;
  };
};

var setDisplayName = function setDisplayName(displayName) {
  return setStatic('displayName', displayName);
};

var getDisplayName = function getDisplayName(Component$$1) {
  if (typeof Component$$1 === 'string') {
    return Component$$1;
  }

  if (!Component$$1) {
    return undefined;
  }

  return Component$$1.displayName || Component$$1.name || 'Component';
};

var wrapDisplayName = function wrapDisplayName(BaseComponent, hocName) {
  return hocName + '(' + getDisplayName(BaseComponent) + ')';
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};









var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};



var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};









var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var createEagerElementUtil = function createEagerElementUtil(hasKey, isReferentiallyTransparent, type, props, children) {
  if (!hasKey && isReferentiallyTransparent) {
    if (children) {
      return type(_extends({}, props, { children: children }));
    }
    return type(props);
  }

  var Component$$1 = type;

  if (children) {
    return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
      Component$$1,
      props,
      children
    );
  }

  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(Component$$1, props);
};

var isClassComponent = function isClassComponent(Component$$1) {
  return Boolean(Component$$1 && Component$$1.prototype && _typeof(Component$$1.prototype.isReactComponent) === 'object');
};

var isReferentiallyTransparentFunctionComponent = function isReferentiallyTransparentFunctionComponent(Component$$1) {
  return Boolean(typeof Component$$1 === 'function' && !isClassComponent(Component$$1) && !Component$$1.defaultProps && !Component$$1.contextTypes && (process.env.NODE_ENV === 'production' || !Component$$1.propTypes));
};

var createFactory = function createFactory(type) {
  var isReferentiallyTransparent = isReferentiallyTransparentFunctionComponent(type);
  return function (p, c) {
    return createEagerElementUtil(false, isReferentiallyTransparent, type, p, c);
  };
};

var mapProps = function mapProps(propsMapper) {
  return function (BaseComponent) {
    var factory = createFactory(BaseComponent);
    var MapProps = function MapProps(props) {
      return factory(propsMapper(props));
    };
    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(BaseComponent, 'mapProps'))(MapProps);
    }
    return MapProps;
  };
};

var withProps = function withProps(input) {
  var hoc = mapProps(function (props) {
    return _extends({}, props, typeof input === 'function' ? input(props) : input);
  });
  if (process.env.NODE_ENV !== 'production') {
    return function (BaseComponent) {
      return setDisplayName(wrapDisplayName(BaseComponent, 'withProps'))(hoc(BaseComponent));
    };
  }
  return hoc;
};

var pick = function pick(obj, keys) {
  var result = {};
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (obj.hasOwnProperty(key)) {
      result[key] = obj[key];
    }
  }
  return result;
};

var withPropsOnChange = function withPropsOnChange(shouldMapOrKeys, propsMapper) {
  return function (BaseComponent) {
    var factory = createFactory(BaseComponent);
    var shouldMap = typeof shouldMapOrKeys === 'function' ? shouldMapOrKeys : function (props, nextProps) {
      return !__WEBPACK_IMPORTED_MODULE_1_fbjs_lib_shallowEqual___default()(pick(props, shouldMapOrKeys), pick(nextProps, shouldMapOrKeys));
    };

    var WithPropsOnChange = function (_Component) {
      inherits(WithPropsOnChange, _Component);

      function WithPropsOnChange() {
        var _temp, _this, _ret;

        classCallCheck(this, WithPropsOnChange);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.computedProps = propsMapper(_this.props), _temp), possibleConstructorReturn(_this, _ret);
      }

      WithPropsOnChange.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        if (shouldMap(this.props, nextProps)) {
          this.computedProps = propsMapper(nextProps);
        }
      };

      WithPropsOnChange.prototype.render = function render() {
        return factory(_extends({}, this.props, this.computedProps));
      };

      return WithPropsOnChange;
    }(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]);

    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(BaseComponent, 'withPropsOnChange'))(WithPropsOnChange);
    }
    return WithPropsOnChange;
  };
};

var mapValues = function mapValues(obj, func) {
  var result = {};
  /* eslint-disable no-restricted-syntax */
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = func(obj[key], key);
    }
  }
  /* eslint-enable no-restricted-syntax */
  return result;
};

/* eslint-disable no-console */
var withHandlers = function withHandlers(handlers) {
  return function (BaseComponent) {
    var factory = createFactory(BaseComponent);

    var WithHandlers = function (_Component) {
      inherits(WithHandlers, _Component);

      function WithHandlers() {
        var _temp, _this, _ret;

        classCallCheck(this, WithHandlers);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _initialiseProps.call(_this), _temp), possibleConstructorReturn(_this, _ret);
      }

      WithHandlers.prototype.componentWillReceiveProps = function componentWillReceiveProps() {
        this.cachedHandlers = {};
      };

      WithHandlers.prototype.render = function render() {
        return factory(_extends({}, this.props, this.handlers));
      };

      return WithHandlers;
    }(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]);

    var _initialiseProps = function _initialiseProps() {
      var _this2 = this;

      this.cachedHandlers = {};
      this.handlers = mapValues(typeof handlers === 'function' ? handlers(this.props) : handlers, function (createHandler, handlerName) {
        return function () {
          var cachedHandler = _this2.cachedHandlers[handlerName];
          if (cachedHandler) {
            return cachedHandler.apply(undefined, arguments);
          }

          var handler = createHandler(_this2.props);
          _this2.cachedHandlers[handlerName] = handler;

          if (process.env.NODE_ENV !== 'production' && typeof handler !== 'function') {
            console.error(
            // eslint-disable-line no-console
            'withHandlers(): Expected a map of higher-order functions. ' + 'Refer to the docs for more info.');
          }

          return handler.apply(undefined, arguments);
        };
      });
    };

    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(BaseComponent, 'withHandlers'))(WithHandlers);
    }
    return WithHandlers;
  };
};

var defaultProps = function defaultProps(props) {
  return function (BaseComponent) {
    var factory = createFactory(BaseComponent);
    var DefaultProps = function DefaultProps(ownerProps) {
      return factory(ownerProps);
    };
    DefaultProps.defaultProps = props;
    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(BaseComponent, 'defaultProps'))(DefaultProps);
    }
    return DefaultProps;
  };
};

var omit = function omit(obj, keys) {
  var rest = objectWithoutProperties(obj, []);

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (rest.hasOwnProperty(key)) {
      delete rest[key];
    }
  }
  return rest;
};

var renameProp = function renameProp(oldName, newName) {
  var hoc = mapProps(function (props) {
    var _babelHelpers$extends;

    return _extends({}, omit(props, [oldName]), (_babelHelpers$extends = {}, _babelHelpers$extends[newName] = props[oldName], _babelHelpers$extends));
  });
  if (process.env.NODE_ENV !== 'production') {
    return function (BaseComponent) {
      return setDisplayName(wrapDisplayName(BaseComponent, 'renameProp'))(hoc(BaseComponent));
    };
  }
  return hoc;
};

var keys = Object.keys;


var mapKeys = function mapKeys(obj, func) {
  return keys(obj).reduce(function (result, key) {
    var val = obj[key];
    /* eslint-disable no-param-reassign */
    result[func(val, key)] = val;
    /* eslint-enable no-param-reassign */
    return result;
  }, {});
};

var renameProps = function renameProps(nameMap) {
  var hoc = mapProps(function (props) {
    return _extends({}, omit(props, keys(nameMap)), mapKeys(pick(props, keys(nameMap)), function (_, oldName) {
      return nameMap[oldName];
    }));
  });
  if (process.env.NODE_ENV !== 'production') {
    return function (BaseComponent) {
      return setDisplayName(wrapDisplayName(BaseComponent, 'renameProps'))(hoc(BaseComponent));
    };
  }
  return hoc;
};

var flattenProp = function flattenProp(propName) {
  return function (BaseComponent) {
    var factory = createFactory(BaseComponent);
    var FlattenProp = function FlattenProp(props) {
      return factory(_extends({}, props, props[propName]));
    };

    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(BaseComponent, 'flattenProp'))(FlattenProp);
    }
    return FlattenProp;
  };
};

var withState = function withState(stateName, stateUpdaterName, initialState) {
  return function (BaseComponent) {
    var factory = createFactory(BaseComponent);

    var WithState = function (_Component) {
      inherits(WithState, _Component);

      function WithState() {
        var _temp, _this, _ret;

        classCallCheck(this, WithState);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.state = {
          stateValue: typeof initialState === 'function' ? initialState(_this.props) : initialState
        }, _this.updateStateValue = function (updateFn, callback) {
          return _this.setState(function (_ref) {
            var stateValue = _ref.stateValue;
            return {
              stateValue: typeof updateFn === 'function' ? updateFn(stateValue) : updateFn
            };
          }, callback);
        }, _temp), possibleConstructorReturn(_this, _ret);
      }

      WithState.prototype.render = function render() {
        var _babelHelpers$extends;

        return factory(_extends({}, this.props, (_babelHelpers$extends = {}, _babelHelpers$extends[stateName] = this.state.stateValue, _babelHelpers$extends[stateUpdaterName] = this.updateStateValue, _babelHelpers$extends)));
      };

      return WithState;
    }(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]);

    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(BaseComponent, 'withState'))(WithState);
    }
    return WithState;
  };
};

var withStateHandlers = function withStateHandlers(initialState, stateUpdaters) {
  return function (BaseComponent) {
    var factory = createFactory(BaseComponent);

    var WithStateHandlers = function (_Component) {
      inherits(WithStateHandlers, _Component);

      function WithStateHandlers() {
        var _temp, _this, _ret;

        classCallCheck(this, WithStateHandlers);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _initialiseProps.call(_this), _temp), possibleConstructorReturn(_this, _ret);
      }

      WithStateHandlers.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
        var propsChanged = nextProps !== this.props;
        // the idea is to skip render if stateUpdater handler return undefined
        // this allows to create no state update handlers with access to state and props
        var stateChanged = !__WEBPACK_IMPORTED_MODULE_1_fbjs_lib_shallowEqual___default()(nextState, this.state);
        return propsChanged || stateChanged;
      };

      WithStateHandlers.prototype.render = function render() {
        return factory(_extends({}, this.props, this.state, this.stateUpdaters));
      };

      return WithStateHandlers;
    }(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]);

    var _initialiseProps = function _initialiseProps() {
      var _this2 = this;

      this.state = typeof initialState === 'function' ? initialState(this.props) : initialState;
      this.stateUpdaters = mapValues(stateUpdaters, function (handler) {
        return function () {
          for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          return _this2.setState(function (state, props) {
            return handler(state, props).apply(undefined, args);
          });
        };
      });
    };

    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(BaseComponent, 'withStateHandlers'))(WithStateHandlers);
    }
    return WithStateHandlers;
  };
};

var withReducer = function withReducer(stateName, dispatchName, reducer, initialState) {
  return function (BaseComponent) {
    var factory = createFactory(BaseComponent);

    var WithReducer = function (_Component) {
      inherits(WithReducer, _Component);

      function WithReducer() {
        var _temp, _this, _ret;

        classCallCheck(this, WithReducer);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.state = {
          stateValue: _this.initializeStateValue()
        }, _this.dispatch = function (action) {
          return _this.setState(function (_ref) {
            var stateValue = _ref.stateValue;
            return {
              stateValue: reducer(stateValue, action)
            };
          });
        }, _temp), possibleConstructorReturn(_this, _ret);
      }

      WithReducer.prototype.initializeStateValue = function initializeStateValue() {
        if (initialState !== undefined) {
          return typeof initialState === 'function' ? initialState(this.props) : initialState;
        }
        return reducer(undefined, { type: '@@recompose/INIT' });
      };

      WithReducer.prototype.render = function render() {
        var _babelHelpers$extends;

        return factory(_extends({}, this.props, (_babelHelpers$extends = {}, _babelHelpers$extends[stateName] = this.state.stateValue, _babelHelpers$extends[dispatchName] = this.dispatch, _babelHelpers$extends)));
      };

      return WithReducer;
    }(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]);

    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(BaseComponent, 'withReducer'))(WithReducer);
    }
    return WithReducer;
  };
};

var identity = function identity(Component$$1) {
  return Component$$1;
};

var branch = function branch(test, left) {
  var right = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : identity;
  return function (BaseComponent) {
    var leftFactory = void 0;
    var rightFactory = void 0;
    var Branch = function Branch(props) {
      if (test(props)) {
        leftFactory = leftFactory || createFactory(left(BaseComponent));
        return leftFactory(props);
      }
      rightFactory = rightFactory || createFactory(right(BaseComponent));
      return rightFactory(props);
    };

    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(BaseComponent, 'branch'))(Branch);
    }
    return Branch;
  };
};

var renderComponent = function renderComponent(Component$$1) {
  return function (_) {
    var factory = createFactory(Component$$1);
    var RenderComponent = function RenderComponent(props) {
      return factory(props);
    };
    if (process.env.NODE_ENV !== 'production') {
      RenderComponent.displayName = wrapDisplayName(Component$$1, 'renderComponent');
    }
    return RenderComponent;
  };
};

var Nothing = function (_Component) {
  inherits(Nothing, _Component);

  function Nothing() {
    classCallCheck(this, Nothing);
    return possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  Nothing.prototype.render = function render() {
    return null;
  };

  return Nothing;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]);

var renderNothing = function renderNothing(_) {
  return Nothing;
};

var shouldUpdate = function shouldUpdate(test) {
  return function (BaseComponent) {
    var factory = createFactory(BaseComponent);

    var ShouldUpdate = function (_Component) {
      inherits(ShouldUpdate, _Component);

      function ShouldUpdate() {
        classCallCheck(this, ShouldUpdate);
        return possibleConstructorReturn(this, _Component.apply(this, arguments));
      }

      ShouldUpdate.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
        return test(this.props, nextProps);
      };

      ShouldUpdate.prototype.render = function render() {
        return factory(this.props);
      };

      return ShouldUpdate;
    }(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]);

    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(BaseComponent, 'shouldUpdate'))(ShouldUpdate);
    }
    return ShouldUpdate;
  };
};

var pure = function pure(BaseComponent) {
  var hoc = shouldUpdate(function (props, nextProps) {
    return !__WEBPACK_IMPORTED_MODULE_1_fbjs_lib_shallowEqual___default()(props, nextProps);
  });

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'pure'))(hoc(BaseComponent));
  }

  return hoc(BaseComponent);
};

var onlyUpdateForKeys = function onlyUpdateForKeys(propKeys) {
  var hoc = shouldUpdate(function (props, nextProps) {
    return !__WEBPACK_IMPORTED_MODULE_1_fbjs_lib_shallowEqual___default()(pick(nextProps, propKeys), pick(props, propKeys));
  });

  if (process.env.NODE_ENV !== 'production') {
    return function (BaseComponent) {
      return setDisplayName(wrapDisplayName(BaseComponent, 'onlyUpdateForKeys'))(hoc(BaseComponent));
    };
  }
  return hoc;
};

var onlyUpdateForPropTypes = function onlyUpdateForPropTypes(BaseComponent) {
  var propTypes = BaseComponent.propTypes;

  if (process.env.NODE_ENV !== 'production') {
    if (!propTypes) {
      /* eslint-disable */
      console.error('A component without any `propTypes` was passed to ' + '`onlyUpdateForPropTypes()`. Check the implementation of the ' + ('component with display name "' + getDisplayName(BaseComponent) + '".'));
      /* eslint-enable */
    }
  }

  var propKeys = Object.keys(propTypes || {});
  var OnlyUpdateForPropTypes = onlyUpdateForKeys(propKeys)(BaseComponent);

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'onlyUpdateForPropTypes'))(OnlyUpdateForPropTypes);
  }
  return OnlyUpdateForPropTypes;
};

var withContext = function withContext(childContextTypes, getChildContext) {
  return function (BaseComponent) {
    var factory = createFactory(BaseComponent);

    var WithContext = function (_Component) {
      inherits(WithContext, _Component);

      function WithContext() {
        var _temp, _this, _ret;

        classCallCheck(this, WithContext);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.getChildContext = function () {
          return getChildContext(_this.props);
        }, _temp), possibleConstructorReturn(_this, _ret);
      }

      WithContext.prototype.render = function render() {
        return factory(this.props);
      };

      return WithContext;
    }(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]);

    WithContext.childContextTypes = childContextTypes;

    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(BaseComponent, 'withContext'))(WithContext);
    }
    return WithContext;
  };
};

var getContext = function getContext(contextTypes) {
  return function (BaseComponent) {
    var factory = createFactory(BaseComponent);
    var GetContext = function GetContext(ownerProps, context) {
      return factory(_extends({}, ownerProps, context));
    };

    GetContext.contextTypes = contextTypes;

    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(BaseComponent, 'getContext'))(GetContext);
    }
    return GetContext;
  };
};

/* eslint-disable no-console */
var lifecycle = function lifecycle(spec) {
  return function (BaseComponent) {
    var factory = createFactory(BaseComponent);

    if (process.env.NODE_ENV !== 'production' && spec.hasOwnProperty('render')) {
      console.error('lifecycle() does not support the render method; its behavior is to ' + 'pass all props and state to the base component.');
    }

    var Lifecycle = function (_Component) {
      inherits(Lifecycle, _Component);

      function Lifecycle() {
        classCallCheck(this, Lifecycle);
        return possibleConstructorReturn(this, _Component.apply(this, arguments));
      }

      Lifecycle.prototype.render = function render() {
        return factory(_extends({}, this.props, this.state));
      };

      return Lifecycle;
    }(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]);

    Object.keys(spec).forEach(function (hook) {
      return Lifecycle.prototype[hook] = spec[hook];
    });

    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(BaseComponent, 'lifecycle'))(Lifecycle);
    }
    return Lifecycle;
  };
};

var toClass = function toClass(baseComponent) {
  if (isClassComponent(baseComponent)) {
    return baseComponent;
  }

  var ToClass = function (_Component) {
    inherits(ToClass, _Component);

    function ToClass() {
      classCallCheck(this, ToClass);
      return possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    ToClass.prototype.render = function render() {
      if (typeof baseComponent === 'string') {
        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(baseComponent, this.props);
      }
      return baseComponent(this.props, this.context);
    };

    return ToClass;
  }(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]);

  ToClass.displayName = getDisplayName(baseComponent);
  ToClass.propTypes = baseComponent.propTypes;
  ToClass.contextTypes = baseComponent.contextTypes;
  ToClass.defaultProps = baseComponent.defaultProps;

  return ToClass;
};

var setPropTypes = function setPropTypes(propTypes) {
  return setStatic('propTypes', propTypes);
};

function compose() {
  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(function (a, b) {
    return function () {
      return a(b.apply(undefined, arguments));
    };
  });
}

var createEagerElement = function createEagerElement(type, props, children) {
  var isReferentiallyTransparent = isReferentiallyTransparentFunctionComponent(type);
  /* eslint-disable */
  var hasKey = props && props.hasOwnProperty('key');
  /* eslint-enable */
  return createEagerElementUtil(hasKey, isReferentiallyTransparent, type, props, children);
};

var createSink = function createSink(callback) {
  return function (_Component) {
    inherits(Sink, _Component);

    function Sink() {
      classCallCheck(this, Sink);
      return possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    Sink.prototype.componentWillMount = function componentWillMount() {
      callback(this.props);
    };

    Sink.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
      callback(nextProps);
    };

    Sink.prototype.render = function render() {
      return null;
    };

    return Sink;
  }(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]);
};

var componentFromProp = function componentFromProp(propName) {
  var Component$$1 = function Component$$1(props) {
    return createEagerElement(props[propName], omit(props, [propName]));
  };
  Component$$1.displayName = 'componentFromProp(' + propName + ')';
  return Component$$1;
};

var nest = function nest() {
  for (var _len = arguments.length, Components = Array(_len), _key = 0; _key < _len; _key++) {
    Components[_key] = arguments[_key];
  }

  var factories = Components.map(createFactory);
  var Nest = function Nest(_ref) {
    var props = objectWithoutProperties(_ref, []),
        children = _ref.children;
    return factories.reduceRight(function (child, factory) {
      return factory(props, child);
    }, children);
  };

  if (process.env.NODE_ENV !== 'production') {
    var displayNames = Components.map(getDisplayName);
    Nest.displayName = 'nest(' + displayNames.join(', ') + ')';
  }

  return Nest;
};

var hoistStatics = function hoistStatics(higherOrderComponent) {
  return function (BaseComponent) {
    var NewComponent = higherOrderComponent(BaseComponent);
    __WEBPACK_IMPORTED_MODULE_2_hoist_non_react_statics___default()(NewComponent, BaseComponent);
    return NewComponent;
  };
};

var _config = {
  fromESObservable: null,
  toESObservable: null
};

var configureObservable = function configureObservable(c) {
  _config = c;
};

var config = {
  fromESObservable: function fromESObservable(observable) {
    return typeof _config.fromESObservable === 'function' ? _config.fromESObservable(observable) : observable;
  },
  toESObservable: function toESObservable(stream) {
    return typeof _config.toESObservable === 'function' ? _config.toESObservable(stream) : stream;
  }
};

var componentFromStreamWithConfig = function componentFromStreamWithConfig(config$$1) {
  return function (propsToVdom) {
    return function (_Component) {
      inherits(ComponentFromStream, _Component);

      function ComponentFromStream() {
        var _config$fromESObserva;

        var _temp, _this, _ret;

        classCallCheck(this, ComponentFromStream);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.state = { vdom: null }, _this.propsEmitter = Object(__WEBPACK_IMPORTED_MODULE_3_change_emitter__["createChangeEmitter"])(), _this.props$ = config$$1.fromESObservable((_config$fromESObserva = {
          subscribe: function subscribe(observer) {
            var unsubscribe = _this.propsEmitter.listen(function (props) {
              if (props) {
                observer.next(props);
              } else {
                observer.complete();
              }
            });
            return { unsubscribe: unsubscribe };
          }
        }, _config$fromESObserva[__WEBPACK_IMPORTED_MODULE_4_symbol_observable___default.a] = function () {
          return this;
        }, _config$fromESObserva)), _this.vdom$ = config$$1.toESObservable(propsToVdom(_this.props$)), _temp), possibleConstructorReturn(_this, _ret);
      }

      // Stream of props


      // Stream of vdom


      ComponentFromStream.prototype.componentWillMount = function componentWillMount() {
        var _this2 = this;

        // Subscribe to child prop changes so we know when to re-render
        this.subscription = this.vdom$.subscribe({
          next: function next(vdom) {
            _this2.setState({ vdom: vdom });
          }
        });
        this.propsEmitter.emit(this.props);
      };

      ComponentFromStream.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        // Receive new props from the owner
        this.propsEmitter.emit(nextProps);
      };

      ComponentFromStream.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
        return nextState.vdom !== this.state.vdom;
      };

      ComponentFromStream.prototype.componentWillUnmount = function componentWillUnmount() {
        // Call without arguments to complete stream
        this.propsEmitter.emit();

        // Clean-up subscription before un-mounting
        this.subscription.unsubscribe();
      };

      ComponentFromStream.prototype.render = function render() {
        return this.state.vdom;
      };

      return ComponentFromStream;
    }(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]);
  };
};

var componentFromStream = function componentFromStream(propsToVdom) {
  return componentFromStreamWithConfig(config)(propsToVdom);
};

var identity$1 = function identity(t) {
  return t;
};

var mapPropsStreamWithConfig = function mapPropsStreamWithConfig(config$$1) {
  var componentFromStream = componentFromStreamWithConfig({
    fromESObservable: identity$1,
    toESObservable: identity$1
  });
  return function (transform) {
    return function (BaseComponent) {
      var factory = createFactory(BaseComponent);
      var fromESObservable = config$$1.fromESObservable,
          toESObservable = config$$1.toESObservable;

      return componentFromStream(function (props$) {
        var _ref;

        return _ref = {
          subscribe: function subscribe(observer) {
            var subscription = toESObservable(transform(fromESObservable(props$))).subscribe({
              next: function next(childProps) {
                return observer.next(factory(childProps));
              }
            });
            return {
              unsubscribe: function unsubscribe() {
                return subscription.unsubscribe();
              }
            };
          }
        }, _ref[__WEBPACK_IMPORTED_MODULE_4_symbol_observable___default.a] = function () {
          return this;
        }, _ref;
      });
    };
  };
};

var mapPropsStream = function mapPropsStream(transform) {
  var hoc = mapPropsStreamWithConfig(config)(transform);

  if (process.env.NODE_ENV !== 'production') {
    return function (BaseComponent) {
      return setDisplayName(wrapDisplayName(BaseComponent, 'mapPropsStream'))(hoc(BaseComponent));
    };
  }
  return hoc;
};

var createEventHandlerWithConfig = function createEventHandlerWithConfig(config$$1) {
  return function () {
    var _config$fromESObserva;

    var emitter = Object(__WEBPACK_IMPORTED_MODULE_3_change_emitter__["createChangeEmitter"])();
    var stream = config$$1.fromESObservable((_config$fromESObserva = {
      subscribe: function subscribe(observer) {
        var unsubscribe = emitter.listen(function (value) {
          return observer.next(value);
        });
        return { unsubscribe: unsubscribe };
      }
    }, _config$fromESObserva[__WEBPACK_IMPORTED_MODULE_4_symbol_observable___default.a] = function () {
      return this;
    }, _config$fromESObserva));
    return {
      handler: emitter.emit,
      stream: stream
    };
  };
};

var createEventHandler = createEventHandlerWithConfig(config);

// Higher-order component helpers



/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(11)))

/***/ }),
/* 11 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @typechecks
 * 
 */

/*eslint-disable no-self-compare */



var hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
function is(x, y) {
  // SameValue algorithm
  if (x === y) {
    // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    // Added the nonzero y check to make Flow happy, but it is redundant
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    // Step 6.a: NaN == NaN
    return x !== x && y !== y;
  }
}

/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */
function shallowEqual(objA, objB) {
  if (is(objA, objB)) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  for (var i = 0; i < keysA.length; i++) {
    if (!hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
}

module.exports = shallowEqual;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */


var REACT_STATICS = {
    childContextTypes: true,
    contextTypes: true,
    defaultProps: true,
    displayName: true,
    getDefaultProps: true,
    mixins: true,
    propTypes: true,
    type: true
};

var KNOWN_STATICS = {
    name: true,
    length: true,
    prototype: true,
    caller: true,
    arguments: true,
    arity: true
};

var isGetOwnPropertySymbolsAvailable = typeof Object.getOwnPropertySymbols === 'function';

module.exports = function hoistNonReactStatics(targetComponent, sourceComponent, customStatics) {
    if (typeof sourceComponent !== 'string') { // don't hoist over string (html) components
        var keys = Object.getOwnPropertyNames(sourceComponent);

        /* istanbul ignore else */
        if (isGetOwnPropertySymbolsAvailable) {
            keys = keys.concat(Object.getOwnPropertySymbols(sourceComponent));
        }

        for (var i = 0; i < keys.length; ++i) {
            if (!REACT_STATICS[keys[i]] && !KNOWN_STATICS[keys[i]] && (!customStatics || !customStatics[keys[i]])) {
                try {
                    targetComponent[keys[i]] = sourceComponent[keys[i]];
                } catch (error) {

                }
            }
        }
    }

    return targetComponent;
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var createChangeEmitter = exports.createChangeEmitter = function createChangeEmitter() {
  var currentListeners = [];
  var nextListeners = currentListeners;

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  function listen(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.');
    }

    var isSubscribed = true;

    ensureCanMutateNextListeners();
    nextListeners.push(listener);

    return function () {
      if (!isSubscribed) {
        return;
      }

      isSubscribed = false;

      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
    };
  }

  function emit() {
    currentListeners = nextListeners;
    var listeners = currentListeners;
    for (var i = 0; i < listeners.length; i++) {
      listeners[i].apply(listeners, arguments);
    }
  }

  return {
    listen: listen,
    emit: emit
  };
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(16);


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, module) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ponyfill = __webpack_require__(19);

var _ponyfill2 = _interopRequireDefault(_ponyfill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var root; /* global window */


if (typeof self !== 'undefined') {
  root = self;
} else if (typeof window !== 'undefined') {
  root = window;
} else if (typeof global !== 'undefined') {
  root = global;
} else if (true) {
  root = module;
} else {
  root = Function('return this')();
}

var result = (0, _ponyfill2['default'])(root);
exports['default'] = result;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(17), __webpack_require__(18)(module)))

/***/ }),
/* 17 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports['default'] = symbolObservablePonyfill;
function symbolObservablePonyfill(root) {
	var result;
	var _Symbol = root.Symbol;

	if (typeof _Symbol === 'function') {
		if (_Symbol.observable) {
			result = _Symbol.observable;
		} else {
			result = _Symbol('observable');
			_Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

"use babel";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configure = configure;

var _normalizr = __webpack_require__(6);

var _graphql = __webpack_require__(0);

var _middleware = __webpack_require__(21);

var _middleware2 = _interopRequireDefault(_middleware);

var _reducer = __webpack_require__(3);

var _reducer2 = _interopRequireDefault(_reducer);

var _actions = __webpack_require__(23);

var _actions2 = _interopRequireDefault(_actions);

var _hoc = __webpack_require__(24);

var _hoc2 = _interopRequireDefault(_hoc);

var _graphqlTypesConverters = __webpack_require__(1);

var _selectors = __webpack_require__(25);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function configure(graphQLSchema, context, rootValue) {
  var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
      _ref$__debug = _ref.__debug,
      __debug = _ref$__debug === undefined ? false : _ref$__debug;

  var graphQLCompiledSchema = typeof graphQLSchema === "string" ? (0, _graphql.buildSchema)(graphQLSchema) : graphQLSchema;
  var selectorSchema = (0, _selectors.convertsTypesSchemaToSelectorSchema)(graphQLCompiledSchema, { __debug: __debug });
  var normalizrModel = (0, _graphqlTypesConverters.graphQLizr)(graphQLCompiledSchema);
  var recordsModel = (0, _graphqlTypesConverters.graphQLRecordr)(graphQLCompiledSchema);
  var actions = (0, _actions2.default)();
  var middleware = (0, _middleware2.default)(graphQLCompiledSchema, actions, normalizrModel, context, rootValue);
  var reducer = (0, _reducer2.default)(normalizrModel.entities, recordsModel, graphQLCompiledSchema);

  var _configureConnecter = (0, _hoc2.default)({
    selectorSchema: selectorSchema,
    typesSchema: graphQLCompiledSchema,
    recordTypes: recordsModel,
    actions: actions
  }),
      GraphQLConnecter = _configureConnecter.GraphQLConnecter,
      DataFetcher = _configureConnecter.DataFetcher,
      DataHandlers = _configureConnecter.DataHandlers;

  return {
    actions: actions,
    middleware: middleware,
    reducer: reducer,
    normalizrModel: normalizrModel,
    recordsModel: recordsModel,
    selectorSchema: selectorSchema,
    GraphQLConnecter: GraphQLConnecter,
    DataFetcher: DataFetcher,
    DataHandlers: DataHandlers
  };
}

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (schema, actions, normalizrModel, context, rootValue) {
  return function (store) {
    return function (next) {
      return function (action) {
        if ((action.type === "GRAPHQL_FETCH" || action.type === "GRAPHQL_MUTATION") && action.graphql) {
          if (action.type === "GRAPHQL_FETCH") {
            var query = action.payload instanceof _Query2.default ? action.payload.queryQL : action.payload;
            var hash = (0, _utils.hashString)(query);
            var request = {
              ql: query,
              hash: hash
            };

            store.dispatch(actions.queryStarted({ request: request }));
            var variableValues = action.payload instanceof _Query2.default ? action.payload.variables : {};
            var operationName = action.payload instanceof _Query2.default ? action.payload.operationName : undefined;
            (0, _graphql.graphql)(schema, query, rootValue, {
              store: store,
              dependencies: context
            }, variableValues, operationName).then(function (result) {
              if (result.errors === undefined && result.data) {
                store.dispatch(actions.packageData((0, _graphqlTypesConverters.getDataFromResponse)(normalizrModel.converters, result.data), {
                  request: request,
                  response: {
                    raw: result.data
                  }
                }));
              } else {
                console.error("GraphQL query", query, "has failed.\n", "errors:", result.errors);
                store.dispatch(actions.queryFailed({ request: request }, result.errors));
              }
            });
          } else {
            var mutation = action.payload.mutation;
            var _hash = action.payload.queryID;
            var _request = {
              ql: mutation.mutationQL,
              hash: _hash
            };
            store.dispatch(actions.queryStarted({ request: _request }));
            (0, _graphql.graphql)(schema, mutation.mutationQL, rootValue, {
              store: store,
              dependencies: context
            }, mutation.variables, mutation.operationName).then(function (result) {
              if (result.errors === undefined && result.data) {
                store.dispatch(actions.packageData((0, _graphqlTypesConverters.getDataFromResponse)(normalizrModel.converters, result.data), {
                  request: _request,
                  response: {
                    raw: result.data
                  }
                }));
                mutation.onCompleted();
              } else {
                console.error("GraphQL mutation", mutation.mutationQL, "has failed.\n", "errors:", result.errors);
                store.dispatch(actions.queryFailed({ request: _request }, result.errors));
                mutation.onError();
              }
            });
          }
        } else {
          return next(action);
        }
      };
    };
  };
};

var _utils = __webpack_require__(7);

var _graphql = __webpack_require__(0);

var _graphqlTypesConverters = __webpack_require__(1);

var _Mutation = __webpack_require__(2);

var _Mutation2 = _interopRequireDefault(_Mutation);

var _Query = __webpack_require__(22);

var _Query2 = _interopRequireDefault(_Query);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Query = function () {
  function Query() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        queryQL = _ref.queryQL,
        _ref$variables = _ref.variables,
        variables = _ref$variables === undefined ? {} : _ref$variables,
        _ref$onError = _ref.onError,
        onError = _ref$onError === undefined ? function () {} : _ref$onError,
        _ref$onCompleted = _ref.onCompleted,
        onCompleted = _ref$onCompleted === undefined ? function () {} : _ref$onCompleted,
        operationName = _ref.operationName;

    _classCallCheck(this, Query);

    if (queryQL == null) {
      throw new Error("queryQL has to be defined in the params of new Query: new Query({queryQL: `query ...`})");
    }
    this.queryQL = queryQL;
    this.variables = variables;
    this.onError = onError;
    this.onCompleted = onCompleted;
    this.operationName = operationName;
  }

  _createClass(Query, [{
    key: "setOperationName",
    value: function setOperationName(name) {
      return new Query({
        queryQL: this.queryQL,
        variables: this.variables,
        onError: this.onError,
        onCompleted: this.onCompleted,
        operationName: name
      });
    }
  }]);

  return Query;
}();

exports.default = Query;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

"use babel";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = configureActions;

var _Mutation = __webpack_require__(2);

var _Mutation2 = _interopRequireDefault(_Mutation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function configureActions() {
  return {
    mutateData: function mutateData(mutation, queryID) {
      return {
        type: "GRAPHQL_MUTATION",
        graphql: true,
        payload: {
          mutation: mutation,
          queryID: queryID
        }
      };
    },
    fetchData: function fetchData(needs) {
      return {
        type: "GRAPHQL_FETCH",
        graphql: true,
        payload: needs
      };
    },
    bustQueryCache: function bustQueryCache(queryID) {
      return {
        type: "QUERY_CACHE_BUSTED",
        payload: {
          queryID: queryID
        }
      };
    },
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
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

"use babel";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = configureConnecter;

var _react = __webpack_require__(5);

var _react2 = _interopRequireDefault(_react);

var _graphql = __webpack_require__(0);

var _immutable = __webpack_require__(4);

var _graphqlTypesConverters = __webpack_require__(1);

var _utils = __webpack_require__(7);

var _reducer = __webpack_require__(3);

var _Mutation = __webpack_require__(2);

var _Mutation2 = _interopRequireDefault(_Mutation);

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
      reducerName = _ref$reducerName === undefined ? "data" : _ref$reducerName,
      actions = _ref.actions;

  if (typesSchema === undefined) {
    throw new Error("You have to define a type schema, type schema is currently " + typesSchema);
  }
  if (selectorSchema === undefined) {
    throw new Error("You have to define a selector schema, selector schema is currently " + selectorSchema);
  }

  function DataHandlers(_ref2) {
    var mapMutationsToProps = _ref2.mapMutationsToProps;

    return function DataHandlersHOC(Comp) {
      return function (_React$Component) {
        _inherits(DataHandlersContainer, _React$Component);

        function DataHandlersContainer(props) {
          _classCallCheck(this, DataHandlersContainer);

          var _this = _possibleConstructorReturn(this, (DataHandlersContainer.__proto__ || Object.getPrototypeOf(DataHandlersContainer)).call(this, props));

          _this.id = props.__uniqueID || (0, _utils.generateUUID)();
          _this.bustQueryCache = _this.bustQueryCache.bind(_this);
          return _this;
        }

        _createClass(DataHandlersContainer, [{
          key: "getReducer",
          value: function getReducer(props) {
            return props[reducerName];
          }
        }, {
          key: "getLinkedQueries",
          value: function getLinkedQueries(props) {
            var _this2 = this;

            var reducer = this.getReducer(props);
            var queries = reducer.queries;
            var mutationsProps = mapMutationsToProps(props);
            var names = Object.keys(mutationsProps);
            var linkedQueries = names.map(function (name) {
              return {
                name: name,
                query: queries.get((0, _utils.hashMutationQuery)(name, _this2.id).toString())
              };
            });
            return linkedQueries;
          }
        }, {
          key: "getLinkedQueryProps",
          value: function getLinkedQueryProps(props) {
            var linkedQueries = this.getLinkedQueries(props).reduce(function (red, infos) {
              var _extends2;

              var queryProgressPropName = infos.name + "QueryProgress";
              var queryResponsePropName = infos.name + "QueryResponse";
              return _extends({}, red, (_extends2 = {}, _defineProperty(_extends2, queryProgressPropName, infos.query ? infos.query.progress : _reducer.QUERY_PROGRESS_NOT_STARTED), _defineProperty(_extends2, queryResponsePropName, infos.query ? infos.query.results.raw : null), _extends2));
            }, {});
            return linkedQueries;
          }
        }, {
          key: "componentWillUnmount",
          value: function componentWillUnmount() {
            var _this3 = this;

            this.getLinkedQueries(this.props).forEach(function (info) {
              _this3.bustQueryCache(info.name);
            });
          }
        }, {
          key: "bustQueryCache",
          value: function bustQueryCache(handlerName) {
            this.props.dispatch(actions.bustQueryCache((0, _utils.hashMutationQuery)(handlerName, this.id)));
          }
        }, {
          key: "render",
          value: function render() {
            var _this4 = this;

            var reducer = this.getReducer(this.props);
            if (!reducer) throw new Error("DataHandlers must get the cache reducer as a props named '" + reducerName + "'");

            if (!this.props.dispatch) throw new Error("DataHandlers must get the dispatch function as props");

            var mutationsMap = mapMutationsToProps(this.props);
            var handlers = Object.keys(mutationsMap).reduce(function (red, key) {
              if (typeof mutationsMap[key] !== "function") {
                throw new Error("You must pass a function as handler of mapMutationsToProps, handler " + key + " isn't a function");
              }
              return _extends({}, red, _defineProperty({}, key, function () {
                var mutation = mutationsMap[key].apply(mutationsMap, arguments);
                if (mutation instanceof _Mutation2.default) {
                  var action = actions.mutateData(mutation, (0, _utils.hashMutationQuery)(key, _this4.id));
                  _this4.props.dispatch(action);
                } else if (mutation) {
                  console.error("You have to return a Mutation from the handler defined in mapMutationsToProps,", key, "handler doesn't return a Mutation.");
                } else {
                  return;
                }
              }));
            }, {});
            var queries = this.getLinkedQueryProps(this.props);
            return _react2.default.createElement(Comp, _extends({}, this.props, handlers, queries, {
              bustQueryCache: this.bustQueryCache
            }));
          }
        }]);

        return DataHandlersContainer;
      }(_react2.default.Component);
    };
  }

  function DataFetcher(_ref3) {
    var mapPropsToNeeds = _ref3.mapPropsToNeeds,
        _ref3$mapCacheToProps = _ref3.mapCacheToProps,
        mapCacheToProps = _ref3$mapCacheToProps === undefined ? function () {
      return {};
    } : _ref3$mapCacheToProps,
        _ref3$shouldRefetch = _ref3.shouldRefetch,
        shouldRefetch = _ref3$shouldRefetch === undefined ? function () {
      return false;
    } : _ref3$shouldRefetch,
        _ref3$queryProgressPr = _ref3.queryProgressPropName,
        queryProgressPropName = _ref3$queryProgressPr === undefined ? "queryProgress" : _ref3$queryProgressPr;

    return GraphQLConnecter(mapPropsToNeeds, mapCacheToProps, shouldRefetch, {
      queryProgressPropName: queryProgressPropName
    });
  }

  function GraphQLConnecter(mapPropsToNeeds) {
    var mapCacheToProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
      return {};
    };
    var shouldRefetch = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {
      return false;
    };

    var _ref4 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
        _ref4$queryProgressPr = _ref4.queryProgressPropName,
        queryProgressPropName = _ref4$queryProgressPr === undefined ? "queryProgress" : _ref4$queryProgressPr;

    return function (WrappedComponent) {
      return function (_React$Component2) {
        _inherits(GraphQLContainer, _React$Component2);

        function GraphQLContainer(props) {
          _classCallCheck(this, GraphQLContainer);

          var _this5 = _possibleConstructorReturn(this, (GraphQLContainer.__proto__ || Object.getPrototypeOf(GraphQLContainer)).call(this, props));

          _this5.state = {
            selectedData: {},
            queryProgress: _reducer.QUERY_PROGRESS_NOT_STARTED
          };
          return _this5;
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
          key: "mustReselectData",
          value: function mustReselectData(props, nextProps) {
            var currentReducer = this.getReducer(props);
            var nextReducer = this.getReducer(nextProps);
            var currentNeeds = mapPropsToNeeds(props);
            var nextNeeds = mapPropsToNeeds(nextProps);
            if (nextNeeds !== currentNeeds) return true;
            var hash = currentNeeds != null ? (0, _utils.hashString)(currentNeeds).toString() : null;
            if (hash != null) {
              var nextQuery = nextReducer.getIn(["queries", hash]);
              var currentQuery = currentReducer.getIn(["queries", hash]);
              if (nextQuery !== currentQuery) return true;else if (nextReducer.entities !== currentReducer.entities) {
                return (0, _utils.selectedDataHaveChanged)({
                  schema: typesSchema,
                  query: currentNeeds,
                  queryHash: hash,
                  reducer1: currentReducer,
                  reducer2: nextReducer
                });
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
            var _this6 = this;

            var query = mapPropsToNeeds(props);
            var reducer = this.getReducer(props);
            if (query === "{}" || query === "{ }") {
              this.warnAgainstEmptyQuery();
              this.resetSelection();
            } else if (query != null) {
              var hash = (0, _utils.hashString)(query).toString();
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
                  var reducerChanged = _this6.getReducer(props) !== reducer;
                  if (props.__debug) {
                    console.log("CONVERTED data", result.data, "into", convertedData, "for hash", "with reducer", reducer, reducerChanged ? "but reducer has changed to" : "", reducerChanged ? _this6.getReducer(props) : "", reducerChanged ? "relaunching selection" : "");
                  }
                  if (reducerChanged) {
                    _this6.selectData(props);
                  } else {
                    var queryProgress = reducer.getIn(["queries", hash, "progress"], _reducer.QUERY_PROGRESS_NOT_STARTED);
                    _this6.setState(function (state) {
                      return {
                        selectedData: convertedData,
                        queryProgress: queryProgress
                      };
                    });
                  }
                }
              });
            } else {
              this.resetSelection();
            }
          }
        }, {
          key: "resetSelection",
          value: function resetSelection() {
            this.setState(function (state) {
              return {
                selectedData: {},
                queryProgress: _reducer.QUERY_PROGRESS_NOT_STARTED
              };
            });
          }
        }, {
          key: "getNeeds",
          value: function getNeeds() {
            var needs = mapPropsToNeeds(this.props);
            if (needs === "{}" || needs === "{ }") {
              this.warnAgainstEmptyQuery();
            } else if (needs != null) {
              this.props.dispatch(actions.fetchData(needs));
            }
          }
        }, {
          key: "render",
          value: function render() {
            var _this7 = this;

            var reducer = this.getReducer(this.props);
            if (!reducer) throw new Error("GraphQLConnecter must get the cache reducer as a props named '" + reducerName + "'");
            if (!this.props.dispatch) throw new Error("GraphQLConnecter must get the dispatch function as props");
            return _react2.default.createElement(WrappedComponent, _extends({}, this.props, this.state.selectedData, mapCacheToProps(this.props.data, this.props, this.state.selectedData), _defineProperty({}, queryProgressPropName, this.state.queryProgress), {
              refetch: function refetch() {
                return _this7.getNeeds();
              }
            }));
          }
        }]);

        return GraphQLContainer;
      }(_react2.default.Component);
    };
  }
  return { GraphQLConnecter: GraphQLConnecter, DataHandlers: DataHandlers, DataFetcher: DataFetcher };
}

/***/ }),
/* 25 */
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

var _immutable = __webpack_require__(4);

var _graphql = __webpack_require__(0);

var _graphqlTypesConverters = __webpack_require__(1);

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