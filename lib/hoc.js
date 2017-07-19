"use babel";
// @flow

import React from "react";
import { graphql, GraphQLSchema } from "graphql";
import { fromJS } from "immutable";
import { hashString } from "./utils";

type Props = Object;

type State = {
  selectedData: ?Object,
};

export default function configureConnecter(
  {
    selectorSchema,
    reducerName = "data",
  }: {
    selectorSchema: GraphQLSchema,
    reducerName?: string,
  } = {},
) {
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
          if (query === "{}" || query === "{ }") {
            this.warnAgainstEmptyQuery();
          } else if (query != null) {
            graphql(selectorSchema, query, null, {
              db: this.props[reducerName],
              queryHash: hashString(query),
            }).then(result => {
              if (result.errors !== undefined) {
                console.error(
                  "GraphQLConnecter: Impossible to select data. needs:",
                  query,
                  "errors:",
                  result.errors,
                );
              } else {
                this.setState(state => ({ selectedData: result.data }));
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
              refetch={() => this.getNeeds()}
            />
          );
        }
      };
    };
  };
}
