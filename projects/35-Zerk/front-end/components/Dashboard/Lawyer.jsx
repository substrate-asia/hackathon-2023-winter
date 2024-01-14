import { Flex, Heading, Box } from "@chakra-ui/react";
import CreateLawyer from "../comps/createLawyer";
import ValidateCase from "../comps/validateCase";
import ValidateJuster from "../comps/validateJuster";

export default function LegalVerificator() {
  return (
    <Box h="100vh" p="2rem" align={"center"} bgColor="transparent">
      <Heading p="10rem">
        Are you a Lawyer? <br /> Validate Cases & Earn Money
      </Heading>
      <Flex mt="2rem" justify="space-around">
        <CreateLawyer />
        <ValidateCase />
        <ValidateJuster />
      </Flex>
    </Box>
  );
}
