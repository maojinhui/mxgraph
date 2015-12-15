
// 初始化信息面板
function initInfoPanel(){
  //~ var con = document.createElement('div');
  _wndInfoCon.innerHTML='<center class="info">欢迎使用Cloudpss</center>'
  _wndList.wInfo = new mxWindow('系统信息', _wndInfoCon, _WIN.width-320, _WIN.height-170,300,150, true, true);

_wndList.wInfo.w=300;
_wndList.wInfo.h=150;

  _wndList.wInfo.setMinimizable(true);
  _wndList.wInfo.setResizable(true);
  _wndList.wInfo.setMaximizable(true);
  _wndList.wInfo.setVisible(true);
  _wndList.wInfo.setScrollable(true);
  
}// initInfoPanel end


// 设置系统信息
function setSysInfo(type,info){
  var time1 = new Date().Format("yyyy-MM-dd hh:mm:ss");
  switch(type){
    case "warning":
      $(_wndInfoCon).append('<span class="warning">'+time1+' 警告</span><div class="info-content">'+info+'</div>');
      break;
    case "error":
      $(_wndInfoCon).append('<span class="error">'+time1+' 错误</span><div class="info-content">'+info+'</div>');
      break;
    case "info":
      $(_wndInfoCon).append('<span class="info">'+time1+' 消息</span><div class="info-content">'+info+'</div>');
      break;
    default:
      $(_wndInfoCon).append('<span class="info">'+time1+' 消息</span><div class="info-content">'+info+'</div>');
      break;;
  }
}
