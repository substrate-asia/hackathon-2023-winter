import IpfsButton from "@/components/ipfsButton";

function Content() {
  return (
    <span className="text-text-primary text15medium">
      Velit amet auctor feugiat consectetur malesuada suspendisse facilisi. Eget
      fringilla eu semper vivamus morbi nunc arcu pellentesque ac.
    </span>
  );
}

function Meta() {
  return (
    <div className="flex justify-between">
      <div className="flex gap-[4px] text14medium">
        <span className="text-text-primary">#1</span>
        <span className="text-text-tertiary">·</span>
        <span className="text-text-tertiary">12h ago</span>
      </div>
      <IpfsButton />
    </div>
  );
}

export default function AppendantItem() {
  return (
    <div className="flex flex-col gap-[8px]">
      <Meta />
      <Content />
    </div>
  );
}
