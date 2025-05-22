export type TEditableFieldName = {
  label: string;
  text: string;
  isEditing: boolean;
  onFocus?: () => void;
  onSearchClick?: () => void;
  onBlur?: () => void;
}