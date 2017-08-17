// @flow

import Query from "./Query";

describe("Query", () => {
  describe("setOperationName", () => {
    it("recreate a new Query", () => {
      const query = new Query({
        queryQL: `query CreateUser($input: UserInput) {
        createUser(input: $input) {
          id,
        }
      }`,
      });
      const subject = query.setOperationName("create");

      expect(subject).not.toBe(query);
      expect(subject.operationName).not.toBe(query.operationName);
    });

    it("changes operationName and keeps others data", () => {
      const queryQL = `query CreateUser($input: UserInput) {
        createUser(input: $input) {
          id,
        }
      }`;
      const onError = () => {};
      const onCompleted = () => {};
      const variables = {};
      const query = new Query({
        queryQL,
        variables,
        onError,
        onCompleted,
      });
      const subject = query.setOperationName("create");

      expect(subject.operationName).toBe("create");
      expect(subject.queryQL).toBe(queryQL);
      expect(subject.variables).toBe(variables);
      expect(subject.onError).toBe(onError);
      expect(subject.onCompleted).toBe(onCompleted);
    });
  });
});
