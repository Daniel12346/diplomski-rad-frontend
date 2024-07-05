import { Container, Stack, Flex, Box, Text } from "@chakra-ui/react";
import RelatedResults from "./RelatedSearchResults";
import { useRecoilValue } from "recoil";
import {
  deepfakePredictionResultState,
  searchResultsState,
  recognizedFacesState,
} from "../recoil/state";

const ResultDisplay = () => {
  const deepfakePredictionResult = useRecoilValue(
    deepfakePredictionResultState
  );
  const relatedResults = useRecoilValue(searchResultsState);

  const recognizedFaces = useRecoilValue(recognizedFacesState);
  return (
    <Container pb="5">
      <Stack gap={5} px="3" pb="5" borderColor={"blue.300"}>
        <Box>
          {recognizedFaces && (
            <Flex fontSize="xl">
              {recognizedFaces.every((name) => name === "UNKNOWN") ? (
                <Text>Could not recognize any faces</Text>
              ) : (
                <Box>
                  <Text>Recognized faces: </Text>
                  <Box>
                    {recognizedFaces.map((name) => (
                      <Text key={name}>{name}</Text>
                    ))}
                  </Box>
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
