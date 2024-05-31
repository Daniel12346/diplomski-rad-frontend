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
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isRecognizingFace, setIsRecognizingFace] = useState<boolean>(false);
  const [recognizedFaces, setRecognizedFaces] = useState<string[] | null>(null);
  const [boundingBoxOverlaySrc, setboundingBoxOverlaySrc] = useState<
    string | null
  >(null);

  const onStartRequest = async (image: File | null) => {
    console.log("onStartRequest", image);
    const loadImageBase64 = (image: File) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => {
          console.log("Error: ", error);
          reject(error);
        };
      });
    };

    if (image && imageSrc) {
      const { data } = await detectDeepfake(imageSrc);
      setIsRecognizingFace(true);
      const { recognizedFaces, boundingBoxOverlaySrc } = await recognizeFace(
        image
      );
      setRecognizedFaces(recognizedFaces);
      setboundingBoxOverlaySrc(boundingBoxOverlaySrc);
      console.log("deepfake detection result: ", data);
    }
    setIsRecognizingFace(false);
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
        {isRecognizingFace && <Spinner />}
        {recognizedFaces?.length ? (
          <Flex gap={5}>
            <DeleteIcon
              onClick={() => {
                setImage(null);
                setRecognizedFaces(null);
                setboundingBoxOverlaySrc(null);
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
          !isRecognizingFace && (
            <SearchIcon
              boxSize={6}
              color="blue.500"
              cursor="pointer"
              onClick={() => onStartRequest(image)}
            />
          )
        )}
      </Box>
    </Stack>
  );
};

export default ImageInputArea;
