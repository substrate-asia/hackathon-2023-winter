import { PlaceholderNoResult } from "@osn/icons/opensquare";

export default function NoData({ message = "No data" }) {
  return (
    <div className="space-y-5 flex flex-col items-center">
      <PlaceholderNoResult />
      <p className="text16semibold text-text-secondary">{message}</p>
    </div>
  );
}
