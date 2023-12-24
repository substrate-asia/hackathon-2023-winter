1. 项目的基本介绍
新型web3社交关系,你的社交影响力不在是属于大公司的资产,而是你个人价值的体现.
通过twitter授权获取用户身份识别.其他用户通过该用户的身份识别购买或者出售该用户的share,从而获得加入该用户私有群聊的权限.用户将在该群聊中发送一些未公开的特有内容,以维持购买该share用户的热度.
2. 黑客松计划完成的功能
#用户使用邮箱注册
#用户通过twitter授权获取用户在twitter id,头像，以及昵称
#用户创建一个Gear的钱包，并保存用户的助记词。
#创建一个Gear的合约，保存用户的朋友关系。
#用户支付一定的本币在合约中购买朋友的share，从而获得朋友的私有群加入权限，从而获得获得好友的私有聊天内容。朋友的share越多人购买，则当前价格更高。
#用户可以卖出已经拥有的朋友的share，从而被踢出朋友私有群。
#购买share的平台和朋友获得一定的分佣。
#查看最新的加入到系统的用户。
#查看用户的详情。
#查看当前自己拥有的share以及价值。
#购买用户的share.
#加入到用户的私有聊天群并进行聊天.


3. 使用到的技术栈
react js，rust， sqlx，poem web，Gear contract
4. 是否有技术上的障碍
Gear 合约转账问题必须大于10VARA
rust analyzer server 在 rust workspace 情况下不能准确错误提示。
5. 产品和市场上的目标
发布到Gear的正式链，并运营推广。
6. 项目和产品长期规划
基于web3的社交体系长期运营社交关系，从而引入web3游戏，商城等更多的社交场景应用。
7. 现在是否需要资金上的支持
需要，缺少UI人员，以及市场推广费用。
8. 有没有融资计划
暂未拉到投资
9. 希望从Parity和VC得到哪些帮助
希望能够增加项目的热度和曝光度
10. 任意其他对黑客松，导师答疑以及波卡生态的问题
在做Gear合约的时候得到了Gear员工的大力支持。但是感觉开发过程没有Solidity顺畅。遇到的各种问题都必须在开发人员的指导才才能完成。


Make friend with your twitter.

# gear_friend_contract
Use the gear contract tech.
The rust wasm contract langrage.
compile the contract and deploy the contract on gear network.


# kee-front
the friend dapp.
user the react tech .
use the gear api js to invoke the contract function.

# vocechat-server-rust
the back group server use the rust technology.
use the gear api crate to query the contract function.
group talk with the tokio .
