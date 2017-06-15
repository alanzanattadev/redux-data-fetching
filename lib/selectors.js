"use babel";
// @flow

import { parse } from "graphql";
import { fromJS, Map, List } from "immutable";

type ImmutableSelector = Array<string | number | ({ type: string } & Object)>;

function getImmutableSelector(graphQLQuery: string): ImmutableSelector {
  let ast = parse(graphQLQuery);
  let query = ast.definitions[0];
  let rootField = query.selectionSet.selections[0];
  let rootFieldName = rootField.name.value;
  let rootFieldParamID;
  let immutableSelector: ImmutableSelector = [];
  immutableSelector.push(rootFieldName);
  let idArg;
  if (
    rootField.arguments.length > 0 &&
    (idArg = rootField.arguments.find(arg => arg.name.value == "id"))
  ) {
    rootFieldParamID = idArg.value.value;
    immutableSelector.push({ type: "id", value: rootFieldParamID });
  }
  return immutableSelector;
}

function convertIDsToIndex(
  data: Object,
  selector: ImmutableSelector,
): ImmutableSelector {
  return selector
    .reduce(
      (reduction: { rootData: any, newSelector: any }, value: any) => {
        if (
          reduction.newSelector.count() > 0 &&
          reduction.newSelector.last() === null
        )
          return reduction;
        else {
          if (typeof value == "string" || typeof value == "number") {
            return {
              rootData: reduction.rootData.get(value),
              newSelector: reduction.newSelector.push(value),
            };
          } else {
            if (value.type == "id") {
              let selectedIndex = reduction.rootData.findIndex(
                item => item.get("id") == value.value,
              );
              if (selectedIndex == -1) selectedIndex = null;
              return {
                rootData: selectedIndex
                  ? reduction.rootData.get(selectedIndex)
                  : null,
                newSelector: reduction.newSelector.push(selectedIndex),
              };
            } else {
              return reduction;
            }
          }
        }
      },
      { rootData: data, newSelector: List() },
    )
    .newSelector.toJS();
}

export function selectData(data: Object, query: string) {
  let selectorWithIDs = getImmutableSelector(query);
  let selector = convertIDsToIndex(data, selectorWithIDs);
  return Map().set(selectorWithIDs[0], data.getIn(selector, null));
}
