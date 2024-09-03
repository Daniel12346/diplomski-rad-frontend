import { Button, Center, Container, Stack, Text } from "@chakra-ui/react";
import { Link as ReactRouterLink, useRouteError } from "react-router-dom";
import { Link as ChakraLink } from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";

export default function ErrorScreen() {
  const error = useRouteError();
  console.log(error);
  return (
    <Container>
      <Center paddingTop={10} px={{ base: "10px" }}>
        <Stack gap={6}>
          <Text fontSize={"4xl"} fontWeight={"semibold"}>
            Oops! Something went wrong
          </Text>
          <Center>
            <ChakraLink as={ReactRouterLink}>
              <Button
                size={"lg"}
                colorScheme={"blue"}
                rightIcon={<ArrowForwardIcon />}
              >
                Return home
              </Button>
            </ChakraLink>
          </Center>
        </Stack>
      </Center>
    </Container>
  );
}
