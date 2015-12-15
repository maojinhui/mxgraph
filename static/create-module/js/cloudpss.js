

// ************初始化各项参数 ************** 
function iniParam(){
  _WIN.width =  document.body.clientWidth || document.documentElement.clientWidth;
  _WIN.height =  document.body.clientHeight || document.documentElement.clientHeight;
}// iniParam end




function initSaveMod(){
  var con = document.createElement('div');
  // 是否已保存参数
  var _folder ='';
  var csrf = $('input[name="csrfmiddlewaretoken"]').val();
  if( _modParam.icon != '' ){
    _icon = '<img src="'+_modParam.icon+'" id="icon_preview"/>';
  }
  else _icon = '<img src="/static/component/img/bg.png" id="icon_preview"/>';
  con.innerHTML ='\
    <form id="form_mod" method="post" action="/editor/new-module/savemodule"><table class="ele-paramtbl">\
      <tr>\
        <td style="width:40%;padding:20px;border-right:1px solid #BFBFBF;">\
            <center><p>模块基本信息</p>\
            <input type="hidden" name="csrfmiddlewaretoken" value="'+csrf+'" />\
            <input type="hidden" name="id" value="-1" id="mod_id"/>'+_icon+'<br><label class="selectbg"><input id="id_icon" type="file" class="hidden-input" onchange="updatePreview(this)" name="icon" />选择模块图标</label></center>\
        </td>\
        <td>\
          <input type="hidden" id="id_dspshape" name="dspshape" value="" />\
          <input type="hidden" id="id_shape" name="shape" value="" />\
          <input type="hidden" id="id_child" name="child" value="" />\
          <input type="hidden" id="id_childnames" name="childname" value="" />\
          <input type="hidden" id="id_eleparam" name="eleparam" value="" />\
          <input type="hidden" id="id_msrparam" name="msrparam" value="" />\
          <input type="hidden" id="id_ctrlparam" name="ctrlparam" value="" />\
          <input type="hidden" id="id_ctrlnode" name="ctrlnode" value="" />\
          <input type="hidden" id="id_submodparam" name="submodparam" value="" />\
          <input type="hidden" id="id_node" name="node" value="" />\
          <input type="hidden" id="id_eleC" name="eleC" value="" />\
          <input type="hidden" id="id_msrC" name="msrC" value="" />\
          <input type="hidden" id="id_ctrlC" name="ctrlC" value="" />\
          <input type="hidden" id="id_modC" name="modC" value="" />\
          <input type="hidden" id="id_modnodeid" name="modeid" value="" />\
          <input type="hidden" id="id_io" name="io" value="" />\
          <input type="hidden" id="id_ioelenode" name="ioelenode" value="" />\
          <input type="hidden" id="id_ioctrlnode" name="ioctrlnode" value="" />\
          <input type="hidden" id="id_pin" name="pin" value="" />\
          <input type="hidden" id="id_msrnode" name="msrnode" value="" />\
            模块名称：<input type="text" class="param-inpt" value="'+_modParam.name+'" name="typename" id="modname" />\
            模块符号：<input type="text" class="param-inpt" value="'+_modParam.sym+'" name="sym" id="modsym" />\
            模块的描述：<textarea class="param-txt" rows="5" name="desc" id="moddesc">'+_modParam.desc+'</textarea>\
        </td>\
      </tr>\
      <tr><td style="border-top:1px solid #BFBFBF;padding:12px;" colspan="2" class="text-center"><span class="btn" onclick="saveMod(this)">保存</span> <span class="btn" onclick="cancelP()">取消</span></td></tr>\
    </table></form>'
  _wndSave = new mxWindow('填写模块信息', con, _WIN.width*0.5-200, _WIN.height*0.5-200, 430,null, true, true);
  
  _wndSave.setMinimizable(false);
  //~ _wndSave.setVisible(true);
  
}
function showSaveMod(){
    _wndSave.show();
}
function cancelP(){
  _wndSave.hide();
}
function saveMod(self){
    //~ if( doing ) return;
    doing = true;
    if( objCount(_IO['input'])<1 || objCount(_IO['output']) <1){
        // todo : refresh real io record
        alert('您未给模块添加输入输出接口，这将导致模块无法工作！\n请为模块添加输入输出接口');
        return false;
    }
    var modname = $('#modname').val();
    var modsym = $('#modsym').val();
    if( modname.match(/-|\./) != null ){
        alert('模块名称不能包含“.”和“-”');
        return false;
    }
    if( modsym.match(/-|\./) != null ){
        alert('模块符号不能包含“.”和“-”');
        return false;
    }
    $(self).text('生成模块信息中');
/** 保存基本信息 **/
    _modParam.name=modname;//$('#modname').val();
    _modParam.sym=modsym;//$('#modsym').val();
    _modParam.desc=$('#moddesc').val();
    _modParam.icon=$('#icon_preview').attr('src');

/** 开始生成拓扑信息 **/
  
  var vts = _graph.getChildVertices();
  var edges = _graph.getChildEdges();
  var vl=vts.length,el=edges.length;
  
  if(vl < 1){alert('这是乎是一个空的模块，请先建立模块模型后再保存');return false;}

_rpssEle = {};
_rpssCtrl = {};
//~ _rpssModId = [];
_rpssMsr={},_rpssMod={}

  var existV = [];
  for(var i = 0;i<vl;i++){
    existV.push(vts[i].value)
  }
// clear component start
//除一些元件的数据记录，例如用户删除了某个元件，但是其元件记录还在，没有一在删除时删掉其记录，为了避免用户回退时出现问题
  
  for(var x in _pssEle){
    if(existV.indexOf(x) >= 0)
      _rpssEle[x] = _pssEle[x]; // 这种方式没关系，因为_pssEle和 _rpssEle里的元素基本不发生删减
  }

// clear ctrl
  for(var x in _pssCtrl){
      //~ console.log( '..ctrl.',existV.indexOf(x));
    if(existV.indexOf(x) >= 0)
      _rpssCtrl[x] = _pssCtrl[x];
  }

// clear msr
  for(var x in _pssMsr){
      //~ console.log( '..ctrl.',existV.indexOf(x));
    if(existV.indexOf(x) >= 0)
      _rpssMsr[x] = _pssMsr[x];
  }

// clear input
  for(var x in _IO['input']){
      //~ console.log( '..ctrl.',existV.indexOf(x));
    if(existV.indexOf(x) < 0)
      //~ _rpssMsr[x] = _pssMsr[x];
      delete _IO['input'][x]
  }
// clear ouput
  for(var x in _IO['output']){
      //~ console.log( '..ctrl.',existV.indexOf(x));
    if(existV.indexOf(x) < 0)
      //~ _rpssMsr[x] = _pssMsr[x];
      delete _IO['output'][x]
  }

// clear Mod
_rpssModId = [];
_rpssMod =[];
  for(var x in _pssMod){
      //~ console.log( '.-mod.',existV.indexOf(x));
    if(existV.indexOf(x) >= 0){
      _rpssModId.push( _pssMod[x]['id'] );
      _rpssMod.push( _pssMod[x] );
    }
  }
// clear Edge 连线没多大影响，没有任何连接的连线就直接删了
  
  //~ if(edgs.length > 1) //可能全部都写在引脚上
      for(var i =0 ;i<el;i++){
        if( (edges[i].edges == null ) && (edges[i].source  == null || edges[i].target == null) ){
          _graph.removeCells([edges[i]]);
        }
      }
  _graph.refresh();// 刷新显示

// 重置相关节点变量的记录
  _pssNode = [];//电气元件的节点数组，默认0的是接地
  _pssNodeCtrl = [[]];//控制系统的节点数组，节点号从1开始
  _pssNodeMsr = [];//量测系统的节点数组
  _pssGndTMp = [];

  // 有连续部分的节点号生成
  //连线的节点，已分开控制系统，量测系统仍然在里面，已将地节点写入
  genNodeEdge();
  // 采用标记方式的节点号生成
  genNodeLabel();//用户定义的节点标识，已分开控制系统，量测系统仍然在里面

    
    //设置元件的引脚节点号,到后端做
    //~ setNodeP();
    // 控制系统悬空的引脚，到后端做
    //~ addCtrlHangNode();

  //  ---刷新一遍有连接的元件的引脚id ，变为本次绘图中是id
  var _model = _graph.getModel();
  var n = '',pin1=0,j=0;
  // 电气元件的
  var delNode=[]; // 记录将来要删掉的io口所在节点
  var ioEleNode={},ioCtrlNode={},_modNodeId={};
  for(var i = 0;i<_pssNode.length;i++){// for 1
    for(j=0;j<_pssNode[i].length;j++){//for 2
      p = _model.getCell( _pssNode[i][j] ).parent;
      n = p.value;
      pin1 = _model.getCell( _pssNode[i][j] ).pinn >> 0;      
      // io口，当为io口时，将元件节点都改为其对应的符号。例如：in-1
      console.log( 'p.thutype is',p.thutype)
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
          _modNodeId[n][mm] = _pssNode[i][j]; //将模块的引脚dom id记录
          continue;
      }
      // 电气元件
      if( typeof( _rpssEle[n] ) != 'undefined' && _rpssEle[n]['thutype'] == 'ele' ){
          _rpssEle[n]["pin"][pin1]["id"] = _pssNode[i][j];
          continue;
      }
      // 量测元件
      if( typeof( _rpssMsr[n] ) != 'undefined' && _rpssMsr[n]['thutype'] == 'msr' ){
          _rpssMsr[n]["pin"][pin1]["id"] = _pssNode[i][j];
          continue;
      }
    }// for 2 end
  }// for 1 end

// 刷量测元件的引脚id
// 量测元件不连接到外部io口上
for(var i = 0;i<_pssNodeMsr.length;i++){
    var tc = {};
    for(j=0;j<_pssNodeMsr[i].length;j++){
        tc = _model.getCell( _pssNodeMsr[i][j] )
        n = tc.parent.value;
        if( tc.parent.thutype != 'msr' ) continue;
        pin1 = tc.pinn >> 0;
        _rpssMsr[n]["pin"][pin1]["id"] = _pssNodeMsr[i][j];
    }
}

//~ _pssNodeMsr.unshift([]);


//对将要被删除的节点号排序，从大到小，然后删除之。从后往前删
delNode.sort(function(a,b){return a<b?1:-1});
for(var i=0;i<delNode.length;i++){
  _pssNode.splice( delNode[i],1 )
}
  // 控制元件的
  n = '',pin1=0,j=0,delNode=[];
  for(var i = 0;i<_pssNodeCtrl.length;i++){
    for(j=0;j<_pssNodeCtrl[i].length;j++){
      p = _model.getCell( _pssNodeCtrl[i][j] ).parent;
      n = p.value;
      pin1 = _model.getCell( _pssNodeCtrl[i][j] ).pinn >> 0;
console.log('ctrl---,p.thutype', p.thutype)
      if( p.thutype == 'io' ){
          // 纯元件对应io口所在的节点删掉，没有节点号。
          delNode.push(i);
          ioCtrlNode[ n ] = _pssNodeCtrl[i]; //将接在io口上的引脚id记录，这里只有ctrl的
          continue;
      }
      if( typeof( _rpssCtrl[n] ) == 'undefined' ) continue;
      _rpssCtrl[n]["pin"][pin1]["id"] = _pssNodeCtrl[i][j];
    }
  }
// 删除ctrl里的节点
delNode.sort(function(a,b){return a<b?1:-1});
for(var i=0;i<delNode.length;i++){
  _pssNodeCtrl.splice( delNode[i],1 )
}

  /* ----  模块 内容开始  ---- */
var _pssModChildName = [];
for(var x in _pssMod){
    // 加入child 嵌套，不unique操作
    _rpssModId.push( _pssMod[x]['child'] );
    _pssModChildName.push( x );
}
console.log('flatten 前',_rpssModId);
 _rpssModId = _.flatten( _rpssModId ); // [ 1,2,[3,4]] => [1,2,3,4],记录全部的子模块
console.log('flatten 后',_rpssModId);

if(objCount(ioEleNode) >1 )
    genModIO(ioEleNode);//写入与mod连接的io口的相关信息



genMsrNode(_pssNodeMsr); //量测元件的节点
genMsrRelation(); //处理量测元件的测量口
//~ genCtrlRelation(); //处理控制元件的输入，输出口 控制元件与电气元件没有直接相连
/********** 设定一些参数  ***************/
    console.log('-----------节点生成完成---------');
    //~ return;
    // 获取元件的xml图像
    var _shape = getXml();
    var _dspshape = genDspShp();
  /*** 写入各项参数  ***/
    $('#id_dspshape').val( _dspshape );
    $('#id_shape').val( _shape );
    //~ $('#id_child').val( '['+_rpssModId.toString() +']' );
    $('#id_child').val( JSON.stringify( _rpssModId ) );
    $('#id_childnames').val( JSON.stringify( _pssModChildName ) );
    
    $('#id_eleparam').val( JSON.stringify(_rpssEle) );
    $('#id_msrparam').val( JSON.stringify(_rpssMsr) );
    // msr的节点放在了ele里，到后端分离
    //~ $('#id_msrnode').val( JSON.stringify(_rpssMsr) );
    //~ $('#id_ctrlparam').val( JSON.stringify(_rpssCtrl) );
    $('#id_ctrlparam').val( JSON.stringify(_rpssCtrl) );
    $('#id_ctrlnode').val( JSON.stringify(_pssNodeCtrl) );
    $('#id_submodparam').val( '{}' );// 子模块的参数，不在这里设置，需要到仿真中设置
    
    $('#id_node').val( JSON.stringify(_pssNode) );
    
    $('#id_eleC').val( JSON.stringify(_pssEleCount) );
    $('#id_msrC').val( JSON.stringify(_pssMsrCount) );
    $('#id_ctrlC').val( JSON.stringify(_pssCtrlCount) );
    $('#id_modC').val( JSON.stringify(_pssModCount) );
    $('#id_modnodeid').val( JSON.stringify( _modNodeId ) );
    
    $('#id_io').val( JSON.stringify(_IO) );
    $('#id_ioelenode').val( JSON.stringify(ioEleNode) );
    $('#id_ioctrlnode').val( JSON.stringify(ioCtrlNode) );
    $('#id_pin').val( '[]' );
    
    $('#id_msrnode').val( JSON.stringify( _pssNodeMsr ) );
    
    
  /*** ajax 提交 模块 ***/
  var options = {
    success:function(re){
        if( re.status != 0){alert(re.msg);$(self).text('保存');return false;}
        
        $('#mod_id').val(re['id']);
        $(self).text('保存');
        alert('模块保存成功');
    }
  };
  $('#form_mod').ajaxSubmit(options);
}// function saveMod


function updatePreview(no) {
    var oFReader = new FileReader();
    //oFReader.readAsDataURL(document.getElementById("toutu_file").files[0]);
    oFReader.readAsDataURL(no.files[0]);

    oFReader.onload = function (oFREvent) {
        document.getElementById("icon_preview").src = oFREvent.target.result;
    };
}
