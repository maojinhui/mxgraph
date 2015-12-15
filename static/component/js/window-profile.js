/*
* `ele`：电气元件
* `ctrl`：控制元件
* `msr`：量测元件
* `pEm`：节点电压表（测量两个节点，两个引脚）
* `nEm`：对地电压表（测量对地节点的电压，只有一个引脚）
* `Im`：支路电流表（串连进电路）
*/
// 初始元件参数
function initProfilePanel(){
  //~ var con = document.createElement('div');
  var csrf = $('input[name="csrfmiddlewaretoken"]').val();
  _proCon.innerHTML='\
    <form id="id_compform" method="post" action="/editor/new-component/savecomponent"><table class="ele-paramtbl">\
      <tr>\
        <td style="width:40%;padding:20px;border-right:1px solid #BFBFBF;text-align:left;">\
            <center>\
            <input type="hidden" name="csrfmiddlewaretoken" value="'+csrf+'" />\
            <input type="hidden" name="id" value="-1" /><div class="imgarea">\
            <img src="/static/component/img/bg.png" id="icon_preview"/><br><label class="selectbg"><input id="id_icon" type="file" class="hidden-input" onchange="updatePreview(this)" name="icon" />选择元件图标</label></div></center><br>\
            元件名称：<input type="text" placeholder="方便记忆的名称，例如 电感" name="typename" id="typename" /><br>\
            元件符号：<input type="text" placeholder="元件的符号，例如 L" name="sym" id="sym" /><br>\
            元件类型：<select class="param-inpt" name="thutype" id="thutype">\
                      <option value="ele">电气元件</option>\
                      <option value="ctrl">控制元件</option>\
                      <option value="msr">量测元件</option>\
                      <option value="pEm">节点电压表</option>\
                      <option value="nEm">对地电压表</option>\
                      <option value="Im">支路电流表</option>\
                      <option value="gnd">接地</option>\
                    </select><br>\
            类型编号：<input type="text" placeholder="元件的类型编号，例如 2" name="type" id="type" /><br>\
            可控元件：<input type="checkbox" name="ctrlable" id="ctrlable" style="width:14px"/><br>\
            元件的描述：<br><textarea class="param-inpt" rows="3" placeholder="例如：该元件用于限流" name="desc"></textarea>\
        </td>\
        <td class="p2">\
          <input type="hidden" id="id_param" name="param" value="" />\
          <input type="hidden" id="id_shape" name="shape" value="" />\
          <input type="hidden" id="id_pin" name="pin" value="" />\
            <p class="text-center">元件参数</p>\
            <table class="ele-paramtbl" id="param_tbl">\
              <tr><td style="width:30%">参数名称</td><td style="width:30%">默认值</td><td style="width:30%">参数单位</td><td></td>\
              <tr><td><input type="text"/></td><td><input type="text"/></td><td><input type="text"/></td><td></td>\
            </table>\
        </td>\
      </tr>\
      <tr><td style="border-top:1px solid #BFBFBF;padding:12px;" colspan="2" class="text-center"><span class="btn btnsave" onclick="saveParam()">保存</span> <span class="btn btncancel" onclick="cancelP()">取消</span> <span class="btn btnadd" onclick="addParam()">增加参数</span></td></tr>\
    </table></form>';

  _profilePanel = new mxWindow('元件参数', _proCon, _WIN.width*0.5-300, 60,660,null, true, true);

  //~ _profilePanel.setMinimizable(true);
  //~ _profilePanel.setResizable(true);
  //~ _profilePanel.setMaximizable(true);
  //~ _profilePanel.setVisible(true);
  _profilePanel.setScrollable(true);

  // 删除新增的参数
  $('#param_tbl').delegate('img','click',function(){
     $(this).closest('tr').remove()
  });

}// initInfoPanel end



function updatePreview(no) {
    var oFReader = new FileReader();
    //oFReader.readAsDataURL(document.getElementById("toutu_file").files[0]);
    oFReader.readAsDataURL(no.files[0]);

    oFReader.onload = function (oFREvent) {
        document.getElementById("icon_preview").src = oFREvent.target.result;
    };
}


function addParam(){
  $('#param_tbl').append('<tr><td><input type="text"/></td><td><input type="text"/></td><td><input type="text"/></td><td class="mv"><img class="delP" src="/static/component/img/delete.png"></tr>');
}

function saveParam(){
  assembleComp();
  
  var options = {
      dataType : "json",
      beforeSubmit:function(){},
      success : function(result) {
        if(result.status == 0){
          alert('元件保存成功');
          window.location.reload();
        }
      },
      error : function(result) {
      }
  };
  $('#id_compform').ajaxSubmit(options);
}

// 组装元件信息
function assembleComp(){
  if(document.getElementById('id_icon').value == ''){
    alert('请上传元件图标');
    return false;
  }
  if(mainC == null ){
    alert('您还没有绘制元件图形');
    return false;
  }
  var typename = $('#typename').val();
  var sym = $('#sym').val();
  var type = $('#type').val();
  if(typename == ''){
    alert('元件名称不能为空');
    $('#typename').focus();
    return false;
  }
    
  if(sym == ''){
    alert('元件符号不能为空');
    $('#sym').focus();
    return false;
  }
    if( sym.match(/-|\./) != null ){
        alert('元件符号不能包含“.”和“-”');
        return false;
    }
  if( type == '' || isNaN(parseInt(type)) || parseInt(type) < 1 ){
    alert('类型编号不正确，只能为整数');
    $('#type').focus();
    return false;
  }

  var paramtmp=new Array;
  var inputs = null,p={};
  var ptbltr = $('#param_tbl tr'),ptbll=ptbltr.length;

  for(var i=1;i<ptbll;i++){// i 从1开始，跳过头部的提示文字

    inputs = $(ptbltr[i]).find('input');
    if(inputs[0].value == ''){
      alert('该参数项不能为空');
      inputs[0].focus();
      return false;
    }
    if(inputs[1].value == ''){
      alert('该参数项不能为空');
      inputs[1].focus();
      return false;
    }
    //~ if(inputs[2].value == ''){ // 元件单位
      //~ alert('该参数项不能为空');
      //~ inputs[2].focus();
      //~ return false;
    //~ }
    paramtmp.push( {"label":inputs[0].value,"value":inputs[1].value,"unit":inputs[2].value} );
    //paramtmp +='{"label":"'+inputs[0].value+'","value":"'+inputs[1].value+'","unit":"'+inputs[2].value+'"},';

  }

  $('#id_param').val( JSON.stringify(paramtmp) );
  

  var vts = _graph.getChildVertices();
  var i=0;
  //~ var main;
  mainC.thutype = $('#thutype').val();
  //~ mainC.type = type;
  
  var x=mainC.geometry.x;
  var y=mainC.geometry.y;
  var pin = {};
  var pinn = 0;
  for(i;i<vts.length;i++){

    if(vts[i].id != '2') vts[i].parent=mainC;
    if(vts[i].id == '2') continue;
    if(vts[i]['pinn'] != undefined){//连接点
      vts[i]['pinn'] = pinn;
      
      //~ pin[pinn]=-1;
      
      pin[pinn] = {"node":-1,"label":"","id":0}
      pinn++;
      //~ default_param['pin'].push({'pin':'','node':'','id':0});
    }

    vts[i].geometry.relative = true
    vts[i].geometry.offset = new mxPoint(vts[i].geometry.x-x,vts[i].geometry.y-y);

    vts[i].geometry.x=0;
    vts[i].geometry.y=0;

    vts[i].value='';

  }
  mainC.geometry.x=0;
  mainC.geometry.x=0;
  mainC.value=sym

  var xx = '<?xml version="1.0"?>';
  var encoder = new mxCodec();
  var node = encoder.encode(_graph.getModel());

  var shape = mxUtils.getXml(node);
  $('#id_shape').val( shape );
  $('#id_pin').val( JSON.stringify(pin) );
  //~ return true;
}

function cancelP(){
  _profilePanel.hide();
}

function showSetComp(){
  // 记得加上已有参数

  _profilePanel.show();
}

/****** 保存背景图的窗口 *******/
function showSetBg(){
  var csrf = $('input[name="csrfmiddlewaretoken"]').val();
  var _div = document.createElement('div');
  _div.innerHTML='<div class="text-center">\
      <form id="id_bgform" method="post" action="/editor/new-component/updateBg">\
        <h3>请选择一幅图作为元件的背景图</h3>\
        <input type="hidden" name="csrfmiddlewaretoken" value="'+csrf+'" />\
        <img src="/static/component/img/bg.png" id="bg_preview"/><br>\
        <label class="selectbg"><input type="file" name="bg" class="hidden-input" onchange="updateBgPrv(this)"/>选择背景文件</label>\
        <p style="padding:10px 30px"><input type="submit" value="上传背景" /></p>\
      </form>\
    </div>';

  var bgwnd = new mxWindow('设置背景图', _div, _WIN.width*0.5-300, 60,220,null, true, true);

  //~ bgwnd.setMinimizable(true);
  //~ bgwnd.setResizable(true);
  //~ bgwnd.setMaximizable(true);
  bgwnd.setVisible(true);
  bgwnd.setClosable(true);
  //~ bgwnd.setScrollable(true);

      var options = {
          dataType : "json",
          beforeSubmit : function() {
          },
          success : function(result) {
            if(result.status == 0){
              component.bg = result.bgpath;
              mainC.setStyle('shape=image;image='+result.bgpath+';verticalLabelPosition=bottom;verticalAlign=middle');
              bgwnd.destroy();
              _graph.refresh();
             // alert('背景上传成功');
            }
          },
          error : function(result) {
          }
      };
      $('#id_bgform').submit(function() {
        $(this).ajaxSubmit(options);
        return false;
      });

}
function updateBgPrv(no) {
    var oFReader = new FileReader();
    oFReader.readAsDataURL(no.files[0]);
    oFReader.onload = function (oFREvent) {
        document.getElementById("bg_preview").src = oFREvent.target.result;
    };
}


