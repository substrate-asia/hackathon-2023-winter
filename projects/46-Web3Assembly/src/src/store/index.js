import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    visGraph: null,
    selectID:'1',
    contents:[{// 添加初始数据
      id:'14',
      content:`<h1>Taiko</h1><h3>Empowering Blockchain Scalability with zk Roll-Ups</h3><p>💡 Are you fascinated by blockchain technology and want to dive deeper into the world of scalability and privacy? Look no further than TAIKO Protocol! In this beginner-friendly introduction, we'll explore what TAIKO is, its background, value proposition, and its exciting use cases.</p><p></p><h3>🖼️Background: The Scaling Challenge</h3><p>Blockchain technology, famous for its security and transparency, has a scaling challenge. As more users join the network, transaction processing becomes slower and more expensive. This problem stems from the fact that every transaction must be validated by every node in the network, making it inefficient.</p><blockquote><p>This is where TAIKO Protocol comes into play.</p></blockquote><hr><h2>🥁TAIKO Protocol: A Scalability Solution</h2><p>TAIKO Protocol is a cutting-edge blockchain scalability solution that leverages zk Roll-Ups to address the scaling challenge. Let's break down what this means:</p><p>zk Roll-Ups: zk stands for "Zero-Knowledge," a cryptographic technique that allows you to prove that you know something without revealing the actual data. Roll-Ups, on the other hand, are a way to bundle multiple transactions off-chain and submit only a single proof to the main blockchain. This drastically reduces the computational load on the network.</p><h2>❓Why TAIKO?</h2><ul><li><p>⬆️&nbsp;Scalability:</p><p>TAIKO Protocol significantly boosts the scalability of blockchain networks. By batching transactions into zk Roll-Ups, it enables faster and more efficient processing, ensuring that the blockchain can handle a larger volume of transactions without congestion.</p></li><li><p>🔐&nbsp;Privacy:</p><p>Thanks to Zero-Knowledge Proofs, TAIKO Protocol offers enhanced privacy. Users can transact on the blockchain without revealing sensitive information, making it suitable for various applications, including finance and supply chain.</p></li><li><p>⚡&nbsp;Cost-Efficiency:</p><p>Reduced computational requirements mean lower transaction fees for users. TAIKO Protocol makes blockchain applications more accessible by decreasing the cost barrier.</p></li></ul><h2>👤Use Cases for TAIKO Protocol:</h2>`,
    }]
  },
  mutations: {
    setVisGraph(state, payload) {
      state.visGraph = payload
    },
    setSelectID(state, payload){
      state.selectID = payload
      console.log(payload,state.selectID);
    },
    addContents(state,payload){
       state.contents.push(payload)
    }
  },
});
