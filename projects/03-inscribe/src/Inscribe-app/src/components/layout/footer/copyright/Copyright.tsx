import { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button, // 添加 Button 组件的引入
} from "@chakra-ui/react";
import styles from "./Copyright.module.scss";

function Copyright() {
  const year = new Date().getFullYear();
  const [showModal, setShowModal] = useState(false);

  const handleButtonClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <small className={styles.copyright}>
        All rights reserved by{" "}
        <Button variant="link" onClick={handleButtonClick} color="purple">
          Inscribe
        </Button>
        , {year} hackathon
      </small>
      <Modal isOpen={showModal} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Team information</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>captain -- differs (SmartContract Developer)</p>
            <p>team member -- baize336699 (Web3 Frontend Developer)</p>
            <p>team member -- xgocn (Web3 Frontend Developer)</p>
            <p>team member -- DAO UI Design Studio (UI / ARTIST)</p>
          </ModalBody>
          <ModalFooter>{/* 可选的底部内容 */}</ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export { Copyright };
