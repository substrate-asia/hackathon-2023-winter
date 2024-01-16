import CreateCase from "../comps/createCase";
import CreateJuster from "../comps/createJuster";
import { Flex, Heading, Box } from "@chakra-ui/react";
import WithdrawFunds from "../comps/withdrawFunds";
import CardCase from "../comps/cardCase";

export default function Juster() {
  return (
    <Box h="100vh" p="2rem">
      <Flex flexDir="column" alignSelf="center" mt="1rem">
        <Flex
          p="1rem"
          borderRadius="1rem"
          bgGradient="linear(to-l, #ADFF00, #F1FF00)"
        >
          <Heading color="#151515">
            Get Funded! <br /> & Take Legal Action
          </Heading>
        </Flex>

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
