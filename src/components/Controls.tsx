import { DeleteIcon, SearchIcon } from "@chakra-ui/icons";
import {
  SimpleGrid,
  Center,
  Spinner,
  Circle,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  imageState,
  imageSrcState,
  searchResultsState,
  processingStatusState,
  deepfakePredictionResultState,
  shouldCheckDeepfakeState,
  shouldSearchRelatedResultsState,
} from "../recoil/state";
import detectDeepfake from "../functions/detectDeepfake";
import searchRelatedResults from "../functions/searchRelatedResults";
import uploadImageToHostingService from "../functions/uploadImageToHostingService";
import saveCheckResultData from "../functions/saveCheckResultData";
import { Dispatch } from "react";

type ControlsProps = {
  detectFaces: () => void;
  setError: Dispatch<string | null>;
};
const Controls = ({ detectFaces, setError }: ControlsProps) => {
  const image = useRecoilValue(imageState);
  const imageSrc = useRecoilValue(imageSrcState);
  const shouldCheckDeepfake = useRecoilValue(shouldCheckDeepfakeState);
  const shouldSearchRelatedResults = useRecoilValue(
    shouldSearchRelatedResultsState
  );

  const processingStatus = useRecoilValue(processingStatusState);
  const setImage = useSetRecoilState(imageState);
  const setImageSrc = useSetRecoilState(imageSrcState);
  const setRelatedResults = useSetRecoilState(searchResultsState);
  const setProcessingStatus = useSetRecoilState(processingStatusState);
  const setDeepfakePredictionResult = useSetRecoilState(
    deepfakePredictionResultState
  );
  const controlsBgColor = useColorModeValue("blue.100", "blue.800");

  interface RequestParams {
    image: File | null;
    imageSrc: string | null;
    // shouldRecognizeFace: boolean;
    shouldCheckDeepfake: boolean;
    shouldSearchRelatedResults: boolean;
  }
  const onStartRequest = async ({
    image,
    imageSrc,
    shouldCheckDeepfake,
    shouldSearchRelatedResults,
  }: RequestParams) => {
    setProcessingStatus("LOADING");

    if (!image && !imageSrc) return;

    let hostedUrl = null;
    try {
      await detectFaces();
    } catch (e) {
      setError("Could not detect faces in the image");
    }
    try {
      hostedUrl = await uploadImageToHostingService(imageSrc);
      if (!hostedUrl) {
        setProcessingStatus("COMPLETED");
        setError("Error uploading image");
        return;
      }
    } catch (err) {
      console.log(err);
      setError("Error uploading image");
      setProcessingStatus("COMPLETED");
      return;
    }

    let deepfakePredictions = null;

    let result: "FAKE" | "REAL" | "UNKNOWN" = "UNKNOWN";
    let socialMediaName = "UNKNOWN";
    //TODO: other social media names
    let match = imageSrc?.match(/facebook|twitter|x\.com|instagram/gi);
    if (match) {
      socialMediaName = match[0];
    }

    if (shouldCheckDeepfake) {
      try {
        const response = await detectDeepfake(hostedUrl);
        deepfakePredictions = response?.predictions;
        if (deepfakePredictions && deepfakePredictions?.length) {
          result = deepfakePredictions[0].class.toLocaleUpperCase() as
            | "FAKE"
            | "REAL";
          setDeepfakePredictionResult({
            result: result,
            confidence: deepfakePredictions[0].confidence,
          });
        } else if (result === "UNKNOWN") {
          setDeepfakePredictionResult({
            result: "UNKNOWN",
            confidence: 0,
          });
        }
      } catch (e) {
        console.log(e);
        setError("Error checking for deepfake");
        setProcessingStatus("COMPLETED");
        return;
      }
    }

    if (shouldSearchRelatedResults) {
      try {
        const res = await searchRelatedResults(hostedUrl);
        res?.image_results &&
          setRelatedResults(
            res.image_results.map((result: any) => ({
              title: result.title,
              favicon: result.favicon,
              redirect_link: result.redirect_link,
            }))
          );
      } catch (e) {
        setError("Error searching for related results");
        setProcessingStatus("COMPLETED");
        return;
      }
    }
    const confidence =
      (deepfakePredictions && deepfakePredictions[0]?.confidence) || undefined;
    try {
      await saveCheckResultData({
        imageUrl: hostedUrl,
        confidence,
        socialMediaName,
        result,
      });
    } catch (e) {
      setError("Error saving result data");
      setProcessingStatus("COMPLETED");
    }

    setProcessingStatus("COMPLETED");
  };

  return (
    <SimpleGrid
      height={"4rem"}
      columns={3}
      alignItems={"center"}
      bg={controlsBgColor}
      w={"100%"}
      px="2"
    >
      <DeleteIcon
        _hover={{ filter: "brightness(0.8)" }}
        onClick={() => {
          setError(null);
          setImage(null);
          setImageSrc(null);
          setRelatedResults(null);
          setProcessingStatus("IDLE");
          setDeepfakePredictionResult(null);
        }}
        cursor="pointer"
        boxSize={6}
        color="red.400"
      ></DeleteIcon>
      <Center>
        {processingStatus === "LOADING" ? (
          <Spinner color="blue.600" size={"lg"} />
        ) : (
          <Circle
            bg="blue.600"
            size="48px"
            cursor={"pointer"}
            _hover={{ filter: "brightness(0.8)" }}
            onClick={() =>
              imageSrc &&
              onStartRequest({
                image,
                imageSrc,
                shouldCheckDeepfake,
                shouldSearchRelatedResults,
              })
            }
          >
            <SearchIcon boxSize={8} color="blue.100" />
          </Circle>
        )}
      </Center>
    </SimpleGrid>
  );
};

export default Controls;
