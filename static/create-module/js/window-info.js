
// 初始化信息面板
function initInfoPanel(){
  //~ var con = document.createElement('div');
  _wndInfoCon.innerHTML='<center class="info">欢迎使用Cloudpss</center>'
  _wndInfo = new mxWindow('系统信息', _wndInfoCon, _WIN.width-320, _WIN.height-170,300,150, true, true);

  _wndInfo.setMinimizable(true);
  _wndInfo.setResizable(true);
  _wndInfo.setMaximizable(true);
  _wndInfo.setVisible(true);
  _wndInfo.setScrollable(true);
  
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
