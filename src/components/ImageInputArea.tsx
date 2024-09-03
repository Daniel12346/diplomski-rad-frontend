import { ArrowForwardIcon, PlusSquareIcon } from "@chakra-ui/icons";
import {
  Center,
  Input,
  Text,
  Box,
  Stack,
  Image,
  InputGroup,
  InputRightElement,
  useColorModeValue,
  Container,
  Alert,
  CloseButton,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  imageSrcState,
  imageState,
  processingStatusState,
} from "../recoil/state";
import Controls from "./Controls";
import { FileUploader } from "react-drag-drop-files";
import * as faceapi from "face-api.js";

const ImageInputArea = () => {
  const MODEL_URL = "/models";
  const [image, setImage] = useRecoilState(imageState);
  const [imageSrc, setImageSrc] = useRecoilState(imageSrcState);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bg = useColorModeValue("gray.100", "blue.900");
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const setProcessingStatus = useSetRecoilState(processingStatusState);

  const detectFaces = async () => {
    if (imgRef.current && canvasRef.current) {
      setProcessingStatus("LOADING");
      const img = imgRef.current;
      const canvas = canvasRef.current;
      const displaySize = { width: img.width, height: img.height };
      try {
        faceapi.matchDimensions(canvas, displaySize);
        const detections = await faceapi.detectAllFaces(img);
        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );

        if (resizedDetections.length === 0) {
          throw new Error("No faces detected in the image");
        }
        //TODO: fix getting canvas context
        canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
      } catch (e) {
        console.log(e);
        throw new Error("Could not detect faces in the image");
      }
    }
  };

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.loadSsdMobilenetv1Model("/models");
        await faceapi.loadFaceLandmarkModel(MODEL_URL);
      } catch (e) {
        console.log(e);
      }
    };
    loadModels();
  }, []);
  useEffect(() => {
    if (image) {
      //TODO: check if image is too large
      // console.log(image.size, image.size / 1024);
      // if (image.size / 1024 > 20) {
      //   console.log("file too large");
      //   setError("File too large. Please upload a smaller file.");
      //   return;
      // } else {
      //   if (error) {
      //     setError(null);
      //   }
      // }
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(image);
      setError(null);
    }
    if (!image) {
      setImageSrc(null);
    }
  }, [image]);

  return (
    <Stack rounded="md" align={"center"} w="100%">
      <Center
        minW={{ sm: "100%", md: "15rem" }}
        w={"100%"}
        bg={bg}
        borderWidth={2}
        borderColor={"gray.400"}
        borderStyle={imageSrc ? "none" : "dashed"}
      >
        <Container
          padding={0}
          h={imageSrc ? "auto" : "15rem"}
          display={"flex"}
          justifyContent={"center"}
        >
          <FileUploader
            handleChange={async (file: File) => {
              setImage(file);
            }}
            children={
              imageSrc ? (
                <Box>
                  <Image
                    ref={imgRef}
                    src={imageSrc || ""}
                    alt="preview"
                    w={"100%"}
                    maxWidth="50ch"
                  />
                  <canvas
                    ref={canvasRef}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      zIndex: 0,
                    }}
                  ></canvas>
                </Box>
              ) : (
                <Container h="100%" placeContent={"center"} cursor={"pointer"}>
                  <Container display="flex" justifyContent={"center"}>
                    <PlusSquareIcon boxSize={12} color="blue.500" />
                  </Container>
                  <Text fontSize="md">Drag and drop an image here</Text>
                </Container>
              )
            }
          ></FileUploader>
        </Container>
      </Center>

      {imageSrc && (
        <Stack p="0.5rem" w="100vw" maxW={"md"}>
          <Center></Center>
          <Container px="6">
            <Controls detectFaces={detectFaces} setError={setError} />
          </Container>
        </Stack>
      )}

      {!imageSrc && (
        <InputGroup>
          <Input
            size="sm"
            alignSelf={"center"}
            _placeholder={{ color: "blue.400", fontSize: "md" }}
            type="url"
            mt={1}
            border={"2px solid"}
            borderColor={"gray.400"}
            placeholder="or paste an image url"
            ref={fileInputRef}
            p={1}
          />
          <InputRightElement
            display={"flex"}
            justifyContent={"flex-end"}
            cursor={"pointer"}
            onClick={() => {
              const url = fileInputRef.current?.value;
              if (!url) {
                // setError("Please enter a valid URL");
                return;
              }
              //converting the image to base64
              const toDataURL = (url: string) =>
                fetch(url)
                  .then((response) => response.blob())
                  .then(
                    (blob) =>
                      new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          resolve(reader.result);
                        };
                        reader.onerror = reject;
                        reader.readAsDataURL(blob);
                      })
                  );
              toDataURL(url).then((res) => {
                setImageSrc(res as string);
              });
            }}
          >
            <ArrowForwardIcon boxSize={8} color="blue.100" bg="blue.500" />
          </InputRightElement>
        </InputGroup>
      )}
      {error && (
        <Alert status="error">
          <Text fontSize="sm">{error}</Text>
          <CloseButton
            position="absolute"
            right="8px"
            top="8px"
            onClick={() => setError(null)}
          />
        </Alert>
      )}
    </Stack>
  );
};

export default ImageInputArea;
