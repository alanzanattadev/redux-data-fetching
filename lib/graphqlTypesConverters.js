"use babel";
// @flow

import { schema } from "normalizr";
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
  GraphQLEnumType,
  getNullableType,
  getNamedType,
} from "graphql";
import type {
  GraphQLSchema as GraphQLSchemaType,
  GraphQLNamedType,
  GraphQLType,
  GraphQLOutputType,
  GraphQLField,
} from "graphql";
import { Record, Map, List } from "immutable";
import type { Record as RecordType } from "immutable";

type RecordTypes = { [typeName: string]: RecordType<*> };

function isGraphQLIntegratedType(typeName: string): boolean {
  return [
    "String",
    "Boolean",
    "Int",
    "ID",
    "Float",
    "__Schema",
    "__Type",
    "__TypeKind",
    "__Field",
    "__InputValue",
    "__EnumValue",
    "__Directive",
    "__DirectiveLocation",
  ].includes(typeName);
}

export function isEntity(
  graphQLType: GraphQLNamedType,
  markers: Array<string> = ["id"],
): boolean {
  return (
    graphQLType instanceof GraphQLObjectType &&
    Object.keys(graphQLType.getFields()).reduce(
      (red, fieldName) => red || markers.includes(fieldName),
      false,
    )
  );
}

export function createEntitiesForTypes(
  typesMap: { [typeName: string]: GraphQLNamedType },
  markers: Array<string>,
): { [typeName: string]: schema.Entity } {
  return Object.keys(typesMap).reduce(
    (red, typeName) =>
      isGraphQLIntegratedType(typeName) ||
      !isEntity(typesMap[typeName], markers)
        ? red
        : Object.assign(red, { [typeName]: new schema.Entity(typeName) }, {}),
    {},
  );
}

export function getRecordSchemaForType(
  type: GraphQLObjectType,
): { [fieldName: string]: typeof undefined } {
  return Object.keys(type.getFields()).reduce(
    (red, fieldName) => Object.assign({}, red, { [fieldName]: undefined }),
    {},
  );
}

export function createRecordsForTypes(typesMap: {
  [typeName: string]: $FlowFixMe,
}) {
  return Object.keys(typesMap).reduce(
    (red, typeName) =>
      isGraphQLIntegratedType(typeName) ||
      !(typesMap[typeName] instanceof GraphQLObjectType)
        ? red
        : Object.assign(red, {
            [typeName]: Record(
              getRecordSchemaForType(typesMap[typeName]),
              typeName,
            ),
          }),
    {},
  );
}

export function getDefinitionOfType(
  graphQLType: GraphQLType,
  entities: { [typeName: string]: schema.Entity },
) {
  if (graphQLType instanceof GraphQLObjectType) {
    const fields = Object.keys(
      graphQLType.getFields(),
    ).reduce((red, fieldName) => {
      // $FlowFixMe
      const field = graphQLType.getFields()[fieldName];
      // $FlowFixMe
      if (field.type.name in entities)
        return Object.assign({}, red, {
          // $FlowFixMe
          [fieldName]: entities[field.type.name],
        });
      else {
        const definition = getDefinitionOfType(field.type, entities);
        if (definition)
          return Object.assign({}, red, { [fieldName]: definition });
        else return red;
      }
    }, {});
    if (Object.keys(fields).length > 0) return fields;
    else return undefined;
  } else if (graphQLType instanceof GraphQLList) {
    if (graphQLType.ofType.name in entities)
      return [entities[graphQLType.ofType.name]];
    else return undefined;
  } else {
    return undefined;
  }
}

export function addDefinitionsForTypes(
  typesMap: { [typeName: string]: GraphQLNamedType },
  entities: { [typeName: string]: schema.Entity },
): void {
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

export function getConvertersFromSchema(
  schema: GraphQLSchemaType,
): { [fieldName: string]: string } {
  return Object.keys(schema.getQueryType().getFields()).reduce((red, field) => {
    const type = schema.getQueryType().getFields()[field].type;
    let entityType;
    if (type instanceof GraphQLList) entityType = getNamedType(type).name;
    else if (type instanceof GraphQLEnumType) entityType = type.name;
    else entityType = getNamedType(type).name;
    return Object.assign({}, red, { [field]: entityType });
  }, {});
}

export function getDataFromResponse(
  converters: { [fieldName: string]: string },
  data: Object,
) {
  return Object.keys(data).reduce((red, key) => {
    return Object.assign({}, red, {
      [converters[key]]: Array.isArray(data[key]) ? data[key] : [data[key]],
    });
  }, {});
}

export function graphQLizr(
  schema: GraphQLSchemaType,
  { markers = ["id"] }: { markers: Array<string> } = {},
): {
  entities: { [typeName: string]: schema.Entity },
  converters: { [fieldName: string]: string },
} {
  const entities = createEntitiesForTypes(schema._typeMap, markers);
  const converters = getConvertersFromSchema(schema);
  addDefinitionsForTypes(schema.getTypeMap(), entities);
  return { entities, converters };
}

export function graphQLRecordr(schema: GraphQLSchemaType) {
  const records = createRecordsForTypes(schema.getTypeMap());
  return records;
}

export function convertsEntityToRecord(
  entity?: ?Object | mixed,
  type: string,
  graphQLSchema: GraphQLSchemaType,
  recordsTypes: RecordTypes,
): RecordType<*> | mixed {
  if (typeof entity !== "object" || entity == null) return entity;
  if (Array.isArray(entity) === true) {
    console.error("Trying to convert", entity, "into a Record of type", type);
    throw new Error(
      "ILS is trying to convert an Array in a Record which is impossible, you may have called packageData with wrong types (Array instead of Object) or something wrong with the normalization",
    );
  }
  const graphQLType = graphQLSchema.getType(type);
  // $FlowFixMe
  return new recordsTypes[type](
    Object.keys(entity).reduce((red, key) => {
      if (
        graphQLType instanceof GraphQLObjectType &&
        graphQLType.getFields()[key] == null
      ) {
        console.warn(
          "Trying to assign field",
          key,
          "to entity of type",
          type,
          "but it doesn't exist in the graphql data model. You may want to update the schema to have this new field. Aborting assignment",
        );
        return red;
      }
      // $FlowFixMe
      const field = entity[key];
      if (
        typeof field == "object" &&
        Array.isArray(field) == false &&
        field != null
      ) {
        if (
          graphQLSchema.getTypeMap()[type] == null ||
          !(graphQLSchema.getTypeMap()[type] instanceof GraphQLObjectType) ||
          // $FlowFixMe
          graphQLSchema.getTypeMap()[type].getFields()[key] == null
        ) {
          console.error(
            "Error trying to convert entity",
            entity,
            "to record of type",
            type,
          );
          throw new Error(
            `Error has been detected when trying to access the field with key ${key}, if key is a number you may have wrapped data, sent to packageData, in an array where you shouldn't`,
          );
        }
        return Object.assign({}, red, {
          [key]: convertsEntityToRecord(
            field,
            // $FlowFixMe
            graphQLSchema.getTypeMap()[type].getFields()[key].type.name,
            graphQLSchema,
            recordsTypes,
          ),
        });
      } else if (typeof field == "object" && Array.isArray(field) === true) {
        return Object.assign({}, red, {
          [key]: field.map(
            v =>
              typeof v === "object"
                ? convertsEntityToRecord(
                    v,
                    // $FlowFixMe
                    graphQLSchema.getTypeMap()[type].getFields()[key].type
                      .ofType.name,
                    graphQLSchema,
                    recordsTypes,
                  )
                : v,
          ),
        });
      } else {
        return Object.assign({}, red, { [key]: field });
      }
    }, {}),
  );
}

export function convertsNormalizedEntitiesToRecords(
  entities: { [typeName: string]: { [id: string]: Object } },
  recordsTypes: RecordTypes,
  graphQLSchema: GraphQLSchemaType,
): { [typeName: string]: { [id: string]: RecordType<*> } } {
  return Object.keys(entities).reduce((red, typeName) => {
    return Object.assign({}, red, {
      [typeName]: Object.keys(
        entities[typeName],
      ).reduce((reduction, entityId) => {
        return Object.assign({}, reduction, {
          [entityId]: convertsEntityToRecord(
            entities[typeName][entityId],
            typeName,
            graphQLSchema,
            recordsTypes,
          ),
        });
      }, {}),
    });
  }, {});
}

export function convertsGraphQLResultToRootEntitiesIDs(
  result: Object,
): { [entityName: string]: Array<string | number> | string | number } {
  return Object.keys(result).reduce((red, key) => {
    if (!Array.isArray(result[key]) && result[key] == null) return red;
    return red.set(
      key,
      Array.isArray(result[key])
        ? result[key].filter(entity => entity != null).map(entity => entity.id)
        : result[key].id,
    );
  }, Map());
}

export function convertsGraphQLQueryResultToRecords(
  result: mixed,
  associatedQuery: GraphQLField<any, any>,
  schema: GraphQLSchema,
  recordTypes: RecordTypes,
) {
  if (Array.isArray(result))
    return List(result).map(v =>
      convertsGraphQLQueryResultToRecords(
        v,
        associatedQuery,
        schema,
        recordTypes,
      ),
    );
  else if (typeof result === "object" && result !== null) {
    return convertsEntityToRecord(
      result,
      getNamedType(associatedQuery.type).name,
      schema,
      recordTypes,
    );
  } else {
    return result;
  }
}

export function convertsGraphQLResultToRecords(
  result: Object,
  schema: GraphQLSchema,
  recordTypes: RecordTypes,
): Object {
  const rootQuery = schema.getQueryType();
  const queries = rootQuery.getFields();
  return Object.keys(result).reduce((red, key) => {
    const field = result[key];
    const associatedQuery = queries[key];
    const convertedField = convertsGraphQLQueryResultToRecords(
      field,
      associatedQuery,
      schema,
      recordTypes,
    );
    return {
      ...red,
      [key]: convertedField,
    };
  }, {});
}
