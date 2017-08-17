// @flow

import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} from "graphql";
import configureMiddleware from "./middleware";
import configureActions from "./actions";

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
  });
  const actions = configureActions();
  const normalizrModel = {
    converters: {
      user: "User",
      users: "Users",
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

  describe("GRAPHQL_MUTATION", () => {});

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
