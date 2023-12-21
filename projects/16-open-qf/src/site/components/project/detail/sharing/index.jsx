import styled, { css } from "styled-components";
import { useState, useCallback } from "react";
import copy from "copy-to-clipboard";
import Tooltip from "@osn/common-ui/es/Tooltip";
import FlexCenter from "@osn/common-ui/es/styled/FlexCenter";
import { LinkTwitter, SystemCopy } from "@osn/icons/opensquare";

const Wrapper = styled.div`
  display: flex;
  > :not(:last-child) {
    margin-right: 8px;
  }
`;

const ShareButton = styled(FlexCenter)`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #f0f3f8;
  svg {
    width: 16px;
    height: 16px;
    path {
      fill: ${(p) => p.theme["--text-tertiary"]};
    }
  }
  :hover {
    cursor: pointer;
    ${(p) =>
      p.hoverBgColor &&
      css`
        background-color: ${p.hoverBgColor};
      `}
    ${(p) =>
      p.hoverIconColor &&
      css`
        svg path {
          fill: ${p.hoverIconColor};
        }
      `}
  }
`;

export default function Sharing() {
  const [isCopied, setIsCopied] = useState(false);

  const tweet = useCallback(() => {
    const url =
      "https://twitter.com/share?url=" +
      encodeURIComponent(window.location.href) +
      "&text=" +
      encodeURIComponent(document.title);
    window.open(url, "_blank");
  }, []);

  const copyLink = useCallback(() => {
    copy(window.location.href);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  }, []);

  return (
    <Wrapper>
      <ShareButton
        hoverBgColor={"#E6F4FE"}
        hoverIconColor={"#33A2F2"}
        onClick={tweet}
      >
        <LinkTwitter />
      </ShareButton>
      <Tooltip content={isCopied ? "Copied" : "Copy Link"} size="fit">
        <div>
          <ShareButton
            hoverBgColor={"#EDF7ED"}
            hoverIconColor={"#4CAF50"}
            onClick={copyLink}
          >
            <SystemCopy />
          </ShareButton>
        </div>
      </Tooltip>
    </Wrapper>
  );
}
