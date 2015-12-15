
// 初始化元件面板
function initEleCompPanel(){
  //var con = document.createElement('div');
  
  var con = $('<div class="comp-con">');
  /*con.append('<div style="text-align:center;"><input type="text" onchange="showCMPSearch()"/></div>\
    <span class="pagi" title="上一页">⇦</span>\
    <span class="pagi" title="下一页">⇨</span>');*/
  var $ul = $('<ul class="list">');
  var $html = null;
  var i=1;


    $html =$('<li class="component-item" data-w="64" data-h="64" data-bg="/static/component/img/bg.png" title="添加背景骨架"><img src="/static/component/img/bg.png"/></li>');
    $ul.append($html);
    mxUtils.makeDraggable($html[0], _graph, addBg, dragElt, null, null, _graph.autoscroll, true);

    $html =$('<li class="component-item" data-w="32" data-h="10" data-bg="/static/component/img/icon_lineh.png" title="添加横向连接线"><img src="/static/component/img/icon_lineh.png"/></li>');
    $ul.append($html);
    mxUtils.makeDraggable($html[0], _graph, addLineH, dragElt, null, null, _graph.autoscroll, true);

    $html =$('<li class="component-item" data-w="10" data-h="32" data-bg="/static/component/img/icon_linev.png" title="添加竖向连接线"><img src="/static/component/img/icon_linev.png"/></li>');
    $ul.append($html);
    mxUtils.makeDraggable($html[0], _graph, addLineV, dragElt, null, null, _graph.autoscroll, true);

    $html =$('<li class="component-item" data-w="20" data-h="20" data-bg="/static/component/img/icon_port.png" title="添加连接点"><img src="/static/component/img/icon_port.png"/></li>');
    $ul.append($html);
    mxUtils.makeDraggable($html[0], _graph, addPort, dragElt, null, null, _graph.autoscroll, true);

    $html =$('<li class="component-item" data-w="10" data-h="10" data-bg="/static/component/img/probe.png" title="添加量测输出点"><img src="/static/component/img/icon_probe.png"/></li>');
    $ul.append($html);
    mxUtils.makeDraggable($html[0], _graph, addProbe, dragElt, null, null, _graph.autoscroll, true);

  con.append($ul);

  _compPanel = new mxWindow('元素选择', con[0], 10, 50, 93, 300, true, true);


  _compPanel.setMinimizable(true);
  _compPanel.setScrollable(true);
  _compPanel.setVisible(true);
  _compPanel.setScrollable(true);

  $('.list').on('mousedown','.component-item',function(e){
    var w = $(this).data('w'),h = $(this).data('h'),bg=$(this).data('bg');
    //~ var bg = $(this).children('img').attr('src');
    //console.log('w is',w,';h is',h,';bg is',bg);
    setDragElt(w,h,bg);
  });

}// initEleCompPanel end



/*
 * 
 * 拖拽插入元件的处理
 * */

var addBg = function(graphT, evt, target, x, y){
  if(mainC != null){
    setSysInfo('info','已经有主骨架了');
    alert('已经有主骨架了');
    return;
  }

  var parent = graphT.getDefaultParent();

  var model = graphT.getModel();
graphT.setCellsResizable(true);
  var v1 = null;
  model.beginUpdate();
  try
  {
    v1  = graphT.insertVertex(parent, null, '元件符号', x, y, 64, 64,"verticalLabelPosition=bottom;verticalAlign=middle");
    v1.setConnectable(false);
  }
  finally
  {
    model.endUpdate();
  }
  v1.thutype='ele';
  mainC = v1;
  graphT.setSelectionCell(v1);
  resetDragElt();
}

var addLineV = function(graphT, evt, target, x, y){
  if(mainC == null){
    setSysInfo('warning','请先添加主骨架');
    alert('请先添加主骨架');
    return;
  }
  
  var parent = graphT.getDefaultParent();
  var model = graphT.getModel();
  var v1 = null;
  model.beginUpdate();
  try
  {
    v1  = graphT.insertVertex(parent, null, '', x, y, 2, 20,'shape=line;verticalAlign=middle;direction=north;fillColor=white;fontColor=blue;spacingBottom=20');
    v1.setConnectable(false);
  }
  finally
  {
    model.endUpdate();
  }
  //v1.parent=mainC;
  graphT.setSelectionCell(v1);
  resetDragElt();
}

var addLineH = function(graphT, evt, target, x, y){
  if(mainC == null){
    setSysInfo('warning','请先添加主骨架');
    alert('请先添加主骨架');
    return;
  }
  var parent = graphT.getDefaultParent();
  var model = graphT.getModel();

  var v1 = null;
  model.beginUpdate();
  try
  {
    v1  = graphT.insertVertex(parent, null, '', x, y, 20, 2,'shape=line;verticalAlign=middle;direction=west;fillColor=white;fontColor=blue;spacingBottom=20');
    v1.setConnectable(false);
  }
  finally
  {
    model.endUpdate();
  }
  //v1.parent = mainC;
  graphT.setSelectionCell(v1);
  resetDragElt();
}

var addPort = function(graphT, evt, target, x, y){
  if(mainC == null){
    setSysInfo('warning','请先添加主骨架');
    alert('请先添加主骨架');
    return;
  }
  var parent = graphT.getDefaultParent();
  var model = graphT.getModel();

  var v1 = null;
  model.beginUpdate();
  try{
    v1  = graphT.insertVertex(parent, null, dotNum, x, y, 5, 5,"port;image=/static/component/img/dot.png;align=center;fontColor=blue;spacingTop=15");
  }finally{
    model.endUpdate();
  }
  dotNum ++;
  v1.pinn=''
  //v1.parent=mainC;
  graphT.setSelectionCell(v1);
  resetDragElt();
}

var addProbe = function(graphT, evt, target, x, y){
  if(mainC == null){
    setSysInfo('warning','请先添加主骨架');
    alert('请先添加主骨架');
    return;
  }
  if(msrout){
    setSysInfo('warning','已经有一个量测输出点了，请勿重复添加');
    alert('已经有一个量测输出点了，请勿重复添加');
    return;
  }
  var parent = graphT.getDefaultParent();
  var model = graphT.getModel();

  var v1 = null;
  model.beginUpdate();
  try{
    v1  = graphT.insertVertex(parent, null, '量测输出点', x, y, 5, 5,"port;image=/static/component/img/probe.png;align=center;fontColor=blue;spacingTop=15");
  }finally{
    model.endUpdate();
  }
  v1.msrout='';
  //v1.pinn=''
  //v1.parent=mainC;
  graphT.setSelectionCell(v1);
  resetDragElt();
}
