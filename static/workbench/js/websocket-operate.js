function initWebSck(url){
  if( WebSocket == undefined){
    alert('您的浏览器不支持websocket，无法使用本平台');
    return;
  }
  if( WebSck != null ) return;
  
  WebSck = new WebSocket(url);  
  
  
  WebSck.onopen = onwebsockOpen;
  WebSck.onclose = onwebsockClose;
  WebSck.onsend = onwebsockSend;
  WebSck.onmessage = onwebsockMsg;
}

function onwebsockOpen(event){
  console.info('打开websocket，发送开始命令');
  WebSck.send('{ "type":0, "task_id":'+_task_id+'}');
  console.info('发送开始命令结束');
}

function onwebsockClose(event){
  console.info('关闭websocket');
}



function onwebsockSend(event){
  console.log('websocket发送了',event.data);
}

function onwebsockMsg(event){
  console.log('websocket接收到消息',event.data);

  var dat = JSON.parse(event.data);
/*
    var dt = chartGrp[currentChart];
    var dataformated=[];
    for( var i=0;i<dt.length;i++){
        /// 注意这里的数据要与显示的一致
        //for(var j=0;j<dt[i].length;j++){
            dataformated.push( dat[dt[i]] );
        //}
    }
*/
 // Charts.render();
  //return;
  switch( dat["cmd"] ){
      // 函数定义在window-chart.js
      // datformated是已格式化好的数据
    //~ case "draw":updateChart(dataformated);break;// canvas js 版
    case "draw":{
        /*for(var j=0;j<chartGrp[currentChart].length;j++){
            for(var i =0;i<dat[ chartGrp[currentChart][j] ]['dataPoints'].length;i++){
                $(Charts[currentChart])
                    .highcharts('StockChart')
                    .series[j]
                    .addPoint(dat[ chartGrp[currentChart][j] ]['dataPoints'][i],false)
            }
        }*/
    for(var k=0;k<chartGrp.length;k++){// for 1 start
        for(var j=0;j<chartGrp[k].length;j++){
            for(var i =0;i<dat[ chartGrp[k][j] ]['dataPoints'].length;i++){
                Charts[k]
                    //.addSeries( dat[ chartGrp[currentChart][j] ]['dataPoints'] );
                    .series[j]
                    .addPoint(dat[ chartGrp[k][j] ]['dataPoints'][i],false)
            }
        }
    //~ Charts[k].redraw();
    }// for 1 end
        //updateChartH(dat);
        break;// highcharts 版
    }

  };
  
  Charts[currentChart].redraw();
  //~ console.log(j);
}

// 发送命令到服务器
function sendCmd(cmd){
    var msg ={
        "cmd":cmd,
        
    }
  WebSck.send(cmd);
}


function startChart(){
//~ initWebSck(WebSckUrl);
}
