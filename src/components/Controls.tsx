import { DeleteIcon, SearchIcon } from "@chakra-ui/icons";
import { SimpleGrid, Center, Spinner, Circle } from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  imageState,
  imageSrcState,
  recognizedFacesState,
  searchResultsState,
  boundingBoxOverlaySrcState,
  processingStatusState,
  deepfakePredictionResultState,
  shouldCheckDeepfakeState,
  shouldRecognizeFaceState,
  shouldSearchRelatedResultsState,
} from "../recoil/state";
import detectDeepfake from "../functions/detectDeepfake";
import recognizeFace from "../functions/recognizeFace";
import searchRelatedResults from "../functions/searchRelatedResults";
import uploadImageToHostingService from "../functions/uploadImageToHostingService";

const Controls = () => {
  const image = useRecoilValue(imageState);
  const imageSrc = useRecoilValue(imageSrcState);
  const shouldRecognizeFace = useRecoilValue(shouldRecognizeFaceState);
  const shouldCheckDeepfake = useRecoilValue(shouldCheckDeepfakeState);
  const shouldSearchRelatedResults = useRecoilValue(
    shouldSearchRelatedResultsState
  );

  const processingStatus = useRecoilValue(processingStatusState);
  const setImage = useSetRecoilState(imageState);
  const setImageSrc = useSetRecoilState(imageSrcState);
  const setRecognizedFaces = useSetRecoilState(recognizedFacesState);
  const setRelatedResults = useSetRecoilState(searchResultsState);
  const setboundingBoxOverlaySrc = useSetRecoilState(
    boundingBoxOverlaySrcState
  );
  const setProcessingStatus = useSetRecoilState(processingStatusState);
  const setDeepfakePredictionResult = useSetRecoilState(
    deepfakePredictionResultState
  );

  interface RequestParams {
    image: File | null;
    imageSrc: string | null;
    shouldRecognizeFace: boolean;
    shouldCheckDeepfake: boolean;
    shouldSearchRelatedResults: boolean;
  }
  const onStartRequest = async ({
    image,
    imageSrc,
    shouldRecognizeFace,
    shouldCheckDeepfake,
    shouldSearchRelatedResults,
  }: RequestParams) => {
    setProcessingStatus("LOADING");
    //TODO: don't need both image and imageSrc, upload image to hosting service and use the url
    if (!image || !imageSrc) return;

    const hostedUrl = await uploadImageToHostingService(image);

    let deepfakePredictions = null;

    if (shouldCheckDeepfake) {
      const response = await detectDeepfake(hostedUrl);
      deepfakePredictions = response?.predictions;
      if (
        deepfakePredictions &&
        deepfakePredictions?.length &&
        deepfakePredictions[0].class === "fake"
      ) {
        setDeepfakePredictionResult({
          result: "fake",
          confidence: deepfakePredictions[0].confidence,
        });
        setProcessingStatus("COMPLETED");
        return;
      } else if (
        deepfakePredictions &&
        deepfakePredictions?.length &&
        deepfakePredictions[0].class === "real"
      ) {
        setDeepfakePredictionResult({
          result: "real",
          confidence: deepfakePredictions[0].confidence,
        });
      } else {
        setDeepfakePredictionResult({
          result: "unknown",
          confidence: 0,
        });
      }
    }

    if (shouldRecognizeFace) {
      const { recognizedFaces, boundingBoxOverlaySrc } = await recognizeFace(
        hostedUrl
      );
      setRecognizedFaces(recognizedFaces);
      setboundingBoxOverlaySrc(boundingBoxOverlaySrc);
    }
    if (shouldSearchRelatedResults) {
      const res = await searchRelatedResults(hostedUrl);
      console.log(res);
      res?.image_results &&
        setRelatedResults(
          res.image_results.map((result: any) => ({
            title: result.title,
            favicon: result.favicon,
            redirect_link: result.redirect_link,
          }))
        );
    }

    setProcessingStatus("COMPLETED");
  };

  return (
    <SimpleGrid
      height={"4rem"}
      columns={3}
      alignItems={"center"}
      mb={4}
      w={"100%"}
    >
      <DeleteIcon
        _hover={{ filter: "brightness(0.8)" }}
        onClick={() => {
          setImage(null);
          setImageSrc(null);
          setRecognizedFaces(null);
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
                shouldRecognizeFace,
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
