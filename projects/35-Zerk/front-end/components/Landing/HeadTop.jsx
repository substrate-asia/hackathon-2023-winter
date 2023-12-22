"use client";
// Header.jsx

import { Flex, Button, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();

  const handleConnection = () => {
    router.push("/Dashboard");
  };

  return (
    <Flex
      bgColor="Black"
      color="#05D5FB"
      justify="space-between"
      align="center"
      h="10vh"
      p={4}
    >
      <Heading>Zerk</Heading>
      <Button bgColor="transparent" color="#808080" onClick={handleConnection}>
        Login
      </Button>
    </Flex>
  );
};

export default Header;
