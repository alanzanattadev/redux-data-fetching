import { hashString } from "./utils";
import { graphql } from "graphql";
import { getDataFromResponse } from "./graphqlTypesConverters";

export default function(schema, actions, normalizrModel, context) {
  return store => next => action => {
    if (action.graphql) {
      const hash = hashString(action.payload);
      const request = {
        ql: action.payload,
        hash,
      };
      store.dispatch(actions.queryStarted({ request }));
      graphql(schema, action.payload, undefined, {
        store,
        dependencies: context,
      }).then(result => {
        if (result.errors === undefined) {
          store.dispatch(
            actions.packageData(
              getDataFromResponse(normalizrModel.converters, result.data),
              {
                request,
                response: {
                  raw: result.data,
                },
              },
            ),
          );
        } else {
          console.error(
            "GraphQL query",
            action.payload,
            "has failed.\n",
            "errors:",
            result.errors,
          );
          store.dispatch(actions.queryFailed({ request }, result.errors));
        }
      });
    } else {
      return next(action);
    }
  };
}
