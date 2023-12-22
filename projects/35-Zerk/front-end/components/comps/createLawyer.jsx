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

export default function CreateLawyer() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [licenseNumber, setLicenseNumber] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [especiality, setEspeciality] = useState("");

  const createLawyer = async (licenseNumber, name, location, especiality) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        RotamContract,
        contractABIrotam,
        signer
      );
      const transaction = await contract.createLawyer(
        licenseNumber,
        name,
        location,
        especiality
      );
      console.log("transaction", transaction);
      const receipt = await transaction.wait();
      const transactionHash = receipt.transactionHash;
      console.log(transactionHash);
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };

  const handlecreateLawyer = async () => {
    if (licenseNumber && name && location && especiality) {
      createLawyer(licenseNumber, name, location, especiality);
    } else {
      console.log("Please complete all requirements.");
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
        Create Lawyer DID
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
              alt="Lawyer Image"
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
              Be a Lawyer!
            </Heading>
          </Flex>

          <ModalBody>
            <Heading fontSize="1.2rem" textAlign="center" m="4">
              Wait for the validation of your Identity <br />& Start Earning
              Money
            </Heading>
            <Text>Need a Proffessional License to be a Lawyer</Text>

            <form onSubmit={handlecreateLawyer}>
              <Flex align={"center"} justify={"center"} direction={"column"}>
                <FormControl p="1rem" pb="0" isRequired>
                  <FormLabel textAlign="center">License Number</FormLabel>
                  <Input
                    placeholder="License Number"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                  />
                </FormControl>
                <FormControl p="1rem" pb="0" isRequired>
                  <FormLabel textAlign="center">Name</FormLabel>
                  <Input
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </FormControl>
                <FormControl p="1rem" pb="0" isRequired>
                  <FormLabel textAlign="center">Location</FormLabel>
                  <Input
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </FormControl>
                <FormControl p="1rem" pb="0" isRequired>
                  <FormLabel textAlign="center">Especiality</FormLabel>
                  <Input
                    placeholder="Especiality"
                    value={especiality}
                    onChange={(e) => setEspeciality(e.target.value)}
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
              onClick={handlecreateLawyer}
            >
              Create Lawyer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
