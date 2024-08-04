import { useRecoilState } from "recoil";
import getResultHistory from "../functions/getResultHistory";
import { resultHistoryState } from "../recoil/state";
import { useEffect, useState } from "react";
import {
  Container,
  SimpleGrid,
  Image,
  Box,
  Select,
  Text,
  Radio,
  RadioGroup,
  Flex,
  Icon,
  Modal,
  useDisclosure,
  ModalContent,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

export default function ResultHistory() {
  const [resultHistory, setResultHistory] = useRecoilState(resultHistoryState);
  useEffect(() => {
    const fetchResultHistory = async () => {
      const { data } = await getResultHistory();
      const results = data?.results;
      results && setResultHistory(results);
    };
    fetchResultHistory();
  }, []);

  type ValidityFilter = "all" | "fake" | "real";
  type SocialMediaFilter =
    | "facebook"
    | "instagram"
    | "twitter"
    | "tiktok"
    | "all";

  const SocialMediaIcons = {
    facebook: FaFacebook,
    instagram: FaInstagram,
    twitter: FaTwitter,
  };
  const [validityFilter, setValidityFilter] = useState("all");
  const [socialMediaFilter, setSocialMediaFilter] =
    useState<SocialMediaFilter>("all");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalImage, setModalImage] = useState("");

  //TODO: type properly
  const handleSelectSocialMedia = (e: any) => {
    setSocialMediaFilter(e.target.value as SocialMediaFilter);
  };
  const handleSelectValidity = (e: any) => {
    setValidityFilter(e.target.value as ValidityFilter);
  };

  if (!resultHistory) {
    return null;
  }
  return (
    <Box>
      <Flex
        mb="4"
        alignItems={"center"}
        gap={2}
        justifyContent={"space-between"}
      >
        <Select
          maxW={"10rem"}
          onChange={handleSelectSocialMedia}
          onMouseEnter={() => {
            console.log(socialMediaFilter, validityFilter);
          }}
        >
          <option value="all">All social media</option>
          <option value="facebook">Facebook</option>
          <option value="instagram">Instagram</option>
          <option value="twitter">Twitter</option>
          <option value="tiktok">Tiktok</option>
          <option value="unkown">unknown</option>
        </Select>
        <RadioGroup defaultValue={validityFilter}>
          <SimpleGrid columns={3} spacing={2}>
            <Radio value="fake" onClick={handleSelectValidity}>
              fake
            </Radio>
            <Radio value="real" onChange={handleSelectValidity}>
              real
            </Radio>
            <Radio value="all" onChange={handleSelectValidity}>
              all
            </Radio>
          </SimpleGrid>
        </RadioGroup>
      </Flex>
      <SimpleGrid spacing={6} columns={{ base: 2, sm: 3 }}>
        {resultHistory
          .filter(
            (result) =>
              (socialMediaFilter === "all" ||
                result.socialMediaName.toLocaleUpperCase() ===
                  socialMediaFilter.toLocaleUpperCase()) &&
              (validityFilter === "all" ||
                result.result.toLocaleUpperCase() ===
                  validityFilter.toLocaleUpperCase())
          )
          .map((result) => {
            const socialMedia = result.socialMediaName;
            const socialMediaIcon =
              SocialMediaIcons[
                socialMedia.toLocaleLowerCase() as keyof typeof SocialMediaIcons
              ];
            return (
              <Container
                onClick={() => {
                  setModalImage(result.imageUrl);
                  onOpen();
                }}
                key={result.createdAt}
                position={"relative"}
                padding={0}
              >
                <Modal isCentered onClose={onClose} isOpen={isOpen}>
                  <ModalContent>
                    <Image
                      src={modalImage}
                      alt="result"
                      height="100%"
                      width="100%"
                      objectFit={"cover"}
                    />

                    <ModalFooter>
                      <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
                <Image
                  // onClick={onOpen}
                  src={result.imageUrl}
                  alt="result"
                  height="100%"
                  width="100%"
                  objectFit={"cover"}
                />
                <Box
                  p={2}
                  position={"absolute"}
                  bottom={0}
                  left={0}
                  zIndex={100}
                  width="100%"
                  bgGradient={"linear(to-t, gray.800, hsla(0, 0%, 0%, 0.2))"}
                  color="white"
                >
                  <Flex justifyContent={"space-between"}>
                    <Text fontWeight="semibold">{result.result}</Text>{" "}
                    {socialMediaIcon && (
                      <Flex>
                        <Icon as={socialMediaIcon} />
                      </Flex>
                    )}
                  </Flex>
                  <Box>
                    <Text fontSize="small"> with confidence:</Text>{" "}
                    {result.confidence?.toPrecision(3)}
                  </Box>
                </Box>
              </Container>
            );
          })}
      </SimpleGrid>
    </Box>
  );
}
