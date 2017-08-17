import React from "react";
import { shallow, mount } from "enzyme";
import {
  graphQLizr,
  getDataFromResponse,
  graphQLRecordr,
  convertsNormalizedEntitiesToRecords,
  getConvertersFromSchema,
} from "./graphqlTypesConverters";
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
import { Record } from "immutable";
import { normalize } from "normalizr";

let UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    friends: { type: new GraphQLList(UserType) },
  }),
});
let Power = new GraphQLObjectType({
  name: "Power",
  fields: {
    possible_entities: { type: UserType },
  },
});
let Skill = new GraphQLObjectType({
  name: "Skill",
  fields: () => ({
    id: { type: GraphQLInt },
    power: { type: GraphQLInt },
    target: { type: UserType },
  }),
});
let littleSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
      users: {
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
  mutation: new GraphQLObjectType({
    name: "RootMutation",
    fields: {
      createUser: {
        type: UserType,
        resolve() {
          return { id: "1" };
        },
      },
    },
  }),
});

describe("Converters", () => {
  describe("To Entity based data", () => {
    describe("getConvertersFromSchema", () => {
      it("gets converters from query and mutation types", () => {
        const subject = getConvertersFromSchema(littleSchema);

        expect(subject).toMatchSnapshot();
      });
    });
  });

  describe("To normalizr", () => {
    describe("Schema to normalizr model", () => {
      it("should convert basic schema correctly", () => {
        let subject = graphQLizr(littleSchema);

        expect(subject).toMatchSnapshot();
        expect(
          getDataFromResponse(subject.converters, {
            users: [{ id: "1" }],
            skills: [{ id: "2" }],
          }),
        ).toMatchSnapshot();
        expect(
          getDataFromResponse(subject.converters, { user: { id: "2" } }),
        ).toMatchSnapshot();
      });
    });
  });

  describe("To immutable records", () => {
    describe("schema to immutable records", () => {
      it("should converts basic schema correctly", () => {
        let records = graphQLRecordr(littleSchema);
        let subject = Object.keys(records).reduce(
          (red, recordName) =>
            Object.assign({}, red, {
              [recordName]: new records[recordName]({}),
            }),
          {},
        );

        expect(subject).toMatchSnapshot();
      });
    });

    describe("entities to immutable records", () => {
      it("should converts basic entities correctly", () => {
        let records = graphQLRecordr(littleSchema);
        let normalizrModel = graphQLizr(littleSchema);
        let normalized = normalize(
          {
            id: 1,
            power: 8,
            target: {
              id: 2,
              name: "Alan",
              friends: [
                {
                  id: 3,
                  name: "Antoine",
                },
                {
                  id: 4,
                  name: "Joffrey",
                },
              ],
            },
          },
          normalizrModel.entities.Skill,
        );
        let subject = convertsNormalizedEntitiesToRecords(
          normalized.entities,
          records,
          littleSchema,
        );

        expect(subject).toMatchSnapshot();
        expect(subject.User[2].get("id")).toBe(2);
      });
    });
  });
});
