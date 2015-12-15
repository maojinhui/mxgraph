$(function() {
    window.search_cond = {};
    var item_search = new PageSearch({
        results_key: "objects",
        url: '/bg/group/list/',
        set_widget: function (widget, result, i) {
            widget.removeAttr("id");
            widget.find("td:eq(0)").text(i + 1);
            widget.find("td:eq(1)").text(result.name);
            widget.find("a:eq(0)").attr("href", "/bg/page/group/modify/" + result.id + "/");
            widget.find("a:eq(1)").click(function(){
               if(confirm("确定要删除用户组"+result.name + "?")){
                   $.post("/bg/group/remove/" + result.id + "/", {}, function(result){
                        if(handle_error(result)){
                            return;
                        }

                       if(result.success){
                           alert("删除成功");
                           window.location.href="/bg/page/group/list/";
                       }

                       alert(result.reason);
                   }, 'json');
                }
            });
        },
        pre_search: function () {
        },
        post_search: function () {
        }
    });
    item_search.generate_query = function () {
        return window.search_cond;
    };

    item_search.draw_page = draw_center_page;
    item_search.add_table_lines = add_row_widget;


    item_search.search(false);
});