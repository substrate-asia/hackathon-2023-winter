import {
  AddSquare,
  ArrowDown,
  ArrowUp,
  Back,
  CloseSquare,
  Discovery,
  Ecology,
  Environment,
  Heart,
  Housing,
  Instagram,
  Linkedin,
  Password,
  Profile,
  RemoveSquare,
  Social,
  Swap,
  TwitterX,
  Users,
  Wallet,
  Youtube
} from './export-icons';

export type IconType = keyof typeof Icons;

// NOTE: when using tailwindcss use the stroke or fill  utility class to style the icon e.g (stroke-[your_color] or fill-[your_color])

export const Icons = {
  instagram: Instagram,
  linkedin: Linkedin,
  twitterX: TwitterX,
  youtube: Youtube,
  ecology: Ecology,
  environment: Environment,
  housing: Housing,
  social: Social,
  discovery: Discovery,
  heart: Heart,
  wallet: Wallet,
  password: Password,
  swap: Swap,
  users: Users,
  back: Back,
  profile: Profile,
  closeSquare: CloseSquare,
  removeSquare: RemoveSquare,
  addSquare: AddSquare,
  ArrowDown,
  ArrowUp
};
