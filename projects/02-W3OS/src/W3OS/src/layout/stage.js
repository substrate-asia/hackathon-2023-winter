import { Container } from "react-bootstrap";
import { useEffect } from "react";

function Stage(props) {
  const block = props.block;
  const size = block.size;
  const pos = block.position;
  const screen = block.screen;

  useEffect(() => {}, []);

  const cmap = {
    top: `${pos[1] + size[1]}px`,
    //display:"none",
  };

  const r = 20;
  const bmap = {
    left: {
      left: "0px",
      top: "0px",
      width: pos[0] + "px",
      height: pos[1] + size[1] + "px",
      borderEndEndRadius: r + "px",
    },
    right: {
      left: pos[0] + size[0] + "px",
      top: "0px",
      width: screen[0] - size[0] + "px",
      height: pos[1] + size[1] + "px",
      borderBottomLeftRadius: r + "px",
    },
    corner_left: {
      position: "fixed",
      width: r + "px",
      height: r + "px",
      left: pos[0] + "px",
      top: pos[1] + "px",
    },
    corner_right: {
      position: "fixed",
      width: r + "px",
      height: r + "px",
      left: pos[0] + size[0] - r + "px",
      top: pos[1] + "px",
    },
    white_left: {
      position: "fixed",
      width: r + "px",
      height: r + "px",
      left: pos[0] + "px",
      top: pos[1] + "px",
      background: "#FFFFFF",
      zIndex: 966,
      borderTopLeftRadius: r + "px",
    },
    white_right: {
      position: "fixed",
      width: r + "px",
      height: r + "px",
      left: pos[0] + size[0] - r + "px",
      top: pos[1] + "px",
      background: "#FFFFFF",
      zIndex: 966,
      borderTopRightRadius: r + "px",
    },
    top: {
      left: pos[0] + "px",
      top: "0px",
      width: size[0] + "px",
      height: pos[1] + "px",
    },
    bottom: {
      left: "0px",
      top: pos[1] + size[1] + "px",
      width: screen[0] + "px",
      height: screen[1] - pos[1] - size[1] + "px",
    },
  };

  return (
    <div>
      <div id="stage_mask">
        <div
          id="mask_left"
          className="stage"
          style={bmap.left}
          onClick={(ev) => {
            if (props.callback) props.callback(ev);
          }}
        ></div>
        <div
          id="mask_cornor_left"
          className="stage"
          style={bmap.corner_left}
        ></div>
        <div id="mask_wihte_left" style={bmap.white_left}></div>
        <div
          id="mask_cornor_right"
          className="stage"
          style={bmap.corner_right}
        ></div>
        <div id="mask_white_right" style={bmap.white_right}></div>

        <div
          id="mask_top"
          className="stage"
          style={bmap.top}
          onClick={(ev) => {
            if (props.callback) props.callback(ev);
          }}
        ></div>
        <div
          id="mask_bottom"
          className="stage"
          style={bmap.bottom}
          onClick={(ev) => {
            if (props.callback) props.callback(ev);
          }}
        ></div>
        <div
          id="mask_right"
          className="stage"
          style={bmap.right}
          onClick={(ev) => {
            if (props.callback) props.callback(ev);
          }}
        ></div>
      </div>
      <div id="stage" style={cmap}>
        <Container>{props.content}</Container>
      </div>
    </div>
  );
}
export default Stage;
