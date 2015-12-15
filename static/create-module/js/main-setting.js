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


/*******************   主要的  windows  *******************/
// 元件面板，模块面板，信息面板
var _wndComp={};
var _wndModule={};
var _wndIO={};

// 系统信息网面板
var _wndInfo={},_wndInfoCon=document.createElement('div');

// 仿真结果窗口
var _wndChart={},_wndChartCon=document.createElement('div');
    _wndChartCon.id='id_chart';
// 搜索结果窗口
var _wndSResult={};
// 保存仿真的对话框
var _wndSave={};
// 元件参数设定窗口
var _wndEleParam={},_wndEleParamCon=document.createElement('div');
    _wndEleParamCon.id="id_eparam",
    _wndEleParamCon.className='paramPrompt';
// 模块详情查看对话框
var _wndModProfile={};

/*************************************/
// 拖拽的显示元素
var dragElt = document.createElement('div');
    dragElt.style.border = 'dashed black 1px';
    dragElt.style.width = '64px';
    dragElt.style.height = '64px';
    dragElt.style.backgroundSize = 'cover';

// 仿真参数
var _simuParam={};


// 插入元件的处理函数
//~ var insertComp=null;

// 全局websocket 对象
var WebSck=null;
// highcharts
var Charts ={};

mxGuide.prototype.isEnabledForEvent = function(evt){
  return !mxEvent.isAltDown(evt);
};

// 记录IO输入输出
var _IO={'input':{},'output':{} },_OutPut={};
// 电气元件符号记录列表
var _pssEle={},_pssEleCount={};
// 控制元件记录
var _pssCtrl={},_pssCtrlCount={};
// 量测元件的记录
var _pssMsr={},_pssMsrCount={};
// 模块的记录
var _pssMod={},_pssModCount={};
var _pssModId=[],_rpssModId=[];// 记录插入的模块id
// 在提交仿真时的元件记录，_pssEle记录的不删除，
var _rpssEle={},_rpssCtrl={},_rpssMsr={},_rpssMod={};
//~ var _npssEle={},_npssCtrl={},_npssMsr={};


var _pssNode = [],_npssNode={};//电气元件的节点数组，默认0的是接地
var _pssNodeCtrl = [[]],_npssNodeCtrl=[];//控制系统的节点数组，节点号从1开始
var _pssNodeMsr = [],_npssNodeMsr=[];//量测系统的节点数组
var _pssGndTMp = [];
// 仿真的参数

// 在生成模块信息中
var doing = false;

var _modParam={
  "_isSet":false,// 用户是否设置过参数
  "name":'',
  "icon":'',
  "sym":'',
  "desc":''
};
