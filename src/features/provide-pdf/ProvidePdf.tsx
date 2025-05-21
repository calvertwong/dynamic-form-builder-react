import { useContext, useState } from "react";
import { axiosInstance } from "network/axiosInstance";
import { AppContext } from "contexts/AppContext";
import {
  Button,
  Center,
  Code,
  Container,
  Flex,
  Group,
  LoadingOverlay,
  NumberInput,
  Paper,
  ScrollArea,
  Space,
  Text,
  Textarea,
} from "@mantine/core";
import { Dropzone, FileWithPath, PDF_MIME_TYPE } from "@mantine/dropzone";
import { IconFileTypePdf, IconX } from "@tabler/icons-react";

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
  ]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const { setInitialJson, setCurrentRoute, setUploadedDbq } =
    useContext(AppContext);

  const numOfQuestionsChange = (num: number | string) => {
    setNumOfQuestions(num);

    if (num === 0) {
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
    <Center h={{ md: "100vh" }} w="100vw">
      <Container size={"md"} w="100%">
        <Paper shadow="xs" p="xl" withBorder radius={"md"}>
          <LoadingOverlay
            zIndex={1000}
            visible={isProcessing}
            overlayProps={{ radius: "sm", blur: 2 }}
          />

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
                  <Text size="xl" inline>
                    Drag DBQ PDF here or click to select file
                  </Text>
                  <Text size="sm" c="dimmed" inline mt={7}>
                    Attach one file only, each file should not exceed 10mb
                  </Text>
                </div>
              </Group>
            </Dropzone>
            {uploadedFile !== null && (
              <Text>Uploaded DBQ: {uploadedFile.name}</Text>
            )}
            <Space h={"lg"} />

            <Text size="lg" fw={700} ta={"left"}>
              2. Enter the number of questions
            </Text>
            <NumberInput
              allowNegative={false}
              placeholder="Number of questions from the DBQ"
              value={numOfQuestions}
              onChange={numOfQuestionsChange}
            />
            <Space h={"lg"} />

            {numOfQuestions !== "" && numOfQuestions !== 0 && (
              <>
                <Text size="lg" fw={700} ta={"left"}>
                  3. Provide the partial question text eg:{" "}
                  <Code fz={"md"}>Patient/Veteran's</Code>,{" "}
                  <Code fz={"md"}>1A.</Code> or full question text for better
                  accuracy (Order does not matter and will be re-ordered in the
                  next screen)
                </Text>
                <ScrollArea style={{ overflow: "auto" }}>
                  {Array.from({
                    length: numOfQuestions === "" ? 0 : Number(numOfQuestions),
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
                      />
                      <Space h={"md"} />
                    </div>
                  ))}
                </ScrollArea>

                <Center>
                  <Group>
                    <Button
                      variant="filled"
                      bg="red"
                      onClick={clearQuestionList}
                    >
                      Clear question texts
                    </Button>

                    <Button variant="filled" onClick={submitPdf}>
                      Build form
                    </Button>
                  </Group>
                </Center>
              </>
            )}
          </Flex>
        </Paper>
      </Container>
    </Center>
  );
};
