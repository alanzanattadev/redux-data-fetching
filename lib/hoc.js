"use babel";
// @flow

import React from "react";
import { graphql, GraphQLSchema } from "graphql";
import { fromJS } from "immutable";
import { convertsGraphQLResultToRecords } from "./graphqlTypesConverters";
import { hashString } from "./utils";
import { QUERY_PROGRESS_NOT_STARTED } from "./reducer";
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
          this.selectData();
        }

        componentWillReceiveProps(nextProps: Props) {
          if (
            mapPropsToNeeds(nextProps) != mapPropsToNeeds(this.props) ||
            nextProps[reducerName] !== this.props[reducerName]
          ) {
            this.selectData();
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

        selectData() {
          const query = mapPropsToNeeds(this.props);
          const hash = hashString(query);
          const reducer = this.props[reducerName];
          if (query === "{}" || query === "{ }") {
            this.warnAgainstEmptyQuery();
          } else if (query != null) {
            if (this.props.__debug) {
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
                if (this.props.__debug) {
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
                const reducerChanged = this.props[reducerName] !== reducer;
                if (this.props.__debug) {
                  console.log(
                    "CONVERTED data",
                    result.data,
                    "into",
                    convertedData,
                    "for hash",
                    "with reducer",
                    reducer,
                    reducerChanged ? "but reducer has changed to" : "",
                    reducerChanged ? this.props[reducerName] : "",
                    reducerChanged ? "relaunching selection" : "",
                  );
                }
                if (reducerChanged) {
                  this.selectData();
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
          if (!this.props[reducerName])
            throw new Error(
              `GraphQLConnecter must get the cache reducer as a props named '${reducerName}'`,
            );
          if (!this.props.dispatch)
            throw new Error(
              "GraphQLConnecter must get the dispatch function as props",
            );
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
                [queryProgressPropName]: this.props[reducerName].getIn(
                  [
                    "queries",
                    hashString(mapPropsToNeeds(this.props)),
                    "progress",
                  ],
                  QUERY_PROGRESS_NOT_STARTED,
                ),
              }}
              refetch={() => this.getNeeds()}
            />
          );
        }
      };
    };
  };
}
