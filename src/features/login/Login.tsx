import { useContext, useEffect, useState } from "react";
import { axiosInstance } from "network/axiosInstance";
import { AppContext } from "contexts/AppContext";
import {
  Button,
  Center,
  Container,
  Paper,
  PasswordInput,
  Space,
  Text,
  TextInput,
} from "@mantine/core";

export const Login = () => {
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const { setCurrentRoute } = useContext(AppContext);

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") {
      setCurrentRoute("providePdf");
    }
  }, []);

  const loginUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsProcessing(true);

    try {
      const response = await axiosInstance.post("/login", {
        email: loginEmail,
        password: loginPassword,
      });

      if (response.status === 200) {
        setCurrentRoute("providePdf");
        localStorage.setItem("isLoggedIn", "true");
      }

      setIsProcessing(false);
    } catch {
      setIsProcessing(false);
    }
  };

  return (
    <Center h="100vh" w="100vw">
      <Container size={"xs"} w="100%">
        <Paper shadow="xs" p="xl" withBorder radius={"md"}>
          <form onSubmit={loginUser}>
            <Text ta="center" fw={700} size="xl">
              Login
            </Text>
            <Space h="xl" />

            <TextInput
              label="Email"
              value={loginEmail}
              onChange={(event) => setLoginEmail(event.target.value)}
              withAsterisk
              placeholder="Type your email here"
            />
            <Space h="xs" />

            <PasswordInput
              label="Password"
              value={loginPassword}
              onChange={(event) => setLoginPassword(event.target.value)}
              withAsterisk
              placeholder="Type your password here"
            />
            <Space h="xl" />

            <Button w="100%" type="submit" loading={isProcessing}>
              Login
            </Button>
          </form>
        </Paper>
      </Container>
    </Center>
  );
};
