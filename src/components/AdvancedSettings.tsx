import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Container,
  FormControl,
  FormLabel,
  Switch,
} from "@chakra-ui/react";

const AdvancedSettings = () => {
  return (
    <Container>
      <Accordion allowToggle>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" textAlign="left">
                Advanced Settings
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel>
            <FormControl
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <FormLabel htmlFor="isChecked" fontWeight="normal">
                recognize face
              </FormLabel>
              <Switch id="isChecked" isChecked />
            </FormControl>
            <FormControl
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <FormLabel htmlFor="isChecked" fontWeight="normal">
                check deepfake
              </FormLabel>
              <Switch id="isChecked" isChecked />
            </FormControl>
            <FormControl
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <FormLabel htmlFor="isChecked" fontWeight="normal">
                search related results
              </FormLabel>
              <Switch id="isChecked" isChecked />
            </FormControl>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Container>
  );
};

export default AdvancedSettings;
