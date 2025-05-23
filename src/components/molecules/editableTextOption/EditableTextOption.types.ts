import { ComboboxItem } from "@mantine/core";

export type TEditableLabelOption = {
  label: string;
  text: string;
  isEditing: boolean;
  onEditClick: () => void;
  onEditSaveClick: () => void;
  onItemChange: (value: string | null, option: ComboboxItem) => void;
  editMode: boolean;
}