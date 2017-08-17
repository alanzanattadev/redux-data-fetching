// @flow

import type { Middleware, MiddlewareAPI } from "redux";
import type { GraphQLSchema } from "graphql";
import { hashString, hashMutationQuery } from "./utils";
import { graphql } from "graphql";
import { getDataFromResponse } from "./graphqlTypesConverters";
import Mutation from "./Mutation";

export default function(
  schema: GraphQLSchema,
  actions: { [actionName: string]: (...params: any) => Object },
  normalizrModel: any,
  context: any,
): Middleware<any, any> {
  return (store: MiddlewareAPI<any, any>) => (
    next: (action: Object) => void,
  ) => (action: Object) => {
    if (
      (action.type === "GRAPHQL_FETCH" || action.type === "GRAPHQL_MUTATION") &&
      action.graphql
    ) {
      if (action.type === "GRAPHQL_FETCH") {
        const hash = hashString(action.payload);
        const request = {
          ql: action.payload,
          hash,
        };
        store.dispatch(actions.queryStarted({ request }));
        graphql(schema, action.payload, undefined, {
          store,
          dependencies: context,
        }).then(result => {
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
              action.payload,
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
          undefined,
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
