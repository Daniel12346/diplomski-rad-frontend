import "./App.css";
import { Center, Container, Stack, Text } from "@chakra-ui/react";
import ImageInputArea from "./components/ImageInputArea";
import AdvancedSettings from "./components/AdvancedSettings";

function App() {
  return (
    <Container>
      <Container background="blue.100" rounded="md" mb={8}>
        <Text align="start" color="blue.500">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </Text>
      </Container>
      <Stack>
        <AdvancedSettings />
        <Center
          background="blue.50"
          rounded="md"
          // boxSize="xs"
          borderWidth={2}
          borderColor={"blue.500"}
          borderStyle={"dashed"}
        >
          <ImageInputArea />
        </Center>
      </Stack>
    </Container>
  );
}

export default App;
