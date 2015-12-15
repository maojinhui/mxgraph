Date.prototype.Format = function(fmt){
  var o = {
    "M+" : this.getMonth()+1,                 //月份
    "d+" : this.getDate(),                    //日
    "h+" : this.getHours(),                   //小时
    "m+" : this.getMinutes(),                 //分
    "s+" : this.getSeconds(),                 //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S"  : this.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt))
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  for(var k in o)
    if(new RegExp("("+ k +")").test(fmt))
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
  return fmt;
}


// ************初始化各项参数 ************** 
function initParam(){
  _WIN.width =  document.body.clientWidth || document.documentElement.clientWidth;
  _WIN.height =  document.body.clientHeight || document.documentElement.clientHeight;
}// iniParam end

function setDragElt(w,h,bg){
  dragElt.style.width = w+'px';
  dragElt.style.height = h+'px';
  dragElt.style.backgroundImage='url('+bg+')';
}
function resetDragElt(){
  dragElt.style.width = '64px';
  dragElt.style.height = '64px';
  dragElt.style.backgroundImage='url()';
}

function getXml(){

  var xx = '<?xml version="1.0"?>';
  var encoder = new mxCodec();
  var node = encoder.encode(_graph.getModel());

  var xml = mxUtils.getXml(node);
  //var tt = encoder.encodeCell(_graph.getModel(),xx,true);

  console.log(mxUtils.getPrettyXml(node), true);
  return xml;
}


// 载入指定id的元件
function getCompById(id){
  var x ='';
  $.ajax({
    type : "get",
    url : '/api/stencil.php?action=stenciltypedetail&q='+id,
    data :'',
    dataType: "json",
    async : false,
    success : function(data){
      x = data;
    }
    });
  return x;
}

function genXml(){
  var xx = '<?xml version="1.0"?>';
  var encoder = new mxCodec();
  var node = encoder.encode(_graph.getModel());
  var xml = mxUtils.getXml(node);
  return xml;
    //console.log(mxUtils.getPrettyXml(node), true);
}


function showSaveComp(){
  console.log(genXml());
}


// ajax上传元件背景
function uploadBg(){

}

function uploadParam(){


}

// 保存元件
function saveComp(){


}
