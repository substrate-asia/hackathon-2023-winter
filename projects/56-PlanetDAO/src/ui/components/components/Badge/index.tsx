import { Avatar } from '@heathmont/moon-core-tw';

export const Badge = ({ icon, label, description, granted }: { icon: JSX.Element; label: string; description: string; granted?: boolean }) => {
  return (
    <div className="bg-goku rounded-moon-i-md flex border border-beerus flex gap-5 items-center p-6">
      <Avatar size="2xl" className={`${granted ? 'bg-hit text-gohan' : 'bg-gohan text-trunks'} rounded-full text-moon-48`}>
        {icon}
      </Avatar>
      <div className="flex flex-col gap-2">
        <h4 className="text-moon-24 font-semibold">{label}</h4>
        <p className="text-moon-14">{description}</p>
      </div>
    </div>
  );
};

export default Badge;
