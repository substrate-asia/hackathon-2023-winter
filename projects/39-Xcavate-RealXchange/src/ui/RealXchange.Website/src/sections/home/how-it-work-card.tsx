type HowItWorkCardProps = {
  title: string;
  children: React.ReactNode;
  icon: React.ReactNode;
};

export default function HowItWorkCard({ icon, title, children }: HowItWorkCardProps) {
  return (
    <div className="flex h-[230px] w-[400px] flex-col items-start gap-2">
      <div className="flex flex-col items-start gap-4">
        <span className="flex h-[46px] w-[48px] items-center justify-center rounded bg-primary/[0.24]">
          {icon}
        </span>
        <h4 className="text-[1rem]/[1.5rem] font-medium">{title}</h4>
      </div>
      <p className="text-[1rem]/[1.5rem] font-light">{children}</p>
    </div>
  );
}
