'use babel'
// @flow

export default function configureActions() {
  return {
    packageData(data: object) {
      return {
        type: "DATA_RECEIVED",
        payload: data
      };
    },
    removeData(identifiers: {[key: string]: string}) {
      return {
        type: "DATA_REMOVED",
        payload: identifiers
      }
    },
    notifyError(err, query) {
      return {
        type: "GRAPHQL_ERRORS_RECEIVED",
        payload: {
          errors: err,
          query: query
        }
      }
    }
  };
};
