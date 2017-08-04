// @flow

import { Stack, List } from "immutable";
import {
  TypeInfo,
  GraphQLSchema,
  Kind,
  GraphQLList,
  GraphQLObjectType,
  getNamedType,
  visit,
  visitWithTypeInfo,
  parse,
} from "graphql";
import type { ASTNode, FieldNode } from "graphql";
import { DataReducerRecord } from "./reducer";
import { isEntity } from "./graphqlTypesConverters";

export function hashString(str: string): number {
  let hash = 0;
  if (str.length == 0) return hash;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

export class TypeInfoWithValuesComparator extends TypeInfo {
  _value1Stack: Stack<mixed>;
  _value2Stack: Stack<mixed>;
  _reducer1: DataReducerRecord;
  _reducer2: DataReducerRecord;
  _queryHash1: string | number;
  _queryHash2: string | number;
  _shouldBreak: boolean;

  constructor({
    schema,
    reducer1,
    reducer2,
    queryHash1,
    queryHash2,
  }: {
    schema: GraphQLSchema,
    reducer1: DataReducerRecord,
    reducer2: DataReducerRecord,
    queryHash1: string | number,
    queryHash2: string | number,
  }) {
    super(schema);
    this._value1Stack = Stack();
    this._value2Stack = Stack();
    this._reducer1 = reducer1;
    this._reducer2 = reducer2;
    this._queryHash1 = queryHash1;
    this._queryHash2 = queryHash2;
    this._shouldBreak = false;
  }

  _getQueryValue(
    node: FieldNode,
    reducer: DataReducerRecord,
    queryHash: string | number,
  ) {
    if (reducer == null || queryHash == null)
      throw new Error(
        "Trying to determine whether selection of data has to be relaunched, but encounterd an error. Missing dependency on reducer or queryHash",
      );
    const queryResult = reducer.getIn([
      "queries",
      queryHash,
      "results",
      "byQuery",
      node.alias != null ? node.alias.value : node.name.value,
    ]);
    const currentType = this.getType();
    if (queryResult == null) {
      if (currentType instanceof GraphQLList) return [];
      else return null;
    }
    if (currentType instanceof GraphQLList) {
      const typeName = getNamedType(currentType.ofType).name;
      return queryResult.map(id =>
        reducer.getIn(["entities", typeName, id.toString()]),
      );
    } else if (queryResult != null) {
      const namedType = getNamedType(currentType);
      if (namedType != undefined) {
        return reducer.getIn([
          "entities",
          namedType.name,
          queryResult.toString(),
        ]);
      } else {
        console.error("CurrentType:", currentType);
        throw new Error(
          "Weird behavior has been encountered with an unnamed type as current type",
        );
      }
    } else {
      return null;
    }
  }

  _getEntityValue(
    node: FieldNode,
    reducer: DataReducerRecord,
    lastValue: mixed,
  ) {
    if (
      node.selectionSet != null &&
      typeof lastValue === "object" &&
      lastValue != null
    ) {
      const fieldName = node.alias ? node.alias.value : node.name.value;
      if (Array.isArray(lastValue) || List.isList(lastValue))
        // $FlowFixMe
        return lastValue.map(v => this._getEntityValue(node, reducer, v));
      const fieldValue = lastValue[fieldName];
      const namedType = getNamedType(this.getType());
      if (namedType && isEntity(namedType) === false) {
        return fieldValue;
      }
      if (
        this.getType() instanceof GraphQLList &&
        fieldValue != null &&
        (Array.isArray(fieldValue) || List.isList(fieldValue))
      ) {
        if (namedType) {
          const entityName = namedType.name;
          // $FlowFixMe
          return fieldValue.map(id =>
            reducer.getIn(["entities", entityName, id.toString()]),
          );
        } else {
          console.error(
            "Weird state encountered trying to get the named type of",
            this.getType(),
            "at node",
            node,
            "knowing that ",
            fieldValue,
            "is an Array or a Immutable.List",
          );
          throw new Error("Aborting.");
        }
      } else if (fieldValue != null) {
        if (namedType) {
          const entityName = namedType.name;
          // $FlowFixMe
          return reducer.getIn(["entities", entityName, fieldValue.toString()]);
        } else {
          console.error(
            "Weird state encountered trying to get the named type of",
            this.getType(),
            "at node",
            node,
            "knowing that ",
            fieldValue,
            "is an Object or a Immutable.Record",
          );
          throw new Error("Aborting.");
        }
      } else {
        return null;
      }
    } else {
      return lastValue;
    }
  }

  _haveChanged(value1: mixed, value2: mixed): boolean {
    if (typeof value1 !== typeof value2) return true;
    if (Array.isArray(value1) || List.isList(value1)) {
      if (Array.isArray(value2) === true || List.isList(value2) === true) {
        // $FlowFixMe
        return value1.some((v1: mixed, i: number) => {
          return this._haveChanged(
            v1,
            // $FlowFixMe
            Array.isArray(value2) ? value2[i] : value2.get(i),
          );
        });
      } else return true;
    } else if (typeof value1 === "object" && value1 !== null) {
      if (value2 === null) return true;
      return value1 !== value2;
    } else {
      return value1 !== value2;
    }
  }

  enter(node: ASTNode) {
    super.enter(node);
    if (node.kind === Kind.FIELD) {
      let value1;
      let value2;
      if (this.getParentType() === this._schema.getQueryType()) {
        value1 = this._getQueryValue(node, this._reducer1, this._queryHash1);
        this._value1Stack = this._value1Stack.unshift(value1);
        value2 = this._getQueryValue(node, this._reducer2, this._queryHash2);
        this._value2Stack = this._value2Stack.push(value2);
      } else {
        value1 = this._getEntityValue(
          node,
          this._reducer1,
          this._value1Stack.peek(),
        );
        this._value1Stack = this._value1Stack.push(value1);
        value2 = this._getEntityValue(
          node,
          this._reducer2,
          this._value2Stack.peek(),
        );
        this._value2Stack = this._value2Stack.push(value2);
      }
      if (this._shouldBreak === false) {
        this._shouldBreak = this._haveChanged(value1, value2);
      }
    }
  }

  leave(node: ASTNode) {
    if (node.kind === Kind.FIELD) {
      this._value1Stack = this._value1Stack.pop();
      this._value2Stack = this._value2Stack.pop();
    }
    super.leave(node);
  }

  getValue1(): mixed {
    return this._value1Stack.peek();
  }

  getValue2(): mixed {
    return this._value2Stack.peek();
  }

  shouldBreak(): boolean {
    return this._shouldBreak;
  }
}

export function selectedDataHaveChanged({
  query,
  schema,
  queryHash,
  reducer1,
  reducer2,
}: {
  query: string,
  schema: GraphQLSchema,
  queryHash: string | number,
  reducer1: DataReducerRecord,
  reducer2: DataReducerRecord,
}): boolean {
  const typeInfo = new TypeInfoWithValuesComparator({
    schema,
    reducer1,
    reducer2,
    queryHash1: queryHash,
    queryHash2: queryHash,
  });
  let hasChanged = false;
  visit(
    parse(query),
    visitWithTypeInfo(typeInfo, {
      [Kind.FIELD]: {
        enter(node) {
          hasChanged = typeInfo.shouldBreak();
        },
      },
    }),
  );
  return hasChanged;
}
