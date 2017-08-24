// @flow

import React from "react";
import { graphql } from "graphql";
import type { GraphQLSchema } from "graphql";
import Mutation from "./Mutation";
import { compose, withPropsOnChange, lifecycle } from "recompose";
import { DataReducerRecord } from "./reducer";

function configureProxies(
  {
    schema,
    rootValue,
    contextValue,
  }: {
    schema: GraphQLSchema,
    rootValue?: { [key: string]: (...params: any) => any },
    contextValue?: any,
  } = {},
) {
  return {
    configureDispatchProxy(
      {
        dispatch = () => {},
        onError = () => {},
        onSuccess = () => {},
        onResolve = () => {},
      }: {
        dispatch?: (action: Object) => void,
        onError?: (errors: Array<Object>) => void,
        onSuccess?: (data: Object) => void,
        onResolve?: (promise: Promise<any>) => void,
      } = {},
    ) {
      return function dispatchProxy(action) {
        if (action.type === "GRAPHQL_MUTATION") {
          const promise = graphql(
            schema,
            action.payload.mutation.mutationQL,
            rootValue,
            contextValue,
            action.payload.mutation.variables,
          );
          onResolve(promise);
          promise.then(result => {
            if (result.errors && result.errors.length > 0) {
              onError(result.errors);
            } else {
              dispatch(action);
              onSuccess(result.data);
            }
          });
        } else if (action.type === "GRAPHQL_FETCH") {
          const promise = graphql(
            schema,
            action.payload,
            rootValue,
            contextValue,
          );
          onResolve(promise);
          promise.then(result => {
            if (result.errors && result.errors.length > 0) {
              onError(result.errors);
            } else {
              dispatch(action);
              onSuccess(result.data);
            }
          });
        } else {
          dispatch(action);
        }
      };
    },
  };
}

const MockView = compose(
  lifecycle({
    componentDidMount() {
      if (typeof this.props.onMount === "function") {
        this.props.onMount(this.props);
      }
    },

    componentWillReceiveProps(nextProps) {
      if (typeof this.props.onPropChange === "function") {
        if (Array.isArray(this.props.watchedProps)) {
          const changed = this.props.watchedProps.reduce((red, prop) => {
            if (red === true) {
              return red;
            } else {
              return this.props[prop] !== nextProps[prop];
            }
          }, false);
          if (changed) {
            this.props.onPropChange(nextProps, this.props);
          }
        } else if (typeof this.props.watchedProps === "string") {
          if (
            nextProps[this.props.watchedProps] !==
            this.props[this.props.watchedProps]
          ) {
            this.props.onPropChange(nextProps, this.props);
          }
        } else {
          throw new Error(
            "No watch configured. Add watchedProps prop to your TestLab to determine which prop to observe for change",
          );
        }
      }
    },
  }),
)(function MockViewElement() {
  return null;
});

export function createTestLab(
  TestedHOC: (
    comp: Class<React.Component<any, any, any>>,
  ) => Class<React.Component<any, any, any>>,
  {
    reducerName = "data",
    schema,
  }: { reducerName?: string, schema: GraphQLSchema } = {},
): Class<React.Component<any, any, any>> {
  if (schema == null) {
    throw new Error(
      "You have to give your graphql schema to the lab. createTestLab(HOC, { schema: YOUR-SCHEMA })",
    );
  }
  const Subject = TestedHOC(MockView);
  const proxies = configureProxies({ schema });
  const DataLab = compose(
    withPropsOnChange(
      ["dispatch"],
      ({ dispatch, onResolve, onSuccess, onError }) => ({
        dispatch: proxies.configureDispatchProxy({
          dispatch,
          onResolve,
          onSuccess,
          onError,
        }),
        [reducerName]: new DataReducerRecord(),
      }),
    ),
  );
  const SupervisedSubject = compose(DataLab)(Subject);
  return SupervisedSubject;
}
