const self = {
  // checkEncryFile: (fa, ck) => {
  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     try {
  //       const sign = JSON.parse(e.target.result);
  //       if (!sign.address || !sign.encoded)
  //         return ck && ck({ error: "Error encry JSON file" });
  //       if (sign.address.length !== 48)
  //         return ck && ck({ error: "Error SS58 address" });
  //       if (sign.encoded.length !== 268)
  //         return ck && ck({ error: "Error encoded verification" });
  //       return ck && ck(sign);
  //     } catch (error) {
  //       return ck && ck({ error: "Not encry JSON file" });
  //     }
  //   };
  //   reader.readAsText(fa);
  // },

  stamp: () => {
    return new Date().getTime();
  },
  rand: (m, n) => {
    return Math.round(Math.random() * (m - n) + n);
  },
  char: (n, pre) => {
    n = n || 7;
    pre = pre || "";
    for (let i = 0; i < n; i++)
      pre +=
        i % 2
          ? String.fromCharCode(self.rand(65, 90))
          : String.fromCharCode(self.rand(97, 122));
    return pre;
  },
  shorten: (addr, n) => {
    if (n === undefined) n = 10;
    return addr.substr(0, n) + "..." + addr.substr(addr.length - n, n);
  },
  copy:(arr_obj)=>{
    return JSON.parse(JSON.stringify(arr_obj));
  },
  clean:(arr)=>{
    return Array.from(new Set(arr));
  },
  tail:(str,n)=>{
    return str.substr(0, n) + "...";
  },
  empty: (obj) => {
    if (JSON.stringify(obj) === "{}") return true;
    return false;
  },
  toDate: (stamp) => {
    return new Date(stamp).toLocaleString();
  },
};

module.exports = self;
