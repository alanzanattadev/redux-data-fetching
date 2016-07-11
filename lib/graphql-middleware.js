import {graphql} from 'graphql';

export default function(schema, config) {
  return store => next => action => {
    if (action.graphql) {
      graphql(schema , action.payload)
        .then(result => {
          if (result.errors === undefined) {
            dispatch({
              type: "GRAPHQL_DATA_RECEIVED",
              payload: {
                data: result.data,
                query: action.payload
              }
            })
          } else {
            dispatch({
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
