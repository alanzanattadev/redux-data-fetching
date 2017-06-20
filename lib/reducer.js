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
  function warnBadIDRequest(type: string, supposedId: any): void {
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
    state: Map<*, *> = Map().set("entities", Map()).set("result", Map()),
    action: Object,
  ) {
    switch (action.type) {
      case "DATA_RECEIVED":
        const normalizrModel = Object.keys(
          action.payload,
        ).reduce((red, key) => {
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
        }, {});
        const normalized = normalize(
          JSON.parse(JSON.stringify(action.payload)),
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
                    .map(v => v.toString()),
                ),
              state.get("result"),
            ),
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
              return red.deleteIn(["entities", key, id]);
            }
          }
        }, state);
      default:
        return state;
    }
  };
}
