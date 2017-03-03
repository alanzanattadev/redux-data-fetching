'use babel';
// @flow

import { fromJS, Map, List, Set } from 'immutable';
import { normalize } from 'normalizr';
import { graphQLizr } from './graphqlTypesConverters';
import _ from 'lodash';

export default function configureReducer(normalizrTypes) {
  return function reducer(
    state = Map().set('entities', Map()).set('result', Map()),
    action,
  ) {
    switch (action.type) {
      case 'DATA_RECEIVED':
        const normalizrModel = Object.keys(action.payload).reduce((red, key) =>
          Object.assign({}, red, {
            [key]: typeof action.payload[key] == 'object' &&
              Array.isArray(action.payload[key])
              ? [normalizrTypes[key]]
              : normalizrTypes[key],
          }), {});
        const normalized = normalize(JSON.parse(JSON.stringify(action.payload)), normalizrModel);
        return state
          .update('entities', entities =>
            entities.mergeDeep(fromJS(normalized.entities)))
          .update('result', result =>
            Object.keys(normalized.result)
              .reduce(
                (red, key) =>
                  red.update(key, Set(), v =>
                    v
                      .concat(
                        typeof normalized.result[key] == 'object' &&
                          Array.isArray(normalized.result[key])
                          ? List(normalized.result[key])
                          : List.of(normalized.result[key]),
                      )
                      .map(v => v.toString())),
                state.get('result'),
              ));
      case 'DATA_REMOVED':
        return Object.keys(action.payload)
          .reduce(
            (red, key) =>
              typeof action.payload[key] == 'object' &&
                Array.isArray(action.payload[key])
                ? action.payload[key].reduce(
                    (reduction, value) =>
                      reduction.deleteIn(['entities', key, value.toString()]),
                    red,
                  )
                : red.deleteIn([
                    'entities',
                    key,
                    action.payload[key].toString(),
                  ]),
            state,
          );
      default:
        return state;
    }
  };
}
