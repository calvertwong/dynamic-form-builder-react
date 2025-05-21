export type TFieldType = "checkbox" | "textbox" | "radio" | "date";

export type TField = {
  label: string; // The label text associated with the field
  displayLabel: string | null;
  hintOrDesc: string | null;
  answer: string | number | boolean | null;
  unit?: string | null;
  required: boolean; // Whether the field is required
  fieldName: string; // Field name
  type: string; // The type of field (checkbox, textbox, radio, date)
  x: number; // X coordinate of the field on the page
  y: number; // Y coordinate of the field on the page (read from top)
  page: number; // page number of found field
  dependsOn: TDependsOn[] | null;
};

export type TDependsOn = {
  dependeeFieldName: string;
  condition?:
    | "greater than"
    | "less than"
    | "string equal"
    | "boolean equal"
    | "include"
    | "not include"
    | "has value";
  dependeeValue?: string | number | boolean;
  dependeeType?: "string" | "number" | "boolean";
};

export type TFinalJson = {
  question: string; // The question text string
  x: number; // X coordinate of the question on the page
  y: number; // Y coordinate of the question on the page (read from top)
  page: number; // page number of the found text
  displayQuestion: string | null;
  hintOrDesc: string | null;
  dependsOn: TDependsOn[] | null;
  fields: TField[];
};
