import {graphql} from 'graphql';
import {getDataFromResponse} from './graphqlTypesConverters';

export default function(schema, actions, normalizrModel, context) {
  return store => next => action => {
    if (action.graphql) {
      graphql(schema , action.payload, undefined, {
        store,
        dependencies: context,
      })
        .then(result => {
          if (result.errors === undefined) {
            console.log(normalizrModel, result.data);
            console.log(getDataFromResponse(normalizrModel.converters, result.data));
            store.dispatch(actions.packageData(getDataFromResponse(normalizrModel.converters, result.data)));
          } else {
            store.dispatch(actions.notifyError(result.errors, action.payload));
          }
        });
    } else {
      return next(action);
    }
  };
};
