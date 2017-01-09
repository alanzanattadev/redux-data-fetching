'use babel'
// @flow

import React from 'react';
import { fromJS } from "immutable";

export default function GraphQLConnecter(mapPropsToNeeds: (props: any) => string, mapCacheToProps: (cache: any, props: any) => any) {
  return function(WrappedComponent: React.Component<any, any, any>): React.Component<any, any, any> {
    return class GraphQLContainer extends React.Component<any, any, any> {
      componentDidMount() {
        this.getNeeds();
      }

      componentDidUpdate(prevProps, prevState) {
        if (prevProps.needs != this.props.needs || mapPropsToNeeds(this.props) != mapPropsToNeeds(prevProps)) {
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
        return (
          <WrappedComponent {
            ...fromJS(mapCacheToProps(this.props.data, this.props))
              .merge(
                fromJS(this.props)
                .remove('data')
                .remove('needs')
                .remove('mapCacheToProps')
                .remove('mapPropsToNeeds')
                .remove('children')
              )
              .toJS()
          }/>
        )
      }
    }
  }
}
