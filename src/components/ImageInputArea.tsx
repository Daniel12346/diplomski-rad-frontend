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
import { useEffect, useState } from "react";
// import useRecognizeFace from "../hooks/useRecognizeFace";
import recognizeFace from "../functions/recognizeFace";
import detectDeepfake from "../functions/detectDeepfake";

const ImageInputArea = () => {
  const [image, setImage] = useState<File | null>(null);
  const [deepfakePredictionResult, setDeepfakePredictionResult] = useState<{
    isDeepfake: boolean;
    confidence: number;
  } | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [processingState, setProcessingState] = useState<
    "IDLE" | "LOADING" | "COMPLETED" | ""
  >("IDLE");
  const [recognizedFaces, setRecognizedFaces] = useState<string[] | null>(null);
  const [boundingBoxOverlaySrc, setboundingBoxOverlaySrc] = useState<
    string | null
  >(null);

  const onStartRequest = async (image: File | null) => {
    if (image && imageSrc) {
      setProcessingState("LOADING");
      const response = await detectDeepfake(imageSrc);
      if (response?.predictions.length) {
        const deepfakePrediction = response.predictions[0];
        if (deepfakePrediction.class === "fake") {
          setDeepfakePredictionResult({
            isDeepfake: true,
            confidence: deepfakePrediction.confidence,
          });
          setProcessingState("COMPLETED");
        } else {
          setDeepfakePredictionResult({
            isDeepfake: false,
            confidence: deepfakePrediction.confidence,
          });
        }
      }
      const { recognizedFaces, boundingBoxOverlaySrc } = await recognizeFace(
        image
      );
      setRecognizedFaces(recognizedFaces);
      setboundingBoxOverlaySrc(boundingBoxOverlaySrc);
      setProcessingState("COMPLETED");
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
      <Box p={2}>
        {processingState === "LOADING" && <Spinner />}
        {recognizedFaces?.length ? (
          <Flex gap={5}>
            <DeleteIcon
              onClick={() => {
                setImage(null);
                setRecognizedFaces(null);
                setboundingBoxOverlaySrc(null);
                setProcessingState("IDLE");
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
          processingState === "IDLE" && (
            <SearchIcon
              boxSize={6}
              color="blue.500"
              cursor="pointer"
              onClick={() => onStartRequest(image)}
            />
          )
        )}
      </Box>
      {deepfakePredictionResult && (
        <Box>
          {deepfakePredictionResult.isDeepfake ? (
            <Text background="red.400" color="red.50">
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
    </Stack>
  );
};

export default ImageInputArea;
