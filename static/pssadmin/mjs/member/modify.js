$(function () {
    $("#submit_button").click(function () {
        $("#main_form").submit();
    })


    $("#back_button").click(function(){
        window.location.href="/bg/page/member/list/";
    })

    $("#modify_password").change(function(){
        if($(this).get(0).checked){
            $("#modify_password_re").find("input").removeAttr("disabled")
        }
        else{
            $("#modify_password_re").find("input").attr("disabled", "disabled")
        }
    })
});