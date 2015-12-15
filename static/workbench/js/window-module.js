
// 初始化模块面板
function initModulePanel(){
  var con = $('<div class="comp-con">');
  //~ con.html('<div class="comp-con"><input type="text" onchange="showSysModSearch()"</div>');


  var $ul = $('<ul class="list" id="id_modlist">');
  var $html = null;
  con.append($ul);

  _wndList.Module = new mxWindow('系统模块', con[0], _WIN.width-160, 45, 155, _WIN.height-120, true, true);
  loadModList('sys',1);

// 窗口尺寸记录
  _wndList.Module.w=150;
  _wndList.Module.h=_WIN.height-120;

  _wndList.Module.setScrollable(true);
  _wndList.Module.setMinimizable(true);
  _wndList.Module.setVisible(true);
  
}// initModulePanel end

// 初始化用户模块面板
function initUserModulePanel(){
  var con = $('<div class="comp-con">');
  con.html('<div class="comp-con"><input type="text" onchange="showUModSearch()"</div>');


  var $ul = $('<ul class="list" id="id_usermodlist">');
  var $html = null;
  con.append($ul);

  _wndList.UserModule = new mxWindow('我的模块', con[0], _WIN.width-280, 30, 120, _WIN.height-300, true, true);
  //~ loadModList('user',1);

  _wndList.UserModule.setScrollable(true);
  _wndList.UserModule.setMinimizable(true);
  _wndList.UserModule.setVisible(true);
}

function showSysModSearch(){
  alert('未找到模块');  
}


// 载入元件列表，参数：页码
function loadModList(type,p){
  if( p > MAIN.totalCmpPage ){
    return false;
  }
  var i = 0,l=0,$li=null,$ul=$('#id_modlist');
  $ul.html('');
  if( ['sys','user'].indexOf(type) < 0 ){type='sys'}
  $.get(
    '/editor/moduleList/?'+type+'&page='+p,
    function(re,status,jxhr){
      if(re.status != 0 ){
        alert(re['msg']);
        return;
      }
      l=re['cmp'].length;
      for(i;i<l;i++){
        $li = $('<li class="component-item" data-id="'+re['cmp'][i]['id']+'" title="'+re['cmp'][i]['name']+'"><img src="'+re['cmp'][i]['icon']+'"/></li>');
        $ul.append($li);
        $li.mousedown(function(){MAIN.curCmpId = $(this).data('id')});
        mxUtils.makeDraggable($li[0], _graph, insertMod, dragElt, null, null, _graph.autoscroll, true);
      }
    },'json'

  );
}

// 载入指定id的元件
function getModById(id){
  var x ='';
  $.ajax({
    type : "get",
    url : '/editor/getModule/?id='+id,
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

/*
 * 拖拽插入模块的处理
 * */

function insertMod(graph_, evt_, target_, x, y){

  var doc1 = getModById(MAIN.curCmpId);
  if( doc1 == false ){// 获取元件出错
    return;
  }
  var doc = mxUtils.parseXml(doc1["dspshape"]);
  var model = new mxGraphModel();
  var codec = new mxCodec( doc );
      codec.decode(doc.documentElement, model);

  var children = model.getChildren(model.getChildAt(model.getRoot(), 0));
      children[0].geometry.x=0;
      children[0].geometry.y=0;

  var sym = doc1.sym;
  if('undefined' == typeof( _pssModCount[sym] ) ){
    _pssModCount[sym] = 0;
  }
  _pssModCount[sym]++;

  var symt = sym+'-'+_pssModCount[sym];
  children[0].setValue(symt);
  var xx = graph_.importCells(children,x,y,target_);
console.log( xx );

  if(_pssMod instanceof Array) _pssMod ={};
    _pssMod[symt]={ 'id':doc1['id'],'sym':doc1['sym'],'child':doc1['child'] ,'mid':xx[0].id};
    _pssModId.push(doc1['id']);


};

