import React from "react";
import { fromJS, Map, List, Record } from "immutable";
import configureGraphQLConnecter from "./hoc";
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} from "graphql";
import { mount } from "enzyme";
import { compose, lifecycle } from "recompose";
import {
  DataReducerRecord,
  QueryRecord,
  ResultsRecord,
  QUERY_PROGRESS_PENDING,
} from "./reducer";
import { hashString } from "./utils";
import configureActions from "./actions";
import Mutation from "./Mutation";

const User = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    friends: { type: new GraphQLList(User) },
  }),
});

describe("HOC", () => {
  const actions = configureActions();
  const { GraphQLConnecter, DataHandlers } = configureGraphQLConnecter({
    actions,
    typesSchema: new GraphQLSchema({
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
        },
      }),
    }),
    selectorSchema: new GraphQLSchema({
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
        },
      }),
    }),
    recordTypes: {
      User: Record({
        id: null,
        name: null,
        description: null,
        friends: null,
      }),
    },
  });

  describe("DataHandlers", () => {
    it("passes others props to the wrapped components", () => {
      function Comp({ testProp }) {
        expect(testProp).toBeDefined();
        return null;
      }
      const ConnectedComp = DataHandlers({
        mapMutationsToProps: () => ({}),
      })(Comp);

      mount(
        <ConnectedComp
          testProp={true}
          data={new DataReducerRecord()}
          dispatch={() => {}}
        />,
      );
    });

    it("throws if dispatch is not passed as props", () => {
      function Comp({ testProp }) {
        return null;
      }
      const ConnectedComp = DataHandlers({
        mapMutationsToProps: () => ({}),
      })(Comp);

      expect(() =>
        mount(<ConnectedComp data={{}} />),
      ).toThrowErrorMatchingSnapshot();
    });

    it("throws if reducer is not passed as props", () => {
      function Comp({ testProp }) {
        return null;
      }
      const ConnectedComp = DataHandlers({
        mapMutationsToProps: () => ({}),
      })(Comp);

      expect(() =>
        mount(<ConnectedComp dispatch={() => {}} />),
      ).toThrowErrorMatchingSnapshot();
    });

    it("passes the handlers as props", () => {
      function Comp({ onClick }) {
        expect(onClick).toBeDefined();
        return null;
      }
      const ConnectedComp = DataHandlers({
        mapMutationsToProps: () => ({
          onClick: () => new Mutation({ mutationQL: "mutation {}" }),
        }),
      })(Comp);

      mount(
        <ConnectedComp data={new DataReducerRecord()} dispatch={() => {}} />,
      );
    });

    it("dispatches mutations when a handler is called", () => {
      function Comp({}) {
        return null;
      }
      const ConnectedComp = DataHandlers({
        mapMutationsToProps: () => ({
          onClick: () => new Mutation({ mutationQL: "mutation {}" }),
        }),
      })(Comp);
      const spy = jest.fn();

      const subject = mount(
        <ConnectedComp
          __uniqueID={2198392}
          data={new DataReducerRecord()}
          dispatch={spy}
        />,
      );

      subject.find(Comp).at(0).prop("onClick")();

      expect(spy).toHaveBeenCalled();
      expect(spy.mock.calls).toMatchSnapshot();
    });
    it("doesn't dispatch the mutation if returned mutation is null", () => {
      function Comp({}) {
        return null;
      }
      const ConnectedComp = DataHandlers({
        mapMutationsToProps: () => ({
          onClick: () => null,
        }),
      })(Comp);
      const spy = jest.fn();

      const subject = mount(
        <ConnectedComp data={new DataReducerRecord()} dispatch={spy} />,
      );

      subject.find(Comp).at(0).prop("onClick")();

      expect(spy).not.toHaveBeenCalled();
    });

    it("throws if a handler isn't a function", () => {
      function Comp({ testProp }) {
        return null;
      }
      const ConnectedComp = DataHandlers({
        mapMutationsToProps: () => ({
          onClick: 2,
        }),
      })(Comp);

      expect(() =>
        mount(
          <ConnectedComp dispatch={() => {}} data={new DataReducerRecord()} />,
        ),
      ).toThrowErrorMatchingSnapshot();
    });

    it("passes the query progress as props", () => {
      function Comp({ createUserQueryProgress, onClickQueryProgress }) {
        expect(createUserQueryProgress).toMatchSnapshot();
        expect(onClickQueryProgress).toMatchSnapshot();
        return null;
      }
      const ConnectedComp = DataHandlers({
        mapMutationsToProps: () => ({
          onClick: () => new Mutation({ mutationQL: "mutation {}" }),
          createUser: () => new Mutation({ mutationQL: "mutation {}" }),
        }),
      })(Comp);

      mount(
        <ConnectedComp
          __uniqueID={2198392}
          data={
            new DataReducerRecord({
              queries: Map({
                "1385894182": new QueryRecord({
                  progress: QUERY_PROGRESS_PENDING,
                }),
                "436150438": new QueryRecord({}),
              }),
            })
          }
          dispatch={() => {}}
        />,
      );
    });

    it("passes the bustQueryCache as props", () => {
      function Comp({ bustQueryCache }) {
        expect(bustQueryCache).toBeDefined();
        expect(typeof bustQueryCache).toBe("function");
        return null;
      }
      const ConnectedComp = DataHandlers({
        mapMutationsToProps: () => ({
          createUser: () => new Mutation({ mutationQL: "mutation {}" }),
        }),
      })(Comp);

      mount(
        <ConnectedComp data={new DataReducerRecord()} dispatch={() => {}} />,
      );
    });

    it("dispatches an action when bustQueryCache is called", () => {
      function Comp({}) {
        return null;
      }
      const ConnectedComp = DataHandlers({
        mapMutationsToProps: () => ({}),
      })(Comp);
      const spy = jest.fn();

      const subject = mount(
        <ConnectedComp
          __uniqueID={2198392}
          data={new DataReducerRecord()}
          dispatch={spy}
        />,
      );

      subject.find(Comp).at(0).prop("bustQueryCache")();

      expect(spy).toHaveBeenCalled();
      expect(spy.mock.calls).toMatchSnapshot();
    });

    it("busts cache on unmount", () => {
      function Comp({}) {
        return null;
      }
      const ConnectedComp = DataHandlers({
        mapMutationsToProps: () => ({
          onClick: () => new Mutation({ mutationQL: "" }),
          onRemove: () => new Mutation({ mutationQL: "" }),
        }),
      })(Comp);
      const spy = jest.fn();

      const subject = mount(
        <ConnectedComp
          __uniqueID={2198392}
          data={
            new DataReducerRecord({
              queries: Map({
                "1385894182": new QueryRecord({}),
                "436150438": new QueryRecord({}),
              }),
            })
          }
          dispatch={spy}
        />,
      );

      subject.unmount();

      expect(spy).toHaveBeenCalled();
      expect(spy.mock.calls).toMatchSnapshot();
    });
  });

  describe("GraphQLConnecter", () => {
    it("should fetch data on mount", () => {
      let MyComponent = ({ name, description }) =>
        <div>
          <h1>
            {name}
          </h1>
          <p>
            {description}
          </p>
        </div>;
      let spy = jest.fn();
      let MyFetcherComponent = GraphQLConnecter(
        props => `{user(id: "${props.id}") {name, description}}`,
        (cache, props) => cache.getIn(["users", props.id]).toJS(),
      )(MyComponent);
      let subject = mount(
        <MyFetcherComponent
          dispatch={spy}
          data={fromJS({
            users: { "1": { name: "Jon", description: "Good" } },
          })}
          id={"1"}
        />,
      );

      expect(spy).toBeCalledWith({
        type: "GRAPHQL_FETCH",
        graphql: true,
        payload: '{user(id: "1") {name, description}}',
      });
    });

    it("should display with computed props", () => {
      let MyComponent = ({ name, description }) =>
        <div>
          <h1>
            {name}
          </h1>
          <p>
            {description}
          </p>
        </div>;
      let MyFetcherComponent = GraphQLConnecter(
        props => `{user(id: "${props.id}") {name, description}}`,
        (cache, props) => cache.getIn(["users", props.id]).toJS(),
      )(MyComponent);
      let subject = mount(
        <MyFetcherComponent
          dispatch={() => {}}
          data={fromJS({
            users: { "1": { name: "Jon", description: "Good" } },
          })}
          id={"1"}
        />,
      );

      expect(subject.find(MyComponent).at(0).prop("name")).toBe("Jon");
      expect(subject.find(MyComponent).at(0).prop("description")).toBe("Good");
    });

    it("should refetch data when needs change", () => {
      let MyComponent = ({ name, description }) =>
        <div>
          <h1>
            {name}
          </h1>
          <p>
            {description}
          </p>
        </div>;
      let spy = jest.fn();
      let data = fromJS({
        users: {
          "1": { name: "Jon", description: "Good" },
          "2": { name: "Doe", description: "Bad" },
        },
      });
      let MyFetcherComponent = GraphQLConnecter(
        props => `{user(id: "${props.id}") {name, description}}`,
        (cache, props) => cache.getIn(["users", props.id]),
      )(MyComponent);
      let subject = mount(
        <MyFetcherComponent dispatch={() => {}} data={data} id={"1"} />,
      );

      subject.setProps({ dispatch: spy, data: data, id: "2" });

      expect(spy).toBeCalledWith({
        type: "GRAPHQL_FETCH",
        graphql: true,
        payload: '{user(id: "2") {name, description}}',
      });
    });

    it("should refetch data on call of refetch props", () => {
      let MyComponent = ({ name, description }) =>
        <div>
          <h1>
            {name}
          </h1>
          <p>
            {description}
          </p>
        </div>;
      let spy = jest.fn();
      let data = fromJS({
        users: {
          "1": { name: "Jon", description: "Good" },
          "2": { name: "Doe", description: "Bad" },
        },
      });
      let MyFetcherComponent = GraphQLConnecter(
        props => `{user(id: "1") {name, description}}`,
        (cache, props) => cache.getIn(["users", props.id]),
      )(MyComponent);
      let subject = mount(
        <MyFetcherComponent dispatch={() => {}} data={data} id={"1"} />,
      );

      subject.setProps({ dispatch: spy, data: data });
      subject.find(MyComponent).at(0).prop("refetch")();

      expect(spy).toBeCalledWith({
        type: "GRAPHQL_FETCH",
        graphql: true,
        payload: '{user(id: "1") {name, description}}',
      });
    });

    it("selects data in the cache", done => {
      const request = `{ users { id, name, friends { id, name, friends { id, name } } } }`;
      const hash = hashString(request);
      const User = compose(
        GraphQLConnecter(() => request),
        lifecycle({
          componentDidUpdate() {
            if (List.isList(this.props.users)) {
              expect(this.props).toMatchSnapshot();
              done();
            }
          },
        }),
      )(({ users }) => <div />);
      const dataReducer = new DataReducerRecord({
        entities: Map({
          User: Map({
            1: {
              id: 1,
              name: "Alan",
              friends: [2, 3],
            },
            2: {
              id: 2,
              name: "Antoine",
              friends: [1],
            },
            3: {
              id: 3,
              name: "Sophie",
              friends: null,
            },
          }),
        }),
        queries: Map({
          [hash]: new QueryRecord({
            results: new ResultsRecord({
              byQuery: Map({
                users: [1, 2],
              }),
            }),
          }),
        }),
      });
      const subject = mount(<User data={dataReducer} dispatch={() => {}} />);
    });
  });
});
