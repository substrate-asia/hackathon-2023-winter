<template>
  <div class="hello">
    <el-row class="header">
      <el-col :span="8">
        <el-image style="width: 65px; height: 65px" :src="require('@/assets/logo.jpg')"></el-image>
      </el-col>
    </el-row>
    <div id="myChart">
      chart
    </div>


  </div>
</template>

<script>

import * as echarts from 'echarts';
import { chartData1,chartData2,chartOption1,chartOption2} from '@/assets/data.js';

export default { //这个是一个Vue对象
  name: 'FirstPage',
  props: {
    msg: String
  },
  components: {
    // VChart,
  },
  data() {
    return {
      chartData: null,
    }
  },
  methods: {
    // 模拟读取数据的接口
    getChartData() {
      this.chartData = chartData2
      console.log('数据读取成功');
    },
    // 将this.chartData中的数据加载
    drawChart() {
      let myChart = echarts.init(document.getElementById('myChart'), null)

      // 绘制图表
      chartOption2.series[1].data.push(this.chartData)
      var chartOption = chartOption2
      myChart.setOption(chartOption)
      // myChart.setOption(this.chartOption)

    }
  },
  watch: {
    chartData(newVal, oldVal) {
      if (oldVal != newVal) {
        this.drawChart()
      }
    }
  },
  // computed: {
  //   chartDataActivate() {
  //     console.log("activate");
  //     return this.chartOption.series[0].data = [this.chartData];
  //   }
  // },
  mounted() {
    this.getChartData()// 加载数据 触发watch 触发其中drawChart函数
    // this.drawChartFirst();
  },
  created() {
  }
}
</script>

// <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.header {
  height: 60px;
  background-color: rgba(0, 0, 0, .5);
}

#myChart {
  /* width: 500px;可以没有这个 */
  height: 550px;
  /* 不可以100% */
  /* background-color: #42b983; */
}
</style>
