
// 初始化信息面板
function initInfoPanel(){
  //~ var con = document.createElement('div');
  _infoCon.innerHTML='<center class="info">欢迎使用Cloudpss</center>'
  _infoPanel = new mxWindow('系统信息', _infoCon, _WIN.width-320, _WIN.height-170,300,150, true, true);

  _infoPanel.setMinimizable(true);
  _infoPanel.setResizable(true);
  _infoPanel.setMaximizable(true);
  _infoPanel.setVisible(true);
  _infoPanel.setScrollable(true);
  
}// initInfoPanel end


// 设置系统信息
function setSysInfo(type,info){
  var time1 = new Date().Format("yyyy-MM-dd hh:mm:ss");
  switch(type){
    case "warning":
      $(_infoCon).append('<span class="warning">'+time1+' 警告</span><div class="info-content">'+info+'</div>');
      break;
    case "error":
      $(_infoCon).append('<span class="error">'+time1+' 错误</span><div class="info-content">'+info+'</div>');
      break;
    case "info":
      $(_infoCon).append('<span class="info">'+time1+' 消息</span><div class="info-content">'+info+'</div>');
      break;
    default:
      $(_infoCon).append('<span class="info">'+time1+' 消息</span><div class="info-content">'+info+'</div>');
      break;;
  }
}
