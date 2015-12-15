function handle_error(data){
    if(!data.success){
        if(data.reason == ""){
            return true;
        }
    }

    return false;
}

/**
 * 打开确认对话框
 * @param text 确认对话框中显示的确认内容
 * @param suc_func 用户点击确定时的回调函数
 */
function do_confirm(text, suc_func){
    $("#confirm_dialog").find("p").text(text);
    window.dialog_func = suc_func;
    $('#confirm_dialog').dialog('open');
}

/**
 * 打开警告对话框
 * @param text 警告对话框中显示的警告内容
 * @param suc_func 用户点击确定时的回调函数
 */
function do_alert(text, suc_func){
    $("#alert_dialog").find("p").text(text);
    window.dialog_func = suc_func || function(){}
    $('#alert_dialog').dialog('open');
}