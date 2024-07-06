import { Container, Stack, Flex, Box, Text } from "@chakra-ui/react";
import RelatedResults from "./RelatedSearchResults";
import { useRecoilValue } from "recoil";
import {
  deepfakePredictionResultState,
  searchResultsState,
  recognizedFacesState,
  processingStatusState,
  shouldRecognizeFaceState,
} from "../recoil/state";
import PersonThumbnail from "./PersonThumbnail";

const ResultDisplay = () => {
  const deepfakePredictionResult = useRecoilValue(
    deepfakePredictionResultState
  );
  const relatedResults = useRecoilValue(searchResultsState);
  const processingStatus = useRecoilValue(processingStatusState);
  const shouldRecognizeFace = useRecoilValue(shouldRecognizeFaceState);

  const recognizedFaces = useRecoilValue(recognizedFacesState);
  return (
    <Container pb="5">
      <Stack gap={5} px="3" pb="5" borderColor={"blue.300"}>
        <Box>
          {!recognizedFaces &&
            processingStatus === "COMPLETED" &&
            shouldRecognizeFace && (
              <Text fontSize={"xl"}>No faces were found in the image</Text>
            )}
          {recognizedFaces && (
            <Flex fontSize="xl" fontWeight={"350"}>
              {recognizedFaces.every(
                (name) => name.toLocaleUpperCase() === "UNKNOWN"
              ) ? (
                <Text>Could not recognize the found faces</Text>
              ) : (
                <Box>
                  <Text
                    _dark={{ color: "blue.100" }}
                    _light={{ color: "blue.900" }}
                    mt={2}
                    mb={2}
                  >
                    Recognized faces:{" "}
                  </Text>
                  <Stack>
                    {recognizedFaces.map((name) => (
                      <Flex key={name} alignItems={"center"} gap={5}>
                        <Text fontSize="3xl" fontWeight={400} key={name}>
                          {name}
                        </Text>
                        <PersonThumbnail name={name} />
                      </Flex>
                    ))}
                  </Stack>
                </Box>
              )}
            </Flex>
          )}
        </Box>
        {deepfakePredictionResult && (
          <Box>
            {deepfakePredictionResult.result === "FAKE" ? (
              <Text
                background="red.100"
                color="red.600"
                textAlign={"start"}
                p={3}
                borderLeft={"2px"}
                borderLeftColor={"red.600"}
              >
                This image is AI-generated with a confidence of{" "}
                {deepfakePredictionResult.confidence.toPrecision(3)}
              </Text>
            ) : deepfakePredictionResult.result === "REAL" ? (
              <Text
                textAlign={"start"}
                p={3}
                background={"green.100"}
                color="green.700"
                borderLeft={"2px"}
                borderLeftColor={"green.400"}
              >
                This image is not AI-generated with a confidence of{" "}
                {deepfakePredictionResult.confidence.toPrecision(3)}
              </Text>
            ) : (
              <Text
                textAlign={"start"}
                p={3}
                background={"orange.100"}
                color="orange.600"
                borderLeft={"2px"}
                borderLeftColor={"orange.600"}
              >
                Could not conclusively determine if this image is AI-generated
                (meaning it is likelier to be real than fake)
              </Text>
            )}
          </Box>
        )}
        {relatedResults && <RelatedResults results={relatedResults} />}
      </Stack>
    </Container>
  );
};

export default ResultDisplay;
