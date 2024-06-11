import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Container,
  FormControl,
  FormLabel,
  Switch,
} from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import {
  shouldCheckDeepfakeState,
  shouldRecognizeFaceState,
  shouldSearchRelatedResultsState,
} from "../recoil/state";

const AdvancedSettings = () => {
  const [shouldRecognizeFace, setShouldRecognizeFace] = useRecoilState(
    shouldRecognizeFaceState
  );
  const [shuoldCheckDeepfake, setShouldCheckDeepfake] = useRecoilState(
    shouldCheckDeepfakeState
  );
  const [shouldSearchRelatedResults, setShouldSearchRelatedResults] =
    useRecoilState(shouldSearchRelatedResultsState);

  return (
    <Container
      onClick={() => {
        console.log(
          "shouldRecognizeFace, shuoldCheckDeepfake, shouldSearchRelatedResults:",
          shouldRecognizeFace,
          shuoldCheckDeepfake,
          shouldSearchRelatedResults
        );
      }}
    >
      <Accordion allowToggle mb={2}>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" textAlign="left">
                Advanced Settings
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel>
            <FormControl
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <FormLabel htmlFor="shouldRecognizeFace" fontWeight="normal">
                recognize face
              </FormLabel>
              <Switch
                id="shouldRecognizeFace"
                isChecked={shouldRecognizeFace}
                onChange={(e) => setShouldRecognizeFace(e.target.checked)}
              />
            </FormControl>
            <FormControl
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <FormLabel htmlFor="shouldCheckDeepfake" fontWeight="normal">
                check deepfake
              </FormLabel>
              <Switch
                id="shouldCheckDeepfake"
                isChecked={shuoldCheckDeepfake}
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
              >
                search related results
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
