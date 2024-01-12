const Spinner = () => {
  return (
    <svg
      viewBox="0 0 50 50"
      style={{
        animation: 'rotate 2s linear infinite',
        zIndex: 2,
        position: 'absolute',
        top: '50%',
        left: '50%',
        margin: '-25px 0 0 -25px',
        width: '50px',
        height: '50px'
      }}
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        strokeWidth="5"
        style={{
          stroke: 'rgb(255, 140, 0, 1)',
          strokeLinecap: 'round',
          animation: 'dash 1.5s ease-in-out infinite'
        }}
      />
    </svg>
  );
};

export default Spinner;
