import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
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
});
