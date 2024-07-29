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
} from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  boundingBoxOverlaySrcState,
  imageSrcState,
  imageState,
} from "../recoil/state";
import Controls from "./Controls";
import { FileUploader } from "react-drag-drop-files";

const ImageInputArea = () => {
  const [image, setImage] = useRecoilState(imageState);
  const [imageSrc, setImageSrc] = useRecoilState(imageSrcState);
  const boundingBoxOverlaySrc = useRecoilValue(boundingBoxOverlaySrcState);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bg = useColorModeValue("gray.100", "blue.900");

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
    <Stack rounded="md" align={"center"} w="100%">
      <Center
        // h={!imageSrc ? "40vh" : "auto"}
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
            handleChange={(file: File) => {
              console.log(file);
              setImage(file);
            }}
            children={
              imageSrc ? (
                <Box>
                  <Image
                    src={imageSrc || ""}
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
            <Controls />
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
              if (url) {
                setImageSrc(url);
              }
            }}
          >
            <ArrowForwardIcon boxSize={8} color="blue.100" bg="blue.500" />
          </InputRightElement>
        </InputGroup>
      )}
    </Stack>
  );
};

export default ImageInputArea;
