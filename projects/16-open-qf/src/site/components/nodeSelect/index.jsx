import styled, { css } from "styled-components";
import { useState, useRef, useEffect } from "react";
import { useOnClickOutside } from "@osn/common";
import Flex from "@osn/common-ui/es/styled/Flex";
import FlexCenter from "@osn/common-ui/es/styled/FlexCenter";
import {
  useActiveNodeUrl,
  useNodes,
  useSetActiveNodeUrl,
} from "@/context/node";
import { ReactComponent as SignalDefault } from "./signal-default.svg";
import { ReactComponent as SignalFast } from "./signal-fast.svg";
import { ReactComponent as SignalMedium } from "./signal-medium.svg";
import { ReactComponent as SignalSlow } from "./signal-slow.svg";
import { NodeDelayProvider, useNodesDelay } from "@/context/nodeDelay";
import useWindowSize from "@/hooks/useWindowSize";

const Wrapper = styled.div`
  position: relative;
`;

const SmallSelect = styled(FlexCenter)`
  width: 40px;
  height: 40px;
  border: 1px solid ${(p) => p.theme["--stroke-action-default"]};
  padding: 8px;
  cursor: pointer;
  > img {
    width: 24px;
    height: 24px;
  }
  :hover {
    border: 1px solid ${(p) => p.theme["--stroke-action-active"]};
  }
`;

const Select = styled(Flex)`
  border: 1px solid ${(p) => p.theme["--stroke-action-default"]};
  border-radius: 4px;
  height: 38px;
  padding: 0 12px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;
  > :not(:first-child) {
    margin-left: 8px;
  }
  > div {
    flex-grow: 1;
  }
  > img.signal {
    width: 24px;
    height: 24px;
    flex: 0 0 24px;
  }
`;

const Options = styled.div`
  background: white;
  box-shadow:
    0px 6px 22px rgba(30, 33, 52, 0.11),
    0px 1.34018px 4.91399px rgba(30, 33, 52, 0.0655718),
    0px 0.399006px 1.46302px rgba(30, 33, 52, 0.0444282);
  border-radius: 4px;
  position: absolute;
  right: 0;
  margin-top: 4px;
  padding: 8px 0;
  width: 100%;
  z-index: 1;
  ${(p) =>
    p.small &&
    css`
      width: auto;
      min-width: 192px;
    `}
`;

const Item = styled(Flex)`
  padding: 6px 12px;
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;
  cursor: pointer;
  white-space: nowrap;
  color: ${(p) => p.theme["--text-secondary"]};
  :hover {
    background: ${(p) => p.theme["--fill-bg-quaternary"]};
  }
  > img {
    width: 24px;
    height: 24px;
  }
  > :not(:last-child) {
    margin-right: 8px;
  }
  .delay {
    margin-left: auto;
    color: ${(p) => p.color};
  }
  ${(p) =>
    p.active &&
    css`
      color: ${(p) => p.theme["--text-primary"]};
      background: ${(p) => p.theme["--fill-bg-quaternary"]};
    `}
`;

function NodeSelectImpl({ small }) {
  const [show, setShow] = useState(false);
  const ref = useRef();
  const windowSize = useWindowSize();
  const setActiveNodeUrl = useSetActiveNodeUrl();
  const currentNode = useActiveNodeUrl();
  const nodes = useNodes();
  const nodesDelay = useNodesDelay();
  const currentNodeSetting = nodes.find((item) => item.url === currentNode);
  const currentNodeDelay = nodesDelay[currentNode];

  useOnClickOutside(ref, () => setShow(false));

  useEffect(() => {
    if (small && windowSize.width && windowSize.width <= 768) {
      setShow(false);
    }
  }, [small, windowSize]);

  const getSignalImg = (delay) => {
    return (
      <div className="w-[24px] h-[24px]">
        {!delay || isNaN(delay) ? (
          <SignalDefault />
        ) : delay >= 300 ? (
          <SignalSlow />
        ) : delay >= 100 ? (
          <SignalMedium />
        ) : (
          <SignalFast />
        )}
      </div>
    );
  };

  const getSignalColor = (delay) => {
    if (!delay || isNaN(delay)) return "#C2C8D5";
    if (delay >= 300) return "#F44336";
    if (delay >= 100) return "#FF9800";
    return "#4CAF50";
  };

  if (!currentNodeSetting) {
    return null;
  }

  return (
    <Wrapper ref={ref}>
      {small && (
        <SmallSelect onClick={() => setShow(!show)}>
          {getSignalImg(currentNodeDelay)}
        </SmallSelect>
      )}
      {!small && (
        <Select onClick={() => setShow(!show)}>
          {getSignalImg(currentNodeDelay)}
          <div>{currentNodeSetting?.name}</div>
          <img src="/imgs/icons/caret-down.svg" alt="" width={14} height={14} />
        </Select>
      )}
      {show && (
        <Options small={small}>
          {(nodes || []).map((item, index) => {
            const delay = nodesDelay[item.url];
            return (
              <Item
                key={index}
                onClick={() => {
                  if (item.url === currentNodeSetting?.url) {
                    setShow(false);
                    return;
                  }
                  setActiveNodeUrl(item.url);
                  setShow(false);
                }}
                active={item.url === currentNodeSetting?.url}
                color={getSignalColor(delay)}
              >
                {getSignalImg(delay)}
                <div>{`${item?.name}`}</div>
                <div className="delay">
                  {delay && !isNaN(delay) ? `${delay} ms` : ""}
                </div>
              </Item>
            );
          })}
        </Options>
      )}
    </Wrapper>
  );
}

export default function NodeSelect(props) {
  return (
    <NodeDelayProvider>
      <NodeSelectImpl {...props} />
    </NodeDelayProvider>
  );
}
