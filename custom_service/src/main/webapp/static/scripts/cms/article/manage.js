var articleFacade = {
    undeliveredGrid: null,
    articelGrid: null,
    draftGrid: null,
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
        var queryString = articleFacade.getQueryString();
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
                colNames : [ '文章ID', '所属类别', '文章名称', '创建日期', '状态', '操作' ],
                cmTemplate: {sortable:false},
                colModel : [ {
                    name : 'id',
                    align : 'center',
                    width : 80,
                    key: true
                }, {
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
                    	var res = value;
                    	if(row.isEssential == 1) {
                    		res = '<font color="green">[精]</font>' + res;
                    	}
                    	if(row.isImportant == 1) {
                    		res = '<i class="fa fa-exclamation red"></i>' + res;
                    	}
                    	return res;
                    }
                }, {
                    name : 'modifyTime',
                    width : 80,
                    formatter : function(value, option, row) {
                    	return $.dateFormat(value, 'yyyy-MM-dd');
                    }
                }, {
                    name : 'statusStr',
                    align : 'center',
                    width : 50
                }, {
                    name : '',
                    sortable : false,
                    width : 300,
                    align : 'center',
                    formatter : function(cellvalue, options, rowObject) {
                        var retVal = ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="$.showCommonEditDialog(\'/cms/article/showContent?id='+rowObject.id+'&isPreview=false\',\'查看\',1000,550);"><i class="ace-icon fa fa-list blue"></i>查看</button>';
                        retVal += ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="javascript:articleFacade.toAddPage('+rowObject.id+',\'编辑文章\', false);"><i class="ace-icon fa fa-pencil-square-o"></i>编辑</button>';
                        if(rowObject.status != 10) {
                        	var essential = '设为精华';
                        	var important = '设为<i class="ace-icon red fa fa-exclamation"></i>';
                        	var importantAction = '设为重要';
                        	if(rowObject.isEssential) {
                        		essential = '取消精选';
                        	}
                        	if(rowObject.isImportant) {
                        		important = '取消<i class="ace-icon red fa fa-exclamation"></i>';
                        		importantAction = '取消重要';
                        	}
                        	retVal += ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="javascript:articleFacade.updateEssentialOrImportant('+rowObject.id+',2,'+rowObject.isEssential+',\''+essential+'\');"><i class="ace-icon fa fa-wrench"></i>'+essential+'</button>';
                        	retVal += ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="javascript:articleFacade.updateEssentialOrImportant('+rowObject.id+',1,'+rowObject.isImportant+',\''+importantAction+'\');"><i class="ace-icon fa fa-wrench"></i>'+important+'</button>';
                        }
                        retVal += ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="javascript:articleFacade.deleteById('+rowObject.id+', false);"><i class="ace-icon fa fa-times"></i>删除</button>';
                        return retVal;
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
                        $.removeScrollX($('#data-list-article'));
                    }, 0);
                }
            });
        }
        // 自适应宽度
        $.resizeGrid(grid_selector);
    },
    queryDraft : function() {
        var _this = this;
        var grid_selector = "#table-data-list-draft";
        var pager_selector = "#table-data-list-draft-pager";
        var url = '/cms/article/findPage?status=10';
        if (_this.draftGrid) {
            // 根据搜索条件，重新加载
            $(grid_selector).jqGrid('setGridParam', {
                url : url,
                page : 1,
                forceFit : true,
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.draftGrid = $(grid_selector).jqGrid({
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
                colNames : [ '文章ID', '所属类别', '文章名称', '创建日期', '最新修改日期', '状态', '操作' ],
                cmTemplate: {sortable:false},
                colModel : [ {
                    name : 'id',
                    align : 'center',
                    width : 80,
                    key: true
                }, {
                    name : '',
                    width : 160,
                    formatter : function(value, option, row) {
                    	return row.catLevel1Name + '>' + row.catLevel2Name + '>' + row.catLevel3Name;
                    }
                }, {
                    name : 'title',
                    align : 'center',
                    width : 160
                }, {
                    name : 'createTime',
                    width : 80,
                    formatter : function(value, option, row) {
                    	return $.dateFormat(value, 'yyyy-MM-dd');
                    }
                }, {
                    name : 'modifyTime',
                    width : 100,
                    formatter : function(value, option, row) {
                    	return $.dateFormat(value, 'yyyy-MM-dd');
                    }
                }, {
                    name : 'statusStr',
                    align : 'center',
                    width : 180
                }, {
                    name : '',
                    sortable : false,
                    width : 190,
                    align : 'center',
                    formatter : function(cellvalue, options, rowObject) {
                        var retVal = ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="$.showCommonEditDialog(\'/cms/article/showContent?id='+rowObject.id+'&isPreview=false\',\'查看\',1000,550);"><i class="ace-icon fa fa-list blue"></i>查看</button>';
                        retVal += ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="javascript:articleFacade.toAddPage('+rowObject.id+',\'编辑文章\', true);"><i class="ace-icon fa fa-pencil-square-o"></i>编辑</button>';
                        retVal += ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="javascript:articleFacade.deleteById('+rowObject.id+', true);"><i class="ace-icon fa fa-times"></i>删除</button>';
                        return retVal;
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
    toAddPage : function(id, title, isDraft) {
    	var url = '/cms/article/toAddPage?isDraft='+isDraft;
    	if(id) {
    		url += "&id=" + id;
    	}
    	$.showCommonEditDialog(url, title, 950, 700);
    },
    view : function(id) {
        var url = '/cms/article/exportDetails?id=' + id;
        if($('#downloadIfm').attr('src')) {
        	$('#downloadIfm').attr('');
        }
        $('#downloadIfm').attr('src', url);
    },
    deleteById : function(id, isDraft) {
        $.dialog.confirm('确定要删除此文章吗？', function(){
            var url = '/cms/article/deleteById';
            $.post(url, {'id':id}, function(result){
                if(result.code == '000000') {
                    $.dialog.alert('删除成功');
                    if(isDraft) {
                    	articleFacade.queryDraft();
                    }else {
                    	articleFacade.query();
                    }
                } else {
                    $.dialog.alert("删除失败");
                }
            });
        });
    },
    updateEssentialOrImportant : function(id, type, value, action) {//type : 1: 重要，2：精华   value：当前状态值
        $.dialog.confirm('确定要'+action+'吗？', function(){
            var url = '/cms/article/updateEssentialOrImportant';
            $.post(url, {'id':id, 'type' : type, 'status' : value}, function(result){
                if(result.code == '000000') {
                    $.dialog.alert('操作成功');
                    articleFacade.query();
                } else {
                    $.dialog.alert("操作失败");
                }
            });
        });
    }
}
$(function() {
    $('#page_tabs').tabs();
    $.initDatePicker('#dateRange');
    $('#searchBtn').click(articleFacade.query);
    $("#addBtn").click(function() {
    	articleFacade.toAddPage(null,"新建文章", false);
    	});
    listen();
    articleFacade.query();
});

function queryDraft() {
    $( "#page_tabs" ).tabs( "option", "active", 1 );
    articleFacade.queryDraft();
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