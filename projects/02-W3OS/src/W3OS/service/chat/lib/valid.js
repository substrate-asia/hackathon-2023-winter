const def=[
    {"type":"address",min:48,max:48,reg:null},
]

const fs = require('fs');
const file = {
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
    }
};

const self={
    auto:(args,ck)=>{
        //console.log(args);
        const result={
            "anchor":"",
            "file":"config.json",
            "address":"",
            "port":0,
        }

        switch (args.length) {
            case 0:     //no parameters, check the default setting file
                file.read(result.file,(json)=>{
                    if(json.error){
                        return ck && ck({error:`Failed to load default config file "${result.file}"`});
                    }

                    for(var k in result){
                        if(json[k]!==undefined) result[k]=json[k];
                    }
                    result.data=json;

                    return ck && ck(result);
                },true);
                
                break;

            case 1:     //load target setting file
                file.read(args[0],(json)=>{
                    if(json.error){
                        return ck && ck({error:"Failed to load config file."});
                    }

                    for(var k in result){
                        if(json[k]!==undefined) result[k]=json[k];
                    }
                    result.data=json;

                    return ck && ck(result);
                },true);
                break;
            case 2:     //load target setting file
                file.read(args[0],(json)=>{
                    if(json.error){
                        return ck && ck({error:"Failed to load config file."});
                    }

                    for(var k in result){
                        if(json[k]!==undefined) result[k]=json[k];
                    }
                    result.data=json;
                    result.address=args[1];

                    return ck && ck(result);
                },true);
                break;

            default:    //check the parameters one by one
                
                // arguments
                // const args = process.argv.slice(2);
                // if (!args[0]) return console.log(config.theme.error, `Error: no runner address.`);
                // const address = args[0];
                // if (address.length !== 48) return console.log(config.theme.error, `Error: runner address illegal.`);
                // const port = !args[1] ? 8001 : args[1];
                // const cfgAnchor = !args[2] ? "" : args[2];
                // console.log(config.theme.success, `Ready to load gateway Hub by ${address}, the config Anchor is ${!cfgAnchor ? "not set" : cfgAnchor}`);

                break;
        }
    },
    number:(param,isArray,max)=>{
        if(isArray){
        
        }
    },
    string:(param,isArray,max)=>{

    },
    SS58:(param,isArray)=>{

    },
    anchor:(param,isArray)=>{

    },
    u32:(param,isArray)=>{

    },

    //check the type of definition
    isArr:(str)=>{
        const result={type:"",isArr:false};
    },
}

module.exports=self.auto;