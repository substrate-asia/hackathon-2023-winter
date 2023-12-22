<template>
  <el-container>
    <el-header
      style="display: flex; justify-content: flex-start; align-items: center"
    >
      <el-image
        style="width: 150px; margin-right: 20px"
        :src="require('@/assets/logo.jpg')"
      ></el-image>
      <el-input
        style="width: 700px"
        placeholder="Input to search..."
        v-model="inputSearch"
      >
        <template slot="prepend"><i class="el-icon-search"></i></template>
      </el-input>
      <Profile
        style="
          line-height: normal;
          position: absolute;
          top: 10px;
          right: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
          background-color: #fff;
          z-index: 1000;
        "
      />
    </el-header>
    <el-main style="line-height: normal">
      <div id="container" ref="graph"></div>
      <el-button
        type="primary"
        style="
          position: absolute;
          bottom: 30px;
          right: 48px;
          background-color: yourColorHere;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
          z-index: 1001;
        "
        @click="addNodeVisible = true"
        >Edit Node
      </el-button>

      <el-button
        type=""
        style="
          position: absolute;
          bottom: 30px;
          right: 180px;
          background-color: yourColorHere;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
          z-index: 1001;
        "
        @click="addNewNodeVisible = true"
        >Add New Node
      </el-button>

      <el-switch
        style="position: absolute; bottom: 40px; right: 360px"
        v-model="showBestPath"
        inactive-color="#13ce66"
        active-color="#ff9900"
        inactive-text="展示最优路径"
      >
      </el-switch>

      <el-dialog title="Edit Node" :visible.sync="addNodeVisible" width="80%">
        <RichText ref="richTextComponent" :readOnly="false" />

        <span slot="footer" class="dialog-footer">
          <el-button @click="addNodeVisible = false">Cancel</el-button>
          <el-button type="primary" @click="updateContent">Confirm</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="Add a New Node"
        :visible.sync="addNewNodeVisible"
        width="30%"
      >
        <el-input
          placeholder="Please enter a new node name"
          v-model="newNodeName"
        >
        </el-input>

        <span slot="footer" class="dialog-footer">
          <el-button @click="addNewNodeVisible = false">Cancel</el-button>
          <el-button type="primary" @click="addNewNode">Confirm</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>


<script>
import { visConf } from '@/assets/visConf.js'
import { runXXLayout, treeLayoutConfForm, hubsizeLayoutConfForm } from '@/assets/visLayout'

// import {ownDemoData1} from "@/assets/graphData1"
import { ownDemoData2 } from "@/assets/graphData3"


import RichText from './RichText.vue'
import { mapState, mapMutations } from 'vuex'
// import Profile from './Profile.vue'
import Profile from './PolkadotProfile.vue'
import { AddNodeReq, UpdateNodeReq } from '../apis/api.js'
// import { parse, stringify } from 'flatted'; 循环对象


export default { //这个是一个Vue对象
  name: 'FirstPage',
  props: {
    msg: String
  },
  components: {
    RichText,
    Profile
  },
  data () {
    return {
      demoData: ownDemoData2,
      showBestPath: true,
      newNodeName: '',
      addNewNodeVisible: false,
      addNodeVisible: false,
      inputSearch: '',
      currentID: '6',
      visgraph: ''
    }
  },
  computed: {
    ...mapState({
      visgraphInVuex: 'visGraph', // 确保这里引用的是正确的 state 属性
    }),
  },
  methods: {
    // 更新节点内容，后端版本，不用先
    async updateContentDeprecated() {
        const content = this.$refs.richTextComponent.content;
        const nodeName = this.newNodeName; 
        const id = 2
        const src_id = 0 // 这个变量后端暂时没用，瞎传

        try {
            const response = await UpdateNodeReq(id, src_id, nodeName, content);
            console.log(response);

            this.$message({
                message: `成功提交节点`,
                type: 'success'
            });
            this.addNodeVisible = false;
        } catch (error) {
            console.error("Error adding node:", error);
            this.$message({
                message: `添加节点出错`,
                type: 'error'
            });
        }
    },

    // 创建节点，后端版本，不用先
    async createNode() {
        const nodeName = this.newNodeName; 

        try {
            const response = await AddNodeReq(nodeName, "");
            console.log(response);

            this.$message({
                message: `成功提交节点`,
                type: 'success'
            });
            this.addNodeVisible = false;
        } catch (error) {
            console.error("Error adding node:", error);
            this.$message({
                message: `添加节点出错`,
                type: 'error'
            });
        }
        this.addNewNodeVisible = false
    },

    // 添加新的节点
    addNewNode () {
      var nodeID = new String(Date.now())
      var selectID = this.$store.state.selectID

      if (JSON.parse(window.localStorage.getItem('newGraph'))) {
        var newGraph = JSON.parse(window.localStorage.getItem('newGraph'))
        newGraph.nodes.push({ id: nodeID, label: this.newNodeName })
        newGraph.links.push({ id: 'e' + nodeID, source: selectID, target: nodeID, label: '关系' })
        this.visgraph.activeAddNodeLinks([{ id: nodeID, label: this.newNodeName }], [{ id: 'e' + nodeID, source: selectID, target: nodeID, label: '关系' }])
      } else {
        // 没有
        var newGraph = {
          nodes: [{ id: nodeID, label: this.newNodeName }],
          links: [{ id: 'e' + nodeID, source: selectID, target: nodeID, label: '关系' }]
        }
        this.visgraph.activeAddNodeLinks(newGraph.nodes, newGraph.links)	//在图中动态追加节点和连线
      }
      console.log(1)
      window.localStorage.setItem('newGraph', JSON.stringify(newGraph))
      console.log(newGraph)
      this.addNewNodeVisible = false
    },

    updateContent () {
      console.log(this.$refs.richTextComponent.content)
      var addContent = {//没有考虑去重
        id: this.$store.state.selectID,
        content: this.$refs.richTextComponent.content
      }
      this.addContents(addContent)
      this.$message({
        message: `成功提交节点，id为${this.$store.state.selectID}`,
        type: 'success'
      })
      this.addNodeVisible = false
      // runXXLayout("Tree", this.visgraph.getGraphData(), treeLayoutConfForm);
    },

    // 模拟读取数据的接口
    getGraphData () {
      console.log('数据加载成功')
    },
    // 将this.graphData中的数据加载 渲染
    drawGraph (visConfParm) {
      this.visgraph = new VisGraph(document.getElementById('container'), visConfParm)
      console.log(this.visgraph)
      this.visgraph.drawData(this.demoData)
      // console.log(this.demoData);


      // 上链：存储数据到localstorge
      // window.localStorage.setItem('visgraph',stringify(visgraph))

      // save to vuex
      // this.setVisGraph(visgraph.getGraphData())

      // 读取新增加的节点
      if (JSON.parse(window.localStorage.getItem('newGraph'))) {
        var newGraph = JSON.parse(window.localStorage.getItem('newGraph'))
        this.visgraph.activeAddNodeLinks(newGraph.nodes, newGraph.links)
      }

      runXXLayout("Tree", this.visgraph.getGraphData(), treeLayoutConfForm)
      // runXXLayout("Hubsize", visgraph.getGraphData(),hubsizeLayoutConfForm);

      this.visgraph.setZoom('auto')

    },
    ...mapMutations([
      'setVisGraph', 'setSelectID', 'addContents'
    ]),


    // 跳转 只能跳转已经存在的节点
    goToDetail () {
      this.$router.push('/detail')
    },

  },
  watch: {
    // graphData(newVal, oldVal) {
    //     if (oldVal != newVal) {
    //         this.drawChart()
    //     }
    // },
    // showBestPath(newVal,oldVal){
    //     this.data = newVal ? ownDemoData2 : ownDemoData1;
    //     this.visgraph.clearAll()
    //     this.drawGraph( this.firstConf)
    //     this.visgraph.setZoom('auto')
    // }
  },
  computed: {

  },
  mounted () {
    // 重写配置文件
    var that = this
    this.firstConf = visConf
    this.firstConf.node.ondblClick = function (event, node) {
      that.goToDetail()
      that.setSelectID(node.id)
    }

    this.firstConf.node.onClick = function (event, node) {
      // that.addNodeVisible = true;
      that.currentID = node.id
      that.setSelectID(node.id)
    }


    if (window.VisGraph) {
      // visgraph 已加载，你可以在这里使用它
    } else {
      console.error('visgraph 未定义')
    }

    this.drawGraph(this.firstConf)

  },
  created () {

  }
}
</script>

// <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.search-button {
  display: flex;
  width: 700px;
  border-radius: 28.618px;
}

.header {
  height: 60px;
  background-color: rgba(0, 0, 0, 0.5);
}

#container {
  /* width: 500px;可以没有这个 */
  height: 420px;
  /* 不可以100% */
  /* background-color: #42b983; */
}
</style>
