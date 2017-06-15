"use babel";
// @flow

import { selectData } from "./selectors";
import { fromJS, is, Map } from "immutable";

describe("Selectors", () => {
  describe("selectData", () => {
    let data = fromJS({
      tasks: [],
      users: [
        { id: "1", name: "Alan" },
        { id: "2", name: "Zanatta" },
        { id: "3", name: "Batman" },
      ],
      appointments: [],
      credentials: {
        token: "mytoken",
      },
    });

    it("should return root data when resource is an array", () => {
      let subject = selectData(data, "{users {name}}");

      expect(is(subject, Map().set("users", data.get("users")))).toBe(true);
    });

    it("should return null when resource isn't found in array", () => {
      let subject = selectData(data, '{users(id: "4") {name}}');

      expect(is(subject, Map().set("users", null))).toBe(true);
    });

    it("should return null when resource isn't found in object", () => {
      let subject = selectData(data, "{salut}");

      expect(is(subject, Map().set("salut", null))).toBe(true);
    });

    it("should return root data when resource is an object", () => {
      let subject = selectData(data, "{credentials {token}}");

      expect(is(subject, fromJS({ credentials: { token: "mytoken" } }))).toBe(
        true,
      );
    });

    it("should return root object when resource is an array but selected with id", () => {
      let subject = selectData(data, '{users(id: "2") {name}}');

      expect(is(subject, fromJS({ users: { id: "2", name: "Zanatta" } }))).toBe(
        true,
      );
    });
  });
});
