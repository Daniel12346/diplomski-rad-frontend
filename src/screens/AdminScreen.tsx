import { Container, Heading } from "@chakra-ui/react";
import SocialMediaChart from "../components/SocialMediaChart";
import ValidityChart from "../components/ValidityChart";
import ResultHistory from "../components/ResultHistory";

const AdminScreen = () => {
  return (
    <Container placeContent={"center"} maxWidth="100vw">
      <Container>
        <Heading mb={6}>Admin Screen</Heading>
      </Container>
      <Container
        maxWidth={"60rem"}
        display="flex"
        gap={8}
        flexFlow={"row wrap"}
      >
        <Container maxWidth="25rem">
          <ValidityChart />
        </Container>
        <Container maxWidth="25rem">
          <SocialMediaChart />
        </Container>
      </Container>
      <Container>
        <Heading mb={6}>Result history</Heading>
        <ResultHistory />
      </Container>
    </Container>
  );
};
export default AdminScreen;
