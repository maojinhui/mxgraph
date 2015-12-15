/**
 * Created by owner-pc on 9/5/15.
 */
function init_page(){
    $(".item-create").click(function(){
        $(".sidebar-dropdown").toggle("normal");
    });
    // 左右同高;
//    $(".sidebar").height($(".my-project").height());
//    $(".right-main").height($(".my-project").height());
}

$(function(){
    var id = get_id_from_url();

    window.search_cond = {
        user_id : id
    };

    var item_search = new PageSearch({
        results_key : "simulations",
        url : '/data/simulation/index/list/',
        set_widget : function(widget, result){
            widget.removeAttr("id");
            var a = widget.find("a.header");
            a.attr("href", "/simulation/detail/" + result.id + "/");
            a.text(result.name);

            widget.find("p").text(result.desc);

            a = widget.find("a.author");
            a.attr("href", "/user/index/" + result.user.id + "/");
            a.text(result.user.username);

            widget.find("span.lm_span").text(result.last_modified);
        },
        pre_search : function(){
            $(".right-main").css("min-height", $(".right-main").height());
        },
        post_search : function(){
            $("#result_div").css("min-height", "auto");
        }
    });
    item_search.generate_query = function(){
        return window.search_cond;
    };

    item_search.draw_page = draw_center_page;
    item_search.add_table_lines = add_fluid_widget;

    item_search.search(false);

    init_page();
});