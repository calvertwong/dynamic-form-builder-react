import { ActionIcon, Group, Select, Text } from "@mantine/core"
import { DisplayIf } from "components/organisms/displayIf/DisplayIf"
import { IconCheck, IconPencil } from "@tabler/icons-react"
import { TEditableLabelOption } from "./EditableTextOption.types"
import { memo } from "react"

const typeOptions = [
  { value: "checkbox", label: "Checkbox" },
  { value: "radio", label: "Radio", },
  { value: "textbox", label: "Textbox", },
]

const EditableTextOptionNotMemoized = ({ label, text, isEditing }: TEditableLabelOption) => {
  return (
    <Group gap="xs" w="100%" align="flex-start">
      {/* 
          Field Type

          Expected Type UI:
          =======================================
          Type    : 
          =======================================
      */}
      <Group justify="space-between" w="15ch">
        <Text fz="sm" fw={600}>{label}</Text>
        <Text fz="sm" fw={600}>:</Text>
      </Group>

      {/* 
          Field Type

          Display Select and check icon if 
          1) isEditing is true 

          Expected Type UI:
          =======================================
          Type    : [ Dropdown ▼ ]              ✔
          =======================================
      */}
      <DisplayIf<boolean> rules={{ equalsTo: true }} variable={isEditing}>
        <Group gap="xs" flex={1} justify="space-between">
          <Select size="sm" value={text.toLowerCase()} data={typeOptions} />
          <ActionIcon variant="transparent" color="green"><IconCheck /></ActionIcon>
        </Group>
      </DisplayIf>

      {/* 
          Field Type

          Display text if 
          1) field label is different than the question
          2) isEditing is false 

          Display edit icon if
          1) hover over the text

          Expected Type UI:
          =======================================
          Type    : Some type value            🖉
          =======================================
      */}
      <DisplayIf<boolean> rules={{ equalsTo: false }} variable={isEditing}>
        <Group gap="xs" flex={1}>
          <Text flex={1} lh={"normal"}>{text}</Text>
          <ActionIcon variant="transparent" color="green" size="sm"><IconPencil /></ActionIcon>
        </Group>
      </DisplayIf>
    </Group>
  )
}

export const EditableTextOption = memo(EditableTextOptionNotMemoized)