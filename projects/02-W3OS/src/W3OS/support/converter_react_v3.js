//!important, This is the transformer of React project. 
//!important, By dealing with the built package, React project can be deployed to Anchor Network.
//!important, The resource will also be deployed on chain.

//!important, Depth is the addtional parameters to limit the resouce, then we can reuse the same Anchor.
//!important, {"dep":[start,end]}, this is the format

//########## USAGE ##########
//node converter_react_v3.js package/config_homepage.json 

//"blockmax":3670016,           //3.5MB

console.clear();

const convert_version = "1.0.0";
const block_interval = 60;
const theme = {
    error: '\x1b[36m%s\x1b[0m',
    success: '\x1b[36m%s\x1b[0m',
    dark: '\x1b[33m%s\x1b[0m',
};
const output = (ctx, type, skip) => {
    const stamp = () => { return new Date().toLocaleString(); };
    if (!type || !theme[type]) {
        if (skip) return console.log(ctx);
        console.log(`[${stamp()}] ` + ctx);
    } else {
        if (skip) return console.log(theme[type], ctx);
        console.log(theme[type], `[${stamp()}] ` + ctx);
    }
};

output(`-------------------------------- React project convertror ( v${convert_version} ) --------------------------------`, "", true);
output("\n-- Deploy the React project on Anchor Network.", "", true);
output("-- Node.js needed, run this convertor by node, then the deployment will be done.", "", true);
output("-- Config file needed, use the file name as the second parameter.", "", true);
output("-- Shell : ", "", true);
output("-- node converter_react_v3.js react_config.json", "success", true);
output("-- Config file details : https://github.com/ff13dfly/EasyPolka/blob/main/convertor/react/README.md ", "", true);
output("\n---------------------------------------- Proccess start ---------------------------------------------\n", "", true);

//arguments proccess
const args = process.argv.slice(2);
if (!args[0]) return output("No config file to convert React project.", 'error');
const cfgFile = args[0];
output(`Get the config file path, ready to start.`, 'dark');


const { ApiPromise, WsProvider } = require('@polkadot/api');
const { Keyring } = require('@polkadot/api');
const anchorJS = require('./sdk/anchor');

const fs = require('fs');
output(`Support libraries checked.`, 'dark');

//file functions
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
    save: (name, data, ck) => {
        const target = `./${name}`;
        fs.writeFile(target, data, 'utf8', function (err) {
            if (err) return ck && ck({ error: err });
            return ck && ck();
        });
    },
};

//convertor functions
const cache = { "css": [], "js": [], "resource": {} }
let websocket = null;
const self = {
    getSuffix: (str) => {
        const arr = str.split(".");
        return arr.pop();
    },
    load: (list, folder, ck) => {
        if (list.length === 0) return ck && ck();
        const row = list.pop();
        file.read(`${folder}/${row}`, (str) => {
            const suffix = self.getSuffix(row);
            cache[suffix].push(str);
            return self.load(list, folder, ck);
        }, false);
    },
    resource: (folder, ignor, ck) => {
        const todo = [], more = [];
        const igsFiles = ignor.files;
        const igsDirs = ignor.folder;
        output(`Ready to load resouce from '${folder}'`);

        //1.get all resource of public folder
        let root = 0, static = 0;
        if (fs.existsSync(folder)) {
            const files = fs.readdirSync(folder);
            for (let i = 0; i < files.length; i++) {
                const fa = files[i];
                const isDir = fs.statSync(`${folder}/${fa}`).isDirectory();
                if (isDir && !igsDirs[fa] && fa != 'static') {
                    more.push(fa);
                }

                if (!igsFiles[fa] && !isDir) {
                    const tmp = fa.split('.');
                    const suffix = tmp.pop();
                    todo.push({ 
                        file: `${folder}/${fa}`, 
                        suffix: suffix, 
                        replace: fa,
                        hash: self.char(12, 'RS'),
                    });
                }
            }
            root = todo.length;
            output(`Resource in root folder loaded, total ${root} files.`);
        }

        //2.get all resource of `static`
        const sub = `${folder}/static`;
        if (fs.existsSync(sub)) {
            const dirs = fs.readdirSync(sub);
            for (let i = 0; i < dirs.length; i++) {
                const dir = dirs[i];
                if (!igsDirs[dir]) {
                    const target = `${sub}/${dir}`;
                    const ts = fs.readdirSync(target);
                    for (let j = 0; j < ts.length; j++) {
                        const row = ts[j];
                        const tmp = row.split('.');
                        const suffix = tmp.pop();
                        todo.push({ 
                            file: `${sub}/${dir}/${row}`, 
                            suffix: suffix, 
                            replace: `static/${dir}/${row}`,
                            hash: self.char(12, 'RS'),
                        });
                    }
                }
            }
            static = todo.length - root;
            output(`Resource in 'static' loaded, total ${static} files.`);
        }

        //3.check other folder
        if (more.length !== 0) {
            output(`Find resouce folders ${JSON.stringify(more)}`, 'dark');
            const sysFiles = ignor.system;
            for (let i = 0; i < more.length; i++) {
                const mdir = `${folder}/${more[i]}`;
                const mfa = fs.readdirSync(mdir);
                let count = 0;
                for (let j = 0; j < mfa.length; j++) {
                    const row = mfa[j];
                    if (sysFiles[row]) continue;
                    const tmp = row.split('.');
                    const suffix = tmp.pop();
                    count++;
                    //console.log({file:`${mdir}/${row}`,suffix:suffix,replace:`${more[i]}/${row}`});
                    //console.log(`${more[i]}/${row}`);
                    todo.push({
                        file: `${mdir}/${row}`,
                        suffix: suffix,
                        replace: `${more[i]}/${row}`,
                        hash: self.char(12, 'RS'),
                    });
                }
                output(`Resource in '${more[i]}' loaded, total ${count} files.`);
            }
        }
        output(`Cache resource, total ${todo.length} files.`);
        //console.log(todo);
        return self.getTodo(todo, ck);
    },
    getTodo: (list, ck, backup) => {
        if (backup === undefined) backup = [];
        if (list.length === 0) return ck && ck(backup);

        const row = list.pop();
        file.read(row.file, (res) => {
            switch (row.suffix) {
                case 'css':
                    cache.css.push(res);
                    row.len = res.length;
                    break;

                case 'js':

                    cache.js.push(res);
                    row.len = res.length;
                    break;

                default:
                    const type = self.getType(row.suffix);
                    const bs64 = `data:${type};base64,${res}`;
                    cache.resource[row.replace] = bs64;
                    row.len = bs64.length;
                    backup.push(row);
                    break;
            }
            return self.getTodo(list, ck, backup);
        }, false, (row.suffix !== 'js' && row.suffix !== 'css') ? true : false);
    },
    getType: (suffix) => {
        const check = suffix.toLocaleLowerCase();
        const img = {
            'jpg': 'image/jpg',
            'jpeg': 'image/jpeg',
            'gif': 'image/gif',
            'png': 'image/png',
            'svg': 'image/svg+xml'
        };
        if (img[check]) return img[check];
        return 'application';
    },
    auto: (server, ck) => {
        if (websocket !== null) return ck && ck()
        output(`Ready to link to server ${server}.`, 'dark');

        ApiPromise.create({ provider: new WsProvider(server) }).then((api) => {
            output(`Linker to node [${server}] created.`, 'success');

            if(anchorJS===null){
                return ck && ck({error:"Failed to load anchorJS."});
            }

            websocket = api;
            anchorJS.set(api);
            anchorJS.setKeyring(Keyring);

            const seed = 'Dave';
            const ks = new Keyring({ type: 'sr25519' });
            const pair = ks.addFromUri(`//${seed}`);

            return ck && ck(pair);
        });
    },
    multi: (list, ck, pair, done) => {
        if (done === undefined) done = [];
        //return ck && ck(done);
        if (list.length === 0) {
            output(`Result of writing: ${JSON.stringify(done)}`, 'success');
            return ck && ck(done);
        }

        const row = list.shift();
        output(`Writing lib anchor : ${row.name}`, 'dark');

        const strProto = typeof (row.protocol) == 'string' ? row.protocol : JSON.stringify(row.protocol);
        const raw = typeof (row.raw) == 'string' ? row.raw : JSON.stringify(row.raw);
        anchorJS.write(pair, row.name, raw, strProto, (res) => {
            output(`Processing [ ${res.step} ] : ${row.name}, protocol ( ${strProto.length} bytes ) :${strProto}`);
            if (res.step === "Ready") {
                output(`Please hold, waiting 0~${block_interval}s for the next step.`);
            } else if (res.step === "InBlock") {
                output(`Please hold, waiting ${block_interval * 3}s for the next step.`);
            } else if (res.step === "Finalized") {
                anchorJS.block((block) => {
                    done.push([row.name, block]);
                    output(`Processing done, data is written on chain, result : ${JSON.stringify(done)}`, 'success');
                    output(`Please hold, waiting ${block_interval}s for the next step.`);
                    self.multi(list, ck, pair, done);
                });
            }
        });
    },
    calcResource: (todo) => {
        let len = 0;
        for (let i = 0; i < todo.length; i++) {
            const row = todo[i];
            len += row.len;
        }
        return len;
    },
    sortList: (todo) => {
        const list = [];
        const map = {};

        //1. put length to an array, then sort
        for (let i = 0; i < todo.length; i++) {
            const row = todo[i];
            list.push(row.len);
            map[row.len] = i;
        }
        list.sort((x, y) => y - x);

        //2. sort the data
        const nlist = []
        for (let i = 0; i < list.length; i++) {
            const key = list[i];
            nlist.push(todo[map[key]]);
        }
        return nlist;
    },

    overRangeCheck: (todo, max) => {
        const cut = [];
        for (let i = 0; i < todo.length; i++) {
            const row = todo[i];
            if (row.len > max) cut.push(i);
        }
        const list = [];
        for (let i = 0; i < cut.length; i++) {
            list.push(todo[cut[i]]);
        }
        return list;
    },
    cutResource: (cut, section, fix) => {
        const list = [];
        const max = section - (fix === undefined ? 15 : fix);
        for (let i = 0; i < cut.length; i++) {
            const row = cut[i];

            const div = Math.ceil(row.len / max);
            for (let j = 0; j < div; j++) {
                //section information
                list.push({
                    file: row.file,
                    suffix: row.suffix,
                    replace: row.replace,
                    hash: row.hash,
                    len: (j === (div - 1) ? row.len - max * j : max),
                    sum: div,
                    order: j
                });
                cache.resource[`${row.replace}_${j}`] = cache.resource[row.replace].substr(max * j, max);
                //output(cache.resource[`${row.replace}_${j}`].length);
            }
            delete cache.resource[row.replace];
            output(`Resource ${row.hash} : ${row.len}, max : ${max}, divide to ${div}`);
        }
        return list;
    },

    mixTodo: (cut, todo) => {
        const list = [];
        const map = {};
        for (let i = 0; i < cut.length; i++) {
            const row = cut[i];
            if (!map[row.hash]) map[row.hash] = [];
            map[row.hash].push(row);
        }
        //console.log(map);
        for (let i = 0; i < todo.length; i++) {
            const row = todo[i];
            if (!map[row.hash]) {
                list.push(row);
            } else {
                for (let j = 0; j < map[row.hash].length; j++) {
                    list.push(map[row.hash][j]);
                }
            }
        }
        return list;
    },

    //@param todo Array [ resource file ]
    groupResouce: (todo, max) => {
        //!important, if single file length < max, should divide to small files, order by hash
        // RSiQtOfXmDaKvS will be [ RSiQtOfXmDaKvS_0, RSiQtOfXmDaKvS_1 ]
        // loader will combine the file
        
        //if sort, the result is better
        let nlist = self.sortList(todo);    //get the list order by length
        const lenStruct = 6                   //`"":"",`, key-value structure length
        const base = 2;                       //`{}`, JSON format length

        const cut = self.overRangeCheck(nlist, max);
        if (cut.length !== 0) {
            const mtodo = self.cutResource(cut, max);
            nlist = self.mixTodo(mtodo, nlist);
        }

        //if cut, regroup the todo list
        //1.put everyone in group by length
        const group = [{ ids: [], len: base }];
        for (let i = 0; i < nlist.length; i++) {
            const atom = nlist[i];
            const alen = atom.len + lenStruct + (atom.sum ? (atom.hash + '_' + atom.order).length : atom.hash.length);
            let arranged = false;
            for (let j = 0; j < group.length; j++) {
                if (group[j].len + alen < max) {
                    group[j].ids.push(i);
                    group[j].len += alen;
                    arranged = true;
                    break;
                }
            }
            if (!arranged) {
                group.push({ ids: [], len: base });
                group[group.length - 1].ids.push(i);
                group[group.length - 1].len += alen;
            }
        }
        

        //2.group the really files.
        const rlist = [];
        for (let i = 0; i < group.length; i++) {
            const row = group[i];
            const gp = []
            for (let j = 0; j < row.ids.length; j++) {
                gp.push(nlist[row.ids[j]]);
            }
            rlist.push(gp);
        }
        return rlist;
    },
    rand: (m, n) => { return Math.round(Math.random() * (m - n) + n); },
    char: (n, pre) => {
        n = n || 7; pre = pre || '';
        for (let i = 0; i < n; i++)pre += i % 2 ? String.fromCharCode(self.rand(65, 90)) : String.fromCharCode(self.rand(97, 122));
        return pre;
    },
};

//1.read xconfig.json to get setting
file.read(cfgFile, (xcfg) => {
    if (xcfg.error) return output(`Error: failed to load config file "${cfgFile}".`, 'error');
    output(`Read the config file successful.`, 'success');

    //2.read React asset file
    const target = `${xcfg.directory}/${xcfg.asset}`;
    output(`Read to get asset file '${target}'`);
    file.read(target, (react) => {
        if (react.error){
            return output(`Can not load "${xcfg.asset}, reason: ${JSON.stringify(react)}".`, 'error');;
        } 
        output(`Read asset file '${target}' successful.`, 'success');

        //3.get target css and js file
        const entry = react.entrypoints;
        output(`Read asset entrypoints : ${JSON.stringify(entry)}`);

        self.load(entry, xcfg.directory, () => {
            output(`Asset is cached successful.`, 'success');

            //4.check the public folder to get resouce and convert to Base64
            self.resource(xcfg.directory, xcfg.ignor, (todo) => {
                const related = xcfg.related;
                let list = [];

                //already attach the **JS** and **CSS** to cache
                output(`Resource loaded, css ${cache.css[0].length.toLocaleString()} bytes, js ${cache.js[0].length.toLocaleString()} bytes.`, 'success');
                const rlen = self.calcResource(todo);

                //the left resouce files to handle
                if (todo.length !== 0) {
                    output(`Resource loaded, more ${todo.length} files, ${rlen.toLocaleString()} bytes.`, 'success');
                    const groups = self.groupResouce(todo, xcfg.blockmax);
                    output(`Resource analysisted, ${groups.length} groups, max ${xcfg.blockmax.toLocaleString()} bytes.`, 'success');

                    //4.1.write resouce to Anchor Network.
                    let amount_res = 0;
                    for (let i = 0; i < groups.length; i++) {
                        const group = groups[i];
                        const resKV = {};
                        let str = `Group ${i}: { `;
                        for (let j = 0; j < group.length; j++) {
                            const row = group[j];
                            const key = !row.sum ? row.hash : `${row.hash}_${row.order}`;
                            const rkey = !row.sum ? row.replace : `${row.replace}_${row.order}`;
                            resKV[key] = cache.resource[rkey];
                            str += `${key}: ${cache.resource[rkey].length.toLocaleString()} bytes, `;
                        }
                        output(str.substring(0, str.length - 2) + ' }');
                        const protocol_res = { "type": "data", "fmt": "json" };
                        amount_res++;
                        list.push({ name: related.resource, raw: JSON.stringify(resKV), protocol: protocol_res });
                    }
                    output(`Resource task ready, ${amount_res} taskes, total ${list.length}`);
                }

                //return false;

                //4.2.write resouce then get the anchor location.
                self.auto(xcfg.server, (pair) => {

                    if(pair.error){
                        output(pair.error,"error");
                    }

                    self.multi(list, (done) => {
                        //4.3.write the res result to resoucre ref anchor
                        list = [];        //clean the list
                        const protocol_ref = { "type": "data", "fmt": "json" }
                        list.push({ name: related.resource_ref, raw: done, protocol: protocol_ref });

                        //5.write React project to Anchor Network
                        //5.1.write css lib
                        const ver = xcfg.version;
                        const protocol_css = { "type": "lib", "fmt": "css", "ver": ver }
                        let code_css = cache.css.join(" ");
                        code_css = code_css.replace("sourceMappingURL=", "")
                        list.push({ name: related.css, raw: code_css, protocol: protocol_css });
                        output(`CSS task ready, 1 taske, total ${list.length}`);

                        //5.2.write app anchor
                        const ls = [];
                        if (xcfg.globalVars) {
                            for (let i = 0; i < xcfg.globalVars.length; i++) {
                                ls.push(xcfg.globalVars[i].toLocaleLowerCase());
                            }
                        }
                        if (xcfg.libs) {
                            for (let i = 0; i < xcfg.libs.length; i++) {
                                ls.push(xcfg.libs[i]);
                            }
                        }
                        ls.push(related.css);
                        const protocol = {
                            "type": "app",
                            "fmt": "js",
                            "lib": ls,
                            "ver": ver,
                            "tpl": "react"
                        }
                        if (todo.length !== 0) protocol.res = related.resource_ref;

                        //5.3.clean and merge the code
                        //a.remove sourceMapping support
                        let code_js = cache.js.join(";");
                        code_js = code_js.replaceAll("sourceMappingURL=", "")


                        //b.replace the global 
                        if (xcfg.globalVars) {
                            const g_list = xcfg.globalVars;
                            for (let i = 0; i < g_list.length; i++) {
                                const row = g_list[i];
                                code_js = code_js.replaceAll(`window.${row}`, row);
                            }
                        }

                        //c.replace the resource
                        //!important, extend the Anchor link `|`, format `anchor://{name}|{key[start,end]}`
                        //!important, if the Anchor Data is JSON format, the string after `|` is used as key
                        for (let i = 0; i < todo.length; i++) {
                            const row = todo[i];
                            const reg = new RegExp(`${row.replace}`, "g");
                            code_js = code_js.replace(reg, `anchor://${related.resource}|${row.hash}`);
                        }
                        //file.save("hello.js", code_js);

                        list.push({ name: xcfg.name, raw: code_js, protocol: protocol });
                        output(`JS task ready, 1 task, total ${list.length}`);

                        self.multi(list, (bks) => {
                            output("\n---------------------------------------- Proccess done ----------------------------------------------\n", "", true);
                        }, pair);
                    }, pair);
                });
            });
        });
    }, true);
}, true);
