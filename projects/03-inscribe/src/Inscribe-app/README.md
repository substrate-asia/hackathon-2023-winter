# Inscribe-app
dapp

# Run this app
## Install Node
## install yarn / pnmp
## yarn install
## yarn dev

# 需要开发的内容
## 读取智能合约信息并展示的部分
- 读取单个铭文的信息并根据这些信息渲染成名片
- 读取所有的铭文信息,用列表展示
- 读取某个用户持有的铭文数据并展示
- 读取市场上的订单,根据订单的状态决定是否展示, 提供一个交易的按钮(发送交易的功能可以先不做); 对订单进行排序: 时间,价格的升序和降序
- 读取用户的(所有/最近n条)订单历史记录并展示

## 需要调用智能合约写入数据的部分
- 部署铭文的功能(可以先做UI)
- 铸造铭文的功能(可以先做UI)
- 转账功能(可以先做UI)
- 创建订单的功能(可以先做UI)

## 其他没想到的直接在这个文件中补充

## 智能合约地址
```
programid: 0xfdaf86b31109b2c4013429ed95911730d4c29d4bf219b6d12e6bf1c6e65c020a
``` 
```
idea: https://idea.gear-tech.io/programs/0xfdaf86b31109b2c4013429ed95911730d4c29d4bf219b6d12e6bf1c6e65c020a?node=wss%3A%2F%2Ftestnet.vara-network.io
```

# 技术栈
react + ts + chakra-ui组件库

## 运行 
``` 
拉取代码
git clone https://github.com/hacker20234/Inscribe-app.git

在与src平级目录下创建   .env   文件
文件内容(复制粘贴)    REACT_APP_NODE_ADDRESS=wss://testnet.vara-network.io
保存

推荐版本 node v16.15.1

npm i

npm run start

提交

git push

```

## 前端参考网站
https://www.brc-20.io/

## 组件库
https://chakra-ui.com/docs/components/avatar

## 做功能 
谷歌浏览器右上角点击三个点
点击扩展程序
点击访问chrome应用商店 
右上角搜索 subwallet
安装后选择import an account
选择import from seed phrase
选择import account
第一步设置密码
第二步依次输入 round amount runway busy silk soda kind lab history tell property lounge 这十二个单词 下一步下一步

打开网站 https://idea.gear-tech.io/state/full/0xc18584c6b11838f2f62233f030dc8fe649b4b212fd35aaabf79ed0e5be11c24d?node=wss%3A%2F%2Ftestnet.vara.network
点击右上角 connect 选择subwallet
点击左侧 program 
点击右侧 my program
搜索 inscribe 或者搜索 0xc18584c6b11838f2f62233f030dc8fe649b4b212fd35aaabf79ed0e5be11c24
进到 inscribe 里 
点击右上角 read statu
点击 read full statu


farmer:
.env文件内容更新
REACT_APP_NODE_ADDRESS=wss://testnet.vara-network.io
REACT_APP_IPFS_ADDRESS=https://ipfs.gear-tech.io/api/v0
REACT_APP_IPFS_GATEWAY_ADDRESS=https://ipfs-gw.gear-tech.io/ipfs
REACT_APP_CONTRACT_ADDRESS=0xc18584c6b11838f2f62233f030dc8fe649b4b212fd35aaabf79ed0e5be11c24d
