/**
 * Created by owner-pc on 9/7/15.
 */
function init_page(){
    $(".item-create").click(function(){
        $(".sidebar-dropdown").toggle("normal");
    });
    // 左右同高;
    $(".sidebar").height($(".my-project").height());
    $(".right-main").height($(".my-project").height()-40);

    $('.menu a').click(function(e){
        $('.menu a').removeClass('active');
        $(this).addClass('active');
    });


    // .item:hover
    // $(".project-box .item").hover(function(){
    //     $(this).css("background","#e8e8e8");
    // },function(){
    //     $(this).css("background","#fff");
    // })
}

function addFolder(f){
    var fs = $("#folder_select");
    var li = $("<li><a></a></li>");
    var a = li.find("a");
    a.attr("href", "javascript:void(0)");
    a.attr("data-id", f.id);
    a.text(f.name + "(" + f.size + ")");
    a.addClass("item-file");

    $("#folder_ul").append(li);

    //fs
    var option = new Option();
    option.value = f.id;
    option.text = f.name;
    fs.get(0).options[fs.get(0).options.length] = option;
}


$(function(){
    $.get("/data/simulation/item/count/", {}, function(result){
        if(check_action_result(result)){
            return;
        }

        var data = result.data;
        $("#count_all").text(data.all);
        $("#count_mine").text(data.mine);
        $("#count_collect").text(data.collect);
        $("#count_favor").text(data.favor);
    }, 'json');


    $.get("/data/simulation/folder/list/", {}, function(result) {
        if (check_action_result(result)) {
            return;
        }

        var folders = result.data;
        for (var i = 0; i < folders.length; ++i) {
            var f = folders[i];

            addFolder(f);
        }

        init_page();

        $("#create_folder").click(function(){
            var name = $("#nf_name_input").val();
            if($.trim(name) == ""){
                alert("请输入文件夹名称");
                return;
            }

            $.post("/data/simulation/folder/create/", {name : name}, function(result){
                if (check_action_result(result)) {
                    return;
                }

                if(!result.success){
                    alert(result.reason);
                    return;
                }


                var f = result.folder;
                f.size = 0;
                addFolder(f);

                var fs = $("#folder_select");
                fs.val(f.id);
                $("#myModal").modal("hide");


            }, 'json');
        });
    });
});