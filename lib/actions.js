"use babel";
// @flow

export default function configureActions() {
  return {
    packageData(data: Object) {
      return {
        type: "DATA_RECEIVED",
        payload: data,
      };
    },
    removeData(identifiers: {
      [key: string]:
        | number
        | string
        | { id: string | number }
        | Array<number | string | { id: string | number }>,
    }) {
      return {
        type: "DATA_REMOVED",
        payload: identifiers,
      };
    },
    notifyError(err: mixed, query: string) {
      return {
        type: "GRAPHQL_ERRORS_RECEIVED",
        payload: {
          errors: err,
          query: query,
        },
      };
    },
  };
}
