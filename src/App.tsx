import {
  Center,
  Switch,
  Box,
  useColorMode,
  Spacer,
  Flex,
} from "@chakra-ui/react";

import { MoonIcon, SunIcon } from "@chakra-ui/icons";

import { Outlet } from "react-router-dom";

function MainScreen() {
  const { toggleColorMode, colorMode } = useColorMode();
  return (
    <Box>
      <Flex px={4} py={2}>
        <Spacer />
        <Center pr={2}>
          {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        </Center>
        <Switch
          onChange={() => {
            toggleColorMode();
          }}
        ></Switch>
      </Flex>
      <Center>
        <Outlet />
      </Center>
    </Box>
  );
}

export default MainScreen;
