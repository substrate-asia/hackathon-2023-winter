import styled from "styled-components";
import { Button as ButtonBase } from "@osn/common-ui";

export const Button = styled(ButtonBase)`
  :hover {
    border-color: ${({ theme }) => theme.fillBgBrandSecondary};
  }
  background-color: ${({ theme }) => theme.fillBgBrandSecondary};
  color: ${({ theme }) => theme.textPrimaryContrast};
`;
