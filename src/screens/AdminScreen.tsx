import { Container, SimpleGrid, Stack } from "@chakra-ui/react";
import SocialMediaChart from "../components/SocialMediaChart";
import ValidityChart from "../components/ValidityChart";

const AdminScreen = () => {
  return (
    <Stack>
      <h1>Admin Screen</h1>
      <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={"4rem"}>
        <Container>
          <ValidityChart />
        </Container>
        <Container>
          <SocialMediaChart />
        </Container>
      </SimpleGrid>
    </Stack>
  );
};
export default AdminScreen;
