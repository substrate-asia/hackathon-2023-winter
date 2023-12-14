import Modal from "@osn/common-ui/es/Modal";
import { useServerSideProps } from "@/context/serverSideProps";

export default function DonatePopup({ open, setOpen }) {
  const { roundId, projectId } = useServerSideProps();

  return (
    <Modal open={open} setOpen={setOpen}>
      <div className="flex flex-col gap-[20px]">
        <span className="text16semibold text-text-primary">Donate To</span>
      </div>
    </Modal>
  );
}
