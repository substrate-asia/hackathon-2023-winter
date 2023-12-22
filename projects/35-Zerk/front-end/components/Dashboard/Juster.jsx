import CreateCase from "../comps/createCase";
import CreateJuster from "../comps/createJuster";
import { Flex, Heading, Box } from "@chakra-ui/react";
import WithdrawFunds from "../comps/withdrawFunds";
import CardCase from "../comps/cardCase";

export default function Juster() {
  return (
    <Box h="100vh" p="2rem" align={"center"}>
      <Flex flexDir="column" alignSelf="center" mt="10rem">
        <Heading>
          Get Funded! <br /> & Take Legal Action
        </Heading>
        <Flex mt="2rem" p="2rem" justify="space-around">
          <CreateJuster />
          <CreateCase />
          <WithdrawFunds />
          <CardCase />
        </Flex>
      </Flex>
    </Box>
  );
}
