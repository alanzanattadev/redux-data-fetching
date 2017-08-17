// @flow

import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} from "graphql";
import configureMiddleware from "./middleware";
import configureActions from "./actions";
import Mutation from "./Mutation";

describe("Middleware", () => {
  const User = new GraphQLObjectType({
    name: "User",
    fields: () => ({
      id: { type: GraphQLString },
      name: { type: GraphQLString },
      description: { type: GraphQLString },
      friends: { type: new GraphQLList(User) },
    }),
  });
  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: "RootQuery",
      fields: {
        user: {
          type: User,
          resolve: () => ({ id: "1", name: "Alan" }),
          args: { id: { type: GraphQLString } },
        },
        users: {
          type: new GraphQLList(User),
          resolve: (p, args, context) => [],
        },
      },
    }),
    mutation: new GraphQLObjectType({
      name: "RootMutation",
      fields: {
        createUser: {
          type: User,
          args: {
            name: { type: GraphQLString },
          },
          resolve: () => ({ id: "1", name: "Alan" }),
        },
      },
    }),
  });
  const actions = configureActions();
  const normalizrModel = {
    converters: {
      user: "User",
      users: "Users",
      createUser: "User",
    },
  };
  const context = {};
  const middleware = configureMiddleware(
    schema,
    actions,
    normalizrModel,
    context,
  );

  describe("GRAPHQL_FETCH", () => {
    it("dispatches queryStarted and packageData", done => {
      let calls = 0;
      const dispatchSpy = jest.fn(() => {
        if (calls === 1) {
          expect(dispatchSpy.mock.calls).toMatchSnapshot();
          done();
        }
        calls = calls + 1;
      });
      const nextSpy = jest.fn();
      const subject = middleware({ getState: () => {}, dispatch: dispatchSpy })(
        nextSpy,
      )({
        type: "GRAPHQL_FETCH",
        graphql: true,
        payload: `{
        user (id: "1") {
          id,
          name
        }
      }`,
      });
    });

    it("dispatches queryStarted and queryFailed if query fails", done => {
      let calls = 0;
      const dispatchSpy = jest.fn(() => {
        if (calls === 1) {
          expect(dispatchSpy.mock.calls).toMatchSnapshot();
          done();
        }
        calls = calls + 1;
      });
      const nextSpy = jest.fn();
      const subject = middleware({ getState: () => {}, dispatch: dispatchSpy })(
        nextSpy,
      )({
        type: "GRAPHQL_FETCH",
        graphql: true,
        payload: `{
        user (badargument: "1") {
          id,
          name
        }
      }`,
      });
    });
  });

  describe("GRAPHQL_MUTATION", () => {
    it("doesn't error with variables", done => {
      let calls = 0;
      const dispatchSpy = jest.fn(() => {
        if (calls === 1) {
          expect(dispatchSpy.mock.calls[1][0].type).toMatchSnapshot();
          done();
        }
        calls = calls + 1;
      });
      const nextSpy = jest.fn();
      const subject = middleware({ getState: () => {}, dispatch: dispatchSpy })(
        nextSpy,
      )({
        type: "GRAPHQL_MUTATION",
        graphql: true,
        payload: {
          queryID: "id",
          mutation: new Mutation({
            mutationQL: `mutation CreateUser ($name: String) {
              createUser (name: $name) {
              id,
              name
            }
          }`,
            variables: {
              name: "Alan",
            },
          }),
        },
      });
    });

    it("doesn't error without variables", done => {
      let calls = 0;
      const dispatchSpy = jest.fn(() => {
        if (calls === 1) {
          expect(dispatchSpy.mock.calls[1][0].type).toMatchSnapshot();
          done();
        }
        calls = calls + 1;
      });
      const nextSpy = jest.fn();
      const subject = middleware({ getState: () => {}, dispatch: dispatchSpy })(
        nextSpy,
      )({
        type: "GRAPHQL_MUTATION",
        graphql: true,
        payload: {
          queryID: "id",
          mutation: new Mutation({
            mutationQL: `mutation CreateUser {
              createUser {
              id,
              name
            }
          }`,
          }),
        },
      });
    });

    it("doesn't error without variables and without name", done => {
      let calls = 0;
      const dispatchSpy = jest.fn(() => {
        if (calls === 1) {
          expect(dispatchSpy.mock.calls[1][0].type).toMatchSnapshot();
          done();
        }
        calls = calls + 1;
      });
      const nextSpy = jest.fn();
      const subject = middleware({ getState: () => {}, dispatch: dispatchSpy })(
        nextSpy,
      )({
        type: "GRAPHQL_MUTATION",
        graphql: true,
        payload: {
          queryID: "id",
          mutation: new Mutation({
            mutationQL: `mutation {
              createUser {
              id,
              name
            }
          }`,
          }),
        },
      });
    });

    it("dispatches queryStarted and packageData", done => {
      let calls = 0;
      const dispatchSpy = jest.fn(() => {
        if (calls === 1) {
          expect(dispatchSpy.mock.calls).toMatchSnapshot();
          done();
        }
        calls = calls + 1;
      });
      const nextSpy = jest.fn();
      const subject = middleware({ getState: () => {}, dispatch: dispatchSpy })(
        nextSpy,
      )({
        type: "GRAPHQL_MUTATION",
        graphql: true,
        payload: {
          queryID: "id",
          mutation: new Mutation({
            mutationQL: `mutation CreateUser {
              createUser {
              id,
              name
            }
          }`,
          }),
        },
      });
    });

    it("calls onCompleted", done => {
      const onCompletedSpy = jest.fn(param => {
        expect(param).toMatchSnapshot();
        done();
      });
      const nextSpy = jest.fn();
      const subject = middleware({ getState: () => {}, dispatch: () => {} })(
        nextSpy,
      )({
        type: "GRAPHQL_MUTATION",
        graphql: true,
        payload: {
          queryID: "id",
          mutation: new Mutation({
            mutationQL: `mutation CreateUser {
              createUser {
              id,
              name
            }
          }`,
            onCompleted: onCompletedSpy,
          }),
        },
      });
    });

    it("dispatches queryStarted and queryFailed if query fails", done => {
      let calls = 0;
      const dispatchSpy = jest.fn(() => {
        if (calls === 1) {
          expect(dispatchSpy.mock.calls).toMatchSnapshot();
          done();
        }
        calls = calls + 1;
      });
      const nextSpy = jest.fn();
      const subject = middleware({ getState: () => {}, dispatch: dispatchSpy })(
        nextSpy,
      )({
        type: "GRAPHQL_MUTATION",
        graphql: true,
        payload: {
          queryID: "id",
          mutation: new Mutation({
            mutationQL: `mutation CreateUser($input: User) {
              createUser (badarg: 2) {
              id,
              name
            }
          }`,
          }),
        },
      });
    });

    it("calls onError if query fails", done => {
      const onErrorSpy = jest.fn(param => {
        expect(param).toMatchSnapshot();
        done();
      });
      const subject = middleware({
        getState: () => {},
        dispatch: () => {},
      })(() => {})({
        type: "GRAPHQL_MUTATION",
        graphql: true,
        payload: {
          queryID: "id",
          mutation: new Mutation({
            mutationQL: `mutation CreateUser($input: User) {
              createUser (badarg: 2) {
              id,
              name
            }
          }`,
            onError: onErrorSpy,
          }),
        },
      });
    });
  });

  describe("General", () => {
    it("calls next if it's not a handled action", () => {
      const spy = jest.fn();
      const dispatch = jest.fn();

      middleware({ getState: () => {}, dispatch })(spy)({
        type: "CREATE_USER",
      });
      middleware({ getState: () => {}, dispatch })(spy)({
        type: "GRAPHQL_FETCH",
      });
      middleware({ getState: () => {}, dispatch })(spy)({
        type: "GRAPHQL_MUTATION",
      });

      expect(spy).toHaveBeenCalledTimes(3);
      expect(dispatch).not.toHaveBeenCalled();
    });
  });
});
