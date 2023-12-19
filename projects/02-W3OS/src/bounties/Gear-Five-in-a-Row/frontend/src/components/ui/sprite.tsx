import { BonusPointsIcon, BurgerMenuIcon, CrossIcon, DiscordIcon, GearLogoIcon, GithubIcon, MediumIcon, TVaraCoinIcon, TwitterIcon, VaraLogoIcon, VaraSignIcon } from '@/assets/images';
import { CopyIcon, EditIcon, ExitIcon } from '@/features/wallet/assets';
import { FC, SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  name: string;
  section?: string;
  size?: number;
};

function getSvg(name: string) {
  if (name === "twitter") {
    return <TwitterIcon/>;
  } else if (name === "discord") {
    return <DiscordIcon/>;
  } else if (name === "github") {
    return <GithubIcon/>;
  } else if (name === "medium") {
    return <MediumIcon/>;
  } else if (name === "vara-logo") {
    return <VaraLogoIcon/>;
  } else if (name === "vara-coin") {
    return <VaraLogoIcon/>;
  } else if (name === "tvara-coin") {
    return <TVaraCoinIcon/>;
  } else if (name === "points-coin") {
    return <BonusPointsIcon/>
  } else if (name === "close") {
    return <CrossIcon/>;
  } else if (name === "copy") {
    return <CopyIcon/>;
  } else if (name === "edit") {
    return <EditIcon/>;
  } else if (name === "exit") {
    return <ExitIcon/>;
  } else if (name === "gear-logo") {
    return <GearLogoIcon/>;
  } else if (name === "burger-menu") {
    return <BurgerMenuIcon/>;
  } else if (name === "vara-sign1") {
    return <VaraSignIcon/>;
  } else if (name === "vara-sign") {
    return <VaraSignIcon/>;
  }
  return <CrossIcon/>;
}
export const Sprite: FC<IconProps> = ({ name, className, section = 'icons', size, ...props }) => {
  return (
    <svg className={className} width={size || props.width} height={size || props.height} {...props}>
      {getSvg(name)}
    </svg>
  );
};
