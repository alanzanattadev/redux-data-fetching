"use babel";
// @flow

import { fromJS, Map, List, Set, Record } from "immutable";
import { normalize, schema } from "normalizr";
import {
  graphQLizr,
  convertsNormalizedEntitiesToRecords,
  convertsGraphQLResultToRootEntitiesIDs,
} from "./graphqlTypesConverters";
import type { GraphQLSchema as GraphQLSchemaType } from "graphql";

export const QUERY_PROGRESS_NOT_STARTED = "not started";
export const QUERY_PROGRESS_PENDING = "pending";
export const QUERY_PROGRESS_SUCCEED = "succeed";
export const QUERY_PROGRESS_FAILED = "failed";

export const ResultsRecord = Record({
  raw: null,
  byQuery: Map(),
  byEntity: Map(),
});
export const QueryRecord = Record({
  results: new ResultsRecord(),
  progress: QUERY_PROGRESS_NOT_STARTED,
});
export const DataReducerRecord = Record({
  entities: Map(),
  queries: Map(),
});

export default function configureReducer(
  normalizrTypes: { [typeName: string]: schema.Entity },
  recordsTypes: { [typeName: string]: Record<*> },
  graphQLSchema: GraphQLSchemaType,
) {
  function warnBadIDRequest(type: string, supposedId: mixed): void {
    console.warn(
      "You're trying to delete a key of bad type for type",
      type,
      ":",
      supposedId,
      ".Keys must be of type number, string or identified object eg: {id: 'key'}. Aborting request",
    );
  }

  function getID(data: string | number | { id: string }): ?string {
    if (typeof data === "string") return data;
    else if (typeof data === "number") return data.toString();
    else if (typeof data === "object" && data !== null) {
      return getID(data.id);
    } else {
      return null;
    }
  }

  return function reducer(
    state: DataReducerRecord = new DataReducerRecord(),
    action: { type: string, payload: Object },
  ) {
    switch (action.type) {
      case "DATA_RECEIVED":
        const normalizrModel = Object.keys(
          action.payload.entities,
        ).reduce((red, key) => {
          const type = normalizrTypes[key];
          if (type === undefined)
            throw new Error(
              "You can't normalize a type which is not an Entity. An Entity is a type with an id attribut. You may have defined a GraphQL root query type with a route that has a type without any id.",
            );
          return Object.assign({}, red, {
            [key]:
              typeof action.payload.entities[key] == "object" &&
              Array.isArray(action.payload.entities[key])
                ? [type]
                : type,
          });
        }, {});
        const normalized = normalize(
          JSON.parse(JSON.stringify(action.payload.entities)),
          normalizrModel,
        );
        return state
          .update("entities", entities =>
            entities.mergeDeepWith(
              (a, b) => (b === undefined ? a : b),
              convertsNormalizedEntitiesToRecords(
                normalized.entities,
                recordsTypes,
                graphQLSchema,
              ),
            ),
          )
          .update(
            "queries",
            queries =>
              action.payload.query
                ? queries.set(
                    action.payload.query.request.hash.toString(),
                    new QueryRecord({
                      results: new ResultsRecord({
                        raw: action.payload.query.response.raw,
                        byQuery: convertsGraphQLResultToRootEntitiesIDs(
                          action.payload.query.response.raw,
                        ),
                      }),
                      progress: QUERY_PROGRESS_SUCCEED,
                    }),
                  )
                : queries,
          );
      case "DATA_REMOVED":
        return Object.keys(action.payload).reduce((red, key: string) => {
          if (
            typeof action.payload[key] == "object" &&
            Array.isArray(action.payload[key])
          ) {
            return action.payload[key].reduce((reduction, value) => {
              const id = getID(value);
              if (id == null) {
                warnBadIDRequest(key, value);
                return reduction;
              } else {
                return reduction.deleteIn(["entities", key, id]);
              }
            }, red);
          } else {
            const id = getID(action.payload[key]);
            if (id == null) {
              warnBadIDRequest(key, action.payload[key]);
              return red;
            } else {
              // $FlowFixMe
              return red.deleteIn(["entities", key, id]);
            }
          }
        }, state);
      case "QUERY_STARTED":
        return state.update("queries", queries =>
          queries.update(
            action.payload.query.request.hash.toString(),
            (query = new QueryRecord()) =>
              query.set("progress", QUERY_PROGRESS_PENDING),
          ),
        );
      case "QUERY_FAILED":
        return state.update("queries", queries =>
          queries.update(action.payload.query.request.hash.toString(), query =>
            query.set("progress", QUERY_PROGRESS_FAILED),
          ),
        );
      case "QUERY_CACHE_BUSTED":
        return state.update("queries", queries =>
          queries.remove(action.payload.queryID.toString()),
        );
      default:
        return state;
    }
  };
}
