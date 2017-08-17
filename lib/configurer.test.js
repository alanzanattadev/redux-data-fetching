import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  buildSchema,
} from "graphql";
import { configure } from "./configurer";

describe("Configurer", () => {
  it("returns the differents models", () => {
    const subject = configure(
      new GraphQLSchema({
        query: new GraphQLObjectType({
          name: "RootQuery",
          fields: {
            users: {
              type: new GraphQLObjectType({
                name: "User",
                fields: {
                  id: { type: GraphQLString },
                },
              }),
            },
          },
        }),
      }),
    );

    expect(subject).toMatchSnapshot();
  });

  it("works with schema as string", () => {
    const subject = configure(
      `
      type User {
        id: String!,
        name: String,
        friends: [User!]
      }
      
      type Query {
        users: [User!],
        user(id: String): User
      }
      
      type Mutation {
        createUser(name: String!): User
      }
    `,
      {},
      {
        users: () => [
          { id: "user1", name: "Alan" },
          { id: "user2", name: "Antoine" },
        ],
        user: () => ({ id: "user1", name: "Alan", friends: [] }),
        createUser: ({ name }) => ({ id: "id", name: name }),
      },
    );

    expect(subject).toMatchSnapshot();
  });
});
