// Copyright 2015 HuoHe Tec. Inc. All Rights Reserved.
/**
 * @fileoverview 该文件定义PageSearch对象。该对象用于实现前台分页逻辑。
 */

/**
 * 用于创建PageSearch对象
 * 用户可以自定义的配置项包括
 * <ul>
 *     <li>id_searching: 用于显示 正在检索 的div的id
 *     <li>id_no_record: 用于显示 没有记录 的div的id
 *     <li>id_result_div: 用于展示返回结果的div的id
 *     <li>id_hidden_total_record: 用于存储总匹配记录数的hidden域的id
 *     <li>id_hidden_nr_record_each_page: 用于存储每页条数的hidden域的id
 *     <li>id_hidden_current_page: 用于存储当前页面的hidden域的id。页码从1开始
 *     <li>id_pagination: 用于显示页面的div的id
 *     <li>results_key: 返回结果中对象列表的key
 *     <li>url: 用于根据指定条件查询某页对象列表的地址
 *     <li>id_hidden_widget: 用于存储展示对象的模板的id
 *     <li>set_widget: 用户指定的根据对象属性来填充展示模板的函数
 *
 *
 * @param settings 用户自定义配置
 * @constructor
 *
 */
function PageSearch(settings){
    var default_settings = {
        id_searching : "searching_div",
        id_no_record : "no_record_div",
        id_result_div : "result_list",
        id_hidden_total_record : "total_record",
        id_hidden_nr_record_each_page : "nr_record_each_page",
        id_hidden_current_page : "current_page",
        id_pagination : "pagination",

        results_key : 'data',
        url : '',

        id_hidden_widget : "to_copy_widget",
        set_widget : function(widget, result){},
        pre_search : function(){},
        post_search : function(){}
    };

    for(var key in settings){
        default_settings[key] = settings[key]
    }

    this.settings = default_settings;

    this.searching_div = $("#" + default_settings.id_searching);
    this.no_record_div = $("#" + default_settings.id_no_record);
    this.result_div = $("#" + default_settings.id_result_div);

    this.hidden_total_record = $("#" + default_settings.id_hidden_total_record);
    this.hidden_nr_record_each_page = $("#" + default_settings.id_hidden_nr_record_each_page);
    this.hidden_current_page = $("#" + default_settings.id_hidden_current_page);

    this.pagination = $("#" + default_settings.id_pagination);
}

PageSearch.prototype = {
    /**
     * 生成检索条件的抽象函数。用户需要重写该函数来创建查询条件
     * @protected
     * @interface
     * @returns {{}}: 查询条件。以key: value的形式存储
     */
    generate_query : function(){
        return {};
    },

    /**
     * 用于在页面上绘制页码表
     * @param pages 需要显示在页面上的页码，包括上一页，下一页，省略号，以及直接显示的页码。
     * @param active_page 当前页的页码
     * @protected
     * @interface
     */
    draw_page: function(pages, active_page) {
    },

    /**
     * 用于将请求得到的对象列表绘制到页面上
     * @param results 返回的对象列表
     * @protected
     * @interface
     */
    add_table_lines : function(results){
    },

    /**
     * 用于在页面上绘制页面表
     * @param total 所匹配的总条数
     * @param pagesize 每页面显示的条数
     * @param active_page 当前页面的页码
     * @private
     */
    set_pager : function(total, pagesize, active_page){
		if(pagesize <= 0){
			pagesize = 10;
		}

		if(total <= 0){
			return;
		}

		var total_page = Math.ceil(total / pagesize);
		console.log(total + "," + pagesize + "," + total_page + "," + active_page);

		pages = [];
		if(active_page == 1){
			pages[pages.length] = ["上一页", "span"];
		}
		else{
			pages[pages.length] = ["上一页", "a"];
		}

		if(total_page <= 10){
			for(var i = 1;i <= total_page;++i){
				pages[pages.length] = ["" + i, "a"];
			}
		}
		else{
			pages[pages.length] = ["" + 1, "a"];
			if(active_page - 3 > 2){
				pages[pages.length] = ["...", "span"];
			}

			for(var i = Math.max(active_page - 3, 2);i <= active_page + 3 && i <= total_page -1;++i){
				pages[pages.length] = ["" + i, "a"];
			}

			if(active_page +3 < total_page - 1){
				pages[pages.length] = ["...", "span"];
			}

			pages[pages.length] = ["" + total_page, "a"];
		}

		if(active_page == total_page){
			pages[pages.length] = ["下一页", "span"];
		}
		else{
			pages[pages.length] = ["下一页", "a"];
		}

        this.draw_page(pages, active_page);

        var obj = this;
		this.pagination.find("li").not(".active").not(".disabled").click(function(){
			var current_page = obj.hidden_current_page.val();
			var new_page = current_page;
			if($(this).hasClass("add_one")){
				++new_page;
			}

			else if($(this).hasClass("sub_one")){
				--new_page;
			}

			else{
				new_page = parseInt($.trim($(this).attr("data-page")));
			}

			obj.hidden_current_page.val(new_page);
			obj.search(true);
		});
	},

    /**
     * 向后台发送请求，将根据返回结果进行相应的绘制
     * @param conds 向后台发送的检索条件
     * @param page 当前页面的页码
     * @private
     */
    send_request : function(conds, page) {
        this.searching_div.show();
        this.result_div.hide();
        this.no_record_div.hide();
        this.pagination.hide();

        var obj = this;
        var url = obj.settings['url'];

        var pagesize = conds["pagesize"];

        $.get(url, conds, function (result) {
            handle_error(result);

            obj.hidden_total_record.val(result.total);
            //obj.hidden_nr_record_each_page.val(result.pagesize);

            if (result.total == 0) {
                obj.searching_div.hide();
                obj.result_div.hide();
                obj.pagination.hide();
                obj.no_record_div.show();
            }
            else {
                obj.searching_div.hide();
                obj.no_record_div.hide();
                obj.result_div.show();
                obj.pagination.show();

                obj.set_pager(result.data.total, pagesize, page);
                obj.add_table_lines(result["data"][obj.settings["results_key"]], result);
            }

            obj.settings.post_search();

        }, 'json');
    },

    /**
     * 发起检索并更新页面。
     * @param keep_page 检索后跳转到当前页面还是首页
     */
    search : function(keep_page){
        var conds = this.generate_query();

		//page
		var page = keep_page ? parseInt(this.hidden_current_page.val()) : 1;
		//pagesize
		var pagesize = parseInt(this.hidden_nr_record_each_page.val());

		conds['page'] = page;
		conds['pagesize'] = pagesize;

        this.settings.pre_search();

		this.send_request(conds, page);
    }
};

/**
 * draw_page方法的一种实现，用于系统中所有的页码表
 * @this {PageSearch}
 * @param pages 页码表
 * @param active_page 当前页面的页码
 */
function draw_center_page(pages, active_page){
    var ul = this.pagination;
    ul.html("");

    for(var i = 0;i < pages.length;++i){
        var li = $("<li/>");

        var ele = null;
        if(pages[i][1] == "a"){
            ele = $("<a href='JavaScript:void(0)'></a>");
        }
        else{
            ele = $("<a href='JavaScript:void(0)'></a>");
        }

        if(i == 0){
            ele = $("<a href=\"javascript:void(0)\"><i class=\"fa fa-angle-left\"></i></a>");
            ele.addClass("sub_one");
        }
        else if(i == pages.length - 1){
            ele = $("<a href=\"javascript:void(0)\"><i class=\"fa fa-angle-right\"></i></a>");
            ele.addClass("add_one");
        }
        else{
            ele.text(pages[i][0]);
            ele.attr("data-page", pages[i][0])
        }

        //console.log(parseInt(pages[i][0]) == active_page);
        if(parseInt(pages[i][0]) == active_page){
            li.addClass("active");
        }

        li.append(ele);
        ul.append(li);
    }

    if(active_page == 1){
        ul.find("li:eq(0)").addClass("disabled");
    }

    if(active_page == pages.length - 2){
        ul.find("li:last").addClass("disabled");
    }
}

function add_row_widget(results){
    this.result_div.html("");

    for(var i = 0;i < results.length;++i){
        var widget = $("#" + this.settings.id_hidden_widget).clone();
        widget.show();
        this.settings.set_widget(widget, results[i], i);

        this.result_div.append(widget);
    }
}
