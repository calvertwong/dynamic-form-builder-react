import { AppContext } from "contexts/AppContext";
import { useContext, useMemo, useRef, useState } from "react";
import { TField, TFinalJson } from "./Builder.types";
import {
  ActionIcon,
  Box,
  Button,
  Center,
  Divider,
  Group,
  Paper,
  ScrollArea,
  Space,
  Text,
  Title,
} from "@mantine/core";
import { Document, Page, pdfjs } from "react-pdf";
import { DocumentCallback } from "react-pdf/src/shared/types.js";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { useGetScreenDimens } from "hooks/useGetScreenDimens";
import styles from "./Builder.module.scss";
import { IconTrash, IconZoomIn, IconZoomOut } from "@tabler/icons-react";
import { EditableLabel } from "@molecules/editableLabel/EditableLabel";
import { EditableTextOption } from "@molecules/editableTextOption/EditableTextOption";
import { capitalize } from "utils/capitalize";
import { EditableFieldName } from "@molecules/editableFieldName/EditableFieldName";
import { EditableQuestion } from "@molecules/editableQuestion/EditableQuestion";
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
  const [currentQuestions, setCurrentQuestions] = useState<string[]>([]);
  const [clickedFieldNames, setClickedFieldNames] = useState<string[]>([]);
  const [editingItems, setEditingItems] = useState<{ questionIndex: number, fieldIndex: number, type: string }[]>([]);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [editMode, setEditMode] = useState<boolean>(false)

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

  const onQuestionSearchClick = (question: string, page: number) => {
    if (pdfRef) {
      if (currentQuestions.includes(question)) {
        setCurrentQuestions(currentQuestions.filter(item => item !== question))
      } else {
        setCurrentQuestions([...currentQuestions, question])
        pageRefs.current[page - 1]?.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  const onFieldNameSearchClick = (fieldName: string, page: number) => {
    if (pdfRef) {
      const targetElement = document.querySelectorAll(`[name="${fieldName}"]`)

      const currentBgColor = (targetElement as unknown as HTMLBaseElement[])[0].style.backgroundColor

      if (currentBgColor === "orange") {
        (targetElement as unknown as HTMLBaseElement[]).forEach(element => element.style.backgroundColor = "transparent")

        setClickedFieldNames(clickedFieldNames.filter(item => item !== fieldName))

      } else if (currentBgColor === "transparent") {
        (targetElement as unknown as HTMLBaseElement[]).forEach(element => element.style.backgroundColor = "orange")
        pageRefs.current[page - 1]?.scrollIntoView({ behavior: "smooth" })

        setClickedFieldNames([...clickedFieldNames, fieldName])
      }
    }
  }

  const onFieldFocus = (fieldName: string, page?: number) => {
    if (pdfRef) {
      const targetElement = document.querySelectorAll(`[name="${fieldName}"]`)

      if (targetElement) {
        (targetElement as unknown as HTMLBaseElement[]).forEach(element => element.style.backgroundColor = "orange")

        if (page) {
          pageRefs.current[page - 1]?.scrollIntoView({ behavior: "smooth" })
        }
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

  const onEditClick = (questionIndex: number, fieldIndex: number, type: string) => {
    if (fieldIndex === -1) {
      setCurrentQuestions([...currentQuestions, modifiedJson[questionIndex].question])
    }
    setEditingItems([...editingItems, { questionIndex, fieldIndex, type }])
  }

  const onEditSaveClick = (questionIndex: number, fieldIndex: number, type: string) => {
    if (fieldIndex === -1) {
      setCurrentQuestions(currentQuestions.filter(item => item !== modifiedJson[questionIndex].question))
    }

    const newJson = [...modifiedJson]

    if (type === "fieldLabel" && modifiedJson[questionIndex].fields[fieldIndex].displayLabel === modifiedJson[questionIndex].fields[fieldIndex].label) {

      newJson[questionIndex].fields[fieldIndex] = {
        ...newJson[questionIndex].fields[fieldIndex],
        displayLabel: null
      }

      setModifiedJson(newJson)
    }

    if (type === "question") {
      newJson[questionIndex] = {
        ...newJson[questionIndex],
        displayQuestion: newJson[questionIndex].question === newJson[questionIndex].displayQuestion ? null : newJson[questionIndex].displayQuestion
      }
    }

    setEditingItems(editingItems.filter(item => item.questionIndex !== questionIndex && item.fieldIndex !== fieldIndex && item.type !== type))

    setClickedFieldNames(clickedFieldNames.filter(item => item !== modifiedJson[questionIndex].fields[fieldIndex].fieldName))

  }

  const onItemChange = (questionIndex: number, fieldIndex: number, objectKey: string, newValue: string | number) => {
    const newJson = [...modifiedJson]

    if (objectKey === "displayQuestion") {
      newJson[questionIndex] = {
        ...newJson[questionIndex],
        displayQuestion: newJson[questionIndex].question === newValue as string ? null : newValue as string
      }
    } else {
      if (objectKey === "fieldName" && newJson[questionIndex].fields[fieldIndex].fieldName !== newValue) {
        onFieldBlur(newJson[questionIndex].fields[fieldIndex].fieldName)
        setClickedFieldNames(clickedFieldNames.filter(item => item !== newJson[questionIndex].fields[fieldIndex].fieldName).concat(newValue as string))
        onFieldFocus(newValue as string)
      }

      newJson[questionIndex].fields[fieldIndex] = {
        ...newJson[questionIndex].fields[fieldIndex],
        [objectKey]: newValue
      }
    }

    setModifiedJson(newJson)
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
        // Highlight current selected question in orange
        if (
          currentQuestions.find((item) => item === str)
        ) {
          return `<span key=element-${itemIndex}-${pageNumber} id=element-${itemIndex}-${pageNumber} style="background-color: orange; color: black; cursor: pointer">${str}</span>`;
        }

        // Highlight the questions in the question list in yellow
        if (modifiedJson.find((item) => item.question === str)) {
          return `<span key=element-${itemIndex}-${pageNumber} id=element-${itemIndex}-${pageNumber} style="background-color: yellow; color: black; cursor: pointer">${str}</span>`;
        }

        return `<span key=element-${itemIndex}-${pageNumber} id=element-${itemIndex}-${pageNumber} style="cursor: pointer">${str}</span>`;
      },
    [currentQuestions, modifiedJson],
  );

  // const updateFinalJson = (questionIndex: number, fieldKey: string, fieldValue: string | TDependsOn[] | null,) => {
  //   const newFinalJson = [...modifiedJson];

  //   newFinalJson[questionIndex] = {
  //     ...newFinalJson[questionIndex],
  //     [fieldKey]: fieldValue,
  //   };

  //   setModifiedJson(newFinalJson);
  // };

  const deleteQuestion = (questionIndex: number) => {
    setModifiedJson(modifiedJson.filter((_, index) => index !== questionIndex))
  }

  const goToPreviewPage = () => {
    setFinalJson(modifiedJson)
    setCurrentRoute("previewPage")
  }

  return (
    <Group>
      <Box h="100vh" w={screenWidth / 2.3} pt="md">
        <ScrollArea className={styles["documentStyle"]} offsetScrollbars>
          <Document ref={pdfRef} file={uploadedDbq} onLoadSuccess={onDocumentLoadSuccess}>
            {numPages !== null &&
              numPages > 0 &&
              Array.from({ length: numPages }).map((_, pageIndex: number) => (
                <div
                  key={`page_${pageIndex}`}
                  ref={el => { pageRefs.current[pageIndex] = el }}
                >
                  <Page
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
                  pos="relative"
                >
                  <DisplayIf<boolean> rules={{ equalsTo: true }} variable={editMode}>
                    <ActionIcon
                      color="red"
                      variant="transparent"
                      onClick={() => deleteQuestion(questionIndex)}
                      aria-label="Delete question"
                      right={15}
                      pos="absolute"
                      top={10}
                      title="Delete question"
                    >
                      <IconTrash size={18} />
                    </ActionIcon>
                  </DisplayIf>

                  {/* Original question */}
                  <EditableQuestion
                    label={`Question ${questionIndex + 1}`}
                    text={questionItem.displayQuestion ?? questionItem.question}
                    isEditing={editingItems.find(item => item.questionIndex === questionIndex && item.fieldIndex === -1 && item.type === "question") !== undefined}
                    onEditClick={() => onEditClick(questionIndex, -1, "question")}
                    onEditSaveClick={() => onEditSaveClick(questionIndex, -1, "question")}
                    onItemChange={(event) => onItemChange(questionIndex, -1, "displayQuestion", event.target.value as string)}
                    onSearchClick={() => onQuestionSearchClick(questionItem.question, questionItem.page)}
                    searched={currentQuestions.includes(questionItem.question)}
                    editMode={editMode}
                  />

                  <Divider my="xs" />

                  {/* fields */}
                  <Text fw={600}>Fields:</Text>

                  {questionItem.fields.map(
                    (field: TField, fieldIndex: number) => (
                      <div
                        key={`field-${fieldIndex}`}
                        className={styles.fieldContainerStyle}
                      >
                        <EditableLabel
                          sameAsQuestion={field.label === questionItem.question}
                          label="Label"
                          text={field.displayLabel ?? field.label ?? "N/A"}
                          isEditing={editingItems.find(item => item.questionIndex === questionIndex && item.fieldIndex === fieldIndex && item.type === "fieldLabel") !== undefined}
                          onEditClick={() => onEditClick(questionIndex, fieldIndex, "fieldLabel")}
                          onEditSaveClick={() => onEditSaveClick(questionIndex, fieldIndex, "fieldLabel")}
                          onItemChange={(event) => onItemChange(questionIndex, fieldIndex, "displayLabel", event.target.value as string)}
                          editMode={editMode}
                        />

                        <Space h="5px" />

                        <EditableTextOption
                          label="Type"
                          text={capitalize(field.type)}
                          isEditing={editingItems.find(item => item.questionIndex === questionIndex && item.fieldIndex === fieldIndex && item.type === "fieldType") !== undefined}
                          onEditClick={() => onEditClick(questionIndex, fieldIndex, "fieldType")}
                          onEditSaveClick={() => onEditSaveClick(questionIndex, fieldIndex, "fieldType")}
                          onItemChange={(newValue) => onItemChange(questionIndex, fieldIndex, "type", newValue as string)}
                          editMode={editMode}
                        />

                        <Space h="5px" />

                        <EditableFieldName
                          label="Field name"
                          text={field.fieldName}
                          isEditing={editingItems.find(item => item.questionIndex === questionIndex && item.fieldIndex === fieldIndex && item.type === "fieldName") !== undefined}
                          onEditClick={() => onEditClick(questionIndex, fieldIndex, "fieldName")}
                          onEditSaveClick={() => onEditSaveClick(questionIndex, fieldIndex, "fieldName")}
                          searched={clickedFieldNames.includes(field.fieldName)}
                          onSearchClick={() => onFieldNameSearchClick(field.fieldName, field.page)}
                          onFocus={() => onFieldFocus(field.fieldName, field.page)}
                          onBlur={() => onFieldBlur(field.fieldName)}
                          onItemChange={(event) => onItemChange(questionIndex, fieldIndex, "fieldName", event.target.value as string)}
                          editMode={editMode}
                        />
                      </div>
                    ),
                  )}
                </Paper>
              ),
            )}
          </Box>
        </ScrollArea>

        <Center>
          <Group pos="absolute" bottom={10}>
            <Button color={editMode ? "blue" : "purple"} onClick={() => setEditMode(!editMode)}>
              {editMode ? "Done editing" : "Start editing"}
            </Button>
            <Button color="darkGreen" disabled={editMode} onClick={goToPreviewPage}>
              Preview Form
            </Button>
          </Group>
        </Center>
      </Box>
    </Group>
  );
};
