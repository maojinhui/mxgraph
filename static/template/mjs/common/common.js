// Copyright 2015 HuoHe Tec. Inc. All Rights Reserved.
/**
 * @fileoverview 本文件用于定义一些各个页面的公共初始化函数，并且定义一组公用的工具函数
 */


/**
 * 全局初始化函数，用于在各个页面上实现一些共同的功能和效果。该函数实现三个功能
 * <ul>
 *     <li>初始化确认对话框（如果存在）。如果某页面需要使用确认对话框，需要在{@code <body/> }元素中添加
 *         {@code <div id="confirm_dialog"><p></p></div>}标记，并且添加{@code window.dialog_func}函数来处理“确认”按钮的回调。
 *     <li>初始化警告对话框（如果存在）。如果某页面需要使用警告对话框，需要在{@code <body/> }元素中添加
 *         {@code <div id="confirm_dialog"><p></p></div>}标记，并且添加{@code window.dialog_func}函数来处理“确认”按钮的回调。
 *     <li>初始化{@code input.date-picker}类型的输入框，用于选择日期。基于bootstrap-datetimepicker实现。
 *     <li>初始化{@code input.datetime-picker}类型的输入框，用于选择日期和时间。基于bootstrap-datetimepicker实现。
 * </ul>
 *
 * */
$(function(){
//    $('#confirm_dialog').dialog({
//		autoOpen: false,
//		width: 400,
//		modal: true,
//		buttons: {
//				"取消": function() {
//					$( this ).dialog( "close" );
//				},
//                "确定" : function(){
//                    $( this ).dialog( "close" );
//
//                    if(window.dialog_func){
//                        window.dialog_func();
//                    }
//                }
//			}
//		});
//
//    $('#alert_dialog').dialog({
//		autoOpen: false,
//		width: 400,
//		modal: true,
//		buttons: {
//                "确定" : function(){
//                    $( this ).dialog( "close" );
//                    if(window.dialog_func){
//                        window.dialog_func();
//                    }
//                }
//			}
//		});
//
//    $("input.date-picker").datetimepicker({
//        format : 'yyyy-mm-dd',
//        minView : 2,
//        autoclose : true
//    });
//
//    $("input.datetime-picker").datetimepicker({
//        format : 'yyyy-mm-ddThh:ii:ss',
//        autoclose : true,
//        minuteStep : 2
//    });
});

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

/**
 * 在XHR请求中，检查后台返回的结果。程序中对后台返回的结果采用的统一格式，即一定包括以下字段：
 * <ul>
 *     <li> {@code success}: 是否成功
 *     <li> {@code reason}: 如果失败，则代表出错的原因
 * </ul>
 * 该方法还对一些全局的错误进行了处理，包括：
 * <ul>
 *     <li>{@code not_login}: 用户未登陆，跳转到用户登陆界面。
 *     <li>{@code error_404}: 暂时未做处理。
 *
 *  @param obj 后台返回的结果
 * @returns {boolean} 结果中包含的错误是否已处理
 */
function check_action_result(obj){
    if(!obj.success){
        if(obj.reason == "not_login"){
            window.location.href = "/to_login/";
            return true;
        }
        else if(obj.reason == "error_404"){
            //window.location.href = "";
            return true;
        }
    }

    return false;
}

/**
 * 从{@code <URL>/<ID>/} 样式的url中截取ID号
 * @param url 要处理的url。如果为空，则取当前页面的网址
 * @returns {Number} url最后一段所包括的ID号
 */
function get_id_from_url(url){
    var url = url || window.location.href;

    var url = url.split("?")[0];

    var parts = url.split("/");
    for(var i = parts.length - 1;i >= 0;--i){
        if($.trim(parts[i]) != ""){
            return parseInt(parts[i]);
        }
    }
}

/**
 * 将url中的查询字符串转化为哈希表
 * @returns {{}}: 代表查询内容的哈希表，其中key为查询项的名称，value为查询项的值
 */
function QueryStringToJSON() {
    var pairs = location.search.slice(1).split('&');

    var result = {};
    for(var i = 0;i < pairs.length;++i){
        var pair = pairs[i];
        pair = pair.split('=');
		var value = decodeURIComponent(pair[1] || '');

		if(pair[0] in result){
			obj = result[pair[0]];
			if($.isArray(obj)){
				obj[obj.length] = value;
			}
			else{
				result[pair[0]] = [obj, value];
			}
		}
		else{
        	result[pair[0]] = value;
		}
    }


    //return JSON.parse(JSON.stringify(result));
    return result;
}

/**
 * 在Chrome或FF中，浏览器提供了console对象，用户可以输出内容到控制台。但是IE中并未提供相应对象。
 * 因此，需要在该对象不存存时创建，以防止添加了调试输出语句的代码在IE中报错。
 */
if(!window.console){
    console = {
        log : function(a){

        }
    }
}


