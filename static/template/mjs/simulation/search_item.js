/**
 * Created by owner-pc on 9/7/15.
 */

$(function(){
    $("#searching-btn").click(function(){
        window.location.href="/simulation/search/?q=" + $("#q_input").val();
    });

    var item_search = new PageSearch({
        results_key : "simulations",
        url : '/data/simulation/search/list/',
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

        },
        post_search : function(){
            $("#total_count").text($("#total_record").val());
        }
    });
    item_search.generate_query = function(){
        return {
            q : $("#q_input").val()
        }
    };

    item_search.draw_page = draw_center_page;
    item_search.add_table_lines = add_fluid_widget;

    item_search.search(false);
});