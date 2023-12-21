let wsAPI = null;
let keyRing=null;
let unlistening = null;

const limits={
    key:40,					//Max length of anchor name ( ASCII character )
    protocol:256,			//Max length of protocol	
    raw:4*1024*1024,		//Max length of raw data
	address:48,				//SS58 address length
};

const self = {
	/************************/
	/***Params and setting***/
	/************************/

	/** 
	 * check the basic limitation of anchor
	 * @param {string} key		//anchor name
	 * @param {string} raw		//raw data to write to chain
	 * @param {string} protocol	//protocol to write to chain
	 * @param {string} address	//ss58 address	
	*/
	limited:(key,raw,protocol,address)=>{
        if(key!==undefined) return key.length>limits.key?true:false;
        if(protocol!==undefined) return protocol.length>limits.protocol?true:false;
        if(raw!==undefined) return raw.length>limits.raw?true:false;
		if(address!==undefined) return address.length!==limits.address?true:false;
        return false;
    },

	/** 
	 * set websocket link object.
	 * @param {object} ws		//websocket link to anchor node
	*/
	setWebsocket: (ws) => {
		//check the node support anchor
		if(!ws.query.anchor || !ws.tx.anchor) return false;
		wsAPI = ws;
		return true;
	},

	/** 
	 * set keyring object.
	 * @param {class} ks		//websocket keyring class
	*/
	setKeyring:(ks)=>{
		keyRing=new ks({ type: 'sr25519' });
		return true;
	},

	/** 
	 * check wether the websocket link is ok.
	*/
	ready:()=>{
		return wsAPI===null?false:true;
	},

	/************************/
	/***Polkadot functions***/
	/************************/

	/** 
	 * stop subcribe of the anchor node.
	 * @param {function}	[ck]	//callback function
	*/
	unlistening:(ck)=>{
		if(unlistening!==null) unlistening();
		return ck && ck();
	},

	/** 
	 * clean the subcribe of anchor network.
	*/
	clean: () => {
		if (unlistening != null) {
			unlistening();
			unlistening = null;
		}
		return true;
	},

	/** 
	 * get the current block number
	*/
	block:(ck) => {
		if (!self.ready()) return ck && ck(false);
		let unblock=null;
		wsAPI.rpc.chain.subscribeFinalizedHeads((lastHeader) => {
			const hash = lastHeader.hash.toHex();
			const block=lastHeader.number.toJSON();
			if(unblock!==null) unblock();
			if(ck){
				ck(block,hash);
			} 
		}).then((fun) => {
			unblock = fun;
		});
	},

	/** 
	 * subcribe the newest anchor data
	 * @param {function}	[ck]	//callback function
	*/
	listening: (ck) => {
		if (!self.ready()) return ck && ck(false);
		self.clean();
		wsAPI.rpc.chain.subscribeFinalizedHeads((lastHeader) => {
			//console.log(lastHeader);
			const hash = lastHeader.hash.toHex();
			const block=lastHeader.number.toJSON();
			const list=[];
			const format=self.format;

			self.specific(hash,(exs)=>{
				for(let i=0;i<exs.length;i++){
					const ex=exs[i],row=ex.args;
					if(row.key.substr(0, 2).toLowerCase() === '0x') row.key=self.decodeUTF8(row.key);
					row.signer=ex.owner;
					row.block=block;
					const dt=format(row.key,self.decor(row));
					dt.empty=false;
					list.push(dt);
				}
				return ck && ck(list,block);
			});

		}).then((fun) => {
			unlistening = fun;
		});
		return self.unlistening;		//返回撤销listening的方法
	},

	/** 
	 * Get the balance of target address.
	 * @param {string}		address		//SS58 address 
	 * @param {function}	ck			//callback function
	*/
	balance: (address, ck) => {
		if (!self.ready()) return ck && ck({error:"No websocke link."});
		if(self.limited(undefined,undefined,undefined,address)) return ck && ck(false);
		let unsub=null;
		wsAPI.query.system.account(address, (res) => {
			if(unsub!=null) unsub();
			const data=res.toJSON().data;
			return ck && ck(data);
		}).then((fun)=>{
			unsub=fun;
		});
	},

	/** 
	 * Load pair from encry file
	 * @param {object}		encryJSON	//content of encry file (can get from Polkadot UI) 
	 * @param {string}		password	//password for the encry file 
	 * @param {function}	ck			//callback function
	*/
	load:(encryJSON,password,ck)=>{
		if(!password) return ck && ck({error:"Invalid password."});
		if(!encryJSON.address || !encryJSON.encoded) return ck && ck({error:"Invalid encry data."});
        if(encryJSON.address.length!==48)  return ck && ck({error:"Invalid address."});
        if(encryJSON.encoded.length!==268)  return ck && ck({error:"Invalid encoded data."});
		const pair = keyRing.createFromJson(encryJSON);
		try {
			pair.decodePkcs8(password);
			return ck && ck(pair);
		} catch (error) {
			//console.log(error);
			return ck && ck({error:"Wrong password."});
		}
	},

	/************************/
	/***Anchor data browse***/
	/************************/

	/** 
	 * Get the anchor owner.
	 * @param {string}		anchor	//anchor name
	 * @param {function}	ck		//callback function
	*/
	owner:(anchor,ck)=>{
		let unsub = null;
		wsAPI.query.anchor.anchorOwner(anchor, (res) => {
			unsub();
			if(res.isEmpty) return ck && ck(false);
			const owner=res.value[0].toHuman();
			const block = res.value[1].words[0];
			return ck && ck(owner,block);
		}).then((fun)=>{
			unsub = fun;
		});
	},

	/** 
	 * Get the latest data of anchor.
	 * @param {string}		anchor	//anchor name
	 * @param {function}	ck		//callback function
	*/
	latest: (anchor, ck) => {
		if (!self.ready()) return ck && ck({error:"No websocke link."});
		anchor = anchor.toLocaleLowerCase();
		if (anchor.substr(0, 2) === '0x') anchor = self.decodeUTF8(anchor);

		if(self.limited(anchor)) return ck && ck(false);

		self.owner(anchor,(owner,block)=>{
			if(owner===false) return ck && ck(false);
			self.target(anchor,block,ck);
		});
	},

	/** 
	 * Get the target anchor on special block.
	 * @param {string}		anchor	//anchor name
	 * @param {number}		block	//target block number
	 * @param {function}	ck		//callback function
	*/
	target:(anchor,block,ck)=>{
		if (!self.ready()) return ck && ck({error:"No websocke link."});
		anchor = anchor.toLocaleLowerCase();
		if (anchor.substr(0, 2) === '0x') anchor = self.decodeUTF8(anchor);

		if(self.limited(anchor)) return ck && ck(false);
		self.owner(anchor,(owner)=>{
			const details={block:block};
			if(owner===false) return ck && ck(self.format(anchor,details));
			wsAPI.rpc.chain.getBlockHash(block, (res) => {
				const hash = res.toHex();
				if (!hash) return ck && ck(self.format(anchor,details));

				self.specific(hash,(dt)=>{
					if(dt===false) return ck && ck(self.format(anchor,details));
					
					details.empty = false;
					for(let k in dt) details[k]=dt[k];
					details.owner=owner;

					let unlist=null;
					wsAPI.query.anchor.sellList(anchor, (dt) => {
						unlist();
						if (dt.value.isEmpty){
							return ck && ck(self.format(anchor,details));
						}
						details.sell = true;
						details.cost = dt.value[1].words[0];		//selling cost
						details.target=dt.value[2].toHuman();		//selling target 
						return ck && ck(self.format(anchor,details));
					}).then((fun) => {
						unlist = fun;
					});

				},{anchor:anchor});		//add the owner details here.
			});
		});
	},

	/** 
	 * Get the anchor history list.
	 * @param {string}		anchor		//anchor name
	 * @param {function}	ck			//callback function
	 * @param {number}		[limit]		//search limit block number
	*/
	history: (anchor, ck, limit) => {
		if (!self.ready()) return ck && ck({error:"No websocke link."});
		anchor = anchor.toLocaleLowerCase();
		if(self.limited(anchor)) return ck && ck(false);

		self.owner(anchor,(owner,block)=>{
			if (owner===false) return ck && ck(false);
			self.loop(anchor, block, limit, (list)=>{
				if(list.length===0) return ck && ck(list);
				const res=[],format=self.format;
				for(let i=0;i<list.length;i++){
					const row=list[i];
					res.push(format(row.key,row));
				}
				return ck && ck(res);
			});
		});
	},

	/** 
	 * loop to get anchor linked list.
	 * @param {string}		anchor	//anchor name
	 * @param {number}		block	//target block number
	 * @param {number}		[limit]	//search limit block number
	 * @param {function}	ck		//callback function
	 * @param {array}		[list]	//callback result array
	*/
	loop: (anchor, block, limit, ck, list) => {
		limit = !limit ? 0 : limit;
		if (!list) list = [];
		wsAPI.rpc.chain.getBlockHash(block, (res)=>{
			const hash = res.toHex();
			self.owner(anchor,(owner)=>{
				self.specific(hash,(dt)=>{
					dt.block=block;
					dt.owner=owner;
					list.push(dt);
					if (dt.pre === limit || parseInt(dt.pre) === 0) return ck && ck(list);
					else return self.loop(anchor, dt.pre, limit, ck, list);
				},{anchor:anchor});
			});
		});
	},

	//TODO: [[anchor,block],[anchor,block],...,[anchor,block]], the anchor target list
	footprint:(anchor,ck)=>{

	},

	/** 
	 * Get multi anchors from list.
	 * @param {array}		list	//anchor list, [anchor,block] or "anchor"
	 * @param {function}	ck		//callback function
	 * @param {array}		[done]	//the multi list, the same as list
	 * @param {object}		[map]	//the result map of anchors
	*/
	multi: (list,ck,done,map)=>{
		if (!self.ready()) return ck && ck({error:"No websocke link."});
		if(list.length===0) return [];
		if(!done) done=[];
		if(!map) map={};

		const row=list.shift();
		done.push(row);
		if (typeof (row) == 'string') {
			self.latest(row,(data)=>{
				map[row]=data;
				if(list.length===0) return ck && ck(self.groupMulti(done,map));
				return self.multi(list,ck,done,map);
			});
		} else {
			self.target(row[0],row[1],(data)=>{
				map[row[0]+'_'+row[1]]=data;
				if(list.length===0) return ck && ck(self.groupMulti(done,map));
				return self.multi(list,ck,done,map);
			});
		}
	},

	/** 
	 * Group the anchors result, the same order as requested.
	 * @param {array}		list	//the multi anchor list.
	 * @param {object}		map		//the result map of anchors
	*/
	groupMulti:(list,map)=>{
		const arr=[];
		const format=self.format;
		for (let i = 0; i < list.length; i++) {
			const row = list[i];
			const data=map[(typeof (row) == 'string')?row:(row[0]+'_'+row[1])];
			arr.push(!data?format(list[i]):data);
		}
		return arr;
	},

	/** 
	 * Decode data from target block hash
	 * @param {string}		hash	//target block hash
	 * @param {function}	ck		//callback function
	 * @param {object}		[cfg]	//{anchor:""}, filter target anchor if cfg is sent
	*/
	specific:(hash,ck,cfg)=>{
		if(cfg!==undefined && cfg.anchor!==undefined && self.limited(cfg.anchor)) return ck && ck(false);
		wsAPI.rpc.chain.getBlock(hash).then((dt) => {
			if (dt.block.extrinsics.length === 1) return ck && ck(false);

			wsAPI.query.system.events.at(hash,(evs)=>{
				const exs = self.filter(dt, 'setAnchor',self.status(evs));
				if(exs.length===0) return ck && ck(false);
				if(cfg===undefined || cfg.anchor===undefined) return ck && ck(exs);

				let data=null;
				for(let i=0;i<exs.length;i++){
					let ex=exs[i],row=ex.args;
					if(row.key.substr(0, 2).toLowerCase() === '0x') row.key=self.decodeUTF8(row.key);
					if(row.key.toLowerCase()===cfg.anchor.toLowerCase()){
						data=row;
						data.signer=ex.owner;
						data.stamp=parseInt(ex.stamp);
					}
				}
				if(data===null) return ck && ck(false);
				return ck && ck(self.decor(data));
			});
		});
	},

	/**************************/
	/***Anchor data to chain***/
	/**************************/

	/** 
	 * Write data to chain
	 * @param {object}			pair		//keyring pair
	 * @param {string}			anchor		//anchor name
	 * @param {string | json}	raw			//anchor raw data
	 * @param {string | json}	protocol	//anchor protocol data 
	 * @param {function}		ck			//callback function
	*/
	write: (pair, anchor, raw, protocol, ck) => {
		if (!self.ready()) return ck && ck({error:"No websocke link."});
		if (typeof protocol !== 'string') protocol = JSON.stringify(protocol);
		if (typeof raw !== 'string') raw = JSON.stringify(raw);
		if(self.limited(anchor,raw,protocol)) return ck && ck({error:"Params error"});

		self.owner(anchor,(owner,block)=>{
			if(owner!==false &&  owner!==pair.address) return ck && ck({error:`Not the owner of ${anchor}`});
			self.balance(pair.address,(amount)=>{
				if(amount.free<100*1000000000000) return ck && ck({error:'Low balance'});
				const pre = owner===false?0:block;
				try {
					wsAPI.tx.anchor.setAnchor(anchor, raw, protocol, pre).signAndSend(pair, (res) => {
						return ck && ck(self.process(res));
					});
				} catch (error) {
					return ck && ck({error:error});
				}
			});
		});
	},
	
	/************************/
	/***Anchor market funs***/
	/************************/
	
	// TODO: need to page and step
	/** 
	 * Get list of anchors on sell
	 * @param {function}	[ck]	//callback function
	*/
	market: (ck) => {
		if (!self.ready()) return ck && ck({error:"No websocke link."});
		wsAPI.query.anchor.sellList.entries().then((arr) => {
			let list=[];
			if(!arr) return ck && ck(list);
			for(let i=0;i<arr.length;i++){
				const row=arr[i];
				const key=row[0].toHuman();
				const info=row[1].toHuman();
				list.push({
					name:key[0],
					owner:info[0],
					price:info[1],
					target:info[2],
					free:info[0]===info[2],
				});
			}
			return ck && ck(list);
		});
	},

	/** 
	 * Set anchor to selling status
	 * @param {object}			pair		//keyring pair
	 * @param {string}			anchor		//anchor name
	 * @param {number}			price		//anchor selling price
	 * @param {function}		ck			//callback function
	 * @param {string}			[target]	//special SS58 address
	*/
	sell: (pair, anchor, price, ck , target) => {
		if (!self.ready()) return ck && ck({error:"No websocke link."});
		anchor = anchor.toLocaleLowerCase();
		if(self.limited(anchor)) return ck && ck(false);

		self.owner(anchor,(owner,block)=>{
			if(owner===false) return ck && ck({error:"No target anchor."});
			if(owner!==pair.address) return ck && ck({error:`Not the owner of ${anchor}`});
			try {
				wsAPI.tx.anchor.sellAnchor(anchor,price,!target?owner:target).signAndSend(pair, (res) => {
					return ck && ck(self.process(res));
				});
			} catch (error) {
				return ck && ck({error:error});
			}
			
		});
	},

	/** 
	 * Revoke anchor to normal status
	 * @param {object}			pair		//keyring pair
	 * @param {string}			anchor		//anchor name
	 * @param {function}		ck			//callback function
	*/
	unsell:(pair, anchor, ck) => {
		if (!self.ready()) return ck && ck({error:"No websocke link."});
		anchor = anchor.toLocaleLowerCase();
		if(self.limited(anchor)) return ck && ck({error:"Name error"});
		self.owner(anchor,(owner)=>{
			if(!owner) return ck && ck({error:"No such anchor."});
			if(owner!==pair.address) return ck && ck({error:`Not the owner of ${anchor}`});
			try {
				wsAPI.tx.anchor.unsellAnchor(anchor).signAndSend(pair, (res) => {
					return ck && ck(self.process(res));
				});
			} catch (error) {
				return ck && ck({error:error});
			}
		});
	},

	/** 
	 * Buy target anchor
	 * @param {object}			pair		//keyring pair
	 * @param {string}			anchor		//anchor name
	 * @param {function}		ck			//callback function
	*/
	buy: (pair, anchor, ck) => {
		if (!self.ready()) return ck && ck({error:"No websocke link."});
		anchor = anchor.toLocaleLowerCase();
		if(self.limited(anchor)) return ck && ck({error:"Name error"});

		self.owner(anchor,(owner)=>{
			if(owner===pair.address) return ck && ck({error:"Your own anchor"});
			let unlist=null;
			wsAPI.query.anchor.sellList(anchor, (dt) => {
				unlist();
				if (dt.value.isEmpty) return ck && ck({error:`'${anchor}' is not on sell`});
				const res=dt.toJSON();
				const cost=res[1]*1000000000000;
				if(res[0]!==res[2] && res[2]!==pair.address) return ck && ck({error:"Not target account"});
				
				self.balance(pair.address,(amount)=>{
					if(amount.free<cost) return ck && ck({error:'Low balance'});
					try {
						wsAPI.tx.anchor.buyAnchor(anchor).signAndSend(pair, (res) => {
							return ck && ck(self.process(res));
						});
					} catch (error) {
						return ck && ck({error:error});
					}
				});
			}).then((fun) => {
				unlist = fun;
			});

		});
	},

	/** 
	 * Decode interact status of anchor node
	 * @param {object}			obj		//polkadot status object
	*/
	process:(obj)=>{
		const status={
			step:'',
			message:'',
		};
		const res=obj.status.toHuman();

		if (typeof (res) == 'string'){
			status.step=res;
			status.message='Ready to interact with node.';
			return status;
		}

		if(res.InBlock){
			status.step='InBlock';
			status.message='Packaged to block, nearly done. Waiting for finalizing.';
			return status;
		}

		if(res.Finalized){
			status.step='Finalized';
			status.message='Finalized, done.';
			return status;
		}
		return status;
	},
	
	/************************/
	/***Anchor data format***/
	/************************/
	
	/** 
	 * Format the anchor data 
	 * @param {object}	data	//anchor data from specific function
	*/
	decor:(data)=>{
		if(data.key.substr(0, 2).toLowerCase() === '0x') data.key=self.decodeUTF8(data.key);
		if(data.raw.substr(0, 2).toLowerCase() === '0x') data.raw = self.decodeUTF8(data.raw);
		if(data.protocol){
			try {
				let proto=JSON.parse(data.protocol);
				data.protocol=proto;
				if (proto.type === "data" && proto.format === "JSON") data.raw = JSON.parse(data.raw);
			} catch (error) {
				console.log(`Failed to parse JSON.`);
			}
		}
		data.pre=parseInt(data.pre.replace(/,/gi, ''));
		
		//remove the thound seperetor
		if(data.block && typeof(data.block)==='string') data.block=parseInt(data.block.replace(/,/gi, ''));
		return data;
	},

	/** 
	 * Filter anchor from block raw data
	 * @param {object}			exs			//Extrinsic raw data from @Polkadot/api
	 * @param {string}			method		//target method to filter
	 * @param {function}		status		//status result from self.status
	*/
	filter: (exs, method,status) => {
		let arr = [];
		//console.log(exs[0].toHuman());
		let stamp=0;
		exs.block.extrinsics.forEach((ex, index) => {
			if(index===0){
				stamp=ex.toHuman().method.args.now.replace(/,/gi, '');
			}
			if(index===0 || status[index]!=="ExtrinsicSuccess") return false;
			const dt = ex.toHuman();
			if (dt.method.method === method) {
				const res = dt.method;
				res.owner = dt.signer.Id;
				res.stamp = stamp;
				arr.push(res);
			}
		});
		return arr;
	},

	/** 
	 * Get events from @Polkadot/api raw data
	 * @param {array}			list			//Events raw data from @Polkadot/api
	*/
	status:(list)=>{
		const evs=list.toHuman();
		const map={};
		for(let i=0;i<evs.length;i++){
			const ev=evs[i],index=ev.phase.ApplyExtrinsic;
			if(ev.event.section!=="system") continue;
			map[index]=ev.event.method;
		}
		return map;
	},

	/** 
	 * UTF8 decode
	 * @param {string}	str		//Hex string need to convert
	*/
	decodeUTF8:(str) => {
		const arr=str.slice(2).replace(/\s+/g, '').split("");
		let final='';
		for(let i=0;i<arr.length;i+=2){
			final+="%"+arr[i]+arr[i+1];
		}
		return decodeURIComponent(final);
		//return decodeURIComponent(str.slice(2).replace(/\s+/g, '').replace(/[0-9a-f]{2}/g, '%$&'));
	},

	/** 
	 * Last format the anchor ojbect
	 * @param {string}	anchor		//anchor name
	 * @param {object}	obj			//anchor raw data
	*/
	format:(anchor,obj)=>{
		return {
			"name":!anchor?"":anchor,
			"protocol":(obj && obj.protocol)?obj.protocol:null,
			"raw":(obj && obj.raw)?obj.raw:null,
			"block":(obj && obj.block)?obj.block:0,
			"stamp":(obj && obj.stamp)?obj.stamp:0,
			"pre":(obj && obj.pre)?obj.pre:0,
			"signer":(obj && obj.signer)?obj.signer:"",
			"empty":(obj && obj.empty===false)?obj.empty:true,
			"owner":(obj && obj.owner)?obj.owner:"",
			"sell":(obj && obj.sell)?obj.sell:false,
			"cost":(obj && obj.cost)?obj.cost:0,
			"target":(obj && obj.target)?obj.target:"",
		};
	},
};

module.exports={
	set:self.setWebsocket,		//cache the linker promise object
	setKeyring:self.setKeyring,	//set Keyring to get pair
	ready:self.ready,			//check the ws is ready
	subcribe:self.listening,	//subcribe the latest block which including anchor data
	block:self.block,
	load:self.load,				//load encry json to create pair	
	balance:self.balance,		//get the balance details of account

	search:self.latest,			//search anchor name
	latest:self.latest,			//get the latest data of anchor
	target:self.target,			//view target anchor data
	history:self.history,		//history of anchor data
	multi:self.multi,			//get target data for a list of anchors
	//footprint:self.footprint,
	owner:self.owner,			//get the owner of anchor

	write:self.write,			//init or update an anchor

	market:self.market,			//get the list of selling anchors
	sell:self.sell,				//set anchor to selling status
	unsell:self.unsell,			//revoke anchor from selling status
	buy:self.buy,				//buy selling anchor
};

//!important, The minify lib file can be used in html file by script tag
//!important, when using esbuild to minify this as lib for avoiding the anchorJS=anchorJS.anchorJS，
//!important, need to exports like this. Esbuild command like this
//!important, yarn add esbuild
//!important, ../playground/node_modules/.bin/esbuild anchor.js --bundle --minify --outfile=anchor.min.js --global-name=anchorJS
//console.log(exports);

// exports.set=self.setWebsocket;
// exports.setKeyring=self.setKeyring;
// exports.ready=self.ready;
// exports.subcribe=self.listening;
// exports.block=self.block;
// exports.load=self.load;
// exports.balance=self.balance;
// exports.search=self.latest;
// exports.latest=self.latest;
// exports.target=self.target;
// exports.history=self.history;
// exports.multi=self.multi;
// exports.write=self.write;
// exports.market=self.market;
// exports.sell=self.sell;
// exports.unsell=self.unsell;
// exports.buy=self.buy;