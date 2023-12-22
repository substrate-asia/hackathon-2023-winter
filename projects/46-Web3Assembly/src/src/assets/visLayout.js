function getLayoutConf(layout) {
  //2、获取布局算法的参数配置项
  var configs = layout.getConfig();

  //3、查看布局算法参数配置项,可以重置参数
  configs.forEach(function (config) {
    console.log(config); //打印每一个参数，查看参数名及参数key
    for (var param in config) {
      if (param == "label") {
      } else {
        var paramValue = config[param];
        console.log(paramValue);

        //如果是参数项支持多值，那需要选中其中之一设置
        if (paramValue instanceof Array) {
          paramValue.forEach(function (option) {});
        }
      }
    }
  });
}

function runFastFRLayout(graphData, layoutConf = null) {
  var fastLayout = new LayoutFactory(graphData).createLayout("fastFR");
  fastLayout.initAlgo(); //初始化布局算法
  fastLayout.resetConfig(layoutConf); //设置布局算法参数
  var runLoopNum = 0;
  while (runLoopNum++ < 100) {
    fastLayout.runLayout(); //执行布局计算
  }
  return fastLayout;
}

function runTreeLayout(graphData, layoutConf = null) {
  var treeLayout = new LayoutFactory(graphData).createLayout("tree");
  treeLayout.boolTransition = false; //关闭布局动画

  treeLayout.resetConfig(layoutConf);
  treeLayout.runLayout(); //运行布局算法
  return treeLayout;
}

function runRadiatreeLayout(graphData, layoutConf = null) {
  var layout = new LayoutFactory(graphData).createLayout("radiatree");
  layout.boolTransition = false; //关闭布局动画
  layout.resetConfig(layoutConf);
  layout.runLayout(); //运行布局算法
  return layout;
}

function runKkLayout(graphData, layoutConf = null) {
  var layout = new LayoutFactory(graphData).createLayout("kk");
  layout.resetConfig(layoutConf);
  var runLoopNum = 0;
  while (runLoopNum++ < 100) {
    layout.runLayout(); //执行布局计算
  }
  return layout;
}

function runFrDirectLayout(graphData, layoutConf = null) {
  var layout = new LayoutFactory(graphData).createLayout("frDirect");
  layout.initAlgo(); //初始化布局算法
  layout.resetConfig(layoutConf); //设置布局算法参数
  var runLoopNum = 0;
  while (runLoopNum++ < 50) {
    layout.runLayout(); //执行布局计算
  }
  return layout;
}

function runConcentricLayout(graphData, layoutConf = null) {
  var layout = new LayoutFactory(graphData).createLayout("concentric");
  layout.boolTransition = false;
  layout.resetConfig(layoutConf);
  layout.runLayout(); //执行布局计算
  return layout;
}

function runHubsizeLayout(graphData, layoutConf = null) {
  var layout = new LayoutFactory(graphData).createLayout("hubsize");
  layout.boolTransition = false; //关闭布局动画
  layout.resetConfig(layoutConf);
  layout.runLayout(); //运行布局算法
  return layout;
}

// 总的一个布局函数，用了eval方法，注意layoutName需要首字母
function runXXLayout(layoutName, graphData, layoutConf = null) {
  console.log(layoutName);
  var func = eval(`run${layoutName}Layout`);
  return func(graphData, layoutConf);
}

var treeLayoutConf = [
  {
    label: "点间距",
    distX: 80,
  },
  {
    label: "层间距",
    distY: 120,
  },
  {
    label: "排列方向",
    direction: [
      {
        label: "上下",
        value: "UD",
      },
      {
        label: "下上",
        value: "DU",
      },
      {
        label: "左右",
        value: "LR",
      },
      {
        label: "右左",
        value: "RL",
      },
    ],
  },
];

var treeLayoutConfForm = {
    'distX':150,
    'distY':380,
    'direction':"LR"
}

var hubsizeLayoutConfForm = {
    layerDistance:100,
    nodeDistance:200,
    sortMethod:"directed",
    direction:"LR"
}

export { runXXLayout,treeLayoutConfForm,hubsizeLayoutConfForm};


var hubsizeLayoutConf = [
    {
        "label": "层间距",
        "layerDistance": 100
    },
    {
        "label": "点间距",
        "nodeDistance": 100
    },
    {
        "label": "排列方式",
        "sortMethod": [
            {
                "label": "连线方向",
                "value": "directed"
            },
            {
                "label": "度大小",
                "value": "hubsize"
            },
            {
                "label": "指定点",
                "value": "selected"
            }
        ]
    },
    {
        "label": "排列方向",
        "direction": [
            {
                "label": "上下",
                "value": "UD"
            },
            {
                "label": "下上",
                "value": "DU"
            },
            {
                "label": "左右",
                "value": "LR"
            },
            {
                "label": "右左",
                "value": "RL"
            }
        ]
    }
]