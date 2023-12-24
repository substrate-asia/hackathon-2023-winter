import Skeleton from '@mui/material/Skeleton';

const Loader = ({ element, width = 50, height = 23, many = 1, loading = true }) => {
  if (loading) {
    let allElements = [];
    for (let i = 0; i < many; i++) {
      allElements.push(<Skeleton variant="rounded" key={i} width={width} height={height} />);
    }
    return allElements;
  } else {
    return element;
  }
};

export default Loader;
