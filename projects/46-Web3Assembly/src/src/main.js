import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './plugins/element.js'

Vue.config.productionTip = false

import echarts from "echarts";
Vue.prototype.$echarts = echarts; //全局引入echarts


new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
