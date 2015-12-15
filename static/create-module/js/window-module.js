
// 初始化模块面板
function initModulePanel(){
  //~ var con = document.createElement('div');
  var con = $('<div class="comp-con">');
  con.html('<div class="comp-con"><input type="text" onchange="showMODSearch()" /></div>');


  var $ul = $('<ul class="list" id="id_modlist">');
  var $html = null;
  con.append($ul);

  _wndModule = new mxWindow('系统模块', con[0], _WIN.width-150, 30, 120, _WIN.height-300, true, true);
  loadModList(1);

  _wndModule.setScrollable(true);
  _wndModule.setMinimizable(true);
  _wndModule.setVisible(true);

}// initModulePanel end


function showMODSearch(){
  alert('未找到模块');
}



// 载入元件列表，参数：页码
function loadModList(p){
  if( p > MAIN.totalCmpPage ){
    return false;
  }
  var i = 0,l=0,$li=null,$ul=$('#id_modlist');
  $ul.html('');
  $.get(
    '/editor/moduleList/?page='+p,
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


  if(_pssMod instanceof Array) _pssMod ={};
    _pssMod[symt]={ 'id':doc1['id'],'sym':doc1['sym'],'child':doc1['child'] };
    _pssModId.push(doc1['id']);


};

