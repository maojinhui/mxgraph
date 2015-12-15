/*
 * 系统的设置，全局参数等在这里
 * */

var _WIN={
  'width':0,
  'height':0,
  'wl':0,//窗口停靠左侧的数量
  'wr':0,//窗口停靠右侧的数量
  'wt':0,//窗口停靠上部的数量
  'wb':0//窗口停靠下部的数量
};
var _task_id = 0;
var _simuFile_ = ''

var _container = document.getElementById('mainEditor');

// 主编辑器对象
var _editor = {};
var _graph = {};
var _modEditor={},_modgraph = {};

/*******************   主要的  windows  *******************/

// 各窗口的位置大小记录，初始参数放到cloudpss initParam里完成
var _wndRestore={};
// 元件面板，模块面板，信息面板

// 窗口的数组对象，需要加入窗口管理器的窗口列表
var _wndList={
 Comp:{},
 Module:{},
 //Msr:{},
 //Ctrl:{},
 //UserModule:{},
 Outline:{},
 wInfo:{},
 Ctrl:{},
 Msr:{}
};
/*
var _wndComp={};
var _wndModule={};
var _wndMsr={};
var _wndCtrl={};
var _wndUserModule={};
var _wndOutline={};
*/
// 系统信息网面板
//~ var _wndInfo={},
var _wndInfoCon=document.createElement('div');

// 仿真结果窗口
var _wndChart={},_wndChartCon=document.createElement('div');
    _wndChartCon.id='id_chart';
// 搜索结果窗口
var _wndSResult={};
// 保存仿真的对话框
var _wndSave=null;
// 元件参数设定窗口
var _wndEleParam={},_wndEleParamCon=document.createElement('div');
    _wndEleParamCon.id="id_eparam",
    _wndEleParamCon.className='paramPrompt';
// 模块详情查看对话框
var _wndModProfile={},_wndModProfileCon=document.createElement('div');
    //~ _wndModProfileCon.id='id_modprofile',
    _wndModProfileCon.style.height='100%';



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
var WebSck=null,
WebSckUrl='ws://115.28.80.125:8004/';
//~ WebSckUrl='ws://127.0.0.1:8004/';
// 绘图记录对象
var Charts =[];

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
var _pssMod={},_rpssMod=[],_pssModCount={};
var _pssModId=[],_rpssModId=[];// 记录插入的模块id

// 在提交仿真时的元件记录，_pssEle记录的不删除，
var _rpssEle={},_rpssCtrl={},_rpssMsr={},_rpssMod;
//~ var _npssEle={},_npssCtrl={},_npssMsr={};


var _pssNode = [],_npssNode={};//电气元件的节点数组，默认0的是接地
var _pssNodeCtrl = [[]],_npssNodeCtrl=[];//控制系统的节点数组，节点号从1开始
var _pssNodeMsr = [],_npssNodeMsr=[];//量测系统的节点数组
var _pssGndTMp = [];
// 需要显示的电表
var _pssMeters = {};
// 模块被点击的记录
// [ {} ] [ 'mod1','mod2']
var _pssModRec=[];
// 仿真的参数

var modnames = [];

var _simuPARAM={
  "_isSet":false,// 用户是否设置过参数
  "start":0,//仿真开始时间，单位：秒
  "end":0,//仿真结束时间，单位：秒
  "step":0,//步长，单位：秒
  "switch":0,//开关周期，单位：秒
  "breakPoint":[]//断点处,断点的数组列表
};
// 仿真的非电气属性
var _simuProp={
    'name':'',
    'folder':'',
    'simuno':'',
    'desc':'',
    'share':1
};

// 当前被双击的module
var _curModId = null,_curModSym='';
