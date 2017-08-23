# redux-data-fetching

If you're looking for an alternative to Relay based on Redux you're at the good place. Data management is hard and painful, this library is a complete infrastructure designed to handle entities storage, data merging, auto fetching and GraphQL based selection of data. It also supports mutations and query progress.

My goal is to provide you a flexible way to store data by organizing them by entities by leveraging the GraphQL type system to link different libraries together: Normalizr, ImmutableJS, Redux and GraphQL.

![Build Status](https://circleci.com/gh/veyo-care/redux-data-fetching.svg?&style=shield&circle-token=bc115cf5f1754f6a3b14c15fe147ed444bd9f872)

## How it works

You have a set of Higher Order Components, to either fetch or mutate data. This library takes your GraphQL Schema and converts types to others libraries schemas (ImmutableJS Records, Normalizr Schema, etc...). Then you wrap your component with the DataFetcher and ask in GraphQL what you need. It automatically fetches data, normalizes it, converts it to Records and selects it in the cache. It sends you the query progress as prop and when data is fetched, what you asked, in the exact shape you asked. To update data you'll have to associate Mutation objects to handlers, will be explained in this documentation.

## Install

Install module
```shell

npm install --save alanzanattadev/redux-data-fetching
```

## Use

### Configuration

Create a GraphQL schema
```javascript
import { buildSchema } from "graphql";

const graphQLSchema = buildSchema(`
  type Query {
    user(id: String!): User,
    users(): [User],
  }
  
  type User {
    id: String!,
    name: String,
    friends: [User!],
  }
`);

```

Get the utility set
```javascript
import {configure} from 'redux-data-fetching';

const rootValue = {
  user: ({id}) => api.getUser(id),
  users: () => api.getUsers()
};

let {reducer, middleware, actions, DataFetcher, DataHandlers} = configure(graphQLSchema, {somecontext: "ok", api: {}}, rootValue);

createStore(combineReducers({
  data: reducer,
}), {}, compose(
  applyMiddleware([middleware])
));
```

Export actions and HOCs
```javascript

export { actions, DataFetcher, DataHandlers };

```

### Manage data

Everything is based on your GraphQL types, so be careful on naming.

#### DataFetcher

DataFetcher is the HOC (Higher Order Component) used for fetching data as its name indicates. It is responsible for getting what you asked, and sending it to you as props. To provide a good user experience, you probably want to display some spinners / loaders while data is loading, and this HOC will send you what you need also for that. If you need to force a refetch, the HOC sends you a prop "refetch" which is a function that you can call without arguments.

This is an example of usage:

```javascript
  import { connect } from "react-redux";
  import {
    QUERY_PROGRESS_NOT_STARTED,
    QUERY_PROGRESS_PENDING,
    QUERY_PROGRESS_FAILED,
    QUERY_PROGRESS_SUCCEED
  } from "redux-data-fetching";
  import { compose } from "recompose";
  import { DataFetcher } from "../utils";
  
  const UserCard = ({user, queryProgress, refetch}) => {
    if (queryProgress === QUERY_PROGRESS_PENDING) {
      return <Spinner/>
    } else if (queryProgress === QUERY_PROGRESS_FAILED) {
      return <Error>No network</Error>
    } else if (queryProgress === QUERY_PROGRESS_NOT_STARTED) {
      return <Blank/>
    } else if (queryProgress === QUERY_PROGRESS_SUCCEED) {
      return (
        <div>
          User {user.id} has name {user.name} and his first friend is {user.friends[0].name}
          <button onClick={refetch}/>
        </div>
      );
    } else {
      return null;
    }
  }
  
  const ConnectedUserCard = compose(
    connect(({data}) => ({
      data
    }), (dispatch) => ({
      dispatch
    })),
    DataFetcher({
      mapPropsToNeeds: (props) => `{
        user (id: "1") {
          id,
          name,
          friends {
            id,
            name
          }
        }
      }`
    })
  )(UserCard);
  
  function App() {
    return (
      <ConnectedUserCard/>
    );
  }
```

DataFetcher can receive:
  - mapPropsToNeeds: (props) => graphQLQueryString. REQUIRED
  - mapCacheToProps: (cache, props, selectedData) => ({newProp: "ok"}).
  - shouldRefetch: (currentProps, prevProps) => boolean. Default false, true causing a force refetch.
  - queryProgressPropName: string. Default "queryProgress".

You have to send the reducer and dispatch as props to DataFetcher.

- [ ] variables
- [ ] aliases
- [ ] fragments
- [ ] directives (Haven't tried, maybe it works).

#### DataHandlers

DataHandlers is the HOC responsible of giving you the capability of updating data through mutations. It lets you define handlers that will return mutations, allowing you to modify data on a form submission or on a button click. Data returned by the mutation is automatically merged with the data in your store.

This is an example of usage:

```javascript

import { connect } from "react-redux";
import {
  QUERY_PROGRESS_NOT_STARTED,
  QUERY_PROGRESS_PENDING,
  QUERY_PROGRESS_FAILED,
  QUERY_PROGRESS_SUCCEED,
  Mutation,
} from "redux-data-fetching";
import { compose } from "recompose";
import { DataHandlers } from "../utils";

const Form = ({onSubmit, onSubmitQueryProgress}) => {
  if (queryProgress === QUERY_PROGRESS_PENDING) {
    return <Spinner/>
  } else if (queryProgress === QUERY_PROGRESS_FAILED) {
    return <Error>No network</Error>
  } else if (queryProgress === QUERY_PROGRESS_NOT_STARTED) {
    return (
      <form onSubmit={onSubmit}>
        <input type="text" name="username"/>
        <button type="submit"/>
      </form>
    );
  } else if (queryProgress === QUERY_PROGRESS_SUCCEED) {
    return (
      <div>
        Data modified !
      </div>
    );
  } else {
    return null;
  }
}

const ConnectedForm = compose(
  connect(({data}) => ({
    data
  }), (dispatch) => ({
    dispatch
  })),
  DataHandlers({
    mapMutationsToProps: (props) => ({
      onSubmit: (data) => new Mutation({
        mutationQL: `mutation UpdateUsername($id: String!, $name: String! ) {
          updateUsername(id: $id, name: $name) {
            id,
            name,
          }
        }`,
        variables: {
          id: props.userId,
          name: data.name
        }
      })
    })
  })
)(Form);

function App() {
  return (
    <ConnectedForm userId="id"/>
  );
}

``` 

DataHandlers can receive:
  - mapMutationsToProps: (props) => ({
    handlerName: (...params) => new Mutation()
  }). REQUIRED

Mutation API: new Mutation({
  mutationQL: string, Mutation query string in GraphQL.
  variables: Object, Variables used in the query.
  onCompleted: () => void, Handler called on mutation success.
  onError: () => void, Handler called on mutation error.
}).

You have to send the reducer and dispatch as props to DataFetcher.

- [x] variables
- [ ] aliases
- [x] fragments
- [ ] directives (Haven't tried, maybe it works).

#### Actions

If you want to manually update Data outside react, I provide you some helper actions.

Dispatch a packageData action to manually update some data. This has to be keyed with entity name, and entities have to contain an id attribut. It can be an array of entities or simple entities.
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
  Task: {
    id: 1,
    name: 'work',
    user: {
      id: 1,
      name: 'Alan',
      job: 'developer',
    }
  }
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

Dispatch a removeData action to manually remove some data. You have to tell it the entities ids of entities you want to remove. It has to be keyed with entity name. You can describe it as array of ids or simple id;
```javascript

import actions from './store.js';

dispatch(actions.removeData({
  User: 1,
  Task: [1]
}))

```

#### DEPRECATED: GraphQLConnecter
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