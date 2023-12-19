//const {output}=require("../common/output");
//const tools=require("../common/tools");
const fs = require('fs');

const self={
    read: (target, ck, toJSON, toBase64) => {
        fs.stat(target, (err, stats) => {
            if (err) return ck && ck({ error: err });
            if (!stats.isFile()) return ck && ck(false);
            fs.readFile(target, (err, data) => {
                if (err) return ck && ck({ error: err });
                if (toBase64) return ck && ck(data.toString("base64"));
                if (!toJSON) return ck && ck(data.toString());
                try {
                    const str = data.toString();
                    const json = JSON.parse(str);
                    return ck && ck(json);
                } catch (error) {
                    return ck && ck({ error: 'Invalid JSON file.' });
                }
            });
        });
    },
    save: (name, data, ck) => {
        const target = `./${name}`;
        fs.writeFile(target, data, 'utf8', function (err) {
            if (err) return ck && ck({ error: err });
            return ck && ck();
        });
    },
}

let first=true;
let timer=null;
const at=60;                //backup per minute
const name="backup";
module.exports=(getData,setData,ck)=>{
    if(first){
        first=false;
        //1. recover from backup file
        self.read(name,(json)=>{
            if(!json.error) setData(json);
        },true);
    }
    
    //2. start to autosave group&history data
    if(timer===null){
        timer=setInterval(()=>{
            //output(`Autosave the GCS status, per ${at}s`);
            const data=getData();
            
            self.save(name,JSON.stringify(data),()=>{
                //output(`Backup at ${tools.stamp()}`);
            });
        },at*1000);
    }
    return ck && ck();
}