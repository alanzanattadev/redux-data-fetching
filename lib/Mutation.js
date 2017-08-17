// @flow

export default class Mutation {
  mutationQL: string;
  variables: { [variableName: string]: mixed };
  onError: () => void;
  onCompleted: () => void;
  operationName: ?string;

  constructor(
    {
      mutationQL,
      variables = {},
      onError = () => {},
      onCompleted = () => {},
      operationName,
    }: {
      mutationQL: string,
      variables?: { [variableName: string]: mixed },
      onError?: () => void,
      onCompleted?: () => void,
      operationName?: string,
    } = {},
  ) {
    if (mutationQL == null) {
      throw new Error(
        "mutationQL has to be defined in the params of new Mutation: new Mutation({mutationQL: `mutation ...`})",
      );
    }
    this.mutationQL = mutationQL;
    this.variables = variables;
    this.onError = onError;
    this.onCompleted = onCompleted;
    this.operationName = operationName;
  }

  setOperationName(name: string) {
    return new Mutation({
      mutationQL: this.mutationQL,
      variables: this.variables,
      onError: this.onError,
      onCompleted: this.onCompleted,
      operationName: name,
    });
  }
}
