var warehouseTransFacade = {
    undeliveredGrid: null,
    deliveredGrid: null,
    iframeCount : 0,
    getQueryString : function() {
        var queryString = $("form").serialize();
        return queryString;
    },
    transList : function() {
        var queryString = warehouseTransFacade.getQueryString();
        var _this = this;
        var grid_selector = "#table-data-list";
        var pager_selector = "#table-data-list-pager";
        var url = '/warehouse/transfer/findPage?' + queryString;
        if (_this.detailsGrid) {
            // 根据搜索条件，重新加载
            $(grid_selector).jqGrid('setGridParam', {
                url : url,
                page : 1,
                forceFit : true,
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
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
                colNames : [ '调拨发起日期', '调拨单号', '提报人', '调出仓库城市', '调出仓库', '调入仓库城市', '调入仓库', '状态', '操作' ],
                cmTemplate: {sortable:false},
                colModel : [ {
                    name : 'createTime',
                    align : 'center',
                    width : 80,
                    formatter : function(value, option, row) {
                    	return $.dateFormat(value, 'yyyy-MM-dd');
                    }
                }, {
                    name : 'id',
                    width : 60,
                    key: true
                }, {
                    name : 'createBy',
                    align : 'center',
                    width : 60
                }, {
                    name : 'fromCityName',
                    width : 80
                }, {
                    name : 'fromWarehouseName',
                    align : 'center',
                    width : 180
                }, {
                    name : 'toCityName',
                    width : 80
                }, {
                    name : 'toWarehouseName',
                    align : 'center',
                    width : 180
                }, {
                    name : 'statusStr',
                    width : 50
                }, {
                    name : '',
                    sortable : false,
                    width : 190,
                    align : 'center',
                    formatter : function(cellvalue, options, rowObject) {
                        var retVal = ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="$.showCommonEditDialog(\'/warehouse/transfer/toDetailPage?id='+rowObject.id+'\',\'查看详情\',800,500);"><i class="ace-icon fa fa-list blue"></i>查看详情</button>';
                        retVal += ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="javascript:warehouseTransFacade.exportItemDetails('+rowObject.id+');"><i class="ace-icon fa fa-download"></i>导出</button>';
                        if(rowObject.status == 10) {
                            retVal += ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="javascript:warehouseTransFacade.cancel('+rowObject.id+');"><i class="ace-icon fa fa-times"></i>取消</button>';
                        }
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
                        $.removeScrollX($('#data-list'));
                    }, 0);
                }
            });
        }
        // 自适应宽度
        $.resizeGrid(grid_selector);
    },
    toAddPage : function() {
    	$.showCommonEditDialog('/warehouse/transfer/toAddPage', '发起调拨',800,500);
    },
    exportItemDetails : function(id) {
        var url = '/warehouse/transfer/exportDetails?id=' + id;
        if($('#downloadIfm').attr('src')) {
        	$('#downloadIfm').attr('');
        }
        $('#downloadIfm').attr('src', url);
    },
    cancel : function(id) {
        $.dialog.confirm('确定要取消调拨单吗？', function(){
            var url = '/warehouse/transfer/cancel';
            $.post(url, {'id':id}, function(result){
                if(result.code == '000000') {
                    $.dialog.alert('取消成功');
                    warehouseTransFacade.transList();
                } else {
                    $.dialog.alert("取消失败");
                }
            });
        })
    }
}
var warehouseDeliveryDialog = null;
$(function() {
    $.initDatePicker('#dateRange');
    $('#searchBtn').click(warehouseTransFacade.transList);
    $("#addTransBtn").click(warehouseTransFacade.toAddPage);
    warehouseTransFacade.transList();

});