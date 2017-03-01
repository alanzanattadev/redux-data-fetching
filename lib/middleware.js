import {graphql} from 'graphql';

export default function(schema, actions) {
  return store => next => action => {
    if (action.graphql) {
      graphql(schema , action.payload)
        .then(result => {
          if (result.errors === undefined) {
            store.dispatch(actions.packageDate(result.data));
          } else {
            store.dispatch(actions.notifyError(result.errors, action.payload));
          }
        });
    } else {
      return next(action);
    }
  };
};
