export const visConf = {
  node: {
    //节点的默认配置
    label: {
      //标签配置
      show: true, //是否显示
      color: "50,50,50", //字体颜色
      font: "30px 微软雅黑", //字体大小及类型
      wrapText: false, //节点包裹文字
      textPosition: "Middle_Center", //文字位置 Top_Center,Bottom_Center,Middle_Right
      //textOffsetX:-24,//文字横向偏移量
      //textOffsetY:-24,//文字纵向偏移量
      //backgroud:'255,255,255',//文字背景色
      //borderWidth:0,//文字边框宽度
      //borderColor:'250,250,250'//文字边框颜色
    },
    // shape: 'circle', //节点形状 circle,rect,square,ellipse,triangle,star,polygon,text
    //image:'images/T1030001.svg',//节点图标(设置后节点显示为圆形图标)
    shape: "rect",
    width: 270, //节点的长度(shape为rect生效) 看似无效
    height: 87, //节点的高度(shape为rect生效)
    color: "255,255,255", //节点颜色
    borderColor: "48,53,145", //边框颜色

    borderWidth:  10, //边框宽度,
    borderRadius: 10.935, //边框圆角大小 有效
    lineDash: [0], //边框虚线间隔,borderWidth>0时生效

    // alpha: 1, //节点透明度
    // size: 40, //节点默认大小

    selected: {
      //选中时的样式设置
      borderColor: "50,120,230", //选中时边框颜色
      borderAlpha: 1, //选中时的边框透明度
      borderWidth: 8, //选中是的边框宽度
      showShadow: false, //是否展示阴影
      shadowColor: "50,100,250", //选中是的阴影颜色
    },
    onClick: function (event, node) {
      //节点点击事件回调
    },
    ondblClick: function (event, node) {
	  

    }, //节点双击事件
    onMouseDown: function (event, node) {}, //节点的鼠标按下事件
    onMouseUp: function (event, node) {}, //节点的鼠标弹起事件
    onMouseOver: function (event, node) {}, //节点的鼠标划过事件
    onMouseOut: function (event, node) {}, //节点的鼠标划出事件
    onMousedrag: function (event, node) {}, //节点的拖拽移动事件
  },
  link: {
    //连线的默认配置
    label: {
      //连线标签
      show: false, //是否显示
      color: "50,50,50", //字体颜色
      font: "normal 12px 微软雅黑", //字体大小及类型
    },
    lineType: "direct", //连线类型,direct,curver,vlink,hlink,bezier,vbezier,hbezier
    colorType: "defined", //连线颜色类型 source:继承source颜色,target:继承target颜色 both:用双边颜色，defined:自定义
    color: "48,53,145", //连线颜色
    alpha: 0.8, // 连线透明度
    lineWidth: 6, //连线宽度
    lineDash: [0], //虚线间隔样式如：[5,8]
    showArrow: true, //显示箭头
    selected: {
      //选中时的样式设置
      color: "250,50,50", //选中时的颜色
      alpha: 1,
      showShadow: false, //是否展示阴影
      shadowColor: "250,40,30", //选中连线时的阴影颜色
    },
    onClick: function (event, link) {
      //连线点击事件回调
      console.log(
        "click link---[" + link.source.id + "-->" + link.target.id + "]"
      );
    },
    ondblClick: function (event, link) {}, //连线的双击回调事件
  },
  highLightNeiber: false, //相邻节点高度标志
  wheelZoom: 0.9, //滚轮缩放开关，不使用时不设置[0,1]
  noElementClick: function (event) {
    //画布空白处的点击事件
  },
  // rightMenu: {
  // 	nodeMenu: NodeRightMenu, //节点右键菜单配置
  // 	linkMenu: LinkRightMenu // 连线右键菜单配置
  // },
  layout: {
    //开启内置力导向布局,不配置时不启动
    // type: 'force',
    // options: {
    // 	friction: 0.9,
    // 	linkDistance: 150,
    // 	linkStrength: 0.05,
    // 	charge: -150,
    // 	gravity: 0.01,
    // 	noverlap: false
    // }
  },
};
