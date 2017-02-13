'use babel'
// @flow

import React from 'react';
import { fromJS } from "immutable";

export default function GraphQLConnecter(mapPropsToNeeds: (props: any) => string, mapCacheToProps: (cache: any, props: any) => any, shouldRefetch: (props: any, prevProps: any) => boolean = () => false) {
  return function(WrappedComponent: React.Component<any, any, any>): React.Component<any, any, any> {
    return class GraphQLContainer extends React.Component<any, any, any> {
      componentDidMount() {
        this.getNeeds();
      }

      componentDidUpdate(prevProps, prevState) {
        if (mapPropsToNeeds(this.props) != mapPropsToNeeds(prevProps) || shouldRefetch(this.props, prevProps)) {
          this.getNeeds();
        }
      }

      getNeeds() {
        this.props.dispatch({
          type: "GRAPHQL_FETCH",
          graphql: true,
          payload: mapPropsToNeeds(this.props)
        });
      }

      render() {
        if (!this.props.data)
          throw new Error("GraphQLConnecter must get the cache reducer as a props named 'data'");
        if (!this.props.dispatch)
          throw new Error("GraphQLConnecter must get the dispatch function as props");
        return (
          <WrappedComponent {...this.props} {...mapCacheToProps(this.props.data, this.props)}/>
        )
      }
    }
  }
}
