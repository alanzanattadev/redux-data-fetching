// @flow

import type {
  GraphQLOutputType,
  GraphQLType,
  GraphQLField,
  GraphQLNamedType,
  GraphQLArgumentConfig,
} from "graphql";
import { Map } from "immutable";
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
  GraphQLUnionType,
  getNamedType,
} from "graphql";
import { isEntity } from "./graphqlTypesConverters";

type TypeMap = { [typeName: string]: GraphQLNamedType };

function getResolveQuery(entityName: string) {
  return function resolveQuery(
    parent,
    args,
    context,
    {
      rootValue,
      fieldName,
      returnType,
      path,
    }: {
      rootValue: Map<string, Map<string, *>>,
      fieldName: string,
      returnType: GraphQLOutputType,
      path: { key: string },
    } = {},
  ) {
    if (context == null || context.db == null || context.queryHash == null)
      throw new Error(
        "You have to pass database (entities and results) as db and graphql query as queryHash in contextValue",
      );
    const queryResult = context.db.getIn([
      "queries",
      context.queryHash,
      "results",
      "byQuery",
      path.key,
    ]);
    if (returnType instanceof GraphQLList) {
      const typeName = getEntityTypeNameFromSelectorTypeName(
        returnType.ofType.name,
      );
      return queryResult.map(id =>
        context.db.getIn(["entities", typeName, id.toString()]),
      );
    } else if (queryResult != null) {
      return context.db.getIn([
        "entities",
        getEntityTypeNameFromSelectorTypeName(returnType.name),
        queryResult,
      ]);
    } else {
      return null;
    }
  };
}

function getResolveEntity(entityName: string) {
  return function resolveEntity(
    parent,
    args,
    context,
    {
      rootValue,
      fieldName,
      returnType,
    }: {
      rootValue: Map<string, Map<string, *>>,
      fieldName: string,
      returnType: GraphQLOutputType,
    } = {},
  ) {
    const fieldValue = parent[fieldName];
    if (returnType instanceof GraphQLList && fieldValue != null) {
      return fieldValue.map(id =>
        context.db.getIn(["entities", entityName, id.toString()]),
      );
    } else if (fieldValue != null) {
      return context.db.getIn(["entities", entityName, fieldValue.toString()]);
    } else {
      return null;
    }
  };
}

function getSelectorTypeName(name: string): string {
  return `${name}Selector`;
}

function getEntityTypeNameFromSelectorTypeName(name: string): string {
  return name.substring(0, name.length - 8);
}

function getSelectorTypeFromType(
  type: GraphQLOutputType,
  typesMap: TypeMap,
): GraphQLOutputType {
  if (type instanceof GraphQLList)
    return new GraphQLList(getSelectorTypeFromType(type.ofType, typesMap));
  else if (type instanceof GraphQLObjectType) {
    return typesMap[getSelectorTypeName(getNamedType(type).name)];
  } else {
    return type;
  }
}

export function convertsFieldToSelectorField(
  query: GraphQLField<*, *>,
  typesMap: TypeMap,
  type: "entity" | "query" | "scalar",
): GraphQLField<*, *> {
  let resolver;
  let name;
  switch (type) {
    case "entity":
      name = getSelectorTypeName(query.name);
      resolver = getResolveEntity(getNamedType(query.type).name);
      break;
    case "query":
      name = getSelectorTypeName(query.name);
      resolver = getResolveQuery(getNamedType(query.type).name);
      break;
    case "scalar":
      break;
  }
  return {
    name: name,
    // description: query.description,
    args: query.args.reduce(
      (red, arg): { [argName: string]: GraphQLArgumentConfig } => ({
        ...red,
        [arg.name]: arg,
      }),
      {},
    ),
    type: getSelectorTypeFromType(query.type, typesMap),
    resolve: resolver,
  };
}

export function convertsTypeToSelectorType(
  type: GraphQLObjectType,
  typeMap: TypeMap,
): GraphQLOutputType {
  const selectorName = getSelectorTypeName(type.name);
  return new GraphQLObjectType({
    name: selectorName,
    fields: () =>
      Object.keys(type.getFields()).reduce((red, key) => {
        return {
          ...red,
          [key]: isEntity(getNamedType(type.getFields()[key].type))
            ? convertsFieldToSelectorField(
                type.getFields()[key],
                typeMap,
                "entity",
              )
            : convertsFieldToSelectorField(
                type.getFields()[key],
                typeMap,
                "scalar",
              ),
        };
      }, {}),
  });
}

export function convertsTypeMapToSelectorTypeMap(typeMap: TypeMap): TypeMap {
  let newTypeMap = {};
  Object.keys(typeMap).forEach(key => {
    const type = typeMap[key];
    if (isEntity(type) === true) {
      newTypeMap[getSelectorTypeName(key)] = convertsTypeToSelectorType(
        type,
        newTypeMap,
      );
    }
  });
  return newTypeMap;
}

export function convertsRootQueryToSelectorRootQuery(
  rootQuery: GraphQLObjectType,
  selectorTypeMap: TypeMap,
): GraphQLObjectType {
  return new GraphQLObjectType({
    name: "SelectorsRootQueryType",
    fields: Object.keys(rootQuery.getFields()).reduce((red, key) => {
      return {
        ...red,
        [key]: convertsFieldToSelectorField(
          rootQuery.getFields()[key],
          selectorTypeMap,
          "query",
        ),
      };
    }, {}),
  });
}

export function convertsTypesSchemaToSelectorSchema(
  schema: GraphQLSchema,
  { markers = ["id"] }: { markers: Array<string> } = {},
): GraphQLSchema {
  const typesMap = schema.getTypeMap();
  const selectorTypesMap = convertsTypeMapToSelectorTypeMap(typesMap);
  const typesQuery = schema.getQueryType();
  const selectorTypesQuery = convertsRootQueryToSelectorRootQuery(
    typesQuery,
    selectorTypesMap,
  );
  const selectorSchema = new GraphQLSchema({
    query: selectorTypesQuery,
  });
  return selectorSchema;
}
