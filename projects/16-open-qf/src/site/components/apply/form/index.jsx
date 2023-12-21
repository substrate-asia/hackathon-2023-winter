import ApplyProjectDonationForm from "./donation";
import ApplyProjectInfoForm from "./info";

export default function ApplyProjectForm() {
  return (
    <div className="space-y-5">
      <ApplyProjectInfoForm />
      <ApplyProjectDonationForm />
    </div>
  );
}
