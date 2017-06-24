"use babel";
// @flow

import React from "react";
import { fromJS } from "immutable";

type Props = Object;

export default function GraphQLConnecter(
  mapPropsToNeeds: (props: Props) => string,
  mapCacheToProps: (cache: any, props: Props) => any,
  shouldRefetch: (props: Props, prevProps: Props) => boolean = () => false,
) {
  return function(
    WrappedComponent: Class<React.Component<any, any, any>>,
  ): Class<React.Component<any, any, any>> {
    return class GraphQLContainer extends React.Component<any, Props, any> {
      props: Props;

      componentDidMount() {
        this.getNeeds();
      }

      componentDidUpdate(prevProps: Props) {
        if (
          mapPropsToNeeds(this.props) != mapPropsToNeeds(prevProps) ||
          shouldRefetch(this.props, prevProps)
        ) {
          this.getNeeds();
        }
      }

      getNeeds() {
        this.props.dispatch({
          type: "GRAPHQL_FETCH",
          graphql: true,
          payload: mapPropsToNeeds(this.props),
        });
      }

      render() {
        if (!this.props.data)
          throw new Error(
            "GraphQLConnecter must get the cache reducer as a props named 'data'",
          );
        if (!this.props.dispatch)
          throw new Error(
            "GraphQLConnecter must get the dispatch function as props",
          );
        return (
          <WrappedComponent
            {...this.props}
            {...mapCacheToProps(this.props.data, this.props)}
            refetch={() => this.getNeeds()}
          />
        );
      }
    };
  };
}
