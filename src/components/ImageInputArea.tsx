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
} from "@chakra-ui/react";
import { useEffect } from "react";
// import useRecognizeFace from "../hooks/useRecognizeFace";
import recognizeFace from "../functions/recognizeFace";
import detectDeepfake from "../functions/detectDeepfake";
import { useRecoilState } from "recoil";
import {
  boundingBoxOverlaySrcState,
  deepfakePredictionResultState,
  imageSrcState,
  imageState,
  processingStatusState,
  recognizedFacesState,
} from "../recoil/state";

const ImageInputArea = () => {
  const [image, setImage] = useRecoilState(imageState);
  const [deepfakePredictionResult, setDeepfakePredictionResult] =
    useRecoilState(deepfakePredictionResultState);
  const [imageSrc, setImageSrc] = useRecoilState(imageSrcState);
  const [processingStatus, setProcessingStatus] = useRecoilState(
    processingStatusState
  );
  const [recognizedFaces, setRecognizedFaces] =
    useRecoilState(recognizedFacesState);
  const [boundingBoxOverlaySrc, setboundingBoxOverlaySrc] = useRecoilState(
    boundingBoxOverlaySrcState
  );

  const onStartRequest = async (
    image: File | null,
    imageSrc: string | null
  ) => {
    setProcessingStatus("LOADING");

    if (!image || !imageSrc) return;
    console.log("imageSrc", imageSrc);
    const response = await detectDeepfake(imageSrc);
    console.log("response", response);
    const predictions = response?.predictions;
    if (predictions?.length && predictions[0].class === "fake") {
      setDeepfakePredictionResult({
        isDeepfake: true,
        confidence: predictions[0].confidence,
      });
      setProcessingStatus("COMPLETED");
      return;
    } else {
      if (predictions?.length && predictions[0].class === "real") {
        setDeepfakePredictionResult({
          isDeepfake: false,
          confidence: predictions[0].confidence,
        });
      }
      const { recognizedFaces, boundingBoxOverlaySrc } = await recognizeFace(
        image
      );
      setRecognizedFaces(recognizedFaces);
      setboundingBoxOverlaySrc(boundingBoxOverlaySrc);
      setProcessingStatus("COMPLETED");
    }
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
      <Box>
        <Box p={2}>
          {processingStatus === "LOADING" && <Spinner />}
          {recognizedFaces?.length ? (
            <Flex gap={5}>
              <DeleteIcon
                onClick={() => {
                  setImage(null);
                  setRecognizedFaces(null);
                  setboundingBoxOverlaySrc(null);
                  setProcessingStatus("IDLE");
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
            image &&
            processingStatus === "IDLE" && (
              <SearchIcon
                boxSize={6}
                color="blue.500"
                cursor="pointer"
                onClick={() => imageSrc && onStartRequest(image, imageSrc)}
              />
            )
          )}
        </Box>
        {deepfakePredictionResult && (
          <Box>
            {deepfakePredictionResult.isDeepfake ? (
              <Text background="red.600" color="red.100">
                This image is AI-generated with a confidence of{" "}
                {deepfakePredictionResult.confidence.toPrecision(3)}
              </Text>
            ) : (
              <Text>
                This image is not AI-generated with a confidence of{" "}
                {deepfakePredictionResult.confidence.toPrecision(3)}
              </Text>
            )}
          </Box>
        )}
      </Box>
    </Stack>
  );
};

export default ImageInputArea;
