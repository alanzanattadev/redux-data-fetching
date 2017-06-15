import React from "react";
import TestUtils from "react-addons-test-utils";
import { fromJS } from "immutable";
import GraphQLConnecter from "./hoc";
import { mount } from "enzyme";

describe("HOC", () => {
  it("should fetch data on mount", () => {
    let MyComponent = ({ name, description }) =>
      <div>
        <h1>{name}</h1>
        <p>{description}</p>
      </div>;
    let spy = jest.fn();
    let MyFetcherComponent = GraphQLConnecter(
      props => `{user(id: "${props.id}") {name, description}}`,
      (cache, props) => cache.getIn(["users", props.id]).toJS(),
    )(MyComponent);
    let subject = mount(
      <MyFetcherComponent
        dispatch={spy}
        data={fromJS({ users: { "1": { name: "Jon", description: "Good" } } })}
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
        <h1>{name}</h1>
        <p>{description}</p>
      </div>;
    let MyFetcherComponent = GraphQLConnecter(
      props => `{user(id: "${props.id}") {name, description}}`,
      (cache, props) => cache.getIn(["users", props.id]).toJS(),
    )(MyComponent);
    let subject = mount(
      <MyFetcherComponent
        dispatch={() => {}}
        data={fromJS({ users: { "1": { name: "Jon", description: "Good" } } })}
        id={"1"}
      />,
    );

    expect(subject.find(MyComponent).at(0).prop("name")).toBe("Jon");
    expect(subject.find(MyComponent).at(0).prop("description")).toBe("Good");
  });

  it("should refetch data when needs change", () => {
    let MyComponent = ({ name, description }) =>
      <div>
        <h1>{name}</h1>
        <p>{description}</p>
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
});
