"use babel";
// @flow

import Mutation from "./Mutation";

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
    mutateData(mutation: Mutation, queryID: string) {
      return {
        type: "GRAPHQL_MUTATION",
        graphql: true,
        payload: {
          mutation,
          queryID,
        },
      };
    },
    fetchData(needs: string) {
      return {
        type: "GRAPHQL_FETCH",
        graphql: true,
        payload: needs,
      };
    },
    bustQueryCache(queryID: string) {
      return {
        type: "QUERY_CACHE_BUSTED",
        payload: {
          queryID,
        },
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
