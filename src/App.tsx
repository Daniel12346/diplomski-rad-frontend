import {
  Center,
  Stack,
  Switch,
  Box,
  useColorMode,
  Spacer,
  Flex,
  Container,
} from "@chakra-ui/react";
import ImageInputArea from "./components/ImageInputArea";
import AdvancedSettings from "./components/AdvancedSettings";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import ResultDisplay from "./components/ResultDisplay";
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
