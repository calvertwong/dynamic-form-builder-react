import { TDependsOn } from "@features/builder/Builder.types";
import { TDisplayIfProps, TStringConditions, TStringArrayConditions, TNumberConditions, TNumberArrayConditions, TBooleanConditions, TObjectArrayConditions } from "./DisplayIf.types";

const notNullCheck = (variable: string | number | boolean | string[] | number[] | object[] | null | undefined) => variable !== null;
const notUndefinedCheck = (variable: string | number | boolean | string[] | number[] | object[] | null | undefined) => variable !== undefined;

const stringCheck = (rules: TStringConditions, variable: string) => {
  let shouldDisplay = false;

  if (rules.notNull) shouldDisplay = notNullCheck(variable);
  if (rules.notUndefined) shouldDisplay = notUndefinedCheck(variable);
  if (rules.notEmptyString) shouldDisplay = variable.trim() !== "";
  if (rules.includedString !== undefined) shouldDisplay = variable.includes(rules.includedString);
  if (rules.equalsTo !== undefined) shouldDisplay = variable === rules.equalsTo;

  return shouldDisplay;
}

const stringArrayCheck = (rules: TStringArrayConditions, variable: string[]) => {
  let shouldDisplay = false;

  if (rules.notNull) shouldDisplay = notNullCheck(variable);
  if (rules.notUndefined) shouldDisplay = notUndefinedCheck(variable);
  if (rules.notEmptyArray) shouldDisplay = variable.length > 0;
  if (rules.includedAllStrings !== undefined) shouldDisplay = rules.includedAllStrings.every(str => variable.includes(str));
  if (rules.includedSomeStrings !== undefined) shouldDisplay = rules.includedSomeStrings.some(str => variable.includes(str));

  return shouldDisplay;
}

const numberCheck = (rules: TNumberConditions, variable: number) => {
  let shouldDisplay = false;

  if (rules.notNull) shouldDisplay = notNullCheck(variable);
  if (rules.notUndefined) shouldDisplay = notUndefinedCheck(variable);
  if (rules.moreThan !== undefined) shouldDisplay = variable > rules.moreThan;
  if (rules.lessThan !== undefined) shouldDisplay = variable < rules.lessThan;
  if (rules.equalsTo !== undefined) shouldDisplay = variable === rules.equalsTo;

  return shouldDisplay;
}

const numberArrayCheck = (rules: TNumberArrayConditions, variable: number[]) => {
  let shouldDisplay = false;

  if (rules.notNull) shouldDisplay = notNullCheck(variable);
  if (rules.notUndefined) shouldDisplay = notUndefinedCheck(variable);
  if (rules.notEmptyArray) shouldDisplay = variable.length > 0;

  return shouldDisplay;
}

const booleanCheck = (rules: TBooleanConditions, variable: boolean) => {
  let shouldDisplay = false;

  if (rules.notNull) shouldDisplay = notNullCheck(variable);
  if (rules.notUndefined) shouldDisplay = notUndefinedCheck(variable);
  if (rules.equalsTo !== undefined) shouldDisplay = variable === rules.equalsTo;

  return shouldDisplay;
}

const objectCheck = (rules: TObjectArrayConditions, variable: TDependsOn[]) => {
  let shouldDisplay = false;

  if (rules.notNull) shouldDisplay = notNullCheck(variable);
  if (rules.notUndefined) shouldDisplay = notUndefinedCheck(variable);
  if (rules.notEmptyArray) shouldDisplay = variable.length > 0;

  return shouldDisplay;
}

export const DisplayIf = <T,>({ variable, rules, children }: TDisplayIfProps<T>) => {
  let shouldDisplay = false;

  // String
  if (typeof variable === "string") {
    shouldDisplay = stringCheck(rules as TStringConditions, variable)
  }
  // String[]
  else if (Array.isArray(variable) && variable.every(value => typeof value === "string")) {
    shouldDisplay = stringArrayCheck(rules as TStringArrayConditions, variable)
  }
  // Number
  else if (typeof variable === "number") {
    shouldDisplay = numberCheck(rules as TNumberConditions, variable)
  }
  // Number[]
  else if (Array.isArray(variable) && variable.every(value => typeof value === "number")) {
    shouldDisplay = numberArrayCheck(rules as TNumberArrayConditions, variable)
  }
  // Boolean
  else if (typeof variable === "boolean") {
    shouldDisplay = booleanCheck(rules as TBooleanConditions, variable)
  } 
  // TDependsOn
  else if (typeof variable === "object" && variable !== null && "dependeeFieldName" in variable) {
    shouldDisplay = objectCheck(rules as object, variable as TDependsOn[])
  }

  return shouldDisplay ? children : null;
};
