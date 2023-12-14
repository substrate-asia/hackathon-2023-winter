import { Button as ButtonBase } from "@osn/common-ui";
import tw from "tailwind-styled-components";

export const Button = tw(ButtonBase)`
  !border-fill-bg-brand-secondary
  hover:!border-fill-bg-brand-secondary
  !bg-fill-bg-brand-secondary
  !text-text-primary-contrast
  disabled:!bg-fill-bg-brand-disable disabled:!border-fill-bg-brand-disable
`;

export const SecondaryButton = tw(ButtonBase)`
  hover:!border-fill-bg-brand-secondary
  !bg-white
  !text-text-primary
`;
