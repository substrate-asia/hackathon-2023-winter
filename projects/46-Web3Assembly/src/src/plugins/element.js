import Vue from 'vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { ElementTiptapPlugin } from 'element-tiptap';
// 引入 ElementUI 样式
import 'element-ui/lib/theme-chalk/index.css';
// import element-tiptap 样式
import 'element-tiptap/lib/index.css';

Vue.use(Element)
// 安装 element-tiptap 插件
Vue.use(ElementTiptapPlugin, {
  /* 插件配置项 */
});

