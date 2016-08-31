import React from 'react';
import {fromJS} from 'immutable';

export default class Connecter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentDidMount() {
    this.getNeeds();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.needs != this.props.needs) {
      this.getNeeds();
    }
  }

  getNeeds() {
    this.props.dispatch({
      type: "GRAPHQL_FETCH",
      graphql: true,
      payload: this.props.needs
    });
  }

  render() {
    return React.cloneElement(
      this.props.children,
      fromJS(this.props.mapCacheToProps(this.props.data))
        .merge(
          fromJS(this.props)
            .remove('data')
            .remove('needs')
            .remove('mapCacheToProps')
            .remove('children')
        )
        .toJS()
    );
  }
}

Connecter.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  data: React.PropTypes.object.isRequired,
  needs: React.PropTypes.string.isRequired,
  mapCacheToProps: React.PropTypes.func.isRequired,
};

Connecter.defaultProps = {
  mapCacheToProps: (data) => ({data}),
};
