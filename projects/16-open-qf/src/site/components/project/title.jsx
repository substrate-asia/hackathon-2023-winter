export default function CardTitle({ title, count }) {
  return (
    <div className="flex gap-[4px] text16semibold pb-[20px]">
      <span className="text-text-primary">{title}</span>
      <span className="text-text-tertiary">·</span>
      <span className="text-text-tertiary">{count}</span>
    </div>
  );
}
