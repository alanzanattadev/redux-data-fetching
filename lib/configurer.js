'use babel'
// @flow
import configureMiddleware from './middleware';
import configureReducer from './reducer';
import configureActions from './actions';
import {graphQLizr, graphQLRecordr} from './graphqlTypesConverters';
import { schema } from 'normalizr';

export function configure(graphQLSchema, context: any) {
  const normalizrModel = graphQLizr(graphQLSchema);
  const recordsModel = graphQLRecordr(graphQLSchema);
  const actions = configureActions();
  return {
    actions,
    middleware: configureMiddleware(graphQLSchema, actions, normalizrModel, context),
    reducer: configureReducer(normalizrModel.entities, recordsModel, graphQLSchema),
    normalizrModel: normalizrModel,
    recordsModel: recordsModel,
  };
}
