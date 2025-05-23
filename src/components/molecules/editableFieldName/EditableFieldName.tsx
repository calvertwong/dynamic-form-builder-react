import { ActionIcon, Group, Text, Textarea } from "@mantine/core"
import { DisplayIf } from "components/organisms/displayIf/DisplayIf"
import { IconCheck, IconPencil, IconSearch } from "@tabler/icons-react"
import { TEditableFieldName } from "./EditableFieldName.types"
import { memo } from "react"
import styles from "./EditableFieldName.module.scss"

const EditableFieldNameNotMemoized = ({ label, text, isEditing, onSearchClick, searched, onEditClick, onEditSaveClick, onItemChange, editMode, ...props }: TEditableFieldName) => {
  return (
    <Group gap="xs" w="100%" align="flex-start">
      {/* 
          Field Label

          Expected Label UI:
          =======================================
          Label    : 
          =======================================
      */}
      <Group justify="space-between" w="15ch">
        <Text fz="sm" fw={600}>{label}</Text>
        <Text fz="sm" fw={600}>:</Text>
      </Group>

      {/* 
          Field Label

          Display textarea and check icon if 
          1) field label is different than the question
          2) isEditing is true 

          Expected Label UI:
          =======================================
                     ┌────────────────────────┐
          Label    : │       (Textarea)       │ ✔
                     └────────────────────────┘
          =======================================
      */}
      <DisplayIf<boolean> rules={{ equalsTo: true }} variable={isEditing}>
        <Group gap="xs" flex={1}>
          <Textarea minRows={1} autosize value={text} flex={1} onChange={onItemChange} {...props} />
          <ActionIcon variant="transparent" color="green" onClick={onEditSaveClick}><IconCheck /></ActionIcon>
        </Group>
      </DisplayIf >

      {/* 
          Field Label

          Display text if 
          1) field label is different than the question
          2) isEditing is false 

          Display edit icon if
          1) hover over the text

          Expected Label UI:
          =======================================
          Label    : Some label value          🖉
          =======================================
      */}
      <DisplayIf<boolean> rules={{ equalsTo: false }} variable={isEditing}>
        <Group gap="xs" flex={1}>
          <Text className={styles.breakWord} lh={"normal"} lineClamp={2} flex={1} {...props}>{text}</Text>
          <ActionIcon variant={searched ? "filled" : "transparent"} color="blue" size="sm" title="Field location" onClick={onSearchClick}><IconSearch /></ActionIcon>
          <DisplayIf<boolean> rules={{ equalsTo: true }} variable={editMode}>
            <ActionIcon variant="transparent" color="blue" size="sm" onClick={onEditClick}><IconPencil /></ActionIcon>
          </DisplayIf>
        </Group>
      </DisplayIf >

    </Group >
  )
}

export const EditableFieldName = memo(EditableFieldNameNotMemoized)