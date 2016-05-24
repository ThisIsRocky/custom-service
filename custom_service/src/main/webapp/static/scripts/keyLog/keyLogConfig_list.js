var keyLogconfigFacade = {
	grid_selector : "#table-data-list",
	pager_selector : "#table-data-list-pager",
	url : '/keyLogConfig/list',
    detailsGrid: null, // 数据详情
    getParams : function() {
    	var params = '';
    	if($("#tableNameHid").val()) {
    		params += "tableName=" + $("#tableNameHid").val();
    	}
    	return params;
    },
    // 加载数据详情
    query : function() {
        $('#data-list').show();
        var _this = this;
        var params = keyLogconfigFacade.getParams();
        // 首次加载
        _this.detailsGrid = $(keyLogconfigFacade.grid_selector).jqGrid({
            url : keyLogconfigFacade.url+"?"+params,
            datatype : 'json',
            colNames : [ '业务ID', '表名' , 'ID字段', 'ID字段说明', '监控字段', '附加条件', '操作'],
            jsonReader : {  
                root: "data",  
                page: "curPage",  
                total: "totalPage",  
                records: "totalRows"
            },
            prmNames : {page:'curPage',rows:'pageSize', sort: 'sidx',order: 'sort'},
            cmTemplate: {sortable:true},
            colModel : [ {
                name : 'businessId',
                sortable : false,
                width : 100
            },  {
                name : 'tableName',
                width : 100,
                sortable : false
            }, {
                name : 'idColumn',
                sortable : false,
                width : 100
            }, {
                name : 'idComments',
                sortable : false,
                width : 100
            }, {
                name : 'details',
                sortable : false,
                width : 100,
                formatter : function(value, options, row) {
                	var retVal = '';
                	if(value) {
                		$(value).each(function(index) {
                			retVal += this.columnName + "<br/>";
                		});
                	}
                	return retVal;
                }
            }, {
                name : 'conditions',
                sortable : false,
                width : 100
            }, {
                name : '',
                sortable : false,
                width : 80,
                align : 'center',
                formatter : function(value, options, row) {
                	var retVal = '<button class="btn btn-minier btn-white btn-default btn-bold" onclick="$.showCommonEditDialog(\'/keyLogConfig/toSave?id='+row.id+'\',\'编辑配置\',480,400);"><i class="ace-icon fa fa-pencil-square-o blue"></i>修改</button>';
                    retVal += ' <button class="btn btn-minier btn-white btn-warning btn-bold" onclick="keyLogconfigFacade.showCommonDeleteDialog('+row.id+');"><i class="ace-icon fa fa-trash-o bigger-120 orange"></i>删除</button>';
                    return retVal;
                }
            }],
            rowNum : 10,
            rowList : [ 10, 20, 50 ],
            pager : keyLogconfigFacade.pager_selector,
            pagerpos : 'left',
            height : 350,
            viewrecords : true,
            autoHeight : true,
            loadComplete : function() {
                var table = this;
                setTimeout(function() {
                    updatePagerIcons(table);
                    $.authenticate();
                    $.removeScrollX('#data-list');
                }, 0);
            }
        });
        // 自适应宽度
        $.resizeGrid(keyLogconfigFacade.grid_selector);
    },
    reload : function() {
        if(keyLogconfigFacade.detailsGrid) {
            // 根据搜索条件，重新加载
            var params = keyLogconfigFacade.getParams();
            $(keyLogconfigFacade.grid_selector).jqGrid('setGridParam',{
                url : keyLogconfigFacade.url + "?" + params,
                page:1 
            }).trigger("reloadGrid");
        }else {
        	keyLogconfigFacade.query();
        }
        // 自适应宽度
        $.resizeGrid(keyLogconfigFacade.grid_selector);
    },
    showCommonDeleteDialog : function (value) {
		$.dialog({
//    			id : 'showCommonDeleteDialog',
		    lock: true,
			content : '确认吗？',
		    width: 200,
		    height: 100,
		    drag: false,
		    resize: false,
		    icon: 'alert.gif',
		    ok: function () {
		        $.post('/keyLogConfig/deleteConfigById', {'id':value}, function(data) {
		        	if(data.success) {
	                	$.dialog({title: '提示',content: '删除成功',icon: 'success.gif', ok : '确定'});
		        		keyLogconfigFacade.reload();
		        	} else {
		        		$.dialog.alert('删除失败:' + data.msg);
		        	}
		        }, 'json');
		        return true
		    },
		    cancel: true
		});
	}
}

$(function() {
	keyLogconfigFacade.query();
	$("#searchBtn").click(keyLogconfigFacade.reload);
	inputSelectUtil.init().load("#tableName", null);
	$("#addConfig").click(function() {
		$.showCommonEditDialog('/keyLogConfig/toSave?','新增配置',480,400);
	});
});