"use client";

import { Box, Heading, Image, Flex, Text } from "@chakra-ui/react";

export default function UseCases() {
  const styleContratos = {
    boxSize: "7.5rem",
    m: "4rem",
  };

  return (
    <Box p="2rem" textAlign="center" bgImage="section2.svg">
      <Heading>Get Funded</Heading>
      <Heading>Take Legal Action</Heading>
      <Flex w="100%" align="center" justify="center">
        <Box alignSelf="center" sx={styleContratos}>
          <Image src="eco1.svg" />
          <Text>Enviromental.</Text>
        </Box>
        <Box sx={styleContratos}>
          <Image src="criminal.svg" />
          <Text>Criminal.</Text>
        </Box>
      </Flex>
    </Box>
  );
}
