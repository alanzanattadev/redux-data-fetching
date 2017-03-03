'use babel'
// @flow
import configureMiddleware from './middleware';
import configureReducer from './reducer';
import configureActions from './actions';
import {graphQLizr} from './graphqlTypesConverters';
import { schema } from 'normalizr';

export function configure(graphQLSchema) {
  let normalizrModel = graphQLizr(graphQLSchema);
  const actions = configureActions();
  return {
    actions,
    middleware: configureMiddleware(graphQLSchema, actions, normalizrModel),
    reducer: configureReducer(normalizrModel.entities),
    normalizrModel: normalizrModel,
  };
}
