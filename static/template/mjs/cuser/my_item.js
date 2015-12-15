/**
 * Created by owner-pc on 9/2/15.
 */
function init_page(){
    $('.fz-navbar-nav li').click(function(e){
        $('.fz-navbar-nav li').removeClass('active');
        $(this).addClass('active');
    });

    $(".item-create").click(function(){
        $(".sidebar-dropdown").toggle("normal");
    });
    // 左右同高;
//    $(".sidebar").height($(".my-project").height());
//    $(".right-main").height($(".my-project").height());


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

    $.get("/data/simulation/folder/list/", {}, function(result){
        if(check_action_result(result)){
            return;
        }

        var folders = result.data;
        for(var i = 0;i < folders.length;++i){
            var f = folders[i];

            var li = $("<li><a></a></li>");
            var a = li.find("a");
            a.attr("href", "javascript:void(0)");
            a.attr("data-id", f.id);
            a.text(f.name + "(" + f.size + ")");
            a.addClass("item-file");

            $("#folder_ul").append(li);
        }

        window.search_cond = {

        };
        var item_search = new PageSearch({
            results_key : "simulations",
            url : '/data/simulation/mine/list/',
            set_widget : function(widget, result){
                widget.removeAttr("id");
                var a = widget.find("a.header");
                a.attr("href", "/simulation/detail/" + result.id + "/");
                a.text(result.name);

                widget.find("span.info:eq(0)").text(result.simu_no);
                widget.find("span.info:eq(1)").text(result.create_time);
                widget.find("span.info:eq(2)").text(result.last_modified);
                widget.find("img.public_img").attr("src", (result.public ? "/static/template/img/gongkai-icon.png" : "/static/template/img/siyou-icon.png"));
                widget.find("a.bianji-btn").attr("href", "/simulation/edit/" + result.id + "/");
                widget.find("a.dakai-btn").attr("href", "/editor/?id=" + result.id);
            },
            pre_search : function(){
                $(".right-main").css("min-height", $(".right-main").height());
            },
            post_search : function(){
                // 左右同高;
//                $(".right-main").height($("#result_list").height());
//                $(".sidebar").height($(".my_project").height());

                $("#result_div").css("min-height", "auto");
            }
        });
        item_search.generate_query = function(){
            return window.search_cond;
        };

        item_search.draw_page = draw_center_page;
        item_search.add_table_lines = add_fluid_widget;


        $("a.item-file").click(function(){
            var id = $(this).attr("data-id");

            window.search_cond = {
                type : 'folder',
                folder : id
            };
            item_search.search(false);
        });

        $("#my_create").click(function(){
            window.search_cond = {
                type : 'create'
            };
            item_search.search(false);
        });

        $("#my_favor").click(function(){
            window.search_cond = {
                type : 'favor'
            };
            item_search.search(false);
        });

        init_page();

        $("#my_create").trigger("click");
    }, 'json');
});