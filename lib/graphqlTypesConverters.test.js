import React from 'react';
import { shallow, mount } from 'enzyme';
import { graphQLizr, getDataFromResponse } from './graphqlTypesConverters';
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
} from 'graphql';

describe('Converters', () => {
  describe('To normalizr', () => {
    describe('Schema to normalizr model', () => {
      it('should convert basic schema correctly', () => {
        let UserType = new GraphQLObjectType({
          name: 'User',
          fields: () => ({
            id: { type: GraphQLInt },
            name: { type: GraphQLString },
            friends: { type: new GraphQLList(UserType) },
          }),
        });
        let Power = new GraphQLObjectType({
          name: 'Power',
          fields: {
            possible_entities: {type: UserType},
          }
        })
        let Skill = new GraphQLObjectType({
          name: 'Skill',
          fields: () => ({
            id: { type: GraphQLInt },
            power: { type: GraphQLInt },
            target: { type: UserType },
          }),
        });
        let littleSchema = new GraphQLSchema({
          query: new GraphQLObjectType({
            name: 'RootQueryType',
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
                }
              }
            },
          }),
        });
        let subject = graphQLizr(littleSchema);

        expect(subject).toMatchSnapshot();
        expect(getDataFromResponse(subject.converters, {users: [{id: '1'}], skills: [{id: '2'}]})).toMatchSnapshot();
        expect(getDataFromResponse(subject.converters, {user: {id: '2'}})).toMatchSnapshot();
      });
    });
  });
});
