"use babel";
// @flow

type QueryRequest = {
  ql: string,
  hash: string | number,
};

type QueryDetails = {
  request: QueryRequest,
  response?: {
    raw: Object,
  },
};

export default function configureActions() {
  return {
    fetchData(needs: string) {
      return {
        type: "GRAPHQL_FETCH",
        graphql: true,
        payload: needs,
      };
    },
    packageData(data: Object, query?: QueryDetails) {
      return {
        type: "DATA_RECEIVED",
        payload: {
          entities: data,
          query,
        },
      };
    },
    queryStarted(query: QueryDetails) {
      return {
        type: "QUERY_STARTED",
        payload: {
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
    queryFailed(query: QueryDetails, errors: Array<Object>) {
      return {
        type: "QUERY_FAILED",
        payload: {
          query,
          errors,
        },
      };
    },
  };
}
