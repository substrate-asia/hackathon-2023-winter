const tools = require("../common/tools");
const DB = require("../common/mndb");
const { format, task, error } = require("./std");
const { count, toast } = require("./state");

const prefix = "GD";
const self = {
    //get unique group id
    getGID: () => {
        const unique = prefix + tools.char(10);
        if (DB.key_get(unique) !== null) return self.getGID();
        return unique;
    },

    //check input accounts validity
    validAccounts: (list) => {
        for (let i = 0; i < list.length; i++) {

        }
        return true;
    },

    //check input group ID validity
    validGID: (gid) => {

    },

    //check wether account not in account list
    validNewAccount: (acc, list) => {
        for (let i = 0; i < list.length; i++) {
            if (acc === list[i]) return false;
        }
        return true;
    },

    //check wether account in account list
    validInAccount: (acc, list) => {
        for (let i = 0; i < list.length; i++) {
            if (acc === list[i]) return true;
        }
        return false;
    },

    error: (way, cat, act, input) => {
        const err = error(way);
        if (cat && act) {
            err.method = {
                cat: cat,
                act: act,
            }
        }
        if (input) err.request = input;  //return the request parameters
        //if(from) err.from=from;
        return err;
    },
    getData: (path, obj) => {

    },
}

module.exports = {

    /*****************************************************/
    /***************** group operations ******************/
    /*****************************************************/

    //create a new group
    create: (input, from) => {
        console.log(`From group.js/chat, input: ${JSON.stringify(input)}`);

        if (!self.validAccounts(input.list)) {
            return self.error("INPUT_INVALID_ACCOUNT", "group", "create", input);
        }

        //1.prepare the group default data
        const gid = self.getGID();
        const data = format("group");
        const ms=Array.from(new Set(input.list));       //remove duplicate member

        data.id = gid;
        data.update = tools.stamp();
        data.create = tools.stamp();
        data.group = ms;
        data.manager = from;
        data.founder = from;
        DB.key_set(gid, data);

        //2.sent notification to creator
        const todos=[];
        for(let i=0;i<ms.length;i++){
            const acc=ms[i];        //member of group
            const todo = task("notice");
            todo.params.msg = { id: gid };
            todo.params.from = from;            //action account
            todo.params.to = acc;               //receiver account
            todo.params.group=gid;
            todo.params.method = {
                act: "create",
                cat: "group"
            };
            if (acc===from && input.callback) todo.callback = input.callback;
            todos.push(todo);
        }

        return todos;
    },

    //get the group details
    detail: (input, from) => {
        const gid = input.id;
        const data = DB.key_get(gid);
        if (data === null) {
            return self.error("INPUT_INVALID_GROUP_ID", "group", "detail", input);
        }

        //1.check valid, only member of group can get it
        if (!self.validInAccount(from, data.group)) {
            return self.error("INPUT_UNEXCEPT", "group", "detail", input);
        }

        const todo = task("notice");
        todo.params.msg = data;
        todo.params.to = from;
        todo.params.group = gid;
        todo.params.method = {
            act: "detail",
            cat: "group"
        };
        if (input.callback) todo.callback = input.callback;

        return [todo];
    },

    members:(input, from)=>{
        console.log(`From group.js/members, input: ${JSON.stringify(input)}`);
        //1.save new account
        const gid = input.id;
        const data = DB.key_get(gid);
        if (data === null || !data) {
            return self.error("SYSTEM_INVALID_DATA", "group", "members", input);
        }
        if( !input.members){
            return self.error("INPUT_UNEXCEPT", "group", "members", input);
        }

        //check the members accounts
        const inms=input.members.split("_");
        if(!inms || inms.length===0){
            return self.error("INPUT_UNEXCEPT", "group", "members", input);
        }

        const ms=[];
        for(let i=0;i<inms.length;i++){
            const acc=inms[i]; 
            if(acc.length!==48){
                return self.error("INPUT_UNEXCEPT", "group", "members", input);
            }

            if(!ms.includes(acc)) ms.push(acc);
        }

        if(ms.length===0) return self.error("INPUT_UNEXCEPT", "group", "members", input);

        //isolate the added members;
        const as=[];
        for(let i=0;i<ms.length;i++){
            const acc=ms[i];
            if(!data.group.includes(acc)){
                as.push(acc);
            }
        }

        //isolate the deleted members;
        const ds=[];
        for (let i = 0; i < data.group.length; i++) {
            const acc=ms[i];
            if(!ms.includes(acc)){
                ds.push(acc);
            }
        }

        //update group data
        data.group=ms;

        const todos=[];
        //sent notice to all new members
        for (let i = 0; i < data.group.length; i++) {
            const to = data.group[i];
            const todo = task("notice");
            todo.params.msg ={
                id:gid,
                from:from
            };
            todo.params.to = to;
            todo.params.from=from;
            todo.params.method = {
                cat: "group",
                act: "members"               
            };

            //add the callback ref
            if(input.callback && to===from) todo.callback=input.callback;
            todos.push(todo);
        }

        //sent notice to deleted members
        for (let i = 0; i < ds.length; i++) {
            const to = ds[i];
            const todo = task("notice");
            todo.params.msg = `Removed from group.`;
            todo.params.to = to;
            todo.params.from=from;
            todo.params.method = {
                cat: "group",
                act: "members"               
            };
            todos.push(todo);
        }

        return todos;
    },

    //join a group
    join: (input, from) => {
        console.log(`From group.js/join, input: ${JSON.stringify(input)}`);

        //1.save new account
        const gid = input.id;
        const data = DB.key_get(gid);
        if (!self.validNewAccount(input.account, data.group)) {
            return self.error("INPUT_UNEXCEPT", "group", "join", input);
        }
        data.group.push(input.account);
        DB.key_set(gid, data);

        //2.check the block list

        //3.sent notice to all
        const todos = [];

        for (let i = 0; i < data.group.length; i++) {
            const to = data.group[i];
            const todo = task("notice");
            todo.params.msg = {
                id:gid,
                from:from,
            };
            todo.params.to = to;
            todo.params.method = {
                act: "join",
                cat: "group"
            };
            todos.push(todo);

            //callback of caller
            //if( input.callback) todo.callback=input.callback;
        }

        toast(todos.length);    //inc the notice amount

        return todos;
    },

    //member leave the group
    leave: (input, from) => {
        console.log(`From group.js/leave, input: ${JSON.stringify(input)}, request from ${from}`);

        const gid = input.id;
        const data = DB.key_get(gid);
        if (data === null || !data) {
            return self.error("SYSTEM_INVALID_DATA", "group", "leave", input);
        }
        if (!self.validInAccount(input.account, data.group)) {
            return self.error("INPUT_UNEXCEPT", "group", "leave", input);
        }

        //1.notice to all and move target account
        const todos = [];
        const ngroup = [];
        for (let i = 0; i < data.group.length; i++) {
            const to = data.group[i];
            const todo = task("notice");
            todo.params.msg = {
                from: from,
                id: gid,
            };
            todo.params.to = to;
            todo.params.method = {
                act: "leave",
                cat: "group"
            };
            if(input.callback && to===from) todo.callback=input.callback;
            todos.push(todo);
            if (to !== input.account) ngroup.push(to);
        }

        //set the new group
        data.group = ngroup;
        DB.key_set(gid, data);

        toast(todos.length);    //inc the notice amount

        return todos;
    },

    //transfer the manager 
    divert: (input, from) => {
        console.log(`From group.js/divert, input: ${JSON.stringify(input)}`);

        //1.check the permit and set new manager
        const gid = input.id;
        const data = DB.key_get(gid);
        if (!data) {
            return self.error("INPUT_INVALID_GROUP_ID", "group", "divert", input);
        }

        if (data.manager !== from) {
            return self.error("PERMIT_NOT_ALLOWED", "group", "divert", input);
        }

        data.manager = input.manager;
        DB.key_set(gid, data);

        //2.sent notice to related member
        //2.1.sent notice to all
        const todos = [];
        for (let i = 0; i < data.group.length; i++) {
            const to = data.group[i];
            const todo = task("notice");
            todo.params.msg ={
                id:gid,
                manager:input.manager,
                from:from,
            };
            todo.params.to = to;
            todo.params.method = {
                act: "divert",
                cat: "group"
            };
            todos.push(todo);
        }

        //2.2.sent notice to new manager
        // const n_new = task("notice");
        // n_new.params.msg = `You are the new group manager`;
        // n_new.params.to = input.manager;
        // n_new.params.method = {
        //     act: "divert",
        //     cat: "group"
        // };
        // todos.push(n_new);

        //2.3.sent notice to old manager
        // const o_new = task("notice");
        // o_new.params.msg = `You are not the group manager`;
        // o_new.params.to = from;
        // o_new.params.method = {
        //     act: "divert",
        //     cat: "group"
        // };
        // if (input.callback) o_new.callback = input.callback;
        // todos.push(o_new);

        toast(todos.length);    //inc the notice amount

        return todos;
    },

    //deport target account from group, the account will be set to block list
    deport: (input, from) => {
        //1.check the permit and set new manager
        const gid = input.id;
        const data = DB.key_get(gid);
        if (!data) {
            return self.error("INPUT_UNEXCEPT", "group", "deport", input);
        }
        if (data.manager !== from) {
            return self.error("INPUT_UNEXCEPT", "group", "deport", input);
        }

        //2.add the account to block list
        data.block.push(input.account);
        DB.key_set(gid, data);

        //3.sent notice to proper accounts.
        const todo = task("notice");
        todo.params.msg = `${input.account} is added to block list`;
        todo.params.to = from;
        todo.params.method = {
            act: "deport",
            cat: "group"
        };
        return [todo];
    },

    //remove the target account from block list
    recover: (input, from) => {
        //1.check the permit and set new manager
        const gid = input.id;
        const data = DB.key_get(gid);
        if (!data) {
            return self.error("INPUT_UNEXCEPT", "group", "recover", input);
        }

        if (data.manager !== from) {
            return self.error("INPUT_UNEXCEPT", "group", "recover", input);
        }

        //2.remove the account from block list
        const nlist = [];
        for (let i = 0; i < data.block.length; i++) {
            if (data.block[i] !== input.account) nlist.push(data.block[i]);
        }
        data.block = nlist;
        DB.key_set(gid, data);

        //3.sent notice to proper accounts.
        const todo = task("notice");
        todo.params.msg = `${input.account} is removed from block list`;
        todo.params.to = from;
        todo.params.method = {
            act: "recover",
            cat: "group"
        };
        return [todo];
    },

    //destory the group on server
    destory: (input, from) => {
        console.log(`From group.js/destory, input: ${JSON.stringify(input)}`);

        //1.check the permit to remove group
        const gid = input.id;
        const data = DB.key_get(gid);
        if (!data) {
            return self.error("INPUT_UNEXCEPT", "group", "destory", input);
        }
        if (data.manager !== from) {
            return self.error("INPUT_UNEXCEPT", "group", "destory", input);
        }
        DB.key_del(gid);

        //2.notice to all members.
        const todos = [];
        for (let i = 0; i < data.group.length; i++) {
            const to = data.group[i];
            const todo = task("notice");
            todo.params.msg ={
                id:gid,
                from:from,
            };
            todo.params.to = to;
            todo.params.method = {
                act: "destory",
                cat: "group"
            };
            todos.push(todo);
        }
        toast(todos.length);    //inc the notice amount

        return todos;
    },

    /*****************************************************/
    /***************** message functions *****************/
    /*****************************************************/

    //sent message to group
    message: (input, from) => {
        console.log(`From group.js/chat, input: ${JSON.stringify(input)}`);

        const gid = input.to;
        const data = DB.key_get(gid);
        if (data === null) {
            return self.error("INPUT_INVALID_GROUP_ID", "group", "message", input);
        }

        const todos = [];
        for (let i = 0; i < data.group.length; i++) {
            const to = data.group[i];
            if (to === from) continue;

            const todo = task("message");
            todo.params.cat = "group";
            todo.params.type = "message";
            todo.params.msg = input.msg;
            todo.params.to = to;
            todo.params.from = from;
            todo.params.group = gid;
            todo.params.method = {
                act: "message",
                cat: "group"
            };
            todos.push(todo);
        }
        count(todos.length);    //inc the message send amount

        return todos;
    },

    //sent notice to group
    notice: (input, from) => {
        console.log(`From group.js/notice, input: ${JSON.stringify(input)}`);

        const gid = input.to;
        const data = DB.key_get(gid);
        if (data === null) {
            return self.error("INPUT_INVALID_GROUP_ID", "group", "notice", input);
        }
        const todos = [];
        for (let i = 0; i < data.group.length; i++) {
            const to = data.group[i];
            if (to === from) continue;

            const todo = task("notice");
            todo.params.msg = input.msg;            //notic message from input
            todo.params.to = to;
            todos.push(todo);
        }

        toast(todos.length);    //inc the notice send amount

        return todos;
    },

    //set the announcement of the group
    announce: (input, from) => {

    },

    update: (input, from) => {
        console.log(`Group/update params from ${from}: ${JSON.stringify(input)}`);
        
        //1.check group status.
        const gid = input.id;
        const data = DB.key_get(gid);
        if (data === null) {
            return self.error("INPUT_INVALID_GROUP_ID", "group", "update", input);
        }

        if (!input.key || !input.val) {
            return self.error("INPUT_UNEXCEPT", "group", "update", input);
        }

        if(!data.group.includes(from)){
            return self.error("PERMIT_NOT_ALLOWED", "group", "update", input);
        }
        //2.check the parameters
        const keys = {    //update keys path
            "nick":{
                path:["nick"],
                type:"string",
            },
            "announce":{
                path:["announce","content"],
                type:"string",
            },
            "expired": {
                path:["announce","expired"],
                type:"integer",
            },
            "pmt_announce": {
                path:["permit","announce"],
                type:"boolean",
            },
            "pmt_free": {
                path:["permit","free"],
                type:"boolean",
            },
        }
        if (!keys[input.key]) {
            return self.error("INPUT_UNEXCEPT", "group", "update", input);
        }

        //2.2 update the data
        const path = keys[input.key].path;
        switch (path.length) {
            case 1:
                if (data[path[0]]===undefined) {
                    return self.error("SYSTEM_INVALID_DATA", "group", "update", input);
                }
                data[path[0]] = input.val;
                DB.key_set(gid, data);
                break;
            case 2:
                if (data[path[0]]===undefined || data[path[0]][path[1]]===undefined) {
                    return self.error("SYSTEM_INVALID_DATA", "group", "update", input);
                }
                data[path[0]][path[1]] = input.val;
                DB.key_set(gid, data);
                break;
            default:
                break;
        }

        //3.notice to all members.
        const todos = [];
        for (let i = 0; i < data.group.length; i++) {
            const to = data.group[i];
            const todo = task("notice");
            todo.params.msg = {
                key: input.key,
                value: input.val,
                id:gid,
                from:from,
            };
            todo.params.to = to;
            todo.params.method = {
                cat: "group",
                act: "update"
            };

            //3.1.check the request callback
            if (input.callback && to===from) todo.callback = input.callback;
            todos.push(todo);
        }
        toast(todos.length);    //inc the notice amount

        return todos;

    },
}