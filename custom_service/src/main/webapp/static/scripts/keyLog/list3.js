var keyLogFacade = {
	grid_selector : "#table-data-list",
	pager_selector : "#table-data-list-pager",
	url : '/keyLog/list',
    detailsGrid: null, // 数据详情
    // 加载数据详情
    query : function() {
    	var params = keyLogFacade.getParams();
    	if(!params) {
    		return false;
    	}
        $('#data-list').show();
        var _this = this;
        // 首次加载
        _this.detailsGrid = $(keyLogFacade.grid_selector).jqGrid({
            url : keyLogFacade.url + "?" + params,
            datatype : 'json',
            colNames : [ '业务ID', '主键' , '主键值', '字段', '变更前' , '变更后', '操作时间', '操作人'],
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
                width : 80
            },  {
                name : 'idColumn',
                width : 80,
            }, {
                name : 'dataId',
                width : 50,
            }, {
                name : 'details',
                width : 100,
                formatter : function(cellvalue, options, rowObject) {
                	var html = '';
                	if(rowObject.details && rowObject.details.length > 0) {
                		$(rowObject.details).each(function() {
                			html += this.propName+'<br<hr>';
                		});
                	}
                	return html;
                },
            }, {
                name : 'details',
                width : 100,
                formatter : function(cellvalue, options, rowObject) {
                	var html = '';
                	if(rowObject.details && rowObject.details.length > 0) {
                		$(rowObject.details).each(function() {
                			html += this.preValue+'<br<hr>';
                		});
                	}
                	return html;
                }
            }, {
                name : 'details',
                formatter : function(cellvalue, options, rowObject) {
                	var html = '';
                	if(rowObject.details && rowObject.details.length > 0) {
                		$(rowObject.details).each(function() {
                			html += this.postValue+'<br<hr>';
                		});
                	}
                	return html;
                },
                width : 100
            }, {
                name : 'createTime',
                sortable : false,
                width : 100,
                formatter : function(cellvalue, options, rowObject) {
                	return $.dateFormat(cellvalue, 'yyyy-MM-dd mm:hh:ss');
                },
            }, {
                name : 'createName',
                width : 80,
                align : 'center'
            }],
            rowNum : 20,
            rowList : [ 10, 20, 50 ],
            pager : keyLogFacade.pager_selector,
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
        $.resizeGrid(keyLogFacade.grid_selector);
    },
    getParams : function() {
    	var params = '';
    	//校验参数
    	if(!$("#businessId").val()) {
    		$.dialog.alert("请选择业务ID");
    		return false;
    	}else {
    		params += '&businessId=' + $.trim($("#businessId").val());
    	}
    	if($.trim($("#dataId").val())) {
    		params += '&dataId=' + $.trim($("#dataId").val());
    	}
    	if($.trim($("#columnName").val())) {
    		params += '&columnName=' + $.trim($("#columnName").val());
    	}
    	if($.trim($("#startTime").val())) {
    		params += '&startTimeStr=' + $.trim($("#startTime").val());
    	}
    	if($.trim($("#endTime").val())) {
    		params += '&endTimeStr=' + $.trim($("#endTime").val());
    	}
    	return params;
    },
    reload : function() {
        if(keyLogFacade.detailsGrid) {
        	var params = keyLogFacade.getParams();
        	if(!params) {
        		return false;
        	}
            // 根据搜索条件，重新加载
            $(keyLogFacade.grid_selector).jqGrid('setGridParam',{
                url : keyLogFacade.url + "?" + params,
                page:1 
            }).trigger("reloadGrid");
        }else {
        	keyLogFacade.query();
        }
        // 自适应宽度
        $.resizeGrid(keyLogFacade.grid_selector);
    },
    getColumns : function () {
    	//校验参数
    	if(!$("#businessId").val()) {
    		//TODO 
    		$("#columnName").html("");
    	}else {
    		$.post("/keyLog/findColumnsByBId", {businessId : $("#businessId").val()}, function(data){
    			if(data && data.length > 0) {
    				$("#columnName").html("");
    				var str = "<option value=''></option>";
    				for(var i = 0; i < data.length; i++) {
    					str += "<option value='" + data[i] + "'>" + data[i] + "</option>";
    				}
    				$("#columnName").append(str);
    			}
    		}, 'json');
    	}
    }

}

$(function() {
	$("#searchBtn").click(keyLogFacade.reload);
	$("#businessId").change(keyLogFacade.getColumns);
});