import { AppContext } from "contexts/AppContext";
import { useContext, useMemo, useRef, useState } from "react";
import { TDependsOn, TField, TFinalJson } from "./Builder.types";
import {
  ActionIcon,
  Box,
  Button,
  Center,
  Checkbox,
  Divider,
  Group,
  Paper,
  ScrollArea,
  Space,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { Document, Page, pdfjs } from "react-pdf";
import { DocumentCallback } from "react-pdf/src/shared/types.js";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { useGetScreenDimens } from "hooks/useGetScreenDimens";
import styles from "./Builder.module.scss";
import { IconZoomIn, IconZoomOut } from "@tabler/icons-react";
import { DisplayIf } from "components/organisms/displayIf/DisplayIf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const ZOOM_INTERVAL = 0.5;
const MAX_ZOOM = 3;
const MIN_ZOOM = 1;

// const fillArray = (numOfItems: number, value: string | Record<string, string> | TDependsOn,) => {
//   return new Array(numOfItems).fill(value);
// };

export const Builder = () => {
  const { initialJson, setFinalJson, uploadedDbq, setCurrentRoute } = useContext(AppContext);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentQuestion] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const [modifiedJson, setModifiedJson] = useState<TFinalJson[]>(initialJson)

  const pdfRef = useRef(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { screenWidth } = useGetScreenDimens();

  const zoomPage = (zoom: "in" | "out") => {
    if (zoomLevel + ZOOM_INTERVAL <= MAX_ZOOM && zoom === "in") {
      setZoomLevel(zoomLevel + ZOOM_INTERVAL);
    } else if (zoomLevel - ZOOM_INTERVAL >= MIN_ZOOM && zoom === "out") {
      setZoomLevel(zoomLevel - ZOOM_INTERVAL);
    }
  };

  const onPageClick = (event: React.MouseEvent<Element, MouseEvent>) => {
    navigator.clipboard.writeText(
      (event.target as HTMLElement).innerText ||
      (event.target as HTMLFormElement).name,
    );
  };

  const onDocumentLoadSuccess = ({ numPages }: DocumentCallback) => {
    setNumPages(numPages);
  };

  const onFieldFocus = (fieldName: string, page: number) => {
    if (pdfRef) {
      const targetElement = document.querySelectorAll(`[name="${fieldName}"]`)

      if (targetElement) {
        (targetElement as unknown as HTMLBaseElement[]).forEach(element => element.style.backgroundColor = "orange")
        pageRefs.current[page - 1]?.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  const onFieldBlur = (fieldName: string) => {
    if (pdfRef) {
      const targetElement = document.querySelectorAll(`[name="${fieldName}"]`)

      if (targetElement) {
        (targetElement as unknown as HTMLBaseElement[]).forEach(element => element.style.backgroundColor = "transparent")
      }
    }
  }

  const customTextRenderer = useMemo(
    () =>
      ({
        str,
        itemIndex,
        pageNumber,
      }: {
        str: string;
        itemIndex: number;
        pageNumber: number;
      }) => {
        // // Highlight current selected field label in blue
        // if (
        //   currentPdfPage !== null &&
        //   modifiedJson.find((item) =>
        //     item.fields.find(
        //       (fieldItem) =>
        //         fieldItem.label === currentPdfPage &&
        //         str === currentPdfPage,
        //     ),
        //   )
        // ) {
        //   return `<span style="background-color: blue; color: black">${str}</span>`;
        // }

        // Highlight current selected question in orange
        if (
          currentQuestion !== null &&
          modifiedJson.find((item) => item.question === str)
        ) {
          return `<span key=element-${itemIndex}-${pageNumber} id=element-${itemIndex}-${pageNumber} style="background-color: orange; color: black; cursor: pointer">${str}</span>`;
        }

        // Highlight the questions in the question list in yellow
        if (modifiedJson.find((item) => item.question === str)) {
          return `<span key=element-${itemIndex}-${pageNumber} id=element-${itemIndex}-${pageNumber} style="background-color: yellow; color: black; cursor: pointer">${str}</span>`;
        }

        return `<span key=element-${itemIndex}-${pageNumber} id=element-${itemIndex}-${pageNumber} style="cursor: pointer">${str}</span>`;
      },
    [currentQuestion, modifiedJson],
  );

  const updateFinalJson = (questionIndex: number, fieldKey: string, fieldValue: string | TDependsOn[] | null,) => {
    const newFinalJson = [...modifiedJson];

    newFinalJson[questionIndex] = {
      ...newFinalJson[questionIndex],
      [fieldKey]: fieldValue,
    };

    setModifiedJson(newFinalJson);
  };

  const goToTestPage = () => {
    setFinalJson(modifiedJson)
    setCurrentRoute("testPage")
  }

  return (
    <Group>
      <Box h="100vh" w={screenWidth / 2.3} pt="md">
        <ScrollArea className={styles["documentStyle"]}>
          <Document ref={pdfRef} file={uploadedDbq} onLoadSuccess={onDocumentLoadSuccess}>
            {numPages !== null &&
              numPages > 0 &&
              Array.from({ length: numPages }).map((_, pageIndex: number) => (
                <div
                  key={`page_${pageIndex}`}
                  ref={el => { pageRefs.current[pageIndex] = el }}
                >                  <Page
                    width={screenWidth / 2.3}
                    pageNumber={pageIndex + 1}
                    customTextRenderer={customTextRenderer}
                    className={styles["pageStyle"]}
                    scale={zoomLevel}
                    onClick={onPageClick}
                    renderForms
                  />
                  <Space h="md" />
                </div>
              ))}
          </Document>
        </ScrollArea>

        <Center>
          <Group pos="absolute" bottom={10}>
            <ActionIcon onClick={() => zoomPage("out")}>
              <IconZoomOut />
            </ActionIcon>
            {zoomLevel}x
            <ActionIcon onClick={() => zoomPage("in")}>
              <IconZoomIn />
            </ActionIcon>
          </Group>
        </Center>
      </Box>

      <Space w="sm" />

      <Box flex={1} h="100vh" pt="md">
        <Title ta="center" order={2}>
          Build Your Form
        </Title>
        <Space h="md" />

        <ScrollArea h="90vh">
          <Box pr="xl">
            {modifiedJson.map(
              (questionItem: TFinalJson, questionIndex: number) => (
                <Paper
                  key={`question-${questionIndex}`}
                  shadow="xs"
                  p="xl"
                  withBorder
                  radius={"md"}
                  mb="md"
                >
                  {/* Original question */}
                  <Text>Original question:</Text>
                  <Text fw={600}>{questionItem.question}</Text>

                  <Divider my="xs" />

                  {/* Display question */}
                  <Stack gap="xs">
                    <Checkbox
                      label="Show a different question text?"
                      labelPosition="left"
                      checked={questionItem.displayQuestion !== null}
                      onChange={(event) =>
                        updateFinalJson(
                          questionIndex,
                          "displayQuestion",
                          event.target.checked ? "" : null,
                        )
                      }
                    />
                    <DisplayIf<string> rules={{ notNull: true }} variable={questionItem.displayQuestion}>
                      <Textarea
                        value={questionItem.displayQuestion ?? ""}
                        placeholder="Question text that will be displayed to users"
                        withAsterisk
                        minRows={1}
                        autosize
                      />
                    </DisplayIf>
                  </Stack>

                  <Space h="xs" />

                  {/* Question hint or description */}
                  {/* <Stack gap="xs">
                    <Checkbox
                      label="Question hint or description"
                      labelPosition="left"
                      checked={questionItem.hintOrDesc !== null}
                      onChange={(event) =>
                        updateFinalJson(
                          questionIndex,
                          "hintOrDesc",
                          event.target.checked ? "" : null,
                        )
                      }
                    />

                    <DisplayIf<string> rules={{ notNull: true }} variable={questionItem.hintOrDesc}>
                      <Textarea
                        value={questionItem.hintOrDesc ?? ""}
                        placeholder="Hint or description will be a smaller gray text below the question"
                        withAsterisk
                        minRows={1}
                        autosize
                      />
                    </DisplayIf>
                  </Stack> */}

                  {/* <Space h="xs" /> */}

                  {/* Question dependee(s) */}
                  {/* <Stack gap="xs">
                    <Checkbox
                      label="Question dependee(s)?"
                      labelPosition="left"
                      checked={questionItem.dependsOn !== null}
                      onChange={(event) =>
                        updateFinalJson(
                          questionIndex,
                          "dependsOn",
                          event.target.checked ? [] : null,
                        )
                      }
                    />

                    <DisplayIf<TDependsOn[]> rules={{ notNull: true }} variable={questionItem.dependsOn}>
                      <NumberInput
                        label="How many dependee(s)?"
                        value={questionItem.dependsOn?.length}
                        onChange={(value) =>
                          updateFinalJson(
                            questionIndex, "dependsOn", value && Number(value) > 0 ? fillArray(Number(value), { dependeeFieldName: "", } as TDependsOn) : []
                          )
                        }
                      />
                    </DisplayIf>

                    <DisplayIf<TDependsOn[]> rules={{ notNull: true, notEmptyArray: true }} variable={questionItem.dependsOn}>
                      <>
                        <Text>Show when:</Text>
                        {questionItem.dependsOn?.map(
                          (dependsOnItem, dependsOnIndex) => (
                            <Group
                              key={`question_${questionIndex}_dependsOn_${dependsOnIndex}`}
                            >
                              <TextInput
                                placeholder="Field name"
                                value={dependsOnItem.dependeeFieldName ?? ""}
                                w="100%"
                              />

                              <Group>
                                <Radio label="text" />
                                <Radio label="number" />
                                <Radio label="boolean" />
                              </Group>

                              {dependsOnItem.type === "string" && (
                                <TextInput
                                  key={`question_${questionIndex}_dependsOn_${dependsOnIndex}`}
                                  value={(dependsOnItem.value as string) ?? ""}
                                />
                              )}
                              {dependsOnItem.type === "number" && (
                                <NumberInput
                                  key={`question_${questionIndex}_dependsOn_${dependsOnIndex}`}
                                  value={(dependsOnItem.value as number) ?? ""}
                                />
                              )}
                              {dependsOnItem.type === "boolean" && (
                                <TextInput
                                  key={`question_${questionIndex}_dependsOn_${dependsOnIndex}`}
                                  value={(dependsOnItem.value as string) ?? ""}
                                />
                              )}
                            </Group>
                          ),
                        )}
                      </>
                    </DisplayIf>
                  </Stack> */}

                  <Space h="md" />

                  {/* fields */}
                  <Text>Fields:</Text>

                  {questionItem.fields.map(
                    (field: TField, fieldIndex: number) => (
                      <div
                        key={`field-${fieldIndex}`}
                        className={styles.fieldContainerStyle}
                      >
                        <Text>
                          {field.label === questionItem.question
                            ? ""
                            : `Field label: ${field.label === "" ? "" : field.label}`}
                        </Text>

                        <Text>
                          Type: {field.type}
                        </Text>

                        {/* <TextInput
                          label="Actual label to display"
                          value={field.displayLabel ?? ""}
                          withAsterisk
                        />

                        <TextInput
                          label="Hint or description"
                          value={field.hintOrDesc ?? ""}
                          withAsterisk
                        /> */}

                        <TextInput
                          label="Field name"
                          value={field.fieldName ?? ""}
                          withAsterisk
                          onFocus={() => onFieldFocus(field.fieldName, field.page)}
                          onBlur={() => onFieldBlur(field.fieldName)}
                        />

                        {/* <Radio.Group name="isFieldRequired" withAsterisk>
                          <Group>
                            <Radio value="required" label="Required" />
                            <Radio value="optional" label="Optional" />
                          </Group>
                        </Radio.Group> */}

                        {/* <Radio.Group
                          name="fieldType"
                          label="Field type"
                          withAsterisk
                        >
                          <Group>
                            <Radio value="string" label="Text" />
                            <Radio value="number" label="Number" />
                            <Radio value="checkbox" label="Checkbox" />
                            <Radio value="date" label="Date" />
                          </Group>
                        </Radio.Group> */}

                        {/* {field.dependsOn && (
                          <>
                            <Text>Show when:</Text>
                            {field.dependsOn.map(
                              (dependsOnItem, dependsOnIndex) => (
                                <Group
                                  key={`field_${fieldIndex}_dependsOn_${dependsOnIndex}`}
                                >
                                  <TextInput
                                    label="Dependee field name"
                                    value={
                                      dependsOnItem.dependeeFieldName ?? ""
                                    }
                                  />

                                  <Group>
                                    <Radio label="text" />
                                    <Radio label="number" />
                                    <Radio label="boolean" />
                                  </Group>

                                  {dependsOnItem.type === "string" && (
                                    <TextInput
                                      key={`question_${questionIndex}_dependsOn_${dependsOnIndex}`}
                                      value={(dependsOnItem.value as string) ?? ""}
                                    />
                                  )}
                                  {dependsOnItem.type === "number" && (
                                    <NumberInput
                                      key={`question_${questionIndex}_dependsOn_${dependsOnIndex}`}
                                      value={(dependsOnItem.value as number) ?? ""}
                                    />
                                  )}
                                  {dependsOnItem.type === "boolean" && (
                                    <TextInput
                                      key={`question_${questionIndex}_dependsOn_${dependsOnIndex}`}
                                      value={(dependsOnItem.value as string) ?? ""}
                                    />
                                  )}
                                </Group>
                              )
                            )}
                          </>
                        )} */}
                      </div>
                    ),
                  )}
                </Paper>
              ),
            )}
          </Box>
        </ScrollArea>

        <Center>
          <Button onClick={goToTestPage} pos="absolute" bottom={10}>
            Submit
          </Button>
        </Center>
      </Box>
    </Group>
  );
};
