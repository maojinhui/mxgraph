function initEleParam(){
  _wndEleParam = new mxWindow('', _wndEleParamCon, 300, 50, 300, null, true, true);
  _wndEleParam.setResizable(true);
  _wndEleParam.setMinimizable(false);
  //~ _wndEleParam.setVisible(true);
}

/** 电气元件的参数设置 start**/
//~ var wnd=null;
function showEleProfile(iid,nn,p){


  var pins = new Array()
  for(var i=0;i<p.children.length;i++){
    //~ console.log( p.children[i].pinn )
    if(p.children[i].isConnectable() && p.children[i].pinn > -1 ) {
      pins.push( p.children[i].getValue() );
    }
  }
  //~ console.log('in window-eleparam.js ，编辑元件参数',pins);

  var html = '<table class="PARAMdiv">'
  for(var i = 0 ; i< _pssEle[nn]['param'].length;i ++){
     html+='<tr><td>'+_pssEle[nn]['param'][i]['label']+'</td><td><input type="text" value="'+_pssEle[nn]['param'][i]['value']+'" /></td><td>'+_pssEle[nn]['param'][i]['unit']+'</td></tr>';
  }
  html+='</table>';
  /*
  var html = '<div class="PARAMdiv">'
  for(var i = 0 ; i< _pssEle[nn]['param'].length;i ++){
    html+='<div>'+_pssEle[nn]['param'][i]['label']+'：<input type="text" value="'+_pssEle[nn]['param'][i]['value']+'"/> '+_pssEle[nn]['param'][i]['unit']+'</div><br>';
  }
  * */
  html +='</div><hr><p>设置引脚标签（可选）</p><div class="PINsdiv" style="text-align:left" id="pinID">'
  var j =1;
 /* for( var x in _pssEle[nn]["pin"]){
    html += '引脚'+j+'：<input type="text" value="'+x+'" style="width:12em"/> 节点号：'+_pssEle[nn]["pin"][x]+'<br>';
    j++;

  }*/
  //~ var noden = _pssEle[nn]['pin'][i]['node'];
  for(var i = 0;i<pins.length;i++,j++){
    //~ if( noden < 0)
    //~ html += '引脚'+j+'：<input type="text" class="param-input" value="'+pins[i]+'" /> 节点号：未设置<br>';
    //~ else
    html += '引脚'+j+'：<input type="text" class="param-input" value="'+pins[i]+'" /><br>'
  }

if( _pssEle[nn]['ctrlable'] ==1 )
  html += '</div><br><div>控制源：<input type="text" class="param-input ctrl-src" value="'+_pssEle[nn]['ctrlby']+'" /><br><button onclick="saveCP(this,\''+iid+'\',\''+nn+'\')">保存</button> <button onclick="cancelCP()">取消</button>';
else // 不能被控制时
  html += '</div><br><br><button onclick="saveCP(this,\''+iid+'\',\''+nn+'\')">保存</button> <button onclick="cancelCP()">取消</button>';
  _wndEleParamCon.innerHTML=html;

  _wndEleParam.setTitle('设置参数：'+nn)
  _wndEleParam.show()
}//function showEleProfile


function cancelCP(){
  //~ wnd.destroy();
  _wndEleParam.hide();
}



function saveCP(self,iid,nn){
 /** 参数 **/
  var d = $('.PARAMdiv').find('input');//参数的父级下的div，用来区分参数，顺序与_pssEle[id]中的一致
  for(var i =0 ; i<d.length;i++){
    _pssEle[nn]['param'][i]['value']=d[i].value
  }
/** pins **/
  d = $('.PINsdiv').children('input');//参数的父级下的div，用来区分参数，顺序与_pssEle[id]中的一致
  var vts = _graph.getModel().getCell(iid);//引脚的父元素
  /*for(var i =0 ; i<d.length;i++){
    _pssEle[nn]['pins'][i]['pin']=d[i].value;

  }*/
  for(var i=0;i<vts.children.length;i++){
    if(vts.children[i].isConnectable() && vts.children[i].pinn > -1) {
      var t = vts.children[i].pinn;
      //~ _pssEle[nn]['pin'][t]['pin']= d[t].value;
      _pssEle[nn]['pin'][t]['label'] = d[t].value; // 记录更新
      vts.children[i].setValue( d[t].value );// 视图更新
    }
  }
  _pssEle[nn]['ctrlby'] = $('.ctrl-src').val();
  _wndEleParam.hide();
  _graph.refresh();
}



/** 测量系统元件的参数设置 start**/
function showMsrProfile(iid,nn,p){

  var pins = new Array()
  for(var i=0;i<p.children.length;i++){
    //~ console.log( p.children[i].pinn )
    if(p.children[i].isConnectable() && p.children[i].pinn > -1 ) {
      pins.push( p.children[i].getValue() );
    }
  }
  //~ console.log('in window-eleparam.js ，编辑元件参数',pins);

  var html = '<table class="PARAMdiv">'
  for(var i = 0 ; i< _pssMsr[nn]['param'].length;i ++){
     html+='<tr><td>'+_pssMsr[nn]['param'][i]['label']+'</td><td><input type="text" value="'+_pssMsr[nn]['param'][i]['value']+'" /></td><td>'+_pssMsr[nn]['param'][i]['unit']+'</td></tr>';
  }
  html+='</table>';
  /*
  var html = '<div class="PARAMdiv">'
  for(var i = 0 ; i< _pssEle[nn]['param'].length;i ++){
    html+='<div>'+_pssEle[nn]['param'][i]['label']+'：<input type="text" value="'+_pssEle[nn]['param'][i]['value']+'"/> '+_pssEle[nn]['param'][i]['unit']+'</div><br>';
  }
  * */
  html +='</div><hr><p>设置引脚标签（可选）</p><div class="PINsdiv" style="text-align:left" id="pinID">'
  var j =1;
 /* for( var x in _pssEle[nn]["pin"]){
    html += '引脚'+j+'：<input type="text" value="'+x+'" style="width:12em"/> 节点号：'+_pssEle[nn]["pin"][x]+'<br>';
    j++;

  }*/
  //~ var noden = _pssCtrl[nn]['pin'][i]['node'];
  for(var i = 0;i<pins.length;i++,j++){
    //~ if( noden < 0)
    //~ html += '引脚'+j+'：<input type="text" class="param-input" value="'+pins[i]+'" /> 节点号：未设置<br>';
    //~ else
    html += '引脚'+j+'：<input type="text" class="param-input" value="'+pins[i]+'" /><br>'
  }


  html += '</div><br><button onclick="saveCtrlP(this,\''+iid+'\',\''+nn+'\')">保存</button> <button onclick="cancelCP()">取消</button>';
  _wndEleParamCon.innerHTML=html;

  _wndEleParam.setTitle('设置参数：'+nn)
  _wndEleParam.show()

}//function showMsrProfile

function saveMsrP(s,iid,nn){
 /** 参数 **/
  var d = $('.PARAMdiv').find('input');//参数的父级下的div，用来区分参数，顺序与_pssEle[id]中的一致
  for(var i =0 ; i<d.length;i++){
    _pssMsr[nn]['param'][i]['value']=d[i].value
  }
/** pins **/
  d = $('.PINsdiv').children('input');//参数的父级下的div，用来区分参数，顺序与_pssEle[id]中的一致
  var vts = _graph.getModel().getCell(iid);//引脚的父元素
  /*for(var i =0 ; i<d.length;i++){
    _pssEle[nn]['pins'][i]['pin']=d[i].value;

  }*/
  for(var i=0;i<vts.children.length;i++){
    if(vts.children[i].isConnectable() && vts.children[i].pinn > -1) {
      var t = vts.children[i].pinn;
      //~ _pssEle[nn]['pin'][t]['pin']= d[t].value;
      _pssMsr[nn]['pin'][t]['label'] = d[t].value; // 记录更新
      vts.children[i].setValue( d[t].value );// 视图更新
    }
  }
  _wndEleParam.hide();
  _graph.refresh();
}

/** 测量系统元件的参数设置 end**/

/** 控制系统元件的参数设置 end**/
function showCtrlProfile(iid,nn,p){

  var pins = new Array()
  for(var i=0;i<p.children.length;i++){
    //~ console.log( p.children[i].pinn )
    if(p.children[i].isConnectable() && p.children[i].pinn > -1 ) {
      pins.push( p.children[i].getValue() );
    }
  }
  //~ console.log('in window-eleparam.js ，编辑元件参数',pins);

  var html = '<table class="PARAMdiv">'
  for(var i = 0 ; i< _pssCtrl[nn]['param'].length;i ++){
     html+='<tr><td>'+_pssCtrl[nn]['param'][i]['label']+'</td><td><input type="text" value="'+_pssCtrl[nn]['param'][i]['value']+'" /></td><td>'+_pssCtrl[nn]['param'][i]['unit']+'</td></tr>';
  }
  html+='</table>';
  /*
  var html = '<div class="PARAMdiv">'
  for(var i = 0 ; i< _pssEle[nn]['param'].length;i ++){
    html+='<div>'+_pssEle[nn]['param'][i]['label']+'：<input type="text" value="'+_pssEle[nn]['param'][i]['value']+'"/> '+_pssEle[nn]['param'][i]['unit']+'</div><br>';
  }
  * */
  html +='</div><hr><p>设置引脚标签（可选）</p><div class="PINsdiv" style="text-align:left" id="pinID">'
  var j =1;
 /* for( var x in _pssEle[nn]["pin"]){
    html += '引脚'+j+'：<input type="text" value="'+x+'" style="width:12em"/> 节点号：'+_pssEle[nn]["pin"][x]+'<br>';
    j++;

  }*/
  //~ var noden = _pssCtrl[nn]['pin'][i]['node'];
  for(var i = 0;i<pins.length;i++,j++){
    //~ if( noden < 0)
    //~ html += '引脚'+j+'：<input type="text" class="param-input" value="'+pins[i]+'" /> 节点号：未设置<br>';
    //~ else
    html += '引脚'+j+'：<input type="text" class="param-input" value="'+pins[i]+'" /><br>'
  }


  html += '</div><br><button onclick="saveCtrlP(this,\''+iid+'\',\''+nn+'\')">保存</button> <button onclick="cancelCP()">取消</button>';
  _wndEleParamCon.innerHTML=html;

  _wndEleParam.setTitle('设置参数：'+nn)
  _wndEleParam.show()

}//function showCtrlProfile
function saveCtrlP(s,iid,nn){
 /** 参数 **/
  var d = $('.PARAMdiv').find('input');//参数的父级下的div，用来区分参数，顺序与_pssEle[id]中的一致
  for(var i =0 ; i<d.length;i++){
    _pssCtrl[nn]['param'][i]['value']=d[i].value
  }
/** pins **/
  d = $('.PINsdiv').children('input');//参数的父级下的div，用来区分参数，顺序与_pssEle[id]中的一致
  var vts = _graph.getModel().getCell(iid);//引脚的父元素
  /*for(var i =0 ; i<d.length;i++){
    _pssEle[nn]['pins'][i]['pin']=d[i].value;

  }*/
  for(var i=0;i<vts.children.length;i++){
    if(vts.children[i].isConnectable() && vts.children[i].pinn > -1) {
      var t = vts.children[i].pinn;
      //~ _pssEle[nn]['pin'][t]['pin']= d[t].value;
      _pssCtrl[nn]['pin'][t]['label'] = d[t].value; // 记录更新
      vts.children[i].setValue( d[t].value );// 视图更新
    }
  }
  _wndEleParam.hide();
  _graph.refresh();

}

/** 控制系统元件的参数设置 end**/
