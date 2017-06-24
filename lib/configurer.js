"use babel";
// @flow
import configureMiddleware from "./middleware";
import configureReducer from "./reducer";
import configureActions from "./actions";
import { graphQLizr, graphQLRecordr } from "./graphqlTypesConverters";
import { schema } from "normalizr";
import { buildSchema } from "graphql";
import type { GraphQLSchema } from "graphql";

export function configure(
  graphQLSchema: GraphQLSchema | string,
  context: mixed,
) {
  const graphQLCompiledSchema = typeof graphQLSchema === "string"
    ? buildSchema(graphQLSchema)
    : graphQLSchema;
  const normalizrModel = graphQLizr(graphQLCompiledSchema);
  const recordsModel = graphQLRecordr(graphQLCompiledSchema);
  const actions = configureActions();
  return {
    actions,
    middleware: configureMiddleware(
      graphQLCompiledSchema,
      actions,
      normalizrModel,
      context,
    ),
    reducer: configureReducer(
      normalizrModel.entities,
      recordsModel,
      graphQLCompiledSchema,
    ),
    normalizrModel: normalizrModel,
    recordsModel: recordsModel,
  };
}
