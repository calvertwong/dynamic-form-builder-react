export type TEditableLabel = {
  label: string;
  text: string;
  isEditing: boolean;
  shouldDisplay?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}