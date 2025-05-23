import { TDependsOn } from "@features/builder/Builder.types";

export type TStringConditions = {
  notNull?: boolean;
  notUndefined?: boolean;
  notEmptyString?: boolean;
  includedString?: string;
  equalsTo?: string;
};

export type TStringArrayConditions = {
  notNull?: boolean;
  notUndefined?: boolean;
  notEmptyArray?: boolean;
  includedAllStrings?: string[];
  includedSomeStrings?: string[];
};

export type TNumberConditions = {
  notNull?: boolean;
  notUndefined?: boolean;
  moreThan?: number;
  lessThan?: number;
  equalsTo?: number;
};

export type TNumberArrayConditions = {
  notNull?: boolean;
  notUndefined?: boolean;
  notEmptyArray?: boolean;
};

export type TBooleanConditions = {
  notNull?: boolean;
  notUndefined?: boolean;
  equalsTo?: boolean;
};

export type TObjectArrayConditions = {
  notNull?: boolean;
  notUndefined?: boolean;
  notEmptyArray?: boolean;
};

// --- Conditional Type Mapping ---
export type TDisplayIfConditions<T> =
  T extends string ? TStringConditions :
  T extends string[] ? TStringArrayConditions :
  T extends number ? TNumberConditions :
  T extends number[] ? TNumberArrayConditions :
  T extends boolean ? TBooleanConditions :
  T extends TDependsOn[] ? TObjectArrayConditions :
  T extends File ? TObjectArrayConditions :
  never;

export type TDisplayIfProps<T> = {
  variable: T | null | undefined;
  rules: TDisplayIfConditions<T>;
  children: React.ReactNode;
};