import { useSporranContext } from '@/context/sporran-context';
import { BaseButton } from '../ui/base-button';
import Image from 'next/image';
import { siteImage } from '@/config/image';
import { IconProps } from '../export-icons';

export default function ConnectKiltButton() {
  const { kilt, processing, connectKiltWallet } = useSporranContext();

  return (
    <BaseButton
      className="flex w-full items-center justify-between rounded-lg border border-foreground px-4 py-2"
      onClick={() => connectKiltWallet(kilt.sporran)}
    >
      <div className="flex items-center gap-2">
        <Image src={siteImage.sporran} alt="sporran" width={42} height={42} priority />
        <span className="text-[1rem]/[1.5rem]">Sporran</span>
      </div>
      {processing ? (
        <StatusIcon className="h-4 w-4 animate-spin" />
      ) : (
        <span className="text-[0.75rem]/[1.5rem] font-light text-primary">
          Recommended
        </span>
      )}
    </BaseButton>
  );
}

const StatusIcon = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M2.45 14.97c1.07 3.44 3.95 6.09 7.53 6.82M2.05 10.98A9.996 9.996 0 0 1 12 2c5.18 0 9.44 3.94 9.95 8.98M14.01 21.8c3.57-.73 6.44-3.35 7.53-6.78"
      stroke="#FF8A65"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </svg>
);
