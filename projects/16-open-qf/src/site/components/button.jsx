import { Button as ButtonBase } from "@osn/common-ui";
import tw from "tailwind-styled-components";

export const Button = tw(ButtonBase)`
  hover:!border-fill-bg-brand-secondary
  !bg-fill-bg-brand-secondary
  !text-text-primary-contrast
`;

export const SecondaryButton = tw(ButtonBase)`
  hover:!border-fill-bg-brand-secondary
  !bg-white
  !text-text-primary
`;
