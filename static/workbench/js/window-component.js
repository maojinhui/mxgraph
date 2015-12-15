
// 初始化元件面板
function initEleCompPanel(){
  //var con = document.createElement('div');

  var con = $('<div class="comp-con">');
  /*con.append('<div style="text-align:center;"><input type="text" class="" onchange="showCMPSearch()"/></div>\
    <span class="pagi" title="上一页">⇦</span>\
    <span class="pagi" title="下一页">⇨</span>');*/
  
  var $ul = $('<ul class="list" id="id_complist">');
  var $html = null;


  con.append($ul);
  _wndList.Comp = new mxWindow('电气系统', con[0], 10, 45, 125, _WIN.height-100, true, true);

// 窗口原始尺寸记录
  _wndList.Comp.w=150;
  _wndList.Comp.h=_WIN.height-100;
  _wndList.Comp.dir=0; //窗口的方向：0正常，1：左，2：右，3：上，4：下


  loadComponentList(1)
  _wndList.Comp.setMinimizable(true);
  _wndList.Comp.setScrollable(true);
  _wndList.Comp.setVisible(true);
  _wndList.Comp.setScrollable(true);


  $('#id_complist').on('mousedown','.component-item',function(e){
    var bg=$(this).find('img').attr('src');
    setDragElt(64,64,bg);
  });

}// initEleCompPanel end



/*
 *
 * 拖拽插入元件的处理
 * */

function insertComp(graph_, evt_, target_, x, y){

  var doc1 = getCompById(MAIN.curCmpId);
  if( doc1 == false ){// 获取元件出错
    return;
  }
  var doc = mxUtils.parseXml(doc1["ele"].shape);
  var model = new mxGraphModel();
  var codec = new mxCodec( doc );
      codec.decode(doc.documentElement, model);

  var children = model.getChildren(model.getChildAt(model.getRoot(), 0));
      children[0].geometry.x=0;
      children[0].geometry.y=0;

  var sym = doc1.sym;
  if('undefined' == typeof( _pssEleCount[sym] ) ){
    _pssEleCount[sym] = 0;
  }
  _pssEleCount[sym]++;

  var symt = sym+'-'+_pssEleCount[sym];
  children[0].setValue(symt);
  var xx = graph_.importCells(children,x,y,target_);


  if(_pssEle instanceof Array) _pssEle ={};
  if(_pssCtrl instanceof Array) _pssCtrl={};

  switch(children[0].thutype){
    //~ case "ele":_pssEle[symt] = (doc1["ele"]["param"]);break;
    case "ele":;
    case "gnd":_pssEle[symt] = (doc1["ele"]["param"]);break;
  /*
  //插入的参数，在后面节点生成时加入
    case "Ia":thuIa[sym+' - '+thuCompC[sym]] = JSON.parse(doc1[0].default_param);break;//支路电流
    case "pE":thupE[sym+' - '+thuCompC[sym]] = JSON.parse(doc1[0].default_param);break;//节点电压
    case "E":thuE[sym+' - '+thuCompC[sym]] = JSON.parse(doc1[0].default_param);break;//支路电压
  */
    case "msr":; //量测元件 。 全部记录入一个对象里
    case "pEm":; //节点电压表（测量两个节点，两个引脚）
    case "nEm":; //对地电压表（测量对地节点的电压，只有一个引脚）
    case "Im":_pssMsr[symt] = (doc1["ele"]["param"]);break; //支路电流表（物理上是串联进电路，在本系统中作为一个节点接入，类似探针）
    case "ctrl":_pssCtrl[symt] = (doc1["ele"]["param"]);break;
    //~ case "mod":setModParam();break; // 模块的不在这里处理

  }
/*
  function setModParam(){
    if(thuMod instanceof Array) thuMod = {};
    if(thuModComp instanceof Array ) thuModComp = {};
    if(thuModCtrl instanceof Array) thuModCtrl = {};
    if(thuModMsr instanceof Array) thuMod = {};
    thuMod[sym+' - '+thuCompC[sym]]={'id':doc1[0].id};
    thuModComp[sym+' - '+thuCompC[sym]]=JSON.parse(doc1[0].modComp);
    thuModCtrl[sym+' - '+thuCompC[sym]]=JSON.parse(doc1[0].modCtrl);
    thuModMsr[sym+' - '+thuCompC[sym]]=JSON.parse(doc1[0].modMsr);
  }
*/
};


// 显示搜索结果
function showCMPSearch(){
  $.get(
    '/editor/searchCompnent/?q='+q,
    function(re,status,jxhr){

    },'json'
  );
}
