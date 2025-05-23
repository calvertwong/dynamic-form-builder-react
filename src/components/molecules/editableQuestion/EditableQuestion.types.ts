export type TEditableQuestion = {
  label: string;
  text: string;
  isEditing: boolean;
  searched?: boolean;
  onSearchClick?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onEditClick: () => void;
  onEditSaveClick: () => void;
  onItemChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  editMode: boolean;
}