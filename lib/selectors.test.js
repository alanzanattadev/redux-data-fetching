import {
  printSchema,
  graphql,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLID,
  getNullableType,
} from "graphql";
import { convertsTypesSchemaToSelectorSchema } from "./selectors";
import { Record, Map, List } from "immutable";

describe("Selectors", () => {
  const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
      id: { type: GraphQLInt },
      name: { type: GraphQLString },
      friends: { type: new GraphQLList(UserType) },
    }),
  });
  const Power = new GraphQLObjectType({
    name: "Power",
    fields: {
      possible_entities: { type: UserType },
    },
  });
  const Skill = new GraphQLObjectType({
    name: "Skill",
    fields: () => ({
      id: { type: GraphQLInt },
      power: { type: GraphQLInt },
      target: { type: UserType },
    }),
  });
  const littleSchema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: "RootQueryType",
      fields: {
        users: {
          args: { gender: { type: GraphQLString } },
          type: new GraphQLList(UserType),
          resolve() {
            return [];
          },
        },
        skills: {
          type: new GraphQLList(Skill),
          resolve() {
            return [];
          },
        },
        user: {
          type: UserType,
          resolve() {
            return {};
          },
        },
      },
    }),
  });

  describe("convertsTypesSchemaToSelectorSchema", () => {
    it("converts simple schema to selector schema", () => {
      const subject = convertsTypesSchemaToSelectorSchema(littleSchema);

      expect(subject).toMatchSnapshot();
    });

    it("resolves to result of the needs", done => {
      const selectorSchema = convertsTypesSchemaToSelectorSchema(littleSchema);
      const queryHash = "hash";
      const User = Record({ id: null, name: null, friends: List() });
      const Progress = Record({ percent: 0, status: "WAITING" });
      const Result = Record({
        results: Map({ byQuery: Map(), byEntity: Map() }),
        progress: new Progress(),
      });
      const user1 = new User({ id: 1, name: "Alan", friends: List.of(2, 3) });
      const user2 = new User({
        id: 2,
        name: "Sophie",
        friends: List.of(1),
      });
      const user3 = new User({
        id: 3,
        name: "Antoine",
        friends: List.of(1),
      });
      const data = Map({
        queries: Map({
          [queryHash]: new Result({
            results: Map({
              byEntity: Map({ User: [2, 3] }),
              byQuery: Map({ users: [1, 3], females: [2] }),
            }),
          }),
        }),
        entities: Map({
          User: Map({ 1: user1, 2: user2, 3: user3 }),
        }),
      });
      const contextValue = {
        db: data,
        queryHash: queryHash,
      };
      graphql(
        selectorSchema,
        `{ users(gender: "male") { id, friends { id, friends { id, name }} }, females: users(gender: "female") { id, friends { id, name } } }`,
        null,
        contextValue,
      ).then(result => {
        expect(result.errors).toBeUndefined();
        expect(result.data).toMatchSnapshot();
        done();
      });
    });

    it("throws when db is not passed in contextValue", done => {
      const selectorSchema = convertsTypesSchemaToSelectorSchema(littleSchema);
      graphql(
        selectorSchema,
        `{ users(gender: "male") { id, friends { id } } }`,
      ).then(result => {
        expect(result.errors).toMatchSnapshot();
        done();
      });
    });
  });

  describe("selectData", () => {});
});
