import { Container, Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import SocialMediaChart from "../components/SocialMediaChart";
import ValidityChart from "../components/ValidityChart";

const AdminScreen = () => {
  return (
    <Stack>
      <Heading mb={6}>Admin Screen</Heading>
      <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={"4rem"}>
        <Container>
          <Text pl="4" fontSize={"lg"}>
            Image validity
          </Text>
          <ValidityChart />
        </Container>
        <Container>
          <Text pl="4" fontSize={"lg"}>
            Social media
          </Text>
          <SocialMediaChart />
        </Container>
      </SimpleGrid>
    </Stack>
  );
};
export default AdminScreen;
