import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  Image,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function Hero() {
  const handleLogin = () => {
    router.push("/Dashboard");
  };
  const router = useRouter();
  return (
    <Container maxW="100vw" bgImage="abstract Grey.svg">
      <Stack
        as={Box}
        textAlign={"center"}
        spacing={{ base: 8, md: 14 }}
        py={{ base: 20, md: 36 }}
        bgColor="transparent"
      >
        <Image
          bgColor="transparent"
          alignSelf={"center"}
          w={"8rem"}
          src="zerk idea Z.svg"
        ></Image>
        <Heading
          fontWeight={600}
          fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
          lineHeight={"110%"}
        >
          zerk
          <br />
          <Text as={"span"} color={"grey"}>
            network
          </Text>
        </Heading>
        <Text
          mt="10"
          fontWeight={600}
          fontSize={{ base: "xl", sm: "2xl", md: "4xl" }}
          lineHeight={"110%"}
        >
          Descentralized Justice
        </Text>
        <Stack
          direction={"column"}
          spacing={3}
          align={"center"}
          alignSelf={"center"}
          position={"relative"}
        >
          <Button
            onClick={handleLogin}
            textColor={"black"}
            colorScheme={"green"}
            bgGradient={"linear(to-r, #FFFF00, #AFFF00)"}
            rounded={"full"}
            px={6}
            _hover={{
              bg: "green.500",
            }}
          >
            Get Started
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
