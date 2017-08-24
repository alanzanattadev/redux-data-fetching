// @flow

import React from "react";
import { mount } from "enzyme";
import { buildSchema } from "graphql";
import { createTestLab } from "./TestUtils";
import { configure } from "./configurer";
import Mutation from "./Mutation";

describe("TestUtils", () => {
  const schema = buildSchema(`
    type Query {
      users: [User]
    }
    
    type Mutation {
      createUser(name: String!, friends: [Int!]): User
    }
    
    type User {
      id: String!,
      name: String!,
      friends: [User!]
    }
  `);
  const rootValue = {
    users: () => [],
    createUser: ({ name, friends }) => ({
      id: "ah",
      name,
      friends: friends.map(friend => ({
        id: friend,
        name: "ok",
        friends: [],
      })),
    }),
  };
  const { DataHandlers, DataFetcher } = configure(schema, {}, rootValue);
  describe("createTestLab", () => {
    it("tests a correct DataHandlers correctly", done => {
      const Lab = createTestLab(
        DataHandlers({
          mapMutationsToProps: () => ({
            onSubmit: () =>
              new Mutation({
                mutationQL: `mutation {
              createUser(name: "Alan", friends: [2]) {
                id,
                name
              },
            }`,
              }),
          }),
        }),
        {
          schema,
          rootValue,
        },
      );
      const subject = mount(
        <Lab
          onMount={props => {
            props.onSubmit();
          }}
          onSuccess={done}
        />,
      );
    });

    it("tests a bad DataHandlers correctly", done => {
      const Lab = createTestLab(
        DataHandlers({
          mapMutationsToProps: () => ({
            onSubmit: () =>
              new Mutation({
                mutationQL: `mutation {
                  createUser(name: "Alan", friends: [2]),
                }`,
              }),
          }),
        }),
        {
          schema,
          rootValue,
        },
      );
      const subject = mount(
        <Lab
          onMount={props => {
            props.onSubmit();
          }}
          onError={errors => {
            done();
          }}
        />,
      );
    });

    it("tests a correct DataFetcher correctly", done => {
      const Lab = createTestLab(
        DataFetcher({
          mapPropsToNeeds: () => `{
          users {
            id,
            name,
            friends {
              id,
            }
          }
        }`,
        }),
        { schema, rootValue },
      );

      const subject = mount(
        <Lab
          watchedProps="users"
          onPropChange={props => {
            console.log(props.users);
            expect(props.users).toMatchSnapshot();
            done();
          }}
        />,
      );
    });

    it("tests a bad DataFetcher correctly", done => {
      const Lab = createTestLab(
        DataFetcher({
          mapPropsToNeeds: () => `{
          users(invalidArg: 1) {
            id,
            name,
            friends {
              id,
            }
          }
        }`,
        }),
        { schema, rootValue },
      );

      const subject = mount(
        <Lab
          watchedProps="users"
          onError={() => {
            done();
          }}
        />,
      );
    });
  });
});
