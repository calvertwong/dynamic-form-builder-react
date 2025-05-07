export type TFieldType = 'checkbox' | 'textbox' | 'radio' | 'date';

export type TField = {
  label: string; // The label text associated with the field
  required: boolean; // Whether the field is required
  fieldName: string; // Field name
  type: TFieldType; // The type of field (checkbox, textbox, radio, date)
  x: number; // X coordinate of the field on the page
  y: number; // Y coordinate of the field on the page (read from top)
  page: number; // page number of found field
}

export type TFinalJson = {
  question: string; // The question text string
  x: number; // X coordinate of the question on the page
  y: number; // Y coordinate of the question on the page (read from top)
  page: number; // page number of the found text
  fields: TField[];
}