
// 初始化仿真参数设置窗口
function initParamWnd(){
  var con = document.createElement('div');
  
  // 是否已保存参数
  con.innerHTML='\
  <div class="simu-param" id="wnd_simuparam">\
    <table class="simu-paramtbl">\
      <tr><td class="text-right">仿真开始时间（单位：s）</td><td><input class="param-inpt" value="" id="simu_start"/></td></tr>\
      <tr><td class="text-right">仿真结束时间（单位：s）</td><td><input class="param-inpt" value="" id="simu_end"/></td></tr>\
      <tr><td class="text-right">步长（单位：s）</td><td><input class="param-inpt" value="" id="simu_step"/></td></tr>\
      <tr><td class="text-right">开关周期（单位：s）</td><td><input class="param-inpt" value="" id="simu_switch"/></td></tr>\
      <tr><td class="text-right">断点（单位：s）</td><td><input class="param-inpt" value="" id="simu_breakPoint"/></td></tr>\
      <tr><td class="text-right">显示分组</td><td><input class="param-inpt" value="" id="simu_dspgrp" /></td></tr>\
      <tr><td class="text-right">是在断点处暂停</td><td><input type="checkbox" class="param-inpt" value="" id="simu_pausebrk"/></td></tr>\
      \
      <tr><td class="text-right"><span onclick="saveSimuParam()" class="btn btnsave">保存</span></td><td><span onclick="discardSimuParam()" class="btn btncancel">取消</span></td></tr>\
    </table>\
  </div>';



  _simuParam = new mxWindow('设置仿真参数', con, _WIN.width*0.5-150, _WIN.height*0.5-200, 350,null, true, true);


  //~ _simuParam.setVisible(true);
  
}// initEleCompPanel end


function setSimuParam(){
  _simuParam.show();
}

function saveSimuParam(){
    var start = $('#simu_start').val();
    var end = $('#simu_end').val();
    var step = $('#simu_step').val();
    var _switch = $('#simu_switch').val();
    var brk = $('#simu_breakPoint').val();
    var brks = brk.split(',');
    
    _simuPARAM["_isSet"]=true,
    _simuPARAM["start"]=start,//仿真开始时间，单位：秒
    _simuPARAM["end"]=end,//仿真结束时间，单位：秒
    _simuPARAM["step"]=step,//步长，单位：秒
    _simuPARAM["switch"]=_switch,//开关周期，单位：秒
    _simuPARAM["breakPoint"]=brks;//断点处,断点的数组列表

    _simuParam.hide();
}

function discardSimuParam(){
  _simuParam.hide();
}
