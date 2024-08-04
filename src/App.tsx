import {
  Center,
  Switch,
  Box,
  useColorMode,
  Spacer,
  Flex,
  Stack,
} from "@chakra-ui/react";

import { MoonIcon, SunIcon } from "@chakra-ui/icons";

import { Outlet } from "react-router-dom";

function MainScreen() {
  const { toggleColorMode, colorMode } = useColorMode();
  return (
    <Stack maxWidth="100vw">
      <Flex gap={2} p="2">
        <Spacer />
        <Center>{colorMode === "light" ? <MoonIcon /> : <SunIcon />}</Center>
        <Switch
          onChange={() => {
            toggleColorMode();
          }}
        ></Switch>
      </Flex>
      {/* <ErrorBoundary> */}
      <Center>
        <Outlet />
      </Center>
      {/* </ErrorBoundary> */}
    </Stack>
  );
}

export default MainScreen;
