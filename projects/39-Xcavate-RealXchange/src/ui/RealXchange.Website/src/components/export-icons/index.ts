import { SVGProps, RefAttributes } from 'react';

export type SVGAttributes = Partial<SVGProps<SVGSVGElement>>;
type ComponentAttributes = RefAttributes<SVGSVGElement> & SVGAttributes;

export interface IconProps extends ComponentAttributes {
  size?: string | number;
  absoluteStrokeWidth?: boolean;
}

export { default as Instagram } from './instagram';
export { default as Linkedin } from './linkedin';
export { default as TwitterX } from './twitterX';
export { default as Youtube } from './youtube';
export { default as Discovery } from './discovery';
export { default as Ecology } from './ecology';
export { default as Environment } from './environment';
export { default as Housing } from './housing';
export { default as Social } from './social';
export { default as Swap } from './swap';
export { default as Back } from './back';
export { default as Heart } from './heart';
export { default as Users } from './users';
export { default as Password } from './password';
export { default as Wallet } from './wallet';
export { default as Profile } from './profile';
export { default as CloseSquare } from './close-square';
export { default as RemoveSquare } from './remove-square';
export { default as AddSquare } from './add-square';
export { default as ArrowUp } from './arrow-up';
export { default as ArrowDown } from './arrow-down';
export { default as Logout } from './logout';
export { default as Tailsman } from './tailsman-icon';
