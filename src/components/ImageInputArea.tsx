import { PlusSquareIcon } from "@chakra-ui/icons";
import {
  Center,
  Input,
  FormLabel,
  Text,
  Box,
  Stack,
  Flex,
  Image,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  boundingBoxOverlaySrcState,
  deepfakePredictionResultState,
  imageSrcState,
  imageState,
  recognizedFacesState,
  searchResultsState,
} from "../recoil/state";
import RelatedResults from "./RelatedResults";
import Controls from "./Controls";

const ImageInputArea = () => {
  const [image, setImage] = useRecoilState(imageState);
  const deepfakePredictionResult = useRecoilValue(
    deepfakePredictionResultState
  );
  const relatedResults = useRecoilValue(searchResultsState);
  const [imageSrc, setImageSrc] = useRecoilState(imageSrcState);

  const recognizedFaces = useRecoilValue(recognizedFacesState);
  const boundingBoxOverlaySrc = useRecoilValue(boundingBoxOverlaySrcState);

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
      <Stack gap={0} rounded="md">
        <Center
          borderWidth={2}
          borderColor={"gray.400"}
          borderStyle={imageSrc ? "none" : "dashed"}
        >
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
            <Stack px="0.5rem">
              <Box position={"relative"}>
                {/* TODO: adapt width */}
                <Image
                  src={imageSrc}
                  alt="preview"
                  w={"100%"}
                  maxWidth="50ch"
                />
                <Image
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
              <Controls />
            </Stack>
          ) : (
            <FormLabel
              htmlFor="image"
              cursor="pointer"
              boxSize="2xs"
              placeContent="center"
            >
              <Center>
                <PlusSquareIcon boxSize={12} color="blue.500" />
                <Text fontWeight="semibold" color="blue.400">
                  add an image
                </Text>
              </Center>
            </FormLabel>
          )}
        </Center>
        {!imageSrc && (
          <Input
            _placeholder={{ color: "blue.300" }}
            type="url"
            mt={1}
            border={"2px solid"}
            borderColor={"gray.400"}
            placeholder="or paste an image url"
            onBlur={(e) => setImageSrc(e.target.value)}
          />
        )}
      </Stack>

      <Box>
        {/* TODO: move to new component */}

        <Stack maxWidth={"50ch"} gap={4} paddingX={2}>
          <Box mb={4}>
            {recognizedFaces && (
              <Flex>
                <Text>Recognized faces:</Text>
                <Box>
                  {recognizedFaces.map((name) => (
                    <Text key={name}>{name}</Text>
                  ))}
                </Box>
              </Flex>
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
                <Text textAlign={"start"} p={3} background={"green.100"}>
                  This image is not AI-generated with a confidence of{" "}
                  {deepfakePredictionResult.confidence.toPrecision(3)}
                </Text>
              ) : (
                <Text
                  textAlign={"start"}
                  p={3}
                  background={"orange.100"}
                  color="orange.600"
                >
                  Could not conclusively determine if this image is AI-generated
                  (meaning it is likelier to be real than fake)
                </Text>
              )}
            </Box>
          )}
          {relatedResults && <RelatedResults results={relatedResults} />}
        </Stack>
      </Box>
    </Stack>
  );
};

export default ImageInputArea;
