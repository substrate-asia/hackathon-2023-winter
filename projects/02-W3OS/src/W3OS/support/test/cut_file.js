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
    },
    save: (name, data, ck, type) => {
        console.log(`Save input length: ${data.length}`);
        const target = `./${name}`;
        fs.writeFile(target,data,function (err) {
            if (err) return ck && ck({ error: err });
            return ck && ck();
        });
    },
};

function b64ToU8Array(bs64){
    console.log(`Raw base64 length: ${bs64.length}`);
    var byteCharacters = atob(bs64);
    console.log(`atob converted: ${byteCharacters.length}`);
    var bytes = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
        bytes[i] = byteCharacters[i].charCodeAt(0);
    }
    return new Uint8Array(bytes);
}


const target="sudoku_0001.zkey";
file.read(target,(fa)=>{
    console.log(fa.substr(0,100)+'...');
    //1.try to cut the base64 string;
    const len=1500000;
    

    //2.combine the string here;

    file.save("test.zkey",b64ToU8Array(fa),()=>{
        console.log(`Saved`);
    })
},false,true);