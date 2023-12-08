import Card from "@/components/card";

export default function UserTabQFpowerContent() {
  return (
    <div>
      <Card className="space-y-1" hoverable={false}>
        <div className="text20semibold text-text-primary">What is QFpower</div>
        <div className="text14medium text-text-tertiary">
          QFpower is a score calculated by OpenQF based on on-chain activities
          and social link authentication.
        </div>
      </Card>
    </div>
  );
}
