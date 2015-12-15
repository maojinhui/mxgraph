

// ************初始化各项参数 **************
function iniParam(){
  _WIN.width =  document.body.clientWidth || document.documentElement.clientWidth;
  _WIN.height =  document.body.clientHeight || document.documentElement.clientHeight;

    // 各窗口的位置大小记录
    _wndRestore={
        'comp':{'w':155,'h':_WIN.height-80},//电气元件的初始参数
        'mod':{},//
    };
}// iniParam end



function startSimu(){


_rpssEle={};
_rpssCtrl={};
_rpssMsr={};
_rpssMod={};
    //~ return;
  //~ _wndChart.show();
  if( _simuPARAM["_isSet"] == false ){
      alert('您还没设置仿真参数，请先设置仿真参数');
      _simuParam.show();return false
    }

  var vts = _graph.getChildVertices();
  var edges = _graph.getChildEdges();
  var vl=vts.length,el=edges.length;

  if(vl < 1){alert('这是乎是一个空的仿真，请先建立仿真模型后再开始');return false;}

  var existV = [];
  for(var i = 0;i<vl;i++){
    existV.push(vts[i].value)
  }
// clear component start
//除一些元件的数据记录，例如用户删除了某个元件，但是其元件记录还在，没有一在删除时删掉其记录，为了避免用户回退时出现问题
  // clear ele
  for(var x in _pssEle){
    if(existV.indexOf(x) >= 0)
      _rpssEle[x] = _pssEle[x]; // 这种方式没关系，因为_pssEle和 _rpssEle里的元素基本不发生删减
  }

// clear ctrl
  for(var x in _pssCtrl){
    if(existV.indexOf(x) >= 0){
      _rpssCtrl[x] = _pssCtrl[x];
    }
  }
console.log( 'after clear',_rpssCtrl );
// clear msr
  for(var x in _pssMsr){
    if(existV.indexOf(x) >= 0)
      _rpssMsr[x] = _pssMsr[x];
  }
// clear Mod
_rpssModId = [];
_rpssMod =[];
modnames = [];
  for(var x in _pssMod){
      //~ console.log( '.-mod.',existV.indexOf(x));
    if(existV.indexOf(x) >= 0){
      _rpssModId.push( _pssMod[x]['id'] );
      _rpssMod.push( _pssMod[x] );
      modnames.push( x );
    }
  }
// clear Edge 连线没多大影响，没有任何连接的连线就直接删了

  //if(edgs.length < 1) 可能全部都写在引脚上
  for(var i =0 ;i<el;i++){
    if( (edges[i].edges == null ) && (edges[i].source  == null || edges[i].target == null) ){
      _graph.removeCells([edges[i]]);
    }
  }
  _graph.refresh();// 刷新显示

  _pssNode = [];//电气元件的节点数组，默认0的是接地
  _pssNodeCtrl = [[]];//控制系统的节点数组，节点号从1开始
  _pssNodeMsr = [];//量测系统的节点数组
  _pssGndTMp = [];
  _pssMeters = {};

  genNodeEdge();//连线的节点，已分开控制系统，量测系统仍然在里面，已将地节点写入 thuGndTMp
  genNodeLabel();//用户定义的节点标识，已分开控制系统，量测系统仍然在里面



  //  ---刷新一遍有连接的元件的引脚id
  var _model = _graph.getModel();
  var ioEleNode={},ioCtrlNode={},_modNodeId={};
  var delNode=[]; // 记录将来要删掉的io口所在节点

  var n = '',tmpv=null,pin1=0,j=0,p=null;

  // 电气元件的
  for(var i = 0;i<_pssNode.length;i++){// for 1
    for(j=0;j<_pssNode[i].length;j++){//for 2
      p = _model.getCell( _pssNode[i][j] ).parent;
      n = p.value;
      pin1 = _model.getCell( _pssNode[i][j] ).pinn >> 0;

     if( p.thutype == 'io' ){
          // 纯元件对应io口所在的节点删掉，没有节点号。
          delNode.push(i);
          ioEleNode[n] = _pssNode[i]; //将接在io口上的引脚id记录，这里只有ele的
          //~ console.log( 'is io ',p.value )
          //~ _rpssEle[n]["pin"][pin1]["id"] = p.value;
          continue;
      }
      if( p.thutype == 'mod' ){
          // 纯元件对应io口所在的节点删掉，没有节点号。
          //~ delNode.push(i);
          var mm = _model.getCell( _pssNode[i][j] ).value;
          if( typeof( _modNodeId[n] ) != 'object' ) _modNodeId[n] = {};
          //~ _modNodeId[n][mm] = _pssNode[i][j]; //将模块的引脚dom id记录
          _modNodeId[n][mm] = i; //将模块的引脚dom id记录
          continue;
      }

      // 电气元件
      if( typeof( _rpssEle[n] ) != 'undefined' && _rpssEle[n]['thutype'] == 'ele' ){
          _rpssEle[n]["pin"][pin1]["id"] = _pssNode[i][j];
          continue;
      }
      // 量测元件(量测元件的单独了)
      if( typeof( _rpssMsr[n] ) != 'undefined' && _rpssMsr[n]['thutype'] == 'msr' ){
          _rpssMsr[n]["pin"][pin1]["id"] = _pssNode[i][j];
          continue;
      }
    }// for 2 end
  }// for 1 end
  // 控制元件的
  n = '',pin1=0,j=0;
  for(var i = 0;i<_pssNodeCtrl.length;i++){
    for(j=0;j<_pssNodeCtrl[i].length;j++){
      n = _model.getCell( _pssNodeCtrl[i][j] ).parent.value;
      pin1 = _model.getCell( _pssNodeCtrl[i][j] ).pinn >> 0;
      if( typeof( _rpssCtrl[n] ) == 'undefined' ) continue;
      _rpssCtrl[n]["pin"][pin1]["id"] = _pssNodeCtrl[i][j];
    }
  }
/*
  // 量测元件的
  n = '',pin1=0,j=0;
  for(var i = 0;i<_pssNodeMsr.length;i++){
    for(j=0;j<_pssNodeMsr[i].length;j++){
      n = _model.getCell( _pssNodeMsr[i][j] ).parent.value;
      pin1 = _model.getCell( _pssNodeMsr[i][j] ).pinn >> 0;
      if( typeof( _rpssMsr[n] ) == 'undefined' ) continue;
      _rpssMsr[n]["pin"][pin1]["id"] = _pssNodeMsr[i][j];
    }
  }
*/
  /* ----  模块 内容开始  ---- */

for(var x in _pssMod){
    // 加入child 嵌套，不unique操作
    _rpssModId.push( _pssMod[x]['child'] );

}
 _rpssModId = _.flatten( _rpssModId ); // [ 1,2,[3,4]] => [1,2,3,4],记录全部的子模块

console.log('before--',ioEleNode);
 genModIO(ioEleNode);//写入与mod连接的io口的相关信息
console.log('after--',ioEleNode);
 console.log('------------信息生成完成-----------------');

//~ genMsrNode(_pssNodeMsr); //量测元件的节点
//
for( var x in _rpssMsr ){
    if( _rpssMsr[x]['type'] == 200 ){
        // 支路电压，注：类型编号将来可能会变更
        

    }
}

genMsrRelation(); //处理量测元件的测量口

genCtrlNode(_pssNodeCtrl);//控制元件节点

//~ genMeterNode(); //处理电表的节点号
//处理电表，电表比较少，就前端直接处理了
console.log('处理前',_pssMeters);
for(var x in _pssMeters){ // 处理电表 for
    if( _pssMeters[x]['type'] == 'Im' ) continue;//支路电流表不作处理
    if( _pssMeters[x]['type'] == 'nEm' ){
        for(var i=0;i<_pssNode;i++){
            if( _pssNode[i].indeOf(_pssMeters[x]['type']['pin1']) > -1 ){
                _pssMeters[x]['pin1'] = i;
            }
        }
        continue;
    }// end nEm
    if( _pssMeters[x]['type'] == 'pEm' ){

        for(var i=0;i<_pssNode.length;i++){
             //~ console.log('判断',_pssNode[i],_pssMeters[x]);

            if( _pssNode[i].indexOf( _pssMeters[x]['pin1'] ) > -1 ){
                console.log('pin1',i);
                _pssMeters[x]['pin1'] = i;
                _pssMeters[x]['target'] ++;

            }
            //~ console.log(_pssMeters[x]['pin2'],'>>...');
            //~ console.log(_pssNode[i].indexOf( _pssMeters[x]['pin2']>>0 ),'.....');
            if( _pssNode[i].indexOf( _pssMeters[x]['pin2'] ) > -1 ){
                console.log('pin2',i);
                _pssMeters[x]['pin2'] = i;
                _pssMeters[x]['target'] ++;
            }
        }
    }// end pEm
}// 处理电表 for end
//~ for( var x in _pssMeters ){
    //~ if( _pssMeters[x]['type'] == 'pEm' && _pssMeters[x]['target'] != 2){
        //~ alert('节点电压表不能');
        //~ return;
    //~ }
//~ }
console.log('处理后',_pssMeters);
// 向服务器传数据，生成算例文件
var csrf = $('input[name="csrfmiddlewaretoken"]').val();
    $.post(
        '/editor/genSimulationFile/',
        {
            "csrfmiddlewaretoken":csrf,
            "simuParam":JSON.stringify(_simuPARAM),

            "pssEle":JSON.stringify(_rpssEle),// 电气元件记录
            "pssNode":JSON.stringify(_pssNode),// 电气元件和量测元件的节点记录

            "pssMsr":JSON.stringify(_rpssMsr),// 量测元件

            "pssCtrl":JSON.stringify(_rpssCtrl),// 控制元件记录
            "pssNodeCtrl":JSON.stringify(_pssNodeCtrl),// 控制元件的节点记录

            "pssMod":JSON.stringify(_rpssMod), //模块的记录
            "pssModName":JSON.stringify( modnames ), //模块名
            "child":JSON.stringify(_rpssModId), //
            "modeid":JSON.stringify(_modNodeId), //
            "ioelenode":JSON.stringify(ioEleNode), //

            "dspgrp":$('#simu_dspgrp').val(),
            "meters":JSON.stringify(_pssMeters)
        },
        function(re,s,jx){
            if( re.status == 0){
                // 如果文件生成成功，则向服务器发出开始仿真的命令
                startIns(re.task_id,re.file);

                // 本地测试时直接获取测试数据
                //~ initChartWnd();
                //~ _wndChart.show();
                //~ window.open(re.file);
                /*
                initChartWnd();
                window.open(re.file);
                initWebSck(WebSckUrl);
                _task_id = re.task_id;
                _simuFile_ = re.file;
                _wndChart.show();
                * */
            }else{
                alert(re.msg);
            }
        },'json'

    );
}// function startSimu

function stopSimu(){

    WebSck.send('{ "type":"100", "simuNo":98217, "calNO":"45345" }');
  WebSck.close();
  //~ WebSck.onopen = null;
  //~ WebSck.onclose = null;
  //~ WebSck.onsend = null;
  //~ WebSck.onmessage = null;
  WebSck = null;

  dps = [];

for(var i=0;i<Charts.length;i++){
            Charts[i].destroy();
      }
      Charts=[];
  //~ clearInterval(chartInterval);
  //~ $('#chart1').highcharts().destroy();
  //~ $('#chart1').highcharts('StockChart').destroy();

  //~ _wndChart.hide();
}

// 向服务器发出开始仿真命令
function startIns(tid,file){

$.get(
'/editor/startsimu/?tid='+tid+'&ff='+file,
function(re,s,jxhr){
    if(0==re.status){
        initChartWnd();

        window.open(file);

        initWebSck(WebSckUrl);
        _task_id = re.task_id;
        _simuFile_ = re.file;
        _wndChart.show();
    }
    alert('暂时未能生成算例文件');
}

);
}

function showSaveSimu(){
  var con = document.createElement('div');
  // 是否已保存参数
  var _folder ='';
  for( var i = 0;i<userFolder.length;i++){
      if( userFolder[i] == _simuProp['folder'] )
          _folder +='<option value="'+userFolder[i]['id']+'" selected>'+userFolder[i]['folder']+'</option>';
      else
          _folder +='<option value="'+userFolder[i]['id']+'">'+userFolder[i]['folder']+'</option>';
  }
  if( _simuProp['share'] == 0 ){
    var ch = '<label><input style="width:2em" type="radio" name="share" value="1" />是</label> <label><input style="width:2em" type="radio" name="share" value="0" checked />否</label>';
  }else{
    var ch = '<label><input style="width:2em" type="radio" name="share" checked value="1" />是</label> <label><input style="width:2em" type="radio" name="share" value="0" />否</label>';
  }
  con.innerHTML='\
  <div class="simu-param">\
  <form method="post" action="/editor/savesimu/" id="form_simusave" >\
    <input type="hidden" name="id" value="0" id="simuid" />\
    <input type="hidden" name="csrfmiddlewaretoken" value="" id="csrf" />\
    <input type="hidden" name="simuparam" value="" id="psimuparam" />\
    <input type="hidden" name="diagram" value="" id="pdia" />\
    <input type="hidden" name="component" value="" id="pcomp" />\
    <input type="hidden" name="elecount" value="" id="pelecount" />\
    <input type="hidden" name="ctrl" value="" id="pctrl" />\
    <input type="hidden" name="ctrlcount" value="" id="pctrlcount" />\
    <input type="hidden" name="msr" value="" id="pmsr" />\
    <input type="hidden" name="msrcount" value="" id="pmsrcount" />\
    <input type="hidden" name="module" value="" id="pmod" />\
    <input type="hidden" name="modname" value="" id="pmodname" />\
    <input type="hidden" name="modcount" value="" id="pmodcount" />\
    <input type="hidden" name="meters" value="" id="pmeters" />\
    <table class="simu-paramtbl">\
      <tr><td class="text-right" style="width:6em">仿真名称</td><td><input class="param-inpt" value="'+_simuProp['name']+'" name="name" /></td></tr>\
      <tr><td class="text-right">仿真文件夹</td><td>\
        <select class="folder" name="folder" >'+_folder+'</select>\
      </td></tr>\
      <tr><td class="text-right">仿真编号</td><td><input class="param-inpt" value="'+_simuProp['folder']+'" name="simuno"/></td></tr>\
      <tr><td class="text-right">仿真描述</td><td><textarea name="desc" class="param-inpt" style="height:100px">'+_simuProp['desc']+'</textarea></td></tr>\
      <tr><td class="text-right">公开仿真</td><td class="text-left">'+ch+'</td></tr>\
      \
      <tr><td class="text-center" colspan="2"><br><span class="btn btnsave" onclick="saveSimu(event)" >保存</span> <span class="btn btncancel" onclick="discardSimu(event)">取消</span><br></td></tr>\
    </table></form>\
  </div>';


if( _wndSave == null ){
  _wndSave = new mxWindow('填写仿真信息', con, _WIN.width*0.5-150, _WIN.height*0.5-200, 350,null, true, true);

  _wndSave.setMinimizable(false);
  _wndSave.setVisible(true);
}
else{
_wndSave.show();
}

}
function saveSimu(evt){
    evt.preventDefault();
    // 如果是载入的仿真，则修改一下id
    if( simuId > 0){
        $('#simuid').val( simuId );
    }
/*** 准备数据 ***/
var encoder = new mxCodec();
var node = encoder.encode(_graph.getModel());
var xml = mxUtils.getXml(node);
$('#csrf').val( $('input[name="csrfmiddlewaretoken"]').val() );
//~ $('#psimubo').val( );
$('#pdia').val( xml );
$('#pcomp').val( JSON.stringify(_pssEle) );
$('#pelecount').val( JSON.stringify(_pssEleCount) );

$('#pctrl').val( JSON.stringify(_pssCtrl) );
$('#pctrlcount').val( JSON.stringify(_pssCtrlCount) );

$('#pmsr').val( JSON.stringify(_pssMsr) );
$('#pmsrcount').val( JSON.stringify(_pssMsrCount) );

$('#pmod').val( JSON.stringify(_pssMod) );
$('#pmodname').val( JSON.stringify(modnames) );
$('#pmodcount').val( JSON.stringify(_pssModCount) );

$('#psimuparam').val( JSON.stringify(_simuPARAM) );
$('#pmeters').val( JSON.stringify(_pssMeters) );

    var option={
        success:function(re){
            if( 0!= re.status){
                alert('暂时未能保存，请稍后再试');
                return;
            }
            alert('保存成功');
            $('#simuid').val( re.id );
            _wndSave.hide();
        },
        error:function(){
            alert('暂时未能保存，请稍后再试');
            _wndSave.hide();
        },
        dataType:'json'
    }
$('#form_simusave').ajaxSubmit(option);

}

function discardSimu(e){
  e.preventDefault();
  _wndSave.hide();
}
