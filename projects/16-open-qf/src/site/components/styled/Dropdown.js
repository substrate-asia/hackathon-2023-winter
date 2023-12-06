import React from "react";
import styled from "styled-components";
import { Dropdown } from "semantic-ui-react";
// import CaretDownIcon from "../imgs/icons/caret-down.svg";
// import { netural_grey_200, netural_grey_500 } from "../styles/colors";

const StyledDropdown = styled(Dropdown)`
  width: 100%;
  height: 64px !important;
  border-radius: 0 !important;
  :active,
  :hover,
  :focus {
    border-color: #cccccc !important;
  }
  &.active,
  & .menu {
    border-color: #cccccc !important;
  }
  .ui.selection.dropdown {
    min-height: 48px !important;
  }
  &.ui.dropdown .menu {
    border-radius: 0 !important;

    ::-webkit-scrollbar {
      width: 10px;
    }
    ::-webkit-scrollbar-track {
      background-color: transparent;
    }
    ::-webkit-scrollbar-thumb {
      border-radius: 10px;
      width: 10px;
      padding: 0px;
      border: 2px solid transparent;
      background-clip: padding-box;
    }

    > .item {
      border-top: none !important;

      &.selected,
      &:hover {
      }
    }
  }
  .icon {
    top: 50% !important;
    transform: translate(0, -50%) !important;
    width: 24px !important;
    height: 24px !important;
    right: 16px !important;
    margin: 0 !important;

    &::before {
      content: " " !important;
    }
  }

  &.active {
    .icon {
      transform: translate(0, -50%) rotate(180deg) !important;
    }
  }
`;

export default StyledDropdown;
