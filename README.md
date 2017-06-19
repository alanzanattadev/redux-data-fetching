# redux-data-fetching

If you're looking for an alternative to Relay based on Redux and Normalizr you're at the good place. Data managment is hard and painful, this library is a set of utilities (reducer, middleware, actions, selectors) designed to handle entities storage, data merging, auto fetching and GraphQL based selection of data.

My goal is to provide you a flexible way to store data by organizing them by entities.

GraphQL Schema system is powerful enough to be the base schema for convertions.

![Build Status](https://circleci.com/gh/veyo-care/redux-data-fetching.svg?&style=shield&circle-token=bc115cf5f1754f6a3b14c15fe147ed444bd9f872)

## How it works

It converts your GraphQLSchema to a Normalizr one, and merges data for you. You only have to dispatch some actions with the provided action creators, and use the HOC GraphQLConnecter to send data to your components. It will fetch data when needed automatically.

Types are converted to Normalizr entities when "id" attribut exists, else they're not normalized, so your data aren't in a mess. Types are named the same way of your GraphQL Types.

## Install

Install module
```shell

npm install --save alanzanattadev/redux-data-fetching
```

## Use

### Configuration

Create a GraphQL schema
```javascript
import {graphql, GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList} from 'graphql';

let User = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    job: { type: GraphQLString }
  }
})

let Task = new GraphQLObjectType({
  name: "Task",
  fields: {
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    user: { type: User },
  }
})

let graphQLSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      tasks: {
        type: new GraphQLList(Task),
        resolve(ids) {
          let promise = new Promise(
            (resolve, reject) => setTimeout(
              () => resolve([{id: 1, name: "Work", user: null}, {id: 2, name: "Sleep", user: {id: 1, name: 'Alan'}}]),
              3000
            )
          );
          // You can use redux-request-state here to display spinners and others
          store.dispatch({
            type: "REFRESH_TASKS",
            requestID: "tasks.get",
            resolve: () => promise,
          });
          return promise;
        }
      }
    }
  })
});
```

Get the utility set
```javascript
import {configure} from 'redux-data-fetching';

let {reducer, middleware, actions} = configure(graphQLSchema, {somecontext: "ok", api: {}});

createStore(combineReducers({
  data: reducer,
}), {}, compose(
  applyMiddleware([middleware])
));
```

Export actions
```javascript

export default actions;

```

### Manage data

Everything is based on your GraphQL types, so be careful on naming.

#### Actions

Dispatch a packageData action to manually dispatch some data. You have to send them organized by entities but not normalized. It can be an array of entities or simple entities
```javascript

import actions from './store.js';

dispatch(actions.packageData({
  User: [{
    id: 1,
    name: 'Alan',
  }, {
    id: 2,
    name: 'Antoine'
  }],
  Task: {id: 1, name: 'work', user: {
    id: 1,
    name: 'Alan',
    job: 'developer',
  }}
}))
```

Data is automatically normalized and merged. So you'll have
```javascript

let state = {
  entities: {
    User: [{
      id: 1,
      name: 'Alan',
      job: 'developer'
    }, {
      id: 2,
      name: 'Antoine'
    }],
    Task: [{
      id: 1,
      name: 'work',
      user: 1
    }],
  },
  result: {
    User: [1, 2],
    Task: [1]
  }
}

```

Dispatch a removeData action to manually remove some data. You have to tell it the entities ids of entities you want to remove. You can describe it as array of ids or simple id;
```javascript

import actions from './store.js';

dispatch(actions.removeData({
  User: 1,
  Task: [1]
}))

```

#### GraphQLConnecter
GraphQLConnecter is a Higher Order Component which connect a wrapped component to GraphQL, allowing the component to describe its needs and how to send them to the component. It requires the data reducer as prop "data" and the props dispatch from redux. It automatically detects needs change and request data again based on what's already cached and new needs.

```javascript
// React and component imports ...
import {GraphQLConnecter} from 'redux-data-fetching';

let UserCard = connect(state => ({data: state.data}))(GraphQLConnecter(
  (props) => `{
    user(id: "${props.userId}") {
      name,
      job
    }
  }`,
  (cache, props) => ({
    name: cache.users.find(user => user.id == props.userId).name,
    age: cache.users.find(user => user.id == props.userId).age
  })
)(WrappedComponent))

let Page = ( ) => <UserCard userId="8943294"/>
```

params:
  - Function that takes props as parameter and returns a GraphQL request string
  ```javascript

    mapPropsToNeeds(props: any): string
  ```
  - Function that takes the data cache and the props as parameters and returns props passed to the WrappedComponent
  ```javascript

    mapCacheToProps(cache: any, props: any): any
  ```

  - Function called to check whether it should refetch or not based on props change (default: () => false). It will be called only if needs haven't changed
  ```javascript

    shouldRefetch(props: any, prevProps: any): boolean
  ```

Your wrapped component also receive a prop "refetch" that you can call to manually launch a data refresh.