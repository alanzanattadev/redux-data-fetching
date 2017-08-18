"use babel";
// @flow

import React from "react";
import { graphql, GraphQLSchema, getNamedType } from "graphql";
import { fromJS, List } from "immutable";
import { convertsGraphQLResultToRecords } from "./graphqlTypesConverters";
import {
  hashString,
  selectedDataHaveChanged,
  hashMutationQuery,
  generateUUID,
} from "./utils";
import { QUERY_PROGRESS_NOT_STARTED, QueryRecord } from "./reducer";
import type { Record } from "immutable";
import Mutation from "./Mutation";

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
    actions,
  }: {
    typesSchema: GraphQLSchema,
    selectorSchema: GraphQLSchema,
    recordTypes: { [typeName: string]: Record<any> },
    reducerName?: string,
    actions: { [actionName: string]: (...params: Array<any>) => Object },
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

  function DataHandlers({
    mapMutationsToProps,
  }: {
    mapMutationsToProps: (
      props: Props,
    ) => {
      [propName: string]: (...Array<mixed>) => Mutation,
    },
  }) {
    return function DataHandlersHOC(
      Comp: Class<React.Component<any, any, any>>,
    ): Class<React.Component<any, any, any>> {
      return class DataHandlersContainer extends React.Component<
        any,
        any,
        any,
      > {
        id: string;
        bustQueryCache: (handlerName: string) => void;

        constructor(props) {
          super(props);

          this.id = props.__uniqueID || generateUUID();
          this.bustQueryCache = this.bustQueryCache.bind(this);
        }

        getReducer(props) {
          return props[reducerName];
        }
        getLinkedQueries(props) {
          const reducer = this.getReducer(props);
          const queries = reducer.queries;
          const mutationsProps = mapMutationsToProps(props);
          const names = Object.keys(mutationsProps);
          const linkedQueries = names.map(name => ({
            name,
            query: queries.get(hashMutationQuery(name, this.id).toString()),
          }));
          return linkedQueries;
        }

        getLinkedQueryStates(props) {
          const linkedQueries = this.getLinkedQueries(
            props,
          ).reduce((red, infos) => {
            const propName = `${infos.name}QueryProgress`;
            return {
              ...red,
              [propName]: infos.query
                ? infos.query.progress
                : QUERY_PROGRESS_NOT_STARTED,
            };
          }, {});
          return linkedQueries;
        }

        componentWillUnmount() {
          this.getLinkedQueries(this.props).forEach(info => {
            this.bustQueryCache(info.name);
          });
        }

        bustQueryCache(handlerName: string) {
          this.props.dispatch(
            actions.bustQueryCache(hashMutationQuery(handlerName, this.id)),
          );
        }

        render() {
          const reducer = this.getReducer(this.props);
          if (!reducer)
            throw new Error(
              `DataHandlers must get the cache reducer as a props named '${reducerName}'`,
            );

          if (!this.props.dispatch)
            throw new Error(
              "DataHandlers must get the dispatch function as props",
            );

          const mutationsMap = mapMutationsToProps(this.props);
          const handlers = Object.keys(mutationsMap).reduce((red, key) => {
            if (typeof mutationsMap[key] !== "function") {
              throw new Error(
                `You must pass a function as handler of mapMutationsToProps, handler ${key} isn't a function`,
              );
            }
            return {
              ...red,
              [key]: (...args) => {
                const mutation = mutationsMap[key](...args);
                if (mutation instanceof Mutation) {
                  const action = actions.mutateData(
                    mutation,
                    hashMutationQuery(key, this.id),
                  );
                  this.props.dispatch(action);
                } else if (mutation) {
                  console.error(
                    "You have to return a Mutation from the handler defined in mapMutationsToProps,",
                    key,
                    "handler doesn't return a Mutation.",
                  );
                } else {
                  return;
                }
              },
            };
          }, {});
          const queries = this.getLinkedQueryStates(this.props);
          return (
            <Comp
              {...this.props}
              {...handlers}
              {...queries}
              bustQueryCache={this.bustQueryCache}
            />
          );
        }
      };
    };
  }

  function DataFetcher({
    mapPropsToNeeds,
    mapCacheToProps = () => ({}),
    shouldRefetch = () => false,
    queryProgressPropName = "queryProgress",
  }: {
    mapPropsToNeeds: (props: Props) => string,
    mapCacheToProps?: (
      cache: any,
      props: Props,
      selectedData: Object,
    ) => Object,
    shouldRefetch?: (props: Props, prevProps: Props) => boolean,
    queryProgressPropName?: string,
  }) {
    return GraphQLConnecter(mapPropsToNeeds, mapCacheToProps, shouldRefetch, {
      queryProgressPropName,
    });
  }

  function GraphQLConnecter(
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
          const hash =
            currentNeeds != null ? hashString(currentNeeds).toString() : null;
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
            this.resetSelection();
          } else if (query != null) {
            const hash = hashString(query).toString();
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
          } else {
            this.resetSelection();
          }
        }

        resetSelection() {
          this.setState(state => ({ selectedData: {} }));
        }

        getNeeds() {
          const needs = mapPropsToNeeds(this.props);
          if (needs === "{}" || needs === "{ }") {
            this.warnAgainstEmptyQuery();
          } else if (needs != null) {
            this.props.dispatch(actions.fetchData(needs));
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
                  ["queries", hashString(needs).toString(), "progress"],
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
  }
  return { GraphQLConnecter, DataHandlers, DataFetcher };
}
