import { useState } from "react";
import {
  FormControl,
  Button,
  FormLabel,
  Input,
  Select,
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

function Deploy() {
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);

  return (
    <div>
      <div style={{ display: "flex" }}>
        <div style={{ marginRight: "20px" }}>
          <FormControl isRequired>
            <FormLabel>inscribe_index</FormLabel>
            <Input placeholder="inscribe_index" w="500px" />
            <FormLabel>deployer</FormLabel>
            <Input placeholder="deployer" w="500px" />
            <FormLabel>tick</FormLabel>
            <Input placeholder="tick" w="500px" />
            <FormLabel>max_supply</FormLabel>
            <Input placeholder="max_supply" w="500px" />
            <FormLabel>total_supply</FormLabel>
            <Input placeholder="total_supply" w="500px" />
            <FormLabel>amt_per_mint</FormLabel>
            <Input placeholder="amt_per_mint" w="500px" />
            <FormLabel>slogan</FormLabel>
            <Input placeholder="slogan" w="500px" />
          </FormControl>
        </div>
        <div>
          <FormControl isRequired>
            <FormLabel>media</FormLabel>
            <Select placeholder="Select media" w="500px">
              <option>Twitter</option>
              <option>Website</option>
              <option>Email</option>
              <option>Other</option>
            </Select>
            <FormLabel>media_link</FormLabel>
            <Input placeholder="media_link" w="500px" />
            <FormLabel>verify</FormLabel>
            <Select placeholder="Select verify" w="500px">
              <option>None</option>
              <option>Verified</option>
              <option>Evildoer</option>
            </Select>
            <FormLabel>icon</FormLabel>
            <Input placeholder="icon" w="500px" />
            <FormLabel>frame</FormLabel>
            <Input placeholder="frame" w="500px" />
            <FormLabel>decimals</FormLabel>
            <Input placeholder="decimals" w="500px" />
            <FormLabel>inscribe_state</FormLabel>
            <Select placeholder="Select inscribe_state" w="500px">
              <option>Deployed</option>
              <option>Mintstart</option>
              <option>MintEnd</option>
            </Select>
          </FormControl>
        </div>
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

export { Deploy };
