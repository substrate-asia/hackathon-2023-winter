import { addressEllipsis } from "@osn/common";

export const resolveMentionFormat = (identity, user) =>
  `[@${identity?.info?.display || addressEllipsis(user.address)}](${
    user.address
  }-${user.network}) `;
