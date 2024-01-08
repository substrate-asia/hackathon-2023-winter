import React, { useState } from "react";
import {
  ModalBody,
  ModalFooter,
  Button,
  Flex,
  Text,
  Heading,
  Stack,
  FormControl,
  FormLabel,
  Image,
  useDisclosure,
  ModalContent,
  Modal,
  Input,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { RotamContract } from "../../requireEnviromentVariables";
const contractABIrotam = require("../../utils/contractABIrotam.json");

export default function CreateCase() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [caseNumber, setCaseNumber] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const createCase = async (caseNumber, jurisdiction, price, description) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        RotamContract,
        contractABIrotam,
        signer
      );
      const transaction = await contract.createCase(
        caseNumber,
        jurisdiction,
        price,
        description
      );
      console.log("transaction", transaction);
      const receipt = await transaction.wait();
      const transactionHash = receipt.transactionHash;
      console.log(transactionHash);
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };

  const handlecreateCase = async () => {
    if (caseNumber && jurisdiction && price && description) {
      createCase(caseNumber, jurisdiction, price, description);
    } else {
      console.log("Please Complete all the fields.");
    }
  };
  return (
    <>
      <Button
        bgColor="transparent"
        border="1px"
        borderColor="#ADFF00"
        color="#808080"
        onClick={onOpen}
      >
        Create A Case
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent bgColor={"#969696"}>
          <Flex
            alignItems="center"
            flexDir="column"
            bgColor="black"
            borderBottomRadius="3rem"
          >
            <Image
              src="https://copper-ready-guanaco-464.mypinata.cloud/ipfs/QmSonedE3a6r1zS9ukPYZPCTXqJX6gncwuRrXwFYhMAbU6?_gl=1*1hk0k8b*_ga*MTM1ODQ0MTgxMi4xNjk2NzkyMjEz*_ga_5RMPXG14TE*MTcwMjk2MjQwMC40My4xLjE3MDI5NjI4NTIuNjAuMC4w"
              alt="Case Image"
              objectFit={"contain"}
              boxSize={"15rem"}
            ></Image>
            <Heading
              fontWeight="medium"
              color="white"
              fontSize="1.2rem"
              mb="1.5rem"
              textAlign="center"
              bgColor="black"
            >
              Create A Case!
            </Heading>
          </Flex>

          <ModalBody>
            <Heading fontSize="1.2rem" textAlign="center" m="4">
              Wait for the validation of your Case <br />& Get Funded
            </Heading>
            <Text>Whats your Case Data?</Text>

            <form onSubmit={handlecreateCase}>
              <Flex align={"center"} justify={"center"} direction={"column"}>
                <FormControl p="1rem" pb="0" isRequired>
                  <FormLabel textAlign="center">Case Number</FormLabel>
                  <Input
                    placeholder="Case Number"
                    value={caseNumber}
                    onChange={(e) => setCaseNumber(e.target.value)}
                  />
                </FormControl>
                <FormControl p="1rem" pb="0" isRequired>
                  <FormLabel textAlign="center">Jurisdiction</FormLabel>
                  <Input
                    placeholder="Jurisdiction"
                    value={jurisdiction}
                    onChange={(e) => setJurisdiction(e.target.value)}
                  />
                </FormControl>
                <FormControl p="1rem" pb="0" isRequired>
                  <FormLabel textAlign="center">Price</FormLabel>
                  <Input
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </FormControl>
                <FormControl p="1rem" pb="0" isRequired>
                  <FormLabel textAlign="center">Description</FormLabel>
                  <Input
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </FormControl>
                <Stack spacing={6} direction={["column", "row"]}></Stack>
              </Flex>
            </form>
          </ModalBody>

          <ModalFooter justify={"space-arround"}>
            <Button
              bg={"grey"}
              color={"white"}
              w="full"
              _hover={{
                bg: "black",
              }}
              onClick={handlecreateCase}
            >
              Create a Case
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
