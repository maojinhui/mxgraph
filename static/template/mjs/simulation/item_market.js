/**
 * Created by owner-pc on 9/5/15.
 */
function init_page(){
    $('.fz-pagination li').click(function(e){
        $('.fz-pagination li').removeClass('active');
        $(this).addClass('active');
    });
}

$(function(){
    init_page();

    window.search_cond = {

    };

    var item_search = new PageSearch({
        results_key : "simulations",
        url : '/data/simulation/market/list/',
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

//            widget.find("span.info:eq(0)").text(result.simu_no);
//            widget.find("span.info:eq(1)").text(result.create_time);
//            widget.find("span.info:eq(2)").text(result.last_modified);
//            widget.find("img.public_img").attr("src", (result.public ? "/static/template/img/gongkai-icon.png" : "/static/template/img/siyou-icon.png"));
//            widget.find("a.bianji-btn").attr("href", "/simulation/edit/" + result.id + "/");
        },
        pre_search : function(){

        },
        post_search : function(){

        }
    });

    item_search.generate_query = function(){
        return window.search_cond;
    };

    item_search.draw_page = draw_center_page;
    item_search.add_table_lines = add_row_widget;

    item_search.search(false);
});