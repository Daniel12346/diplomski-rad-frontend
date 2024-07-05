import { Stack, Link, Box, Text } from "@chakra-ui/react";

//TODO:type
const RelatedSearchResults = ({ results }: any) => {
  return results?.length > 0 ? (
    <Box>
      <Box
        borderBottom="2px solid"
        _light={{ color: "gray.700", borderColor: "blue.300" }}
        _dark={{ color: "gray.300", borderColor: "blue.700" }}
        mb={2}
      >
        <Text w={"fit-content"} p={2}>
          Related results:
        </Text>
      </Box>
      <Stack>
        {results.map((result: any) => (
          <Box key={result.redirect_link}>
            <Link
              py={1}
              display={"flex"}
              alignItems={"center"}
              href={result.redirect_link}
              target="_blank"
              rel="noreferrer"
            >
              {result.favicon && <img src={result.favicon} alt="favicon" />}
              <Text ml={2}>{result.title}</Text>
            </Link>
          </Box>
        ))}
      </Stack>
    </Box>
  ) : (
    <Text onClick={() => console.log(results.results)}>
      No related results found
    </Text>
  );
};

export default RelatedSearchResults;
