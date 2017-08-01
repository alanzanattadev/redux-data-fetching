"use babel";
// @flow

import React from "react";
import { shallow, mount } from "enzyme";
import { configure } from "./configurer";
import { Map, fromJS } from "immutable";
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

describe("Reducer", () => {
  let UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
      id: { type: GraphQLInt },
      name: { type: GraphQLString },
      age: { type: GraphQLInt },
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
      },
    }),
  });
  const { reducer, actions } = configure(littleSchema);
  describe("Package Data", () => {
    it("should package data correctly", () => {
      let state = reducer(
        undefined,
        actions.packageData({
          User: {
            id: 1,
            name: "Alan",
            friends: [
              {
                id: 2,
                name: "Antoine",
              },
              {
                id: 3,
                name: "Joffrey",
              },
            ],
          },
          Skill: {
            id: 1,
            power: 4,
            target: {
              id: 1,
              name: "Alan",
            },
          },
        }),
      );
      let subject = reducer(
        state,
        actions.packageData({
          User: {
            id: "2",
            friends: [{ id: 3, name: "Joffrey", age: 28 }],
          },
          Skill: [
            { id: 1, power: 5 },
            { id: 2, power: 2, target: { id: 2, name: "Antoine" } },
          ],
        }),
      );

      expect(subject).toMatchSnapshot();
    });
  });

  it("should accept only one data", () => {
    let subject = reducer(
      undefined,
      actions.packageData({
        User: {
          id: "2",
        },
      }),
    );

    expect(subject).toMatchSnapshot();
  });

  it("accepts queries", () => {
    const subject = reducer(
      undefined,
      actions.packageData(
        {
          User: {
            id: "2",
            friends: [{ id: 3, name: "Joffrey", age: 28 }],
          },
          Skill: [
            { id: 1, power: 5 },
            { id: 2, power: 2, target: { id: 2, name: "Antoine" } },
          ],
        },
        {
          request: {
            ql:
              "{ users: { id, friends { id, name, age } }, skills { id, power, target { id, name } } }",
            hash: "queryhash",
          },
          response: {
            raw: {
              users: {
                id: "2",
                friends: [{ id: 3, name: "Joffrey", age: 28 }],
              },
              skills: [
                { id: 1, power: 5 },
                { id: 2, power: 2, target: { id: 2, name: "Antoine" } },
              ],
            },
          },
        },
      ),
    );

    expect(subject).toMatchSnapshot();
  });

  describe("Remove Data", () => {
    it("should remove several data", () => {
      let subject = reducer(
        fromJS({
          entities: {
            User: {
              "1": {
                id: 1,
                name: "Alan",
              },
              "2": {
                id: 2,
                name: "Joffrey",
              },
              "3": {
                id: 3,
                name: "Antoine",
              },
            },
            Skill: {
              "1": {
                id: 1,
                power: 2,
              },
              "2": {
                id: 2,
                power: 3,
              },
            },
          },
        }),
        actions.removeData({
          User: [1, 3],
          Skill: 2,
        }),
      );

      expect(subject).toMatchSnapshot();
    });

    it("shouldn't crash if no data exists", () => {
      let subject = reducer(
        undefined,
        actions.removeData({ Users: "nonexistantid" }),
      );

      expect(subject).toMatchSnapshot();
    });
  });

  describe("Query started", () => {
    it("puts query state in reducer", () => {
      const subject = reducer(
        undefined,
        actions.queryStarted({
          request: { hash: 904239430, ql: `{ users { id } }` },
        }),
      );

      expect(subject).toMatchSnapshot();
    });
  });

  describe("Query failed", () => {
    it("marks query progress in reducer as failed", () => {
      const request = { hash: 904239430, ql: `{ users { id } }` };
      const initialState = reducer(
        undefined,
        actions.queryStarted({
          request,
        }),
      );
      const subject = reducer(
        initialState,
        actions.queryFailed({ request }, [{ error: "an error" }]),
      );

      expect(subject).toMatchSnapshot();
    });
  });
});
