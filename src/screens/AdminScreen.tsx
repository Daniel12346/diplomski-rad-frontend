import { Container, Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import SocialMediaChart from "../components/SocialMediaChart";
import ValidityChart from "../components/ValidityChart";

const AdminScreen = () => {
  return (
    <Stack>
      <Heading mb={6}>Admin Screen</Heading>
      <SimpleGrid
        columns={{ sm: 1, md: 2 }}
        spacing={"4rem"}
        _dark={{ color: "gray.200" }}
        _light={{ color: "gray.700" }}
      >
        <Container>
          <Text pl="4" fontSize={"lg"} mb={2}>
            Image validity
          </Text>
          <ValidityChart />
        </Container>
        <Container>
          <Text pl="4" fontSize={"lg"} mb={2}>
            Social media
          </Text>
          <SocialMediaChart />
        </Container>
      </SimpleGrid>
    </Stack>
  );
};
export default AdminScreen;
