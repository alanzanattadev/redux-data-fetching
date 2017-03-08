'use babel'
// @flow
import configureMiddleware from './middleware';
import configureReducer from './reducer';
import configureActions from './actions';
import {graphQLizr, graphQLRecordr} from './graphqlTypesConverters';
import { schema } from 'normalizr';

export function configure(graphQLSchema) {
  const normalizrModel = graphQLizr(graphQLSchema);
  const recordsModel = graphQLRecordr(graphQLSchema);
  const actions = configureActions();
  return {
    actions,
    middleware: configureMiddleware(graphQLSchema, actions, normalizrModel),
    reducer: configureReducer(normalizrModel.entities, recordsModel, graphQLSchema),
    normalizrModel: normalizrModel,
    recordsModel: recordsModel,
  };
}
