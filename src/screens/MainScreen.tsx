import { Stack, Center } from "@chakra-ui/react";
import AdvancedSettings from "../components/AdvancedSettings";
import ImageInputArea from "../components/ImageInputArea";
import ResultDisplay from "../components/ResultDisplay";

const MainScreen = () => {
  return (
    <Stack>
      <AdvancedSettings />
      <Center>
        <ImageInputArea />
      </Center>
      <ResultDisplay />
    </Stack>
  );
};
export default MainScreen;
