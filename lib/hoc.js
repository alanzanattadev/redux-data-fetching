"use babel";
// @flow

import React from "react";
import { graphql, GraphQLSchema, getNamedType } from "graphql";
import { fromJS, List } from "immutable";
import { convertsGraphQLResultToRecords } from "./graphqlTypesConverters";
import { hashString, selectedDataHaveChanged } from "./utils";
import { QUERY_PROGRESS_NOT_STARTED, QueryRecord } from "./reducer";
import type { Record } from "immutable";

type Props = Object;

type State = {
  selectedData: ?Object,
};

export default function configureConnecter(
  {
    typesSchema,
    selectorSchema,
    recordTypes,
    reducerName = "data",
  }: {
    typesSchema: GraphQLSchema,
    selectorSchema: GraphQLSchema,
    recordTypes: { [typeName: string]: Record<any> },
    reducerName?: string,
  } = {},
) {
  if (typesSchema === undefined) {
    throw new Error(
      "You have to define a type schema, type schema is currently " +
        typesSchema,
    );
  }
  if (selectorSchema === undefined) {
    throw new Error(
      "You have to define a selector schema, selector schema is currently " +
        selectorSchema,
    );
  }
  return function GraphQLConnecter(
    mapPropsToNeeds: (props: Props) => string,
    mapCacheToProps: (
      cache: any,
      props: Props,
      selectedData: Object,
    ) => any = () => ({}),
    shouldRefetch: (props: Props, prevProps: Props) => boolean = () => false,
    {
      queryProgressPropName = "queryProgress",
    }: { queryProgressPropName?: string } = {},
  ) {
    return function(
      WrappedComponent: Class<React.Component<any, any, any>>,
    ): Class<React.Component<any, any, any>> {
      return class GraphQLContainer extends React.Component<any, Props, any> {
        props: Props;

        constructor(props) {
          super(props);

          this.state = {
            selectedData: {},
          };
        }

        componentDidMount() {
          this.getNeeds();
          this.selectData(this.props);
        }

        getReducer(props) {
          return props[reducerName];
        }

        mustReselectData(props, nextProps) {
          const currentReducer = this.getReducer(props);
          const nextReducer = this.getReducer(nextProps);
          const currentNeeds = mapPropsToNeeds(props);
          const nextNeeds = mapPropsToNeeds(nextProps);
          if (nextNeeds !== currentNeeds) return true;
          const hash = currentNeeds != null ? hashString(currentNeeds) : null;
          if (hash != null) {
            const nextQuery = nextReducer.getIn(["queries", hash]);
            const currentQuery = currentReducer.getIn(["queries", hash]);
            if (nextQuery !== currentQuery) return true;
            else if (nextReducer.entities !== currentReducer.entities) {
              return selectedDataHaveChanged({
                schema: typesSchema,
                query: currentNeeds,
                queryHash: hash,
                reducer1: currentReducer,
                reducer2: nextReducer,
              });
            } else {
              return false;
            }
          } else {
            return false;
          }
        }

        componentWillReceiveProps(nextProps: Props) {
          if (this.mustReselectData(this.props, nextProps)) {
            this.selectData(nextProps);
          }
        }

        componentDidUpdate(prevProps: Props) {
          if (
            mapPropsToNeeds(this.props) != mapPropsToNeeds(prevProps) ||
            shouldRefetch(this.props, prevProps)
          ) {
            this.getNeeds();
          }
        }

        warnAgainstEmptyQuery() {
          console.warn(
            "You have defined as needs {}, which is a wrong graphql query. If you want to avoid fetching, return null instead",
          );
        }

        selectData(props: Object) {
          const query = mapPropsToNeeds(props);
          const reducer = this.getReducer(props);
          if (query === "{}" || query === "{ }") {
            this.warnAgainstEmptyQuery();
          } else if (query != null) {
            const hash = hashString(query);
            if (props.__debug) {
              console.log(
                "SELECTING data for hash",
                hash,
                " -- date:",
                Date.now(),
              );
            }
            graphql(selectorSchema, query, null, {
              db: reducer,
              queryHash: hash,
            }).then(result => {
              if (result.errors !== undefined || result.data == null) {
                console.error(
                  "GraphQLConnecter: Impossible to select data. needs:",
                  query,
                  "errors:",
                  result.errors,
                );
              } else {
                if (props.__debug) {
                  console.log(
                    "SELECTED data",
                    result.data,
                    "for hash",
                    hash,
                    "with reducer",
                    reducer,
                    " -- date:",
                    Date.now(),
                  );
                }
                const convertedData = convertsGraphQLResultToRecords(
                  result.data,
                  typesSchema,
                  recordTypes,
                );
                const reducerChanged = this.getReducer(props) !== reducer;
                if (props.__debug) {
                  console.log(
                    "CONVERTED data",
                    result.data,
                    "into",
                    convertedData,
                    "for hash",
                    "with reducer",
                    reducer,
                    reducerChanged ? "but reducer has changed to" : "",
                    reducerChanged ? this.getReducer(props) : "",
                    reducerChanged ? "relaunching selection" : "",
                  );
                }
                if (reducerChanged) {
                  this.selectData(props);
                } else {
                  this.setState(state => ({ selectedData: convertedData }));
                }
              }
            });
          }
        }

        getNeeds() {
          const needs = mapPropsToNeeds(this.props);
          if (needs === "{}" || needs === "{ }") {
            this.warnAgainstEmptyQuery();
          } else if (needs != null) {
            this.props.dispatch({
              type: "GRAPHQL_FETCH",
              graphql: true,
              payload: needs,
            });
          }
        }

        render() {
          const reducer = this.getReducer(this.props);
          if (!reducer)
            throw new Error(
              `GraphQLConnecter must get the cache reducer as a props named '${reducerName}'`,
            );
          if (!this.props.dispatch)
            throw new Error(
              "GraphQLConnecter must get the dispatch function as props",
            );
          const needs = mapPropsToNeeds(this.props);
          const queryProgress =
            needs !== null
              ? reducer.getIn(
                  ["queries", hashString(needs), "progress"],
                  QUERY_PROGRESS_NOT_STARTED,
                )
              : QUERY_PROGRESS_NOT_STARTED;
          return (
            <WrappedComponent
              {...this.props}
              {...this.state.selectedData}
              {...mapCacheToProps(
                this.props.data,
                this.props,
                this.state.selectedData,
              )}
              {...{
                [queryProgressPropName]: queryProgress,
              }}
              refetch={() => this.getNeeds()}
            />
          );
        }
      };
    };
  };
}
