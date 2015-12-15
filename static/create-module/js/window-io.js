
// 初始化模块面板
function initIOPanel(){
  var con = document.createElement('div');
  
  con.innerHTML='<div class="comp-con" id="io_list"></div>'
  
  _wndIO = new mxWindow('输入输出', con, _WIN.width-280, 30, 86, 80, true, true);
  
  _wndIO.setScrollable(true);
  _wndIO.setMinimizable(true);
  _wndIO.setVisible(true);

  addIO();
  
}// initModulePanel end






// 载入元件列表，参数：页码
function addIO(){
  var i = 0,l=0,$li=null,$ul=$('#io_list');
  $ul.html('');

    $li = $('<li class="component-item" data-id="" title="模块输出"><img src="/static/create-module/img/out.png"/></li>');
    $ul.append($li);
    //~ $li.mousedown(function(){MAIN.curCmpId = $(this).data('id')});
    mxUtils.makeDraggable($li[0], _graph, insertOut, dragElt, null, null, _graph.autoscroll, true);
    $li = null;
    $li = $('<li class="component-item" data-id="" title="模块输入"><img src="/static/create-module/img/in.png"/></li>');
    
    //~ $li.mousedown(function(){MAIN.curCmpId = $(this).data('id')});
    mxUtils.makeDraggable($li[0], _graph, insertIn, dragElt, null, null, _graph.autoscroll, true);
$ul.append($li);

}


function insertOut(graph_, evt_, target_, x, y){
    var sxml = '<mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="2" value="in" style="shape=image;image=/static/create-module/img/bg_in.png;verticalLabelPosition=bottom;verticalAlign=middle" vertex="1" connectable="0" parent="1" thutype="io"><mxGeometry y="100" width="64" height="64" as="geometry"/></mxCell><mxCell id="3" pintype="modout" value="" style="port;image=/static/component/img/dot.png;align=center;fontColor=blue;spacingTop=15" vertex="1" parent="2" pinn="0"><mxGeometry width="8" height="8" relative="1" as="geometry"><mxPoint x="-3" y="27" as="offset"/></mxGeometry></mxCell></root></mxGraphModel>';

var doc = mxUtils.parseXml(sxml);
var model = new mxGraphModel();
var codec = new mxCodec( doc );
  codec.decode(doc.documentElement, model);
var children = model.getChildren(model.getChildAt(model.getRoot(), 0));
      children[0].geometry.x=0;
      children[0].geometry.y=0;
      

    var i = objCount(_IO['output']);
   //~ var  i = _IO['input'].length;
    i++;
  //~ if('undefined' == typeof( _IO['input'] ) ){
    //~ _IO['input'] = 0;
  //~ }
  //~ _IO['input']++;
  //~ _OutPut
  var symt = 'out-'+i;
      children[0].setValue(symt);
  var xx = graph_.importCells(children,x,y,target_);
      _IO['output'][symt] = { 'id':xx[0]['id'],'tgmod':'','tgpin':'' };
}

function insertIn(graph_, evt_, target_, x, y){
    var sxml = '<mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="2" value="out" style="shape=image;image=/static/create-module/img/bg_in.png;verticalLabelPosition=bottom;verticalAlign=middle" vertex="1" connectable="0" parent="1" thutype="io"><mxGeometry y="160" width="64" height="64" as="geometry"/></mxCell><mxCell id="3" pintype="modout" value="" style="port;image=/static/component/img/dot.png;align=center;fontColor=blue;spacingTop=15" vertex="1" parent="2" pinn="0"><mxGeometry width="8" height="8" relative="1" as="geometry"><mxPoint x="59" y="27" as="offset"/></mxGeometry></mxCell></root></mxGraphModel>';

var doc = mxUtils.parseXml(sxml);
var model = new mxGraphModel();
var codec = new mxCodec( doc );
  codec.decode(doc.documentElement, model);
var children = model.getChildren(model.getChildAt(model.getRoot(), 0));
      children[0].geometry.x=0;
      children[0].geometry.y=0;
      

  var i = objCount(_IO['input']);i++;
  var symt = 'in-'+i;
      children[0].setValue(symt);
  var xx = graph_.importCells(children,x,y,target_);
      _IO['input'][symt] = { 'id':xx[0]['id'] };
}
