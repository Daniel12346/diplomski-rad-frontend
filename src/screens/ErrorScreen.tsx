import { Center, Stack, Text } from "@chakra-ui/react";
import { useRouteError } from "react-router-dom";

export default function ErrorScreen() {
  const error = useRouteError();
  console.log(error);
  return (
    <Stack gap={4} width={{ base: "100%" }} maxWidth={"25rem"} px="4">
      <Center>
        <Text>Error </Text>
      </Center>
    </Stack>
  );
}
