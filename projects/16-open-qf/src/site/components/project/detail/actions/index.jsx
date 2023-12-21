import { Button, SecondaryButton } from "@/components/button";

export default function Actions() {
  return (
    <div className="flex justify-end gap-[20px] w-full">
      <SecondaryButton>Add Appendant</SecondaryButton>
      <Button>Edit Project</Button>
    </div>
  );
}
