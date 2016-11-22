# redux-data-fetching

Automatic data managment with caching and auto merging of cached data and fetched one, based on GraphQL.

Install module
```shell
npm install --save alanzanattadev/redux-data-fetching
```
# Redux

## Actions

Actions types

### GRAPHQL_DATA_RECEIVED

Send data to cache (update or create behaviour based on id for array resources).

```javascript
{
  type: "GRAPHQL_DATA_RECEIVED",
  payload: {
    user: {
      name: "Alan",
      token: "myToken"
    },
    appointments: [{
      id: 1,
      date: Date.now().toString(),
      name: "Meeting"
    }, {
      id: 5,
      date: Date.now().toString(),
      name: "Meeting2"
    }, {
      id: 10,
      date: Date.now().toString(),
      name: "Meeting3"
    }]
  }
}
```
Caches user and appointments resources, updating existing keys (based on id for array (eg: appointments)).

### GRAPHQL_DATA_REMOVED

Specifies paths of resources to remove, with an object, based on id for array resources. The reducer will remove data of the same path that are set to true, and entities defined by ID in array of path (eg: appointments with id 1 and 10 in data.appointments and data.user.token in the example below). The paths are defined with objects of the same shape than the reducer data.

```javascript
{
  type: "GRAPHQL_DATA_REMOVED",
  payload: {
    user: {
      token: true
    },
    appointments: [{
      id: 1
    }, {
      id: 10
    }]
  }
}
```

## Middleware

Default middleware which handles graphql requests, and dispatches actions to the reducer

### Use

Create GraphQL Schema
```javascript
import {graphql, GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList} from 'graphql';

let taskSchema = new GraphQLObjectType({
  name: "Task",
  fields: {
    name: { type: GraphQLString }
  }
})

let schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      tasks: {
        type: new GraphQLList(taskSchema),
        resolve(ids) {
          let promise = new Promise(
            (resolve, reject) => setTimeout(
              () => resolve([{name: "Salut"}, {name: "Coucou"}]),
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

Add middleware to the store config with defined schema
```javascript
import graphQLMiddleware from 'redux-data-fetching/lib/graphql-middleware';
createStore(reducers, {}, compose(
  applyMiddleware([graphQLMiddleware(schema)])
));
```

Dispatches graphql action (request in payload) and it will fetch and dispatch GRAPHQL_DATA_RECEIVED with resolved data as payload.
```javascript
dispatch({
  type: "REFRESH_APPOINTMENTS",
  graphql: true,
  payload: '{appointments}'
})
```

## Reducer

Default reducer which handles data received from GraphQL, caches and merges it.

### Use
Add reducer to store config
```javascript
let reducer = combineReducers({data: require('redux-data-fetching/lib/graphql-data-reducer')});
```

Access data
```javascript
store.getState().reducer.yourresource
```

## React Connecter

### GraphQLConnecter
GraphQLConnecter is a Higher Order Component which connect a wrapped component to GraphQL, allowing the component to describe its needs and how to send them to the component. It requires the data reducer as prop "data". It automatically detects needs change and request data again based on what's already cached and new needs.

```javascript
// React and component imports ...
import {GraphQLConnecter} from 'redux-data-fetching';

let UserCard = connect(state => ({data: state.data}))(GraphQLConnecter(
  (props) => `{
    user(id: "${props.userId}") {
      name,
      age
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

### GraphQLContainer - Deprecated !!! !!! !!
GraphQLContainer component which auto fetch needed data described as GraphQL query and respecting refresh requirements

### Use
Connect the container to redux
```javascript
import GraphQLConnecter from 'redux-data-fetching/lib/graphql-data-connecter';
et Connecter = connect(state => ({data: state.data, requests: state.requests, reducer: state.requests}), dispatch => ({dispatch}));
let GraphQLContainer = Connecter(GraphQLConnecter);
```

Define your stateless components
```javascript
let Task = ({name}) => (<h1>{name}</h1>);
let TaskList = ({tasks}) => (<div>{tasks.map(task => <Task key={task.name} name={task.name}/>)}</div>);
```

Use it
```javascript
ReactDOM.render((
  <div>
    <Provider store={store}>
      <GraphQLContainer needs="{tasks{name}}" mapCacheToProps={cache => ({tasks: cache.tasks || []})}>
        <TaskList/>
      </GraphQLContainer>
    </Provider>
  </div>
), document.getElementById("container"));
```

## Example

See https://github.com/alanzanattadev/redux-data-fetching/blob/master/example/lib/index.js for a full example with some advanced uses.
