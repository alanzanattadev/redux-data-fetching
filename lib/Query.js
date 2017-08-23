// @flow

export default class Query {
  queryQL: string;
  variables: { [variableName: string]: mixed };
  onError: () => void;
  onCompleted: () => void;
  operationName: ?string;

  constructor(
    {
      queryQL,
      variables = {},
      onError = () => {},
      onCompleted = () => {},
      operationName,
    }: {
      queryQL: string,
      variables?: { [variableName: string]: mixed },
      onError?: () => void,
      onCompleted?: () => void,
      operationName?: string,
    } = {},
  ) {
    if (queryQL == null) {
      throw new Error(
        "queryQL has to be defined in the params of new Query: new Query({queryQL: `query ...`})",
      );
    }
    this.queryQL = queryQL;
    this.variables = variables;
    this.onError = onError;
    this.onCompleted = onCompleted;
    this.operationName = operationName;
  }

  setOperationName(name: string) {
    return new Query({
      queryQL: this.queryQL,
      variables: this.variables,
      onError: this.onError,
      onCompleted: this.onCompleted,
      operationName: name,
    });
  }
}
