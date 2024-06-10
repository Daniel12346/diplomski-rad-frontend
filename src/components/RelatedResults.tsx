import { Stack, Link, Box, Text } from "@chakra-ui/react";

//TODO:type
const RelatedResults = (results: any) => {
  return results?.length > 0 ? (
    <Box p={2}>
      <Text>Related results:</Text>
      {results.map((result: any) => (
        <Stack key={result.redirect_link}>
          <Link
            py={2}
            display={"flex"}
            alignItems={"center"}
            href={result.redirect_link}
            target="_blank"
            rel="noreferrer"
          >
            {result.favicon && <img src={result.favicon} alt="favicon" />}
            <Text ml={2}>{result.title}</Text>
          </Link>
        </Stack>
      ))}
    </Box>
  ) : (
    <Text>No related results found</Text>
  );
};

export default RelatedResults;
