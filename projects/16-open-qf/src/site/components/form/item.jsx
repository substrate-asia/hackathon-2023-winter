export default function FormItem({
  htmlFor = "",
  label = "",
  children,
  description = "",
}) {
  return (
    <div>
      <div className="mb-3 text16semibold">
        <label htmlFor={htmlFor}>{label}</label>
      </div>
      <div className="w-full">{children}</div>
      {description && (
        <p className="mt-3 text14medium text-text-tertiary">{description}</p>
      )}
    </div>
  );
}
