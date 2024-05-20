// import { useState } from "react";

import { DeleteIcon, PlusSquareIcon } from "@chakra-ui/icons";
import { Center, Input, FormLabel, Text, Box, Spinner } from "@chakra-ui/react";
import { useState } from "react";

const HiddenImageInputWithIcon = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isRecognizingFace, setIsRecognizingFace] = useState<boolean>(false);
  const [recognizedFaces, setRecognizedFaces] = useState<string[] | null>(null);

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
        const response = await fetch(
          `${import.meta.env.FACE_RECOGNITION_URL}/check-face`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
        if (!data?.result.length) {
          console.log("No faces recognized");
          setRecognizedFaces(null);
        } else {
          setRecognizedFaces(data?.result.map((e: any) => e._label));
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
    <Center>
      <Input
        type="file"
        accept="image/*"
        onChange={onImageChange}
        display="none"
        id="image"
        name="image"
      />

      {imageSrc ? (
        <Box>
          <img src={imageSrc} alt="preview" />
          <DeleteIcon
            onClick={() => setImageSrc(null)}
            cursor="pointer"
            boxSize={6}
            color="red.500"
          ></DeleteIcon>
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
      {isRecognizingFace && <Spinner />}
      {recognizedFaces?.length && (
        <>
          <Text>Recognized faces:</Text>
          <Box>
            {recognizedFaces.map((name) => (
              <Text key={name}>{name}</Text>
            ))}
          </Box>
        </>
      )}
    </Center>
  );
};

export default HiddenImageInputWithIcon;
