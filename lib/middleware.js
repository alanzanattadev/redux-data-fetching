// @flow

import type { Middleware, MiddlewareAPI } from "redux";
import type { GraphQLSchema } from "graphql";
import { hashString, hashMutationQuery } from "./utils";
import { graphql } from "graphql";
import { getDataFromResponse } from "./graphqlTypesConverters";
import Mutation from "./Mutation";
import Query from "./Query";

export default function(
  schema: GraphQLSchema,
  actions: { [actionName: string]: (...params: any) => Object },
  normalizrModel: any,
  context?: any,
  rootValue?: any,
): Middleware<any, any> {
  return (store: MiddlewareAPI<any, any>) => (
    next: (action: Object) => void,
  ) => (action: Object) => {
    if (
      (action.type === "GRAPHQL_FETCH" || action.type === "GRAPHQL_MUTATION") &&
      action.graphql
    ) {
      if (action.type === "GRAPHQL_FETCH") {
        const query =
          action.payload instanceof Query
            ? action.payload.queryQL
            : action.payload;
        const hash = hashString(query);
        const request = {
          ql: query,
          hash,
        };

        store.dispatch(actions.queryStarted({ request }));
        const variableValues =
          action.payload instanceof Query ? action.payload.variables : {};
        const operationName =
          action.payload instanceof Query
            ? action.payload.operationName
            : undefined;
        graphql(
          schema,
          query,
          rootValue,
          {
            store,
            dependencies: context,
          },
          variableValues,
          operationName,
        ).then(result => {
          if (result.errors === undefined && result.data) {
            store.dispatch(
              actions.packageData(
                getDataFromResponse(normalizrModel.converters, result.data),
                {
                  request,
                  response: {
                    raw: result.data,
                  },
                },
              ),
            );
          } else {
            console.error(
              "GraphQL query",
              query,
              "has failed.\n",
              "errors:",
              result.errors,
            );
            store.dispatch(actions.queryFailed({ request }, result.errors));
          }
        });
      } else {
        const mutation: Mutation = action.payload.mutation;
        const hash = action.payload.queryID;
        const request = {
          ql: mutation.mutationQL,
          hash,
        };
        store.dispatch(actions.queryStarted({ request }));
        graphql(
          schema,
          mutation.mutationQL,
          rootValue,
          {
            store,
            dependencies: context,
          },
          mutation.variables,
          mutation.operationName,
        ).then(result => {
          if (result.errors === undefined && result.data) {
            store.dispatch(
              actions.packageData(
                getDataFromResponse(normalizrModel.converters, result.data),
                {
                  request,
                  response: {
                    raw: result.data,
                  },
                },
              ),
            );
            mutation.onCompleted();
          } else {
            console.error(
              "GraphQL mutation",
              mutation.mutationQL,
              "has failed.\n",
              "errors:",
              result.errors,
            );
            store.dispatch(actions.queryFailed({ request }, result.errors));
            mutation.onError();
          }
        });
      }
    } else {
      return next(action);
    }
  };
}
