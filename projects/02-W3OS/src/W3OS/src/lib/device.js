const details = {
  gridY: 160,
  cell: [103, 134],
  range: [4, 8],
  screen: [414, 896],
};

const DEVICE = {
  init:()=>{

  },
  details: () => {
    return details;
  },

  getDevice:(name)=>{
    if(!details[name]) return false;
    return details[name];
  },

  grids: () => {
    return [4, 8];
  },
  getStart: (id) => {
    const sel = document.getElementById(id);
    console.log(sel);
  },
};

export default DEVICE;
