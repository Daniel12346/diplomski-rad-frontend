import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Center,
  Container,
  FormControl,
  FormLabel,
  Switch,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import {
  shouldCheckDeepfakeState,
  // shouldRecognizeFaceState,
  shouldSearchRelatedResultsState,
} from "../recoil/state";
import { SettingsIcon } from "@chakra-ui/icons";

const AdvancedSettings = () => {
  // const [shouldRecognizeFace, setShouldRecognizeFace] = useRecoilState(
  //   shouldRecognizeFaceState
  // );
  const [shouldCheckDeepfake, setShouldCheckDeepfake] = useRecoilState(
    shouldCheckDeepfakeState
  );
  const [shouldSearchRelatedResults, setShouldSearchRelatedResults] =
    useRecoilState(shouldSearchRelatedResultsState);
  const settingsIconColor = useColorModeValue("gray.700", "gray.300");

  return (
    <Container w="100%" maxW="25rem">
      <Accordion allowToggle mb={2}>
        <AccordionItem>
          <AccordionButton gap={1}>
            <Center>
              <SettingsIcon color={settingsIconColor} />
            </Center>
            <Box as="span" textAlign="left" fontWeight={400}>
              Advanced Settings
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel
            _dark={{ color: "gray.300" }}
            _light={{ color: "gray.700" }}
          >
            {/* <FormControl
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={1}
            >
              <FormLabel
                htmlFor="shouldRecognizeFace"
                fontWeight={"normal"}
                margin={0}
              >
                recognize face
              </FormLabel>
              <Switch
                id="shouldRecognizeFace"
                isChecked={shouldRecognizeFace}
                onChange={(e) => setShouldRecognizeFace(e.target.checked)}
              />
            </FormControl> */}
            <FormControl
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={1}
            >
              <FormLabel
                htmlFor="shouldCheckDeepfake"
                fontWeight="normal"
                margin={0}
              >
                check deepfake
              </FormLabel>
              <Switch
                id="shouldCheckDeepfake"
                isChecked={shouldCheckDeepfake}
                onChange={(e) => setShouldCheckDeepfake(e.target.checked)}
              />
            </FormControl>
            <FormControl
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <FormLabel
                htmlFor="shouldSearchRelatedResults"
                fontWeight="normal"
                margin={0}
              >
                <Text>search related results</Text>
              </FormLabel>
              <Switch
                id="shouldSearchRelatedResults"
                isChecked={shouldSearchRelatedResults}
                onChange={(e) =>
                  setShouldSearchRelatedResults(e.target.checked)
                }
              />
            </FormControl>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Container>
  );
};

export default AdvancedSettings;
