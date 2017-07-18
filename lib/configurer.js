"use babel";
// @flow
import { schema } from "normalizr";
import { buildSchema } from "graphql";
import type { GraphQLSchema } from "graphql";
import configureMiddleware from "./middleware";
import configureReducer from "./reducer";
import configureActions from "./actions";
import configureConnecter from "./hoc";
import { graphQLizr, graphQLRecordr } from "./graphqlTypesConverters";
import { convertsTypesSchemaToSelectorSchema } from "./selectors";

export function configure(
  graphQLSchema: GraphQLSchema | string,
  context: mixed,
) {
  const graphQLCompiledSchema =
    typeof graphQLSchema === "string"
      ? buildSchema(graphQLSchema)
      : graphQLSchema;
  const selectorSchema = convertsTypesSchemaToSelectorSchema(
    graphQLCompiledSchema,
  );
  const normalizrModel = graphQLizr(graphQLCompiledSchema);
  const recordsModel = graphQLRecordr(graphQLCompiledSchema);
  const actions = configureActions();
  const middleware = configureMiddleware(
    graphQLCompiledSchema,
    actions,
    normalizrModel,
    context,
  );
  const reducer = configureReducer(
    normalizrModel.entities,
    recordsModel,
    graphQLCompiledSchema,
  );
  const GraphQLConnecter = configureConnecter({ selectorSchema });
  return {
    actions,
    middleware,
    reducer,
    normalizrModel,
    recordsModel,
    selectorSchema,
    GraphQLConnecter,
  };
}
