import { Button, Center, Checkbox, Container, Group, Paper, Radio, ScrollArea, Space, Stack, Text, TextInput } from "@mantine/core";
import { SignPad } from "@molecules/signPad/SignPad";
import { AppContext } from "contexts/AppContext";
import { useContext } from "react";

export const PreviewPage = () => {
  const { setCurrentRoute, finalJson, } = useContext(AppContext);

  const goToBuilderPage = () => {
    setCurrentRoute("builder")
  }

  return <Stack>
    <ScrollArea h="95vh" offsetScrollbars>
      {
        finalJson.map(item =>
          <Container key={item.question} size="md" w="100%" pl="lg" pr="lg" pt="lg">
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

                  if (field.type === "signature") {
                    return <SignPad key={field.fieldName} />
                  }
                })
              }
            </Paper>
          </Container>
        )
      }
    </ScrollArea>

    <Center>
      <Group>
        <Button color="purple" onClick={goToBuilderPage}>Go back</Button>
        <Button color="darkGreen">Complete</Button>
      </Group>
    </Center>
  </Stack>
}