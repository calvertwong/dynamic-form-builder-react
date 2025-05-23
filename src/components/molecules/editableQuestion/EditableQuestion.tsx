import { ActionIcon, Group, Stack, Text, Textarea } from "@mantine/core"
import { DisplayIf } from "components/organisms/displayIf/DisplayIf"
import { IconCheck, IconPencil, IconSearch } from "@tabler/icons-react"
import { TEditableQuestion } from "./EditableQuestion.types"
import { memo } from "react"

const EditableQuestionNotMemoized = ({ label, text, isEditing, onEditClick, onEditSaveClick, onItemChange, editMode, searched, onSearchClick, ...props }: TEditableQuestion) => {
  return (
    <Stack gap="0" w="100%" align="flex-start">
      {/* 
          Expected Question UI:
          =======================================
          Question 1: 
          =======================================
      */}
      <Group gap="0">
        <Text fw={600}>{label}</Text>
        <Text fw={600}>:</Text>
      </Group>

      {/* 
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
        <Group gap="xs" w="100%" justify="space-between">
          <Text flex={1} lh={"normal"}>{text}</Text>
          <ActionIcon variant={searched ? "filled" : "transparent"} color="blue" size="sm" title="Field location" onClick={onSearchClick}><IconSearch /></ActionIcon>
          <DisplayIf<boolean> rules={{ equalsTo: true }} variable={editMode}>
            <ActionIcon variant="transparent" color="blue" size="sm" onClick={onEditClick}><IconPencil /></ActionIcon>
          </DisplayIf>

        </Group>
      </DisplayIf>

      {/* 
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
        <Group gap="xs" w="100%" flex={1}>
          <Textarea minRows={1} autosize value={text} flex={1} onChange={onItemChange} {...props} />
          <ActionIcon variant="transparent" color="green" onClick={onEditSaveClick}><IconCheck /></ActionIcon>
        </Group>
      </DisplayIf>
    </Stack>
  )
}

export const EditableQuestion = memo(EditableQuestionNotMemoized)