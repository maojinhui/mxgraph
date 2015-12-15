function initWebSck(url){
  if( WebSocket == undefined){
    alert('您的浏览器不支持websocket，无法使用本平台');
    return;
  }
  if( WebSck != null ) return;
  
  WebSck = new WebSocket(url);  
  
  
  WebSck.onopen = websockOpen;
  WebSck.onclose = websockClose;
  WebSck.onsend = websockSend;
  WebSck.onmessage = websockMsg;
}

function websockOpen(event){
  console.info('打开websocket');
}

function websockClose(event){
  console.info('关闭websocket');
}



function websockSend(event){
  
}

function websockMsg(event){
  console.log('接收到消息');
  var j = JSON.parse(event.data);
  var a = j["I-1"];
  console.log(  a[0]['y']);
  return;
    for(var i =0;i<a.length;i++){
    
    Charts["h"].addPoint([  a[i]["y"] ],true,false);
    //~ Charts["h"].addPoint([ a[i]["x"], a[i]["y"] ],true,false);
  }
  return;
  switch( j["cmd"] ){
    case "draw":updateChart(j);break;

  };
  //~ console.log(j);
}

// 发送命令到服务器
function sendCmd(cmd){
  
}
