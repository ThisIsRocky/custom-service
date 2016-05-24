var maintainerFacade = {
    detailsGrid: null, 
    url : '/maintainer/queryMaintainerPage',
    query : function() {
        var queryString = maintainerFacade.getParams();
        if(!queryString) {
        	return false;
        }
        maintainerFacade.loadDetails(queryString);
    },
    getParams : function() {
        return $("#form").serialize();
    },
    loadDetails : function(params) {
        var _this = this;
        var grid_selector = "#table-data-list";
        var pager_selector = "#table-data-list-pager";
        if(_this.detailsGrid) {
            // 根据搜索条件，重新加载
            $(grid_selector).jqGrid('setGridParam',{
                url : maintainerFacade.url+'?'+params,
                page:1 
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : maintainerFacade.url+'?'+params,
                datatype : 'json',
                colNames : ['维修商名称', '服务城市', '维修类型', '联系人', '联系电话', '操作'],
                jsonReader : {  
                    root: "data",  
                    page: "curPage",  
                    total: "totalPage",  
                    records: "totalRows"
                },
                prmNames : {page:'curPage',rows:'pageSize', sort: 'sidx',order: 'sort'},
                cmTemplate: {sortable:false},
                colModel : [ {
                    name : 'name',
                    align :'center',
                    width : 80
                }, {
                    name : 'cityList',
                    width : 150,
                    align:'center',
                    formatter : function(cellvalue, options, rowObject) {
                        var retVal = '';
                        if(cellvalue && cellvalue.length > 0) {
                        	for(var i = 0; i < cellvalue.length; i++) {
                        		retVal += cellvalue[i].cityName;
                        		if(i < (cellvalue.length - 1)) {
                        			retVal += '、';
                        		}
                        	}
                        }
                        return retVal;
                    }
                }, {
                    name : 'maintainTypeStr',
                    width : 100,
                    align:'center'
                }, {
                    name : 'contactName',
                    width : 100,
                    align:'center'
                }, {
                    name : 'contactPhone',
                    width : 100,
                    align:'center'
                }, {
                    name : "id",
                    formatter : function(cellvalue, options, rowObject) {
                        var retVal = ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="$.showCommonEditDialog(\'/maintainer/addOrUpdate?id='+rowObject.id+'\',\'修改\',400,500);">修改</button>';
                        retVal += ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="deletemaintainer('+rowObject.id+');">删除</button>';
                        return retVal;
                    },
                    align:'center'
                }],
                rowNum : 30,
                rowList : [ 10, 30, 50 ],
                pager : pager_selector,
                pagerpos : 'left',
                viewrecords : true,
                height : 'auto',
                loadComplete : function() {
                    var table = this;
                    setTimeout(function() {
                        updatePagerIcons(table);
                    }, 0);
                }
            });
        }
        // 自适应宽度
        $.resizeGrid(grid_selector);
    }
}
function deletemaintainer(id){
    bootbox.confirm("您确定删除该记录?", function(result) {
        if(result) {
            $.ajax({
                type: "POST",
                url: "/maintainer/deleteById",
                data: "id="+id
            }).done(function (data) {
                if (data.success) {
                    $.dialog({title: '提示', content: "删除成功", icon: 'success.gif',lock:true ,ok: '确定'});
                    maintainerFacade.query();
                } else {
                    $.dialog({title: '提示', content: data.error, icon: 'error.gif',lock:true, ok: '确定'});
                }
            }).always(function () {
                //$("#submitBtn").removeClass("disabled");
            });
        }
    });
}

$(function() {
    MultiSelectUtil.init();
	maintainerFacade.query();
	inputSelectUtil.init().load("#cityName");
    $("#searchBtn").click(maintainerFacade.query);
});