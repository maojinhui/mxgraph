/**
 *
 * 仿真结果，仿真结果的处理
 * */


// 初始化仿真结果窗口
function initChartWnd(){
  _wndChartCon.innerHTML='\
    <div class="operate">\
      <span class="btn " onclick="stopSimu()">停止</span>\
      <span class="btn ">下一个断点</span>\
      <span class="pull-right">\
        <a class="dspgrp-head dspgrp-current">显示组一</a>\
        <a class="dspgrp-head">显示组二</a>\
        <a class="dspgrp-head">显示组三</a>\
      </span>\
    </div>\
    <div class="chart-con" id="chart1">\
    </div>';


  //~ _wndChart = new mxWindow('仿真结果', _wndChartCon, 30, 30, _WIN.width*0.75, _WIN.height-300, true, true);
  _wndChart = new mxWindow('仿真结果', _wndChartCon, 50, 80, _WIN.width*0.75, 500, true, true);


  _wndChart.setMinimizable(true);
  //~ _wndChart.setMaximizable(true);
  _wndChart.setScrollable(true);
  //~ _wndChart.setVisible(true);
  //~ _wndChart.setClosable(true);
  _wndChart.setScrollable(true);

  // 关闭窗口时的处理函数
  _wndChart.addListener(mxEvent.CLOSE, function(e){
      WebSck.close();
  });
  // 窗口显示时的处理
  _wndChart.addListener(mxEvent.SHOW, function(e){
    initWebSck('ws://localhost:13254');
    showchart();
  });
  // 窗口最大化时的处理
  _wndChart.addListener(mxEvent.MAXIMIZE, function(e){
    $('#chart1').css('width',_WIN.width);
  });
 //~ showchart();
  
}// initEleCompPanel end

var chartInterval;

function showchart(){


    //~ Highcharts.setOptions({
        //~ global : {
            //~ useUTC : false
        //~ }
    //~ });

    // Create the chart
   $('#chart1').highcharts('StockChart', {
        chart : {
            events : {
                load : function () {

                    // set up the updating of the chart each second
                    //~ var series = this.series[0];
                    /*chartInterval=setInterval(function () {
                        var x = (new Date()).getTime(), // current time
                            y = Math.round(Math.random() * 100);
                        series.addPoint([x, y], true, true);
                    }, 1000);*/
                }
            }
        },

        rangeSelector: {
            /*buttons: [{
                count: 1,
                type: 'minute',
                text: '1M'
            }, {
                count: 5,
                type: 'minute',
                text: '5M'
            }, {
                type: 'all',
                text: 'All'
            }],*/
            inputEnabled: false,
            selected: 0
        },

        title : {
            text : '测试结果'
        },

        exporting: {
            enabled: false
        },

        series : [{
            name : '',
            data : (function () {
                // generate an array of random data
                var data = [], time = (new Date()).getTime(), i;

                for (i = -5; i <= 0; i += 1) {
                    data.push([
                        //~ time + i * 1000,
                        i,
                        Math.round(Math.random() * 100)
                    ]);
                }
                //~ console.log('初始数据:',data);
                return data;
            }())
        }]
    });

    Charts["h"] = $('#chart1').highcharts('StockChart').series[0];
    //~ initWebSck('ws://192.168.0.108:13254');
    initWebSck('ws://localhost:13254');
}


function updateChart(d){
  var a = d["I-1"];
  //~ console.log('updateChart',a[0]["x"], a[0]["y"] );
  
  //~ var x=0,y=0;
  for(var i =0;i<a.length;i++){
    
    Charts["h"].addPoint([  a[i]["y"] ],true,false);
    //~ Charts["h"].addPoint([ a[i]["x"], a[i]["y"] ],true,false);
  }

}
