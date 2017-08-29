// @flow

import type {
  GraphQLOutputType,
  GraphQLType,
  GraphQLField,
  GraphQLNamedType,
  GraphQLArgument,
  GraphQLArgumentConfig,
  GraphQLFieldConfigMap,
  GraphQLFieldConfig,
  GraphQLResolveInfo,
  FragmentDefinitionNode,
  ASTNode,
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
  visit,
  parse,
  Kind,
} from "graphql";
import { isEntity } from "./graphqlTypesConverters";

type TypeMap = { [typeName: string]: GraphQLNamedType };

function getResolveQuery(entityName: string) {
  return function resolveQuery(
    parent,
    args,
    context,
    { rootValue, fieldName, returnType, path }: GraphQLResolveInfo,
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
      path !== undefined ? path.key : fieldName,
    ]);
    if (queryResult == null) {
      if (returnType instanceof GraphQLList) return [];
      else return null;
    }
    if (returnType instanceof GraphQLList) {
      const typeName = getEntityTypeNameFromSelectorTypeName(
        getNamedType(returnType.ofType).name,
      );
      return queryResult.map(id =>
        context.db.getIn(["entities", typeName, id.toString()]),
      );
    } else if (queryResult != null) {
      return context.db.getIn([
        "entities",
        getEntityTypeNameFromSelectorTypeName(getNamedType(returnType).name),
        queryResult.toString(),
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
    { rootValue, fieldName, returnType }: GraphQLResolveInfo = {},
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
    const typeName = getSelectorTypeName(getNamedType(type).name);
    if (typesMap[typeName] == null) {
      throw new Error(
        "Something went wrong in schema conversions. Trying to access " +
          typeName +
          " type is impossible in Selectors Schema TypeMap",
      );
    }
    // $FlowFixMe
    return typesMap[typeName];
  } else {
    return type;
  }
}

function convertsArgsArrayToArgsMap(
  args: Array<GraphQLArgument>,
): { [argName: string]: GraphQLArgumentConfig } {
  return args.reduce(
    (red, arg): { [argName: string]: GraphQLArgumentConfig } => ({
      ...red,
      [arg.name]: arg,
    }),
    {},
  );
}

export function convertsFieldToSelectorField(
  query: GraphQLField<any, any>,
  typesMap: TypeMap,
  type: "entity" | "query" | "scalar",
): GraphQLFieldConfig<any, any> {
  let resolver;
  let name: string;
  switch (type) {
    case "entity":
      name = getSelectorTypeName(query.name);
      resolver = getResolveEntity(getNamedType(query.type).name);
      break;
    case "query":
      name = getSelectorTypeName(query.name);
      resolver = getResolveQuery(getNamedType(query.type).name);
      break;
    default:
      name = query.name;
  }
  return {
    description: query.description,
    args: convertsArgsArrayToArgsMap(query.args),
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
    if (
      /*isEntity(type) === true &&*/ type instanceof GraphQLObjectType &&
      !key.startsWith("__")
    ) {
      newTypeMap[getSelectorTypeName(key)] = convertsTypeToSelectorType(
        type,
        newTypeMap,
      );
    } else {
      newTypeMap[key] = type;
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
  {
    markers = ["id"],
    __debug = false,
  }: { markers?: Array<string>, __debug?: boolean } = {},
): GraphQLSchema {
  const typesMap = schema.getTypeMap();
  const selectorTypesMap = convertsTypeMapToSelectorTypeMap(typesMap);
  if (__debug) {
    console.log(
      "DataModel TypeMap:",
      typesMap,
      "\nSelector TypeMap:",
      selectorTypesMap,
    );
  }
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

export function convertsQueryToSelectorQuery(query: string | ASTNode): ASTNode {
  return visit(typeof query === "string" ? parse(query) : query, {
    [Kind.FRAGMENT_DEFINITION]: {
      enter(node: FragmentDefinitionNode) {
        const copiedNode: FragmentDefinitionNode = visit(node, {});
        copiedNode.typeCondition.name.value = getSelectorTypeName(
          copiedNode.typeCondition.name.value,
        );
        return copiedNode;
      },
    },
  });
}
