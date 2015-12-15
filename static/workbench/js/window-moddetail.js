function initModWnd(){
  //~ var con = document.createElement('div');
  _wndModProfileCon.innerHTML='<div class="" style="height:30px;background-color:#fff;line-height:30px">&nbsp;&nbsp;\
  <span onclick="closeModDetail(this)" class="btn btnclose" style="float:right;height:18px;line-height:18px;margin-top:3px;margin-right:8px">关闭</span>\
  <span id="modVNav"></span>\
  </div><div id="id_modprofile" style="height:100%"></div>';
  _wndModProfileCon.style.backgroundImage='url("/static/workbench/img/grid.gif")'

  var hw = _WIN.width*0.5,hh=_WIN.height*0.75;
  _wndModProfile = new mxWindow('模块内部详情', _wndModProfileCon, hw*0.5, 60,hw,hh, true, true);

  _wndModProfile.setMinimizable(true);
  _wndModProfile.setResizable(true);
  _wndModProfile.setMaximizable(true);
  //~ _wndModProfile.setClosable(true);
  //~ _wndModProfile.addListener(mxEvent.CLOSE, function(e){
      //~ console.log(e);
      //~ e.hide();
      //~ return false;
  //~ });

  initModDetailEditor();
  configureStylesheet(_modgraph);
}
function closeModDetail(self){
    _wndModProfile.hide();
    _pssModRec = [];
}
// 初始化主编辑器
function initModDetailEditor(){
  if(!mxClient.isBrowserSupported()){//如果浏览器不支持
      mxUtils.error('您的浏览器过旧，请更新浏览器来使用本程序。', 200, false);
      return;
  }
  //var container = document.getElementById('mainEditor');
  /*_modEditor = new mxEditor();

  _modgraph = _modEditor.graph;

  var model = _modgraph.getModel();

  _modEditor.setGraphContainer(document.getElementById('id_modprofile'));

  var config = mxUtils.load('/static/mxgraph/keyhandler-commons.xml').getDocumentElement();

  _modEditor.configure(config);*/

  /*****/
  _modgraph = new mxGraph(document.getElementById('id_modprofile'));
  _modgraph.panningHandler.useLeftButtonForPanning = true;

  _modgraph.setPanning(true);
  _modgraph.setConnectable(true);
  _modgraph.setConnectableEdges(true);
  _modgraph.setDisconnectOnMove(false);
  _modgraph.panningHandler.isPopupTrigger = function() { return false; };

  new mxRubberband(_modgraph);
  /***********************************/
  // Alternative solution for implementing connection points without child cells.
  // This can be extended as shown in portrefs.html example to allow for per-port
  // incoming/outgoing direction.
  _modgraph.getAllConnectionConstraints = function(terminal){
     var geo = (terminal != null) ? this.getCellGeometry(terminal.cell) : null;

     if ((geo != null ? !geo.relative : false) &&
       this.getModel().isVertex(terminal.cell) &&
       this.getModel().getChildCount(terminal.cell) == 0){
      return [new mxConnectionConstraint(new mxPoint(0, 0.5), false),
          new mxConnectionConstraint(new mxPoint(1, 0.5), false)];
      }

    return null;
  };

  // Makes sure non-relative cells can only be connected via constraints
  _modgraph.connectionHandler.isConnectableCell = function(cell){
    if (this.graph.getModel().isEdge(cell)){
      return true;
    }
    else{
      var geo = (cell != null) ? this.graph.getCellGeometry(cell) : null;
      return (geo != null) ? geo.relative : false;
    }
  };
  mxEdgeHandler.prototype.isConnectableCell = function(cell){
    return _modgraph.connectionHandler.isConnectableCell(cell);
  };

  // Adds a special tooltip for edges
  _modgraph.setTooltips(true);


      var labelBackground = '#FFFFFF';
      var fontColor =  '#000000';
      var strokeColor =  '#000000';
      var fillColor =  '#FFFFFF';

      var style = _modgraph.getStylesheet().getDefaultEdgeStyle();
      delete style['endArrow'];
      style['strokeColor'] = strokeColor;
      style['labelBackgroundColor'] = labelBackground;
      style['edgeStyle'] = 'wireEdgeStyle';
      style['fontColor'] = fontColor;
      style['fontSize'] = '9';
      style['movable'] = '0';
      style['MAIN.strokeWidth'] = MAIN.strokeWidth;
      //style['rounded'] = '10';

      // Sets join node size
      style['startSize'] = MAIN.joinNode;
      style['endSize'] = MAIN.joinNode;

      style = _modgraph.getStylesheet().getDefaultVertexStyle();
      style['gradientDirection'] = 'south';
      //style['gradientColor'] = '#909090';
      style['strokeColor'] = strokeColor;
      style['fillColor'] = '#e0e0e0';
      style['fillColor'] = 'none';
      style['fontColor'] = fontColor;
      style['fontStyle'] = '1';
      style['fontSize'] = '12';
      style['resizable'] = '0';
      style['rounded'] = '1';
      style['MAIN.strokeWidth'] = MAIN.strokeWidth;

// 模块查看详情内部 绑定 双击事件
    _modgraph.dblClick = function(evt, cell){
          var scell = _modgraph.getSelectionCells();
          //过滤：edge不显示,分隔线不显示
          if(scell[0].edge) return;
          /*var div1 = $('<div>');
              div1.addClass('paramPrompt');*/
          var pins = new Array()
        
              //todo: set pins
          //递归获取id，传入已选的cell[0]
          var siid = "-1"
          var snn = ''
          var sp = {}//被双击的元件的父级
          function getSId(obj){
            if("1" != obj.parent.id)
              getSId(obj.parent);
            else{
              siid = obj.id
              snn = obj.getValue()
              sp = obj
              return
            }
          }
          getSId(scell[0]);
          console.log( '>>>>',sp);
          switch(sp.thutype){
            case "ele":showModEleProfile(siid,snn,sp);break;
            case "gnd":showModEleProfile(siid,snn,sp);break;
            case "msr":break;showModMsrProfile(siid,snn,sp);break;
            case "ctrl":showModCtrlProfile(siid,snn,sp);break;
            case "mod":modViewRecPush(siid,snn,sp);showModProfile(siid,snn,sp);break;
          }
    };

// 双击事件结束

}//initMainEditor end

function modViewRecPush(siid,snn,sp){
    _pssModRec.push( snn );

    //生成导航头部
    var _nav = '';
    for(var i =0;i<_pssModRec.length;i++){
        _nav+='<a onclick="showModProfile2(\''+_pssModRec[i]+'\')" class="mod-vnav">'+_pssModRec[i]+'</a> <span class="grey">》</span> ';
    }
    var nav = _nav.substr(0,_nav.length-28);
    $('#modVNav').html( nav );
}
// 在主工作编辑器中双击了模块后，显示模块的内部结构.
function showModProfile(iid,nn,p){
    
    _wndModProfile.setTitle('模块"'+nn+'"的内部结构');
    _wndModProfile.show();
    
    var sym = nn.split('-')[0]
    //~ var doc1 = loadModShapeById(_pssMod[nn]['id']);
    var doc1 = loadModShapeById(sym);
    var doc = mxUtils.parseXml(doc1['shape']);
    var model = new mxGraphModel();
    var codec = new mxCodec(doc);
    codec.decode(doc.documentElement, _modgraph.getModel());
    _modgraph.center();
      
}//function showModProfile
// 点击导航上的模块路径导航显示
function showModProfile2(nn){
    
    _wndModProfile.setTitle('模块"'+nn+'"的内部结构');
    _wndModProfile.show();
    
    var sym = nn.split('-')[0]
    //~ var doc1 = loadModShapeById(_pssMod[nn]['id']);
    var doc1 = loadModShapeById(sym);
    var doc = mxUtils.parseXml(doc1['shape']);
    var model = new mxGraphModel();
    var codec = new mxCodec(doc);
    codec.decode(doc.documentElement, _modgraph.getModel());
    _modgraph.center();

    // regenerate the nav menu
    var idx = _pssModRec.indexOf( nn );
    if( idx != _pssModRec.length -1 )
        _pssModRec.splice( idx +1, _pssModRec.length-idx);
    if( idx == 0 )
        _pssModRec=[ nn ];
    var _nav = '';
    for(var i =0;i<_pssModRec.length;i++){
        _nav+='<a onclick="showModProfile2(\''+_pssModRec[i]+'\')" class="mod-vnav">'+_pssModRec[i]+'</a> <span class="grey">》</span> ';
    }
      
    var nav = _nav.substr(0,_nav.length-28);
    $('#modVNav').html( nav );
}//function showModProfile



function showMGraph(container,nn){
      //div1.addClass('paramPrompt');
  mgraph = new mxGraph(container);
    mgraph.setPanning(true);
    mgraph.setConnectable(true);
    mgraph.setConnectableEdges(true);
    mgraph.setDisconnectOnMove(false);
    mgraph.panningHandler.isPopupTrigger = function() { return false; };
     new mxRubberband(mgraph);
      var labelBackground = (invert) ? '#000000' : '#FFFFFF';
      var fontColor = (invert) ? '#FFFFFF' : '#000000';
      var strokeColor = (invert) ? '#C0C0C0' : '#000000';
      var fillColor = (invert) ? 'none' : '#FFFFFF';
var invert = false;
var joinNodeSize = 4;
var strokeWidth = 2;
      var style = mgraph.getStylesheet().getDefaultEdgeStyle();
      delete style['endArrow'];
      style['strokeColor'] = strokeColor;
      style['labelBackgroundColor'] = labelBackground;
      style['edgeStyle'] = 'wireEdgeStyle';
      style['fontColor'] = fontColor;
      style['fontSize'] = '9';
      style['movable'] = '0';
      style['strokeWidth'] = strokeWidth;
      //style['rounded'] = '10';

      // Sets join node size
      style['startSize'] = joinNodeSize;
      style['endSize'] = joinNodeSize;

      style = mgraph.getStylesheet().getDefaultVertexStyle();
      style['gradientDirection'] = 'south';
      //style['gradientColor'] = '#909090';
      style['strokeColor'] = strokeColor;
      style['fillColor'] = '#e0e0e0';
      style['fillColor'] = 'none';
      style['fontColor'] = fontColor;
      style['fontStyle'] = '1';
      style['fontSize'] = '12';
      style['resizable'] = '0';
      style['rounded'] = '1';
      style['strokeWidth'] = strokeWidth;


//mgraph.setEnabled(false);
}


/** 模块内 电气元件的参数设置 start**/
function showModEleProfile(iid,nn,p){
    // 通过sym获取元件的基本参数，方便后面的修改
  var doc = getCompBySym( nn.split('-')[0] );
  var param = doc["ele"]["param"]['param'];
  //~ _pssMod[_curModSym]['child'][_curModId] = {};
  //~ _pssMod[_curModSym]['child'][_curModId][nn] = param;

  var modSym='';//模块名称，例如：mod-1; mod-1.submod1.submod2
  for(var i =0;i<_pssModRec.length;i++){
    modSym += _pssModRec[i]+'.';
  }
  modSym = modSym.substr(0,modSym.length-1);// 去掉末尾的.
  if( typeof(_pssMod[ modSym ]) != 'object'){// 如果不是首次编辑
        _pssMod[modSym] = {};
  }
  if( typeof(_pssMod[modSym]['ele']) != 'object'){// 如果不是首次编辑
        _pssMod[modSym]['ele'] = {};
  }
  //~ console.log('param is 1---',modSym,nn)
  //~ var param = _pssMod[modSym]['ele'][nn];
  //~ console.log('param is ---',param)
  if( _pssMod[modSym]['ele'][nn] != undefined)
    param = _pssMod[modSym]['ele'][nn]
  else
      _pssMod[modSym]['ele'][nn] = param; // 记录电气元件的

  var pins = new Array()
  
  var html = '<table class="PARAMdiv">'
  for(var i = 0 ; i< param.length;i ++){
     html+='<tr><td>'+param[i]['label']+'</td><td><input type="text" class="param-inpt" value="'+param[i]['value']+'" /></td><td>'+param[i]['unit']+'</td></tr>';
  }
  html+='</table>';

  html += '<br><span class="btn btnsave" onclick="saveMCP(this,\''+iid+'\',\''+nn+'\',\''+_curModSym+'\')">保存</span> <span onclick="cancelMCP()" class="btn btncancel">取消</span><br><br>';
  _wndEleParamCon.innerHTML=html;

  _wndEleParam.setTitle('设置参数：'+nn)
  _wndEleParam.show()
}//function showEleProfile


function cancelMCP(){ _wndEleParam.hide(); }

function saveMCP(self,iid,nn,curMs){
 /** 参数 **/
 console.log('--- nn is---',nn);

    var modSym='';//模块名称，例如：mod-1; mod-1.submod1.submod2
  for(var i =0;i<_pssModRec.length;i++){
    modSym += _pssModRec[i]+'.';
  }
  modSym = modSym.substr(0,modSym.length-1);// 去掉末尾的.
  var d = $('.PARAMdiv').find('input');//参数的父级下的div
  for(var i =0 ; i<d.length;i++){
      //~ console.log( typeof d[i].value )
    _pssMod[modSym]['ele'][nn][i]['value']=d[i].value;//>>0
  }
  _wndEleParam.hide();
}

/*--------------------------------------------------*/

// 载入指定id的模块内部结构
function loadModShapeById(id){
  var x ='';
  $.ajax({
    type : "get",
    url : '/editor/getModuleDetail/?id='+id,
    data :'',
    dataType: "json",
    async : false,
    success : function(data){
      if(data.status !=0 ){
        alert(data.msg);
        return false;
      }
      x = data;
    },
    error:function(){
      alert('暂时未能获取模块信息')
      return false;
    }
    });
  return x;
}

