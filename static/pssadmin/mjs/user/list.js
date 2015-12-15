$(function() {
    window.search_cond = {};
    var item_search = new PageSearch({
        results_key: "objects",
        url: '/bg/user/list/',
        set_widget: function (widget, result, i) {
            widget.removeAttr("id");
            widget.find("td:eq(0)").text(i + 1);
            widget.find("td:eq(1)").text(result.status ? "正常" : "禁用").addClass(result.status ? "text-success" : "text-danger");
            widget.find("td:eq(2)").text(result.username);
            widget.find("td:eq(3)").text(result.email);
            widget.find("td:eq(4)").text(result.is_superuser ? "是" : "否");
            widget.find("td:eq(5)").text("");

            widget.find("a:eq(0)").attr("href", "/bg/page/user/modify/" + result.id + "/");
            widget.find("a:eq(1)").click(function(){
               if(confirm("确定删除用户"+result.username + "?")){
                   $.post("/bg/user/remove/" + result.id + "/", {}, function(result){
                        if(handle_error(result)){
                            return;
                        }

                       if(result.success){
                           alert("删除成功");
                           window.location.href="/bg/page/user/list/";
                           return;
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