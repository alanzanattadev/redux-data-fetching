import React from 'react';
import Connecter from '../lib/graphql-data-connecter';
import TestUtils from 'react-addons-test-utils';
import {fromJS} from 'immutable';

describe('connecter', () => {
  it('should fetch data on mount and display', () => {
    let dispatch = jest.fn();
    let data = {};
    let renderer = TestUtils.createRenderer();
    let Child = ({name}) => (<h1>{name}</h1>)
    renderer.render((
      <Connecter dispatch={dispatch} data={data} needs='user{name}' mapCacheToProps={(data) => ({name: fromJS(data).getIn(["user", "name"])})}>
        <Child/>
      </Connecter>
    ));
    let result = renderer.getRenderOutput();
    expect(result.props.name).toBe(undefined);
    expect(result.props.data).toBe(undefined);
    renderer._instance._instance.componentDidMount();
    expect(dispatch.mock.calls.length).toBe(1);
    expect(dispatch.mock.calls[0]).toEqual([{type: "GRAPHQL_FETCH", graphql:true, payload: "user{name}"}]);
    data = {
      user: {name: "Alan"}
    }
    renderer.render((
      <Connecter dispatch={dispatch} data={data} needs='user{name}' mapCacheToProps={(data) => ({name: fromJS(data).getIn(["user", "name"])})}>
        <Child/>
      </Connecter>
    ));
    result = renderer.getRenderOutput();
    expect(result.props.name).toBe("Alan");
  });
});
