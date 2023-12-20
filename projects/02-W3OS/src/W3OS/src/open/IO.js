//!important, this part decode the location.hash to support IO from outside

//sample: ##IMGC_group_333445##
const obj={
    key:"FIRST_PARAM",      //the reg open key
    params:[],              //the left params
}


const IO={
  decoder:()=>{
    console.log(window.location.hash);
  },

  regOpen:(key,fun)=>{

  }
}

export default IO;