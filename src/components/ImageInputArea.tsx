import { ArrowForwardIcon, PlusSquareIcon } from "@chakra-ui/icons";
import {
  Center,
  Input,
  FormLabel,
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

const ImageInputArea = () => {
  const [image, setImage] = useRecoilState(imageState);
  const [imageSrc, setImageSrc] = useRecoilState(imageSrcState);
  const boundingBoxOverlaySrc = useRecoilValue(boundingBoxOverlaySrcState);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bg = useColorModeValue("gray.100", "blue.900");

  const onImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <Stack rounded="md">
      <Center
        bg={bg}
        borderWidth={2}
        borderColor={"gray.400"}
        borderStyle={imageSrc ? "none" : "dashed"}
      >
        <Input
          type="file"
          accept="image/*"
          onInput={onImageInput}
          display="none"
          id="image"
          name="image"
          position={"absolute"}
        />

        {imageSrc ? (
          <Stack p="0.5rem" w="100vw" maxW={"md"}>
            <Center>
              <Box position={"relative"}>
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
            </Center>
            <Container px="6">
              <Controls />
            </Container>
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
