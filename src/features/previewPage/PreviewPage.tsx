import { Box, Checkbox, Paper, Radio, Space, Stack, Text, TextInput } from "@mantine/core";
import { AppContext } from "contexts/AppContext";
import { useContext } from "react";

export const PreviewPage = () => {
  const { finalJson, } = useContext(AppContext);

  return <Stack>
    {
      finalJson.map(item =>
        <Box key={item.question} pl="lg" pr="lg" pt="lg">
          <Paper shadow="xs" p="md" withBorder radius={"md"}>
            <Text>{item.displayQuestion ?? item.question}</Text>
            <Space h="xs" />

            {
              item.fields.map(field => {
                if (field.type === "textbox") {
                  return <>
                    <TextInput key={field.fieldName} label={item.question !== field.label ? field.displayLabel ?? field.label : null} />
                    <Space h="xs" />
                  </>
                }

                if (field.type === "checkbox") {
                  return <>
                    <Checkbox key={field.fieldName} label={field.displayLabel ?? field.label} />
                    <Space h="xs" />
                  </>
                }

                if (field.type === "radio") {
                  return <>
                    <Radio key={field.fieldName} label={field.displayLabel ?? field.label} />
                    <Space h="xs" />
                  </>
                }
              })
            }
          </Paper>
        </Box>
      )
    }
  </Stack>
}