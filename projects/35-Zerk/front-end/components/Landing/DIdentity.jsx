"use client";

import { Button, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function DIdentity() {
  const router = useRouter();

  const handleMetaLog = () => {
    router.push("/Dashboard");
  };
  return (
    <Flex
      direction={"column"}
      align={"center"}
      borderTop={"1px"}
      borderStyle={"dotted"}
      bgImage="section3.svg"
    >
      <Heading m="3rem">Are you a Lawyer?</Heading>
      <Flex>
        <Image
          src="https://copper-ready-guanaco-464.mypinata.cloud/ipfs/QmSonedE3a6r1zS9ukPYZPCTXqJX6gncwuRrXwFYhMAbU6?_gl=1*1hk0k8b*_ga*MTM1ODQ0MTgxMi4xNjk2NzkyMjEz*_ga_5RMPXG14TE*MTcwMjk2MjQwMC40My4xLjE3MDI5NjI4NTIuNjAuMC4w"
          rounded={"10%"}
          w="35%"
          m="1.5rem"
        />
        <Flex direction="column" m="1.5rem">
          <Text fontSize={"1.5rem"}>Be a legal validator!</Text>
          <Text color="#808080" mt="1rem">
            We validate every case that seeks funding in our platform.
          </Text>
          <Text color="#808080" mt="1rem">
            Be part of the community & earn $IUS in the process.
          </Text>
          <Button
            mt="1rem"
            bgColor="transparent"
            border="1px"
            borderColor="#ADFF00"
            color="#808080"
            onClick={handleMetaLog}
          >
            I am a Lawyer
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
