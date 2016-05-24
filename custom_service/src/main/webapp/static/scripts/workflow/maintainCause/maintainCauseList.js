var maintainCauseFacade = {
    detailsGrid: null, 
    url : '/maintainCause/queryMaintainCausePage',
    query : function() {
        var queryString = maintainCauseFacade.getParams();
        if(!queryString) {
        	return false;
        }
        maintainCauseFacade.loadDetails(queryString);
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
                url : maintainCauseFacade.url+'?'+params,
                page:1 
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : maintainCauseFacade.url+'?'+params,
                datatype : 'json',
                colNames : ['维修类型', '紧急度', '报修原因','操作'],
                jsonReader : {  
                    root: "data",  
                    page: "curPage",  
                    total: "totalPage",  
                    records: "totalRows"
                },
                prmNames : {page:'curPage',rows:'pageSize', sort: 'sidx',order: 'sort'},
                cmTemplate: {sortable:false},
                colModel : [ {
                    name : 'maintainTypeStr',
                    width : 100,
                    align:'center'
                }, {
                    name : 'maintainLevelStr',
                    width : 100,
                    align:'center'
                }, {
                    name : 'name',
                    width : 100,
                    align:'center'
                }, {
                    name : "id",
                    formatter : function(cellvalue, options, rowObject) {
                        var retVal = ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="$.showCommonEditDialog(\'/maintainCause/addOrUpdate?id='+rowObject.id+'\',\'修改\',400,200);">修改</button>';
                        retVal += ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="deletemaintainCause('+rowObject.id+');">删除</button>';
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
function deletemaintainCause(id){
    bootbox.confirm("您确定删除该记录?", function(result) {
        if(result) {
            $.ajax({
                type: "POST",
                url: "/maintainCause/deleteById",
                data: "id="+id
            }).done(function (data) {
                if (data.success) {
                    $.dialog({title: '提示', content: "删除成功", icon: 'success.gif',lock:true ,ok: '确定'});
                    maintainCauseFacade.query();
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
	maintainCauseFacade.query();
    $("#searchBtn").click(maintainCauseFacade.query);
});