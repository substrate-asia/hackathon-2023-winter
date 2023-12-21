import AppendantItem from "./item";

function Title() {
  return (
    <div className="flex gap-[4px] text16semibold">
      <span className="text-text-primary">Appendant</span>
      <span className="text-text-tertiary">·</span>
      <span className="text-text-tertiary">1</span>
    </div>
  );
}

export default function Appendant() {
  return (
    <div className="flex flex-col gap-[16px]">
      <Title />
      <div className="flex flex-col">
        <AppendantItem />
      </div>
    </div>
  );
}
