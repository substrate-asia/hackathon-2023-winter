//!important, Group part of GCS

const groups={};        //group cache

const self = {
    init:()=>{
        //1.load groups from storage;
    },

    /*****************************************/
    /************ Basic Interface ************/
    /*****************************************/
    create:(accs,ck)=>{

    },
    join:(acc,gid,act,ck)=>{

    },
    leave:(acc,gid,ck)=>{

    },
    list:(gid)=>{

    },
    destrory:(gid)=>{

    },
    /*****************************************/
    /*************** Functions ***************/
    /*****************************************/
    checkGID:()=>{

    },
    getGID:()=>{

    },
};

module.exports = {
    init:self.init,

    create:self.create,
    join:self.join,
    leave:self.leave,
    
    debug:{
        list:self.list
    }
}