import { useState } from "react";
import {
  FormControl,
  Button,
  FormLabel,
  Input,
  Wrap,
  WrapItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

function Mint() {
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);

  return (
    <div>
      <div style={{ display: "flex" }}>
        <FormControl isRequired>
          <FormLabel>inscribe_id</FormLabel>
          <Input placeholder="inscribe_id" w="500px" />
        </FormControl>
      </div>
      <div style={{ margin: "25px", textAlign: "center" }}>
        <Button onClick={onOpen} colorScheme="blue">
          Button
        </Button>
      </div>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Transaction details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div>
              Sending transaction <span style={{ color: "#e7c34f" }}>gear.sendMessage</span>
            </div>
            <div style={{ color: "lightgreen", marginBottom: "15px" }}>Fees of 35.5845 mTVARA will be applied to the submission</div>
            <Input placeholder="password" />
          </ModalBody>
          <ModalFooter justifyContent="center">
            <Button size="lg" borderRadius="full" width="200px" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Wrap spacing={4}>
              <WrapItem>
                <Button size="lg" borderRadius="full" colorScheme="whatsapp" width="200px">
                  Submit
                </Button>
              </WrapItem>
            </Wrap>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export { Mint };
