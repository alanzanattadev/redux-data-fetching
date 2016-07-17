import {graphql} from 'graphql';

export default function(schema, config) {
  return store => next => action => {
    if (action.graphql) {
      graphql(schema , action.payload)
        .then(result => {
          if (result.errors === undefined) {
            store.dispatch({
              type: "GRAPHQL_DATA_RECEIVED",
              query: action.payload,
              payload: result.data
            })
          } else {
            store.dispatch({
              type: "GRAPHQL_ERRORS_RECEIVED",
              payload: {
                errors: result.errors,
                query: action.payload
              }
            })
          }
        });
    } else {
      return next(action);
    }
  };
};
