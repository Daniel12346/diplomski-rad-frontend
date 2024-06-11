import {
  Center,
  Container,
  Stack,
  Switch,
  Text,
  Box,
  useColorMode,
  Spacer,
  Flex,
} from "@chakra-ui/react";
import ImageInputArea from "./components/ImageInputArea";
import AdvancedSettings from "./components/AdvancedSettings";

function App() {
  const { toggleColorMode } = useColorMode();
  return (
    <Box>
      <Flex p={4}>
        <Spacer />
        <Switch
          onChange={() => {
            toggleColorMode();
          }}
        ></Switch>
      </Flex>
      <Container background="blue.100" rounded="md" mb={8} mt={4}>
        <Text align="start" color="blue.500">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </Text>
      </Container>
      <Stack>
        <AdvancedSettings />
        <Center>
          <ImageInputArea />
        </Center>
      </Stack>
    </Box>
  );
}

export default App;
