export type TEditableLabel = {
  label: string;
  text: string;
  isEditing: boolean;
  sameAsQuestion?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  onEditClick: () => void;
  onEditSaveClick: () => void;
  onItemChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  editMode: boolean;
}