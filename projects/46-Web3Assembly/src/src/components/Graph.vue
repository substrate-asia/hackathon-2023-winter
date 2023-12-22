<template>
    <div>
        <el-card v-loading="loading">
            <el-tooltip class="item" effect="dark" content="double click Node to vote" placement="top-start">
                <div id="container2" style="height: 300px;"></div>
            </el-tooltip>
        </el-card>


        <el-dialog title="Vote $WAG" :visible.sync="showVoteDialog" width="30%">

            <div class="dialog-content">
                <div> <strong>How many $WAG do you want to vote?</strong></div>
                <br/>
                <br/>
                <el-input v-model="voteAmount" placeholder="Enter amount" style="width: 300px;"></el-input>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="submitVote" type="primary">Confirm</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
import { parse, stringify } from 'flatted';
import { visConf } from '@/assets/visConf.js'
import { ownDemoData2 } from '@/assets/graphData3';
import { runXXLayout, treeLayoutConfForm, hubsizeLayoutConfForm } from '@/assets/visLayout'
import { ethers } from 'ethers';
import contractAbi from '@/contract/abi/WAG.json';
import { contractAddress } from '@/components/const.js'

export default {
    name: 'Graph',
    data() {
        return {
            selectID:"6",
            showVoteDialog: false,
            voteAmount: '',
            loading: false
        }
    },
    methods: {
        async submitVote() {
            if (!this.voteAmount) {
                this.$message.warning('Please input the amount you want to vote.');
                return;
            }
            if (this.voteAmount <= 0) {
                this.$message.warning('Please input the correct amount you want to vote.');
                return;
            }

            try {
                if (typeof window.ethereum !== "undefined") {
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const signer = provider.getSigner();
                    const contract = new ethers.Contract(contractAddress, contractAbi, signer);

                    const tx = await contract.burn(this.voteAmount);

                    setTimeout(() => {
                        this.voteAmount = '';
                        this.showVoteDialog = false;
                    }, 100);
                    this.loading = true

                    await tx.wait();
                    this.loading = false
                } else {
                    alert("Please install a Web3 provider, such as MetaMask.");
                }
            } catch (error) {
                console.error('Error sending transaction:', error);
            }

            this.voteAmount = '';
            this.showVoteDialog = false;
            this.$message({
                message:'成功为节点投票',
                type:'success'
            })
        }

    },
    mounted() {
        // get id from state
        this.selectID = this.$store.state.selectID
        console.log('当前节点是：',this.selectID);
        // read bisgraph from local
        // var visgraph = parse(window.localStorage.getItem('visgraph'))
        //read data  this.$store.state.visGraph
        // console.log(visgraph.getGraphData());
        var that = this
        var secondVisConf = visConf
        secondVisConf.node.onClick = function (event, node) {
        }
        secondVisConf.node.ondblClick = function (event, node) {
            that.showVoteDialog = true
        }

        secondVisConf.node.width = 80
        secondVisConf.node.height = 60
        secondVisConf.node.label.font = '18px 微软雅黑'


        var visgraph2 = new VisGraph(document.getElementById('container2'), secondVisConf);
        // var visgraph2_data = visgraph2.getGraphData()
        var newData = { nodes: [], links: [] }
        var nodesIDList = []
        ownDemoData2.links.forEach((item, index) => {
            if (item.source == this.selectID || item.target == this.selectID) {
                nodesIDList.push(item.source)
                nodesIDList.push(item.target)
                newData.links.push(item)
            }
        });
        console.log(nodesIDList);
        ownDemoData2.nodes.forEach((item2, index2) => {
            if (nodesIDList.includes(item2.id)) {
                newData.nodes.push(item2)
            }
        })

        console.log(newData);

        visgraph2.drawData(newData);
        treeLayoutConfForm.distY = 150
        treeLayoutConfForm.distX = 100
        treeLayoutConfForm.direction = 'UD'
        runXXLayout("Tree", visgraph2.getGraphData(), treeLayoutConfForm);

        visgraph2.setZoom('auto')
    },

}

</script>

