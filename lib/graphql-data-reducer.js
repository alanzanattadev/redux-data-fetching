import {fromJS} from 'immutable';

export default function(state = {}, action) {
  switch(action.type) {
    case "GRAPHQL_DATA_RECEIVED":
      return fromJS(action.payload)
              .keySeq()
              .reduce(
                (reduction, resourceKey) => reduction.update(
                  resourceKey,
                  resources => {
                    let newResources = fromJS(action.payload[resourceKey]);
                    if (typeof action.payload[resourceKey] === "object" && Array.isArray(action.payload[resourceKey])) {
                      resources = resources || fromJS([]);
                      return resources
                              .map(
                                resource => newResources
                                              .find(newResource => newResource.get('id') == resource.get('id'), {}, fromJS({}))
                                              .mergeDeep(resource)
                              )
                              .concat(newResources.filterNot(newResource => resources.find(existingResource => existingResource.get('id') == newResource.get('id'))))
                    } else if (typeof action.payload[resourceKey] === "object") {
                      resources = resources || fromJS({});
                      return resources.mergeDeep(newResources);
                    }
                  }
                ),
                fromJS(state)
              )
              .toJS();
      break;
    default:
      return state;
  }
};
