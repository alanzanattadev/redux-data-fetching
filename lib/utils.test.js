import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  visit,
  visitWithTypeInfo,
  parse,
  TypeInfo,
  getNamedType,
} from "graphql";
import { Map, List, Record } from "immutable";
import { selectedDataHaveChanged } from "./utils";
import { DataReducerRecord, ResultsRecord, QueryRecord } from "./reducer";

const Event = new GraphQLObjectType({
  name: "Event",
  fields: () => ({
    timestamp: { type: GraphQLInt },
    triggered_by: { type: Boss },
  }),
});

const User = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    friends: { type: new GraphQLList(User) },
    boss: { type: Boss },
    events: { type: new GraphQLList(Event) },
  }),
});

const Boss = new GraphQLObjectType({
  name: "Boss",
  fields: () => ({
    id: { type: GraphQLString },
    company: { type: GraphQLString },
  }),
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "RootQuery",
    fields: {
      user: {
        type: User,
        resolve: () => {},
        args: { id: { type: GraphQLString } },
      },
      users: {
        type: new GraphQLList(User),
        resolve: (p, args, context) =>
          context.db && context.queryHash ? [] : null,
      },
      boss: {
        type: Boss,
        resolve: () => boss1,
      },
    },
  }),
});

const UserRecord = Record({
  id: null,
  name: null,
  description: null,
  friends: null,
  boss: null,
  events: null,
});

const BossRecord = Record({
  id: null,
  company: null,
});

const EventRecord = Record({
  timestamp: 0,
  triggered_by: null,
});

const user1 = new UserRecord({
  id: 1,
  boss: 2,
  friends: [1],
  events: [
    new EventRecord({ triggered_by: 2 }),
    new EventRecord(),
    new EventRecord(),
  ],
});

const boss1 = new BossRecord({
  id: 2,
  company: "Microsoft",
});

const query = new QueryRecord({
  results: new ResultsRecord({
    byQuery: Map({
      users: [1],
      boss: 2,
    }),
  }),
});

const hash = "hash";
const queries = Map({ [hash]: query });

const reducer1 = new DataReducerRecord({
  entities: Map({
    User: Map({
      "1": user1,
    }),
    Boss: Map({
      "2": boss1,
    }),
  }),
  queries,
});

const reducer2 = new DataReducerRecord({
  entities: Map({
    User: Map({
      "1": user1,
    }),
    Boss: Map({
      "2": boss1.set("company", "Google"),
    }),
  }),
  queries,
});

describe("Utils", () => {
  describe("selectedDataHaveChanged", () => {
    it("can detect change correctly", () => {
      expect(
        selectedDataHaveChanged({
          query: `{ users { id, friends { id, name, friends { id, events { timestamp, triggered_by { company } } } }, boss { company } } }`,
          schema,
          reducer1,
          reducer2,
          queryHash: hash,
        }),
      ).toEqual(true);

      expect(
        selectedDataHaveChanged({
          query: `{ users { id, friends { id, name, friends { id, events { timestamp, triggered_by { company } } } } } }`,
          schema,
          reducer1,
          reducer2,
          queryHash: hash,
        }),
      ).toEqual(true);

      expect(
        selectedDataHaveChanged({
          query: `{ users { id, friends { id, name, friends { id, events { timestamp } } } } }`,
          schema,
          reducer1,
          reducer2,
          queryHash: hash,
        }),
      ).toEqual(false);

      expect(
        selectedDataHaveChanged({
          query: `{ boss { company } }`,
          schema,
          reducer1,
          reducer2,
          queryHash: hash,
        }),
      ).toEqual(true);
    });
  });
});
