var articleQueryFacade = {
    undeliveredGrid: null,
    articelGrid: null,
    collectGrid: null,
    iframeCount : 0,
    getQueryString : function() {
        var queryString = $("#tabs-1").find("form").serialize();
        if($('#tabs-1').find('.isEssential').is(':checked')) {
        	queryString += "&isEssential=" + 1;
        }
        if($('#tabs-1').find('.isImportant').is(':checked')) {
        	queryString += "&isImportant=" + 1;
        }
        return queryString;
    },
    query : function() {
        var queryString = articleQueryFacade.getQueryString();
        var _this = this;
        var grid_selector = "#table-data-list-article";
        var pager_selector = "#table-data-list-article-pager";
        var url = '/cms/article/findPageByIndex?' + queryString;
        if (_this.articelGrid) {
            // 根据搜索条件，重新加载
            $(grid_selector).jqGrid('setGridParam', {
                url : url,
                page : 1,
                forceFit : true,
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.articelGrid = $(grid_selector).jqGrid({
                url : url,
                datatype : 'json',
                jsonReader : {
                    root : "data",
                    page : "curPage",
                    total : "totalPage",
                    records : "totalRows"
                },
                prmNames : {
                    page : 'curPage',
                    rows : 'pageSize',
                    sort : 'sidx',
                    order : 'sort'
                },
                colNames : ['所属类别', '文章名称', '创建日期', '创建人'],
                cmTemplate: {sortable:false},
                colModel : [{
                    name : '',
                    width : 160,
                    formatter : function(value, option, row) {
                    	return row.catLevel1Name + '>' + row.catLevel2Name + '>' + row.catLevel3Name;
                    }
                }, {
                    name : 'title',
                    align : 'center',
                    width : 160,
                    formatter : function(value, option, row) {
                    	var res = '<a href="javascript:void(0);" onclick="$.showCommonEditDialog(\'/cms/article/showContent?id='+row.id+'&isPreview=false\',\'查看\',1000,550);">';
                    	res += value;
                    	if(row.isEssential == 1) {
                    		res = '<font color="green">[精]</font>' + res;
                    	}
                    	if(row.isImportant == 1) {
                    		res = '<i class="fa fa-exclamation red"></i>' + res;
                    	}
                    	res += '</a>';
                    	return res;
                    }
                }, {
                    name : 'modifyTime',
                    width : 80,
                    formatter : function(value, option, row) {
                    	return $.dateFormat(value, 'yyyy-MM-dd');
                    }
                }, {
                    name : 'createBy',
                    align : 'center',
                    width : 100
                }],
                rowNum : 10,
                rowList : [ 10, 20, 30 ],
                pager : pager_selector,
                height : 340,
                autoHeight : true,
                viewrecords : true,
                loadComplete : function() {
                    var table = this;
                    setTimeout(function() {
                        updatePagerIcons(table);
                        $.removeScrollX($('#data-list-article'));
                    }, 0);
                }
            });
        }
        // 自适应宽度
        $.resizeGrid(grid_selector);
    },
    queryCollect : function() {
        var _this = this;
        var grid_selector = "#table-data-list-draft";
        var pager_selector = "#table-data-list-draft-pager";
        var url = '/cms/articleQuery/findCollectPage';
        if (_this.collectGrid) {
            // 根据搜索条件，重新加载
            $(grid_selector).jqGrid('setGridParam', {
                url : url,
                page : 1,
                forceFit : true,
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.collectGrid = $(grid_selector).jqGrid({
                url : url,
                datatype : 'json',
                jsonReader : {
                    root : "data",
                    page : "curPage",
                    total : "totalPage",
                    records : "totalRows"
                },
                prmNames : {
                    page : 'curPage',
                    rows : 'pageSize',
                    sort : 'sidx',
                    order : 'sort'
                },
                colNames : ['所属类别', '文章名称', '发布日期', '收藏日期'],
                cmTemplate: {sortable:false},
                colModel : [{
                    name : '',
                    align : 'center',
                    width : 160,
                    formatter : function(value, option, row) {
                    	return row.catLevel1Name + '>' + row.catLevel2Name + '>' + row.catLevel3Name;
                    }
                }, {
                    name : 'title',
                    align : 'center',
                    width : 160,
                    formatter : function(value, option, row) {
                    	var res = '<a href="javascript:void(0);" onclick="$.showCommonEditDialog(\'/cms/article/showContent?id='+row.id+'&isPreview=false\',\'查看\',1000,550);">';
                    	res += value;
                    	if(row.isEssential == 1) {
                    		res = '<font color="green">[精]</font>' + res;
                    	}
                    	if(row.isImportant == 1) {
                    		res = '<i class="fa fa-exclamation red"></i>' + res;
                    	}
                    	res += '</a>';
                    	return res;
                    }
                }, {
                    name : 'approveTime',
                    align : 'center',
                    width : 80,
                    formatter : function(value, option, row) {
                    	return $.dateFormat(value, 'yyyy-MM-dd');
                    }
                }, {
                    name : 'collectTime',
                    align : 'center',
                    width : 80,
                    formatter : function(value, option, row) {
                        return $.dateFormat(value, 'yyyy-MM-dd');
                    }
                }],
                rowNum : 10,
                rowList : [ 10, 20, 30 ],
                pager : pager_selector,
                height : 340,
                autoHeight : true,
                viewrecords : true,
                loadComplete : function() {
                    var table = this;
                    setTimeout(function() {
                        updatePagerIcons(table);
                        $.removeScrollX($('#data-list-draft'));
                    }, 0);
                }
            });
        }
        // 自适应宽度
        $.resizeGrid(grid_selector);
    },
    view : function(id) {
        var url = '/cms/article/exportDetails?id=' + id;
        if($('#downloadIfm').attr('src')) {
        	$('#downloadIfm').attr('');
        }
        $('#downloadIfm').attr('src', url);
    }
};
$(function() {
    $('#page_tabs').tabs();
    $.initDatePicker('#dateRange');
    $('#searchBtn').click(articleQueryFacade.query);
    $("#addBtn").click(function() {
    	articleQueryFacade.toAddPage(null,"新建文章", false);
    	});
    listen();
    articleQueryFacade.query();
    articleQueryFacade.queryCollect();
});

function queryCollect() {
    $( "#page_tabs" ).tabs( "option", "active", 1 );
    articleQueryFacade.queryCollect();
}

function listen() {
	$("input[name='type']").click(function() {
		if($(this).is(':checked')) {
			if($(this).val() == 0) {
				$(this).parent().find(".isEssential").removeAttr('checked');
				$(this).parent().find(".isImportant").removeAttr('checked');
			}else {
				$(this).parent().find(".all_type").removeAttr('checked');
			}
		}else {
			if($(this).val() == 0) {
				$(this).attr('checked',true);
			}else {
				if(!$(this).parent().find(".isEssential").is(':checked') && !$(this).parent().find(".isImportant").is(':checked')) {
					$(this).attr('checked',true);
				}
			}
		}
	});
	listenCat("#tabs-1");
}