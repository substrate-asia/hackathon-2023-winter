function Mask(props) {
  return (
    <div
      id="mask"
      style={{width:`${props.width}px`,height:`${props.height}px`}}
      onClick={(ev) => {
        if (props.callback) props.callback();
      }}
    ></div>
  );
}
export default Mask;
