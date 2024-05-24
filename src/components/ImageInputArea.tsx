// import { useState } from "react";

import { DeleteIcon, PlusSquareIcon } from "@chakra-ui/icons";
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
import { useState } from "react";

const HiddenImageInputWithIcon = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isRecognizingFace, setIsRecognizingFace] = useState<boolean>(false);
  const [recognizedFaces, setRecognizedFaces] = useState<string[] | null>(null);
  const [canvasUrl, setCanvasUrl] = useState<string | null>(null);

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("file", file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
      recognizeFace(file);
    }
  };

  const recognizeFace = async (image: File) => {
    console.log(image);
    if (image) {
      try {
        setIsRecognizingFace(true);
        const formData = new FormData();
        formData.append("image", image);
        console.log(import.meta.env.VITE_FACE_RECOGNITION_URI);
        const response = await fetch(
          `${import.meta.env.VITE_FACE_RECOGNITION_URI}`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
        console.log(data);
        const { matchResults, detection, canvasUrl } = data;
        if (matchResults?.length) {
          setRecognizedFaces(matchResults.map((e: any) => e._label));
        } else {
          console.log("No faces recognized");
          setRecognizedFaces(null);
        }

        if (detection) {
          //draw the bounding box
        }
        if (canvasUrl) {
          setCanvasUrl(canvasUrl);
        }

        console.log(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsRecognizingFace(false);
      }
    }
  };

  return (
    <Stack>
      <Center>
        <Input
          type="file"
          accept="image/*"
          onChange={onImageChange}
          display="none"
          id="image"
          name="image"
          position={"absolute"}
        />
        {/* <canvas id="canvas" position={}></canvas> */}

        {imageSrc ? (
          <Box position={"relative"}>
            <img src={imageSrc} alt="preview" />
            <img
              hidden={!canvasUrl}
              src={canvasUrl || ""}
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
        {recognizedFaces?.length && (
          <Flex gap={5}>
            <DeleteIcon
              onClick={() => {
                setImageSrc(null);
                setRecognizedFaces(null);
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
        )}
      </Box>
    </Stack>
  );
};

export default HiddenImageInputWithIcon;
