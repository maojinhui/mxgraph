/*
 * 系统的设置，全局参数等在这里
 * */


var _WIN={
  'width':0,
  'height':0
};

var _container = document.getElementById('mainEditor');

// 主编辑器对象
var _editor = {};
var _graph = {};

// 元素面板，元件信息面板
var _compPanel={};
var _profilePanel={},_proCon=document.createElement('div');

// 系统信息网面板
var _infoPanel={},_infoCon=document.createElement('div');

// 主骨架
var mainC = null;
var dotNum = 1;// 连接点数量
var msrout = false;// 量测输出

var component={
  'bg':'',
  'icon':''
  }
// 拖拽的显示元素
var dragElt = document.createElement('div');
    dragElt.style.border = 'dashed #4D4D4D 1px';
    dragElt.style.width = '64px';
    dragElt.style.height = '64px';
    dragElt.style.backgroundSize='100%';
    dragElt.style.backgroundPosition='center';
    dragElt.style.backgroundRpeat='no-repeat';
//~ dragElt.style.backgroundImage='url(/static/component/img/bg.png)';



mxGuide.prototype.isEnabledForEvent = function(evt){
  return !mxEvent.isAltDown(evt);
};


//  编辑器的样式参数
var MAIN={
  'joinNode':4,
  'strokeWidth':2,
  
  'curCMPId':0 //当前元件的id
};

// 元件的参数
var eleParam={
  "id":0,//元件的id，数据库里的PK
  "type": 0,//元件的类型，数字，兼容旧类型
  "thutype":"ele",//元件的类型，表明这是电气元件
  "typename": "电感",//元件的名称，供人读
  "sym":"L",//元件的符号
  "msroutput":"Ia",//是否输出一个量作为测量元件的输入，默认是空
  "param": [//元件的参数
      {
          "label": "电感量",//参数名称
          "unit": "mH",//参数的单位
          "value": 10//默认或者更改过后的值
      },
      {
          "label": "其它参数",
          "unit": "XX",
          "value": 123
      }
  ],
  "pin": {//元件的引脚，引脚对节点号的形式，默认情况是 -1
      "0":12,
      "1":98
  }
};

// 旧元件的数字对照表
var eleTypeTbl=[
  {
    "name":"电阻",
    "type":1
  },
  {
    "name":"电感",
    "type":2
  },
  {
    "name":"电容",
    "type":3
  },
  {
    "name":"单相电源",
    "type":4
  },
  {
    "name":"二极管",
    "type":7
  },
  {
    "name":"单相短路元件",
    "type":1
  }

];



