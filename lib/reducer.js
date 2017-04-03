"use babel";
// @flow

import { fromJS, Map, List, Set } from "immutable";
import { normalize } from "normalizr";
import {
  graphQLizr,
  convertsNormalizedEntitiesToRecords,
} from "./graphqlTypesConverters";
import _ from "lodash";

export default function configureReducer(
  normalizrTypes,
  recordsTypes,
  graphQLSchema,
) {
  return function reducer(
    state = Map().set("entities", Map()).set("result", Map()),
    action,
  ) {
    switch (action.type) {
      case "DATA_RECEIVED":
        const normalizrModel = Object.keys(action.payload).reduce(
          (red, key) => {
            const type = normalizrTypes[key];
            if (type === undefined)
              throw new Error(
                "You can't normalize a type which is not an Entity. An Entity is a type with an id attribut. You may have defined a GraphQL root query type with a route that has a type without any id.",
              );
            return Object.assign({}, red, {
              [key]: typeof action.payload[key] == "object" &&
                Array.isArray(action.payload[key])
                ? [type]
                : type,
            });
          },
          {},
        );
        const normalized = normalize(
          JSON.parse(JSON.stringify(action.payload)),
          normalizrModel,
        );
        return state
          .update("entities", entities =>
            entities.mergeDeepWith(
              (a, b) => b === undefined ? a : b,
              convertsNormalizedEntitiesToRecords(
                normalized.entities,
                recordsTypes,
                graphQLSchema,
              ),
            ))
          .update("result", result =>
            Object.keys(normalized.result).reduce(
              (red, key) =>
                red.update(key, Set(), v =>
                  v
                    .concat(
                      typeof normalized.result[key] == "object" &&
                        Array.isArray(normalized.result[key])
                        ? List(normalized.result[key]).filter(v => v != null)
                        : List.of(normalized.result[key]).filter(
                            v => v != null,
                          ),
                    )
                    .map(v => v.toString())),
              state.get("result"),
            ));
      case "DATA_REMOVED":
        return Object.keys(action.payload).reduce(
          (red, key) =>
            typeof action.payload[key] == "object" &&
              Array.isArray(action.payload[key])
              ? action.payload[key].reduce(
                  (reduction, value) =>
                    reduction.deleteIn(["entities", key, value.toString()]),
                  red,
                )
              : red.deleteIn(["entities", key, action.payload[key].toString()]),
          state,
        );
      default:
        return state;
    }
  };
}
