import { useContext, useState } from "react";
import { axiosInstance } from "network/axiosInstance";
import { AppContext } from "contexts/AppContext";
import {
  Button,
  Code,
  Container,
  Flex,
  Group,
  LoadingOverlay,
  NumberInput,
  Paper,
  ScrollArea,
  Space,
  Stack,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { Dropzone, FileWithPath, PDF_MIME_TYPE } from "@mantine/dropzone";
import { IconFileTypePdf, IconX } from "@tabler/icons-react";
import { DisplayIf } from "components/organisms/displayIf/DisplayIf";

export const ProvidePdf = () => {
  const [numOfQuestions, setNumOfQuestions] = useState<number | string>("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [questionList, setQuestionList] = useState<string[]>([
    // "Patient/Veteran's Social",
    // "1A. DOES THE VETERAN HAVE ONE OR MORE SCARS ANYWHERE ON THE BODY, OR DISFIGUREMENT OF THE HEAD, FACE, OR NECK?",
    // "1B. ARE ANY OF THE SCARS OF THE TRUNK OR EXTREMITIES PAINFUL?",
    // "Are you completing this Disability Benefits Questionnaire",
    // "Are you a VA Healthcare provider?",
    // "Evidence reviewed:",
    // "2. PHYSICAL EXAM FOR SCARS ON THE TRUNK AND EXTREMITIES",
    // "A. SCARS WITHOUT UNDERLYING TISSUE DAMAGE",
    // "Are any of the scars unstable upon inspection? If yes, check all that apply:",
    // "Are any of the scars tender to palpation? If yes, check all that apply:",
  ]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const { setInitialJson, setCurrentRoute, setUploadedDbq } =
    useContext(AppContext);

  const numOfQuestionsChange = (num: number | string) => {
    setNumOfQuestions(num === "" ? "" : num as number);

    if (num === 0 || num === "") {
      setQuestionList([]);
      return;
    }

    if (typeof num !== "string" && !Number.isNaN(num)) {
      if (questionList.length > num) {
        const updatedList = [...questionList];
        setQuestionList(updatedList.slice(0, num));
        return;
      }

      setQuestionList([
        ...questionList,
        ...Array(num - questionList.length).fill(""),
      ]);
    }
  };

  const handleFileChange = (files: FileWithPath[]) => {
    if (files && files.length > 0) {
      setUploadedFile(files[0]);
    } else {
      setUploadedFile(null);
    }
  };

  const collectQuestions = (questionText: string, position: number) => {
    const updatedList = [...questionList];
    updatedList[position] = questionText;
    setQuestionList(updatedList);
  };

  const clearQuestionList = () => {
    setQuestionList(Array(Number(numOfQuestions)).fill(""));
  };

  const submitPdf = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    setIsProcessing(true);

    const formData = new FormData();
    if (uploadedFile !== null && questionList.length > 0) {
      formData.append("singlePdf", uploadedFile);
      formData.append("questions", JSON.stringify(questionList));

      try {
        const response = await axiosInstance.post("/parse-pdf", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 200) {
          try {
            const fileResponse = await axiosInstance.get("/download-pdf", {
              params: { filename: response.data.downloadFileName },
              responseType: "blob"
            });

            const fileBlob = new Blob([fileResponse.data], { type: "application/pdf" });
            const fileUrl = URL.createObjectURL(fileBlob);

            setUploadedDbq(fileUrl);
            setInitialJson(response.data.finalJson);
            setCurrentRoute("builder");
            setIsProcessing(false);
          } catch {
            setIsProcessing(false);
          }
        }
      } catch (error) {
        console.log(error);
        setIsProcessing(false);
      }
    }
  };

  return (
    <Stack h={{ md: "100vh" }} w="100vw">
      <LoadingOverlay
        zIndex={1000}
        visible={isProcessing}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <Space h="lg" />
      <Title order={2} ta="center">Follow instructions below</Title>

      <Stack w="100%" h="90%" justify="space-between">
        <Container size={"md"} w="100%" style={{ display: "flex", flexDirection: "column", minHeight: 0}}>
          <Paper shadow="xs" p="xl" withBorder radius={"md"}>
            <Flex mah={{ xs: "100%", md: "80vh" }} direction="column">
              <Text size="lg" fw={700} ta={"left"}>
                1. Upload a DBQ
              </Text>
              <Space h={"xs"} />
              <Dropzone
                onDrop={handleFileChange}
                onReject={(files) => console.log("rejected files", files)}
                maxSize={10 * 1024 ** 2}
                accept={PDF_MIME_TYPE}
              >
                <Group
                  justify="center"
                  gap="xl"
                  mih={10}
                  style={{ pointerEvents: "none" }}
                >
                  <Dropzone.Accept>
                    <IconFileTypePdf
                      size={52}
                      color="var(--mantine-color-blue-6)"
                      stroke={1.5}
                    />
                  </Dropzone.Accept>
                  <Dropzone.Reject>
                    <IconX
                      size={52}
                      color="var(--mantine-color-red-6)"
                      stroke={1.5}
                    />
                  </Dropzone.Reject>
                  <Dropzone.Idle>
                    <IconFileTypePdf
                      size={52}
                      color="var(--mantine-color-dimmed)"
                      stroke={1.5}
                    />
                  </Dropzone.Idle>

                  <div>
                    {uploadedFile !== null ?
                      <Text ta="center" fw={500}>{uploadedFile.name}</Text>
                      : <>
                        <Text size="xl" inline>
                          Drag DBQ PDF here or click to select file
                        </Text>
                        <Text size="sm" c="dimmed" inline mt={7}>
                          Attach one file only, each file should not exceed 10mb
                        </Text>
                      </>
                    }
                  </div>
                </Group>
              </Dropzone>
            </Flex>
          </Paper>

          <Space h={"lg"} />

          <DisplayIf<File> rules={{ notNull: true }} variable={uploadedFile}>
            <Paper shadow="xs" p="xl" withBorder radius={"md"}>
              <Text size="lg" fw={700} ta={"left"}>
                2. Enter the number of questions
              </Text>
              <NumberInput
                allowNegative={false}
                allowDecimal={false}
                hideControls
                placeholder="Number of questions from the DBQ"
                value={numOfQuestions}
                onChange={numOfQuestionsChange}
                min={1}
                max={40}
                description="min: 1, max: 40"
              />
            </Paper>
          </DisplayIf>

          <Space h={"lg"} />

          <DisplayIf<number | string> rules={{ moreThan: 0, notEmptyString: true }} variable={numOfQuestions}>
            <Paper shadow="xs" p="xl" withBorder radius={"md"} style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
              <>
                <Text size="lg" fw={700} ta={"left"}>
                  3. Provide the partial question text eg:{" "}
                  <Code fz={"md"}>Patient/Veteran's</Code>,{" "}
                  <Code fz={"md"}>1A.</Code> or full question text for better
                  accuracy (Order does not matter and will be re-ordered in the
                  next screen)
                </Text>
                <ScrollArea style={{ overflow: "auto", flex: 1, minHeight: 0 }} offsetScrollbars>
                  {Array.from({
                    length: numOfQuestions as number,
                  }).map((_, index: number) => (
                    <div key={`question_${index}`}>
                      <Textarea
                        placeholder="Enter partial or full question text"
                        label={`Question ${index + 1}`}
                        value={questionList[index] || ""}
                        onChange={(event) =>
                          collectQuestions(event.currentTarget.value, index)
                        }
                        minRows={1}
                        autosize
                        required
                      />
                      <Space h={"md"} />
                    </div>
                  ))}
                </ScrollArea>

                <Space h="md" />

                <Group justify="flex-end">
                  <Button
                    variant="filled"
                    bg="red"
                    onClick={clearQuestionList}
                  >
                    Clear all
                  </Button>
                </Group>
              </>
            </Paper>
          </DisplayIf>
        </Container>

        <Container size="md" w="100%">
          <Button variant="filled" w="100%" disabled={questionList.includes("") || questionList.length === 0} onClick={submitPdf}>
            Next step
          </Button>
        </Container>
      </Stack >
    </Stack>
  );
};
