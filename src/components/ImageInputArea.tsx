import { DeleteIcon, PlusSquareIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Center,
  Input,
  FormLabel,
  Text,
  Box,
  Spinner,
  Stack,
  Flex,
  Link,
} from "@chakra-ui/react";
import { useEffect } from "react";
// import useRecognizeFace from "../hooks/useRecognizeFace";
import recognizeFace from "../functions/recognizeFace";
import detectDeepfake from "../functions/detectDeepfake";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  boundingBoxOverlaySrcState,
  deepfakePredictionResultState,
  imageSrcState,
  imageState,
  processingStatusState,
  recognizedFacesState,
  searchResultsState,
  shouldCheckDeepfakeState,
  shouldRecognizeFaceState,
  shouldSearchRelatedResultsState,
} from "../recoil/state";
import uploadImageToHostingService from "../functions/uploadImageToHostingService";
import searchRelatedResults from "../functions/searchRelatedResults";

const ImageInputArea = () => {
  const [image, setImage] = useRecoilState(imageState);
  const [deepfakePredictionResult, setDeepfakePredictionResult] =
    useRecoilState(deepfakePredictionResultState);
  const [relatedResults, setRelatedResults] =
    useRecoilState(searchResultsState);
  const [imageSrc, setImageSrc] = useRecoilState(imageSrcState);
  const [processingStatus, setProcessingStatus] = useRecoilState(
    processingStatusState
  );
  const [recognizedFaces, setRecognizedFaces] =
    useRecoilState(recognizedFacesState);
  const [boundingBoxOverlaySrc, setboundingBoxOverlaySrc] = useRecoilState(
    boundingBoxOverlaySrcState
  );
  const shouldRecognizeFace = useRecoilValue(shouldRecognizeFaceState);
  const shouldCheckDeepfake = useRecoilValue(shouldCheckDeepfakeState);
  const shouldSearchRelatedResults = useRecoilValue(
    shouldSearchRelatedResultsState
  );

  const onStartRequest = async (
    image: File | null,
    imageSrc: string | null,
    shouldRecognizeFace: boolean,
    shouldCheckDeepfake: boolean,
    shouldSearchRelatedResults: boolean
  ) => {
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

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedImage = e.target.files?.[0];
    if (uploadedImage) {
      setImage(uploadedImage);
    } else {
      setImage(null);
    }
  };

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(image);
    }
    if (!image) {
      setImageSrc(null);
    }
  }, [image]);

  return (
    <Stack>
      <Center>
        <Input
          type="file"
          accept="image/*"
          onInput={onImageChange}
          display="none"
          id="image"
          name="image"
          position={"absolute"}
        />

        {imageSrc ? (
          <Box position={"relative"}>
            <img src={imageSrc} alt="preview" />
            <img
              hidden={!boundingBoxOverlaySrc}
              src={boundingBoxOverlaySrc || ""}
              id="overlay"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 1,
              }}
            />
          </Box>
        ) : (
          <FormLabel
            htmlFor="image"
            cursor="pointer"
            boxSize="2xs"
            placeContent="center"
          >
            <Center>
              <PlusSquareIcon boxSize={12} color="blue.500" />
              <Text>add an image</Text>
            </Center>
          </FormLabel>
        )}
      </Center>
      <Input
        type="url"
        color="blue.500"
        border={"1px solid"}
        placeholder="or paste an image url"
        onBlur={(e) => setImageSrc(e.target.value)}
      />
      <Box>
        <Box p={2}>
          {processingStatus === "LOADING" && <Spinner />}
          {recognizedFaces?.length ? (
            <Flex gap={5}>
              <DeleteIcon
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
                color="red.500"
              ></DeleteIcon>
              <Flex>
                <Text>Recognized faces:</Text>
                <Box>
                  {recognizedFaces.map((name) => (
                    <Text key={name}>{name}</Text>
                  ))}
                </Box>
              </Flex>
            </Flex>
          ) : (
            (image || imageSrc) &&
            processingStatus === "IDLE" && (
              <SearchIcon
                boxSize={6}
                color="blue.500"
                cursor="pointer"
                onClick={() =>
                  imageSrc &&
                  onStartRequest(
                    image,
                    imageSrc,
                    shouldCheckDeepfake,
                    shouldRecognizeFace,
                    shouldSearchRelatedResults
                  )
                }
              />
            )
          )}
        </Box>
        {deepfakePredictionResult && (
          <Box>
            {deepfakePredictionResult.result === "fake" ? (
              <Text
                background="red.600"
                color="red.100"
                textAlign={"start"}
                p={3}
              >
                This image is AI-generated with a confidence of{" "}
                {deepfakePredictionResult.confidence.toPrecision(3)}
              </Text>
            ) : deepfakePredictionResult.result === "real" ? (
              <Text textAlign={"start"} p={3}>
                This image is not AI-generated with a confidence of{" "}
                {deepfakePredictionResult.confidence.toPrecision(3)}
              </Text>
            ) : (
              <Text textAlign={"start"} p={3}>
                Could not conclusively determine if this image is AI-generated
                (meaning it is likelier to be real than fake)
              </Text>
            )}
          </Box>
        )}
        {relatedResults &&
          (relatedResults.length > 0 ? (
            <Box>
              <Text>Related results:</Text>
              {relatedResults.map((result) => (
                <Stack key={result.redirect_link}>
                  <Link
                    py={2}
                    display={"flex"}
                    alignItems={"center"}
                    href={result.redirect_link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {result.favicon && (
                      <img src={result.favicon} alt="favicon" />
                    )}
                    <Text ml={2}>{result.title}</Text>
                  </Link>
                </Stack>
              ))}
            </Box>
          ) : (
            <Text>No related results found</Text>
          ))}
      </Box>
    </Stack>
  );
};

export default ImageInputArea;
