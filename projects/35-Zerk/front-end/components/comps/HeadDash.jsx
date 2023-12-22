import { Flex, Button, Heading, Image } from "@chakra-ui/react";
import { useRouter } from "next/router";

const HeadDash = () => {
  const router = useRouter();

  const handleConnection = async () => {
    try {
      router.push("/");
    } catch (error) {
      console.error("Connection error:", error);
    }
  };

  return (
    <Flex
      color="#05D5FB"
      justify="space-between"
      align="center"
      p={4}
      bgColor="black"
    >
      <Button variant="link" onClick={handleConnection} m="2" ml="1rem">
        <Flex direction="column" bgColor="black">
          <Image src="favicon.svg" bgColor="black" w="4rem" alt="Zerk Logo" />
          <Heading bgColor="black">Zerk</Heading>
        </Flex>
      </Button>
    </Flex>
  );
};

export default HeadDash;
