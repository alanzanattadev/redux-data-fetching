import React from 'react';
import ReactDOM from 'react-dom';
import {graphql, GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList} from 'graphql';
import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import {connect, Provider} from 'react-redux';
import thunk from 'redux-thunk';
import requestStateMiddleware from 'redux-request-state/lib/middleware';
import requestStateReducer from 'redux-request-state/lib/reducer';
import RequestStateConnecter from 'redux-request-state/lib/react';
import graphQLMiddleware from '../../lib/graphql-middleware';
import graphQLReducer from '../../lib/graphql-data-reducer';
import GraphQLConnecter from '../../lib/graphql-data-connecter';


// Define GraphQL Schema
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


// Define middlewares and reducers
let middlewares = [thunk, requestStateMiddleware(), graphQLMiddleware(schema)];
let reducers = combineReducers({
  data: graphQLReducer,
  requests: requestStateReducer,
});

// Create Store
let store = createStore(reducers, {}, compose(
  applyMiddleware(...middlewares),
  window.devToolsExtension ? window.devToolsExtension() : f => f
));

// Define some stateless components
let Task = ({name}) => (<h1>{name}</h1>);
let Tasks = ({tasks}) => (<div>{tasks.map(task => <Task key={task.name} name={task.name}/>)}</div>);
let Spinner = () => (<h1>Loading</h1>);
let Nothing = () => (null);

// Connect Components to Store
let Connecter = connect(state => ({data: state.data, requests: state.requests, reducer: state.requests}), dispatch => ({dispatch}));
let GraphQLContainer = Connecter(GraphQLConnecter);
let StatefulTasks = Connecter(RequestStateConnecter('tasks.get', {
  mapStateToComponent: {
    'PENDING': (<Spinner/>),
    'SUCCESS': (<Tasks/>),
    'DEFAULT': (<Nothing/>)
  }
}));

// Display
ReactDOM.render((
  <div>
    <Provider store={store}>
      <GraphQLContainer needs="{tasks{name}}" mapCacheToProps={cache => ({tasks: cache.tasks || []})}>
        <StatefulTasks/>
      </GraphQLContainer>
    </Provider>
  </div>
), document.getElementById("container"));
