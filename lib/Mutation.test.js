// @flow

import Mutation from "./Mutation";

describe("Mutation", () => {
  describe("setOperationName", () => {
    it("recreate a new Mutation", () => {
      const mutation = new Mutation({
        mutationQL: `mutation CreateUser($input: UserInput) {
        createUser(input: $input) {
          id,
        }
      }`,
      });
      const subject = mutation.setOperationName("create");

      expect(subject).not.toBe(mutation);
      expect(subject.operationName).not.toBe(mutation.operationName);
    });

    it("changes operationName and keeps others data", () => {
      const mutationQL = `mutation CreateUser($input: UserInput) {
        createUser(input: $input) {
          id,
        }
      }`;
      const onError = () => {};
      const onCompleted = () => {};
      const variables = {};
      const mutation = new Mutation({
        mutationQL,
        variables,
        onError,
        onCompleted,
      });
      const subject = mutation.setOperationName("create");

      expect(subject.operationName).toBe("create");
      expect(subject.mutationQL).toBe(mutationQL);
      expect(subject.variables).toBe(variables);
      expect(subject.onError).toBe(onError);
      expect(subject.onCompleted).toBe(onCompleted);
    });
  });
});
