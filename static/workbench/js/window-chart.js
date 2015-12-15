/**
 *
 * 仿真结果，仿真结果的处理
 * */
function hideChart(){
    _wndChart.hide();
    //~ stopSimu();
}

// 初始化仿真结果窗口
function initChartWnd(){
// 显示分组的输入示例：a,b;c,d
chartGrp=[];
    var dsps = $('#simu_dspgrp').val();
    console.log(dsps);
    
    var g = dsps.split(';');
    console.log( g );
    var _tabhead = '',_tabbody='';
    for(var i=0,j=1;i<g.length;i++,j++){
        if( i==0 ){
            _tabhead+='<a class="dspgrp-head dspgrp-current" onclick="showChart('+i+')">显示'+j+'</a>';
            _tabbody+='<div class="chart-con chart-current " id="chart'+j+'"></div>';
        }
        else{
            _tabhead+='<a class="dspgrp-head" onclick="showChart('+i+')">显示'+j+'</a>';
            _tabbody+='<div class="chart-con " id="chart'+j+'"></div>';
        }
        // make chartGrp
        for(var k=0;k<g.length;k++){
            var d = g[k].split(',');
            chartGrp[k]=d;
        }
    }
    //~ chartGrp
  _wndChartCon.innerHTML='\
    <div class="operate">\
      <span class="btn btnclose " onclick="hideChart()">关闭窗口</span> <span class="btn btnclose " onclick="stopSimu()">停止</span>\
      <span class="btn btnsave ">下一个断点</span>\
      <span class="pull-right">'+_tabhead+'</span>\
    </div>'+_tabbody;


  //~ _wndChart = new mxWindow('仿真结果', _wndChartCon, 30, 30, _WIN.width*0.75, _WIN.height-300, true, true);
  _wndChart = new mxWindow('仿真结果', _wndChartCon, 50, 80, _WIN.width*0.75, 500, true, true);

  _wndChart.setMinimizable(true);
  _wndChart.setMaximizable(true);
  _wndChart.setScrollable(true);
  _wndChart.setVisible(true);
  //~ _wndChart.setClosable(true);
  _wndChart.setScrollable(true);
//~ return;
  // 关闭窗口时的处理函数
  _wndChart.addListener(mxEvent.CLOSE, function(e){
      WebSck.close();
      for(var i=0;i<Charts.length;i++){
            Charts[i].destroy();
      }
  });
  // 窗口显示时的处理
  _wndChart.addListener(mxEvent.SHOW, function(e){

    //~ initWebSck(WebSckUrl);
    initWebSck(WebSckUrl);

    console.log('chart window shown');
    //~ showchart();//cnavasjs 版 
    showchartH();// highcharts 版
  });
  // 窗口最大化时的处理
  _wndChart.addListener(mxEvent.MAXIMIZE, function(e){
    $('#chart1').css('width',_WIN.width);
  });
  // 窗口最大化时的处理
  _wndChart.addListener(mxEvent.HIDE, function(e){
      console.log( ' chart window hidden ' );
    stopSimu();
    
  });
 //~ showchart();
/*
  $('.dspgrp-head').click(function(){
        currentChart = $(this).index();
        $('.dspgrp-head').removeClass('dspgrp-current');
        $(this).addClass('dspgrp-current');
        $('.chart-con').removeClass('chart-current');
        $('.chart-con').eq(currentChart).addClass('chart-current');
        // todo:对于highstock需要修改其子元素宽度
        var w = $('#id_chart').css('width');
        $(Charts[currentChart]).find('.highcharts-container').css('width',w);
      }
  );
*/
// 将绘图body记录入列表
var x = $('.chart-con');
for(var i=0;i<x.length;i++){
    chartBody.push( x[i] );
}

}// initEleCompPanel end
function showChart(target){
    for(var i=0;i<chartBody.length;i++){
        chartBody[i].className='chart-con';
    }
    chartBody[target].className='chart-con chart-current';
    currentChart=target;
}

var chartInterval;
var dps = [];
var tmpi = 0;
var currentChart=0;

//分组记录，方便后面进行查找
var chartGrp=[
    // currentChart:group
    // eg: 1:['E-1','I-2']
];
// 保存绘图的body dom
var chartBody=[];

/********** highcharts ***************/
// 操作
//$(Charts[0]).highcharts('StockChart').series[0].remove()
function showchartH(){
    // 根据分组情况添加显示结果window
    var noc = $('.chart-con');
    // Create the chart

    Highcharts.setOptions({
        global : {
            useUTC : false
        }
    });
console.log('called')
    // Create the chart
var serie = [],se=[];
for(var i=0;i<noc.length;i++){
    console.log( chartGrp[i] ,'....');
    //~ se= chartGrp[i].split(',');
    for( var j =0;j<chartGrp[i].length;j++){
        serie.push( {name:'',data:[0,0]} );
    }
    var cha = $(noc[i]).highcharts('StockChart', {
        chart : {
            renderTo:noc[i],
            events : {
                load : function () {

                    // set up the updating of the chart each second
                    var series = this.series[0];
                    /*setInterval(function () {
                        var x = (new Date()).getTime(), // current time
                            y = Math.round(Math.random() * 100);
                        series.addPoint([x, y], true, true);
                    }, 1000);*/
                }
            }
        },
        title : {
            text : '仿真结果'+i
        },
        rangeSelector: {
            buttons: [{
                count: 100,
                type: 'millisecond',
                text: ''
            }],
            inputEnabled: false,
            selected: 0
        },
        exporting: {
            enabled: true
        },

        series : serie
    });
    
    Charts.push( $(cha).highcharts('StockChart') );
                    console.log( cha )
}// end for


}// endof showChartH

function updateChartH(data){
    // data.dataPoints
    //~ console.log( data );return;
    for(var i =0;i<data['I-1']['dataPoints'].length;i++){
$(Charts[0]).highcharts('StockChart').series[0].addPoint(data['I-1']['dataPoints'][i],false)
    }


}
/********** canvas js ***************/
function showchart(){
    // 根据分组情况添加显示结果window
var noc = $('.chart-con');
for(var i=0,j=1;i<noc.length;i++,j++){
    // 将绘图对象记录进全局绘图对象中
    Charts[i] = new CanvasJS.Chart(noc[i],{
        exportEnabled:true,
        title:{ text:"结果"+j },
        data:[
        // 当有多个显示时这里为多个对象
            { type:'line',dataPoints:dps }
        ]

        });
}

    var xVal = 0,yVal=100;
    function updateChart(){
        for(var i=0;i<noc.length;i++){
            xVal ++;
            tmpi = Math.random() %5;
            yVal = Math.sin(xVal) + tmpi;
            if (dps.length > 50 ){
                dps.shift();
            }
            dps.push(  {x:xVal,y:yVal} )
            Charts[i].render();
        }
    }
    updateChart();
    //~ chartInterval = setInterval(updateChart,100);
    return;
    // Create the chart
   $('#chart1').highcharts('StockChart', {
        chart : {
            events : {
                load : function () {
                }
            }
        },

        rangeSelector: {
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
    initWebSck(WebSckUrl);
}


function updateChart(d){
  //~ console.log('updateChart',a[0]["x"], a[0]["y"] );
  
  //~ var x=0,y=0;
  //~ for(var i =0;i<a.length;i++){
    
    //~ Charts["h"].addPoint([  a[i]["y"] ],true,false);
    //~ Charts["h"].addPoint([ a[i]["x"], a[i]["y"] ],true,false);
  //~ }
  // d like :{y:213}
  //~ Charts[currentChart].options.data[0].push(d);
  /* d like : {
			type: "line",
			dataPoints: [
				{ y: 10 },
				{ y:  4 },
				{ y: 18 },
				{ y:  8 }
			]
		}
  */
  console.log( 'data got:',d );
  //~ Charts[currentChart].options.data.push(d);
  for(var i=0;i<Charts[currentChart].options.data.length;i++){
      for(var k=0;k<d.length;k++)
          for( var j=0;j<d[k]['dataPoints'].length;j++)
            Charts[currentChart].options.data[i].dataPoints.push(d[k]['dataPoints'][j])
  }
  //~ Charts[currentChart].options.data=(d);
  Charts[currentChart].render()

}
