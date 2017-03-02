'use babel';
// @flow

import { schema } from 'normalizr';
import {
  printSchema,
  graphql,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLID,
  getNullableType,
  getNamedType,
} from 'graphql';

function isGraphQLIntegratedType(typeName) {
  return [
    'String',
    'Boolean',
    'Int',
    'ID',
    'Float',
    '__Schema',
    '__Type',
    '__TypeKind',
    '__Field',
    '__InputValue',
    '__EnumValue',
    '__Directive',
    '__DirectiveLocation',
  ].includes(typeName);
}

function isEntity(graphQLType, markers: Array<string>) {
  return graphQLType._fields &&
    Object.keys(graphQLType._fields)
      .reduce(
        (red, fieldName) => red || markers.includes(fieldName),
        false,
      );
}

export function createEntitiesForTypes(typesMap, markers) {
  return Object.keys(typesMap)
    .reduce(
      (red, typeName) =>
        isGraphQLIntegratedType(typeName) ||
          !isEntity(typesMap[typeName], markers)
          ? red
          : Object.assign(red, { [typeName]: new schema.Entity(typeName) }, {}),
      {}
    );
}

export function getDefinitionOfType(graphQLType, entities) {
  if ('_fields' in graphQLType) {
    const fields = Object.keys(graphQLType._fields).reduce((red, fieldName) => {
      const field = graphQLType._fields[fieldName];
      if (field.type.name in entities)
        return Object.assign({}, red, {
          [fieldName]: entities[field.type.name],
        });
      else {
        const definition = getDefinitionOfType(field.type, entities);
        if (definition)
          return Object.assign({}, red, { [fieldName]: definition });
        else
          return red;
      }
    }, {});
    if (Object.keys(fields).length > 0) return fields;
    else return undefined;
  } else if ('ofType' in graphQLType) {
    if (graphQLType.ofType.name in entities)
      return [entities[graphQLType.ofType.name]];
    else
      return undefined;
  } else {
    return undefined;
  }
}

export function addDefinitionsForTypes(typesMap, entities) {
  Object.keys(typesMap).forEach(typeName => {
    if (
      isGraphQLIntegratedType(typeName) === false &&
      entities[typeName] instanceof schema.Entity
    ) {
      const definition = getDefinitionOfType(typesMap[typeName], entities);
      entities[typeName].define(definition || {});
    }
  });
}

export function getConvertersFromSchema(schema) {
  return Object.keys(schema._queryType._fields).reduce((red, field) => {
    const type = schema._queryType._fields[field].type;
    let entityType;
    if (type.ofType)
      entityType = type.ofType.name;
    else
      entityType = type.name;
    return Object.assign({}, red, {[field]: entityType});
  }, {});
}

export function getDataFromResponse(converters, data) {
  return Object.keys(data).reduce((red, key) => {
    return Object.assign({}, red, {[converters[key]]: Array.isArray(data[key]) ? data[key] : [data[key]]});
  }, {});
}

export function graphQLizr(schema, { markers = ['id'] } = {}) {
  const entities = createEntitiesForTypes(schema._typeMap, markers);
  const converters = getConvertersFromSchema(schema);
  addDefinitionsForTypes(schema._typeMap, entities);
  return {entities, converters};
}
