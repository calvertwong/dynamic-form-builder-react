import { ActionIcon, Group, Text, Textarea } from "@mantine/core"
import { DisplayIf } from "components/organisms/displayIf/DisplayIf"
import { IconCheck, IconPencil } from "@tabler/icons-react"
import { TEditableLabel } from "./EditableLabel.types"
import { memo } from "react"

const EditableLabelNotMemoized = ({ label, text, isEditing, shouldDisplay = true, ...props }: TEditableLabel) => {
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
      <DisplayIf<boolean> rules={{ equalsTo: false }} variable={shouldDisplay}>
        <DisplayIf<boolean> rules={{ equalsTo: true }} variable={isEditing}>
          <Group gap="xs" flex={1}>
            <Textarea minRows={1} autosize value={text} flex={1} {...props} />
            <ActionIcon variant="transparent" color="green"><IconCheck /></ActionIcon>
          </Group>
        </DisplayIf>
      </DisplayIf>

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
      <DisplayIf<boolean> rules={{ equalsTo: false }} variable={shouldDisplay}>
        <DisplayIf<boolean> rules={{ equalsTo: false }} variable={isEditing}>
          <Group gap="xs" flex={1}>
            <Text flex={1} lh={"normal"}>{text}</Text>
            <ActionIcon variant="transparent" color="green" size="sm"><IconPencil /></ActionIcon>
          </Group>
        </DisplayIf>
      </DisplayIf>

      {/* 
          Field Label
          
          Display label text of N/A if 
          1) field label is the same as the question

          No edit icon
      */}
      <DisplayIf<boolean> rules={{ equalsTo: true }} variable={shouldDisplay}>
        <Text>N/A</Text>
      </DisplayIf>
    </Group>
  )
}

export const EditableLabel = memo(EditableLabelNotMemoized)