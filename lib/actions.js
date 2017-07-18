"use babel";
// @flow

type QueryRequest = {
  ql: string,
  hash: string,
};

type QueryDetails = {
  request: QueryRequest,
  progress: void,
  response: {
    raw: Object,
  },
};

export default function configureActions() {
  return {
    packageData(data: Object, query?: QueryDetails) {
      return {
        type: "DATA_RECEIVED",
        payload: {
          entities: data,
          query,
        },
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
