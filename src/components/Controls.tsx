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
  // recognizedFacesState,
  searchResultsState,
  boundingBoxOverlaySrcState,
  processingStatusState,
  deepfakePredictionResultState,
  shouldCheckDeepfakeState,
  // shouldRecognizeFaceState,
  shouldSearchRelatedResultsState,
} from "../recoil/state";
import detectDeepfake from "../functions/detectDeepfake";
// import recognizeFace from "../functions/recognizeFace";
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
  // const shouldRecognizeFace = useRecoilValue(shouldRecognizeFaceState);
  const shouldCheckDeepfake = useRecoilValue(shouldCheckDeepfakeState);
  const shouldSearchRelatedResults = useRecoilValue(
    shouldSearchRelatedResultsState
  );

  const processingStatus = useRecoilValue(processingStatusState);
  const setImage = useSetRecoilState(imageState);
  const setImageSrc = useSetRecoilState(imageSrcState);
  // const setRecognizedFaces = useSetRecoilState(recognizedFacesState);
  const setRelatedResults = useSetRecoilState(searchResultsState);
  const setboundingBoxOverlaySrc = useSetRecoilState(
    boundingBoxOverlaySrcState
  );
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
    // shouldRecognizeFace,
    shouldCheckDeepfake,
    shouldSearchRelatedResults,
  }: RequestParams) => {
    setProcessingStatus("LOADING");

    if (!image && !imageSrc) return;

    let hostedUrl = imageSrc;
    await detectFaces();
    console.log(image);
    try {
      if (imageSrc) {
        hostedUrl = await uploadImageToHostingService(imageSrc);
      }

      if (!hostedUrl) {
        setProcessingStatus("COMPLETED");
        return;
      }
    } catch (err) {
      setError("Error uploading image");
      setProcessingStatus("COMPLETED");
      return;
    }

    let deepfakePredictions = null;

    //TODO: either use recognizedFaces or recognizedFace both in client and server
    // let recognizedFace = "UNKNOWN";
    //whether the image is AI generated
    let result: "FAKE" | "REAL" | "UNKNOWN" = "UNKNOWN";
    let socialMediaName = "UNKNOWN";
    //TODO: other social media names
    let match = imageSrc?.match(/facebook|twitter|x\.com|instagram/gi);
    if (match) {
      socialMediaName = match[0];
    }

    if (shouldCheckDeepfake) {
      const response = await detectDeepfake(hostedUrl);
      console.log("response", response);
      deepfakePredictions = response?.predictions;
      if (deepfakePredictions && deepfakePredictions?.length) {
        result = deepfakePredictions[0].class.toLocaleUpperCase() as
          | "FAKE"
          | "REAL";
        setDeepfakePredictionResult({
          result: result,
          confidence: deepfakePredictions[0].confidence,
        });
        // if (result === "FAKE") {
        //   setProcessingStatus("COMPLETED");
        //   return;
        // }
      } else if (result === "UNKNOWN") {
        setDeepfakePredictionResult({
          result: "UNKNOWN",
          confidence: 0,
        });
      }
    }

    //TODO: add timeout?
    // if (shouldRecognizeFace) {
    //   const { recognizedFaces, boundingBoxOverlaySrc } = await recognizeFace(
    //     hostedUrl
    //   );
    //   console.log("recogn", recognizedFaces);
    //   recognizedFace = recognizedFaces ? recognizedFaces[0] : "UNKNOWN";
    //   setRecognizedFaces(recognizedFaces);
    //   setboundingBoxOverlaySrc(boundingBoxOverlaySrc);
    // }
    if (shouldSearchRelatedResults) {
      const res = await searchRelatedResults(hostedUrl);
      res?.image_results &&
        setRelatedResults(
          res.image_results.map((result: any) => ({
            title: result.title,
            favicon: result.favicon,
            redirect_link: result.redirect_link,
          }))
        );
    }
    const confidence =
      (deepfakePredictions && deepfakePredictions[0].confidence) || undefined;
    await saveCheckResultData({
      imageUrl: hostedUrl,
      confidence,
      socialMediaName,
      // recognizedFace,
      result,
    });

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
          // setRecognizedFaces(null);
          setRelatedResults(null);
          setboundingBoxOverlaySrc(null);
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
                // shouldRecognizeFace,
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
