var usedQuery = {
    
    grid_selector : "#query-table-data-list",
    pager_selector : "#query-table-data-list-pager",
    url : '/warehouse/used/query/findList',
    detailsGrid : null, // 数据详情
    queryStr : function() {
        var queryString = "?startDate=" + $('#usedQuery #startDateHid').val()
        + "&endDate=" + $('#usedQuery #endDateHid').val()
        + "&startDeliveryDate="+$('#usedQuery #startDeliveryDateHid').val()
        + "&endDeliveryDate=" + $('#usedQuery #endDeliveryDateHid').val()
        + "&warehouseId=" +$('#usedQuery #warehouseId').val()
        + "&id=" + $('#usedQuery #no').val()
         + "&userName=" + $('#usedQuery #userName').val()
        + "&status=" + $('#usedQuery #status').val();    
        return queryString;
    },
    // 加载数据详情
    loadDate : function() {
        // 自适应宽度
        if (usedQuery.detailsGrid) {
            // 根据搜索条件，重新加载
            $(usedQuery.grid_selector).jqGrid('setGridParam', {
                url : usedQuery.url + usedQuery.queryStr(),
                page : 1,
                forceFit : true,
            }).trigger("reloadGrid");
        } else {
            var _this = this;
            // 首次加载
            _this.detailsGrid = $(usedQuery.grid_selector).jqGrid({
                url : usedQuery.url + usedQuery.queryStr(),
                datatype : 'json',
                colNames : [ '创建日期', '领用出库单号', '领用人', '仓库', '状态','领用日期','领用处理人','创建人', '操作' ],
                cmTemplate: {sortable:true},
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
                colModel : [
                        {
                            name : 'createTime',
                            align : 'center',
                            width : 50,
                            formatter : function(cellvalue,options, rowObject) {
                                return $.dateFormat(cellvalue,'yyyy-MM-dd');
                            }
                        },
                        {
                            name : 'id',
                            align : 'left',
                            width : 50
                        },
                        {
                            name : 'userName',
                            width : 100
                        },
                        {
                            name : 'warehouseName',
                            align : 'center',
                            width : 80
                        },
                        {
                            name : 'statusStr',
                            align : 'center',
                            width : 80
                        },
                        {
                            name : 'deliveryTime',
                            align : 'center',
                            width : 80,
                            formatter : function(cellvalue,options, rowObject) {
                                return $.dateFormat(cellvalue,'yyyy-MM-dd');
                            }
                        },
                        {
                            name : 'deliveryUserName',
                            align : 'center',
                            width : 80,
                        },
                        {
                            name : 'createBy',
                            align : 'center',
                            width : 80,
                        },
                        {
                            name : '',
                            align : 'center',
                            formatter : function(cellvalue,options, rowObject) {
                                var url = '/warehouse/used/viewDetail?usedId='
                                        + rowObject.id
                                var returnVal = '<button class="btn btn-minier btn-white btn-default btn-bold zs-auth"'
                                        + 'permission="/warehouse/used/viewDetail"'
                                        + 'onclick="$.showCommonEditDialog(\''
                                        + url
                                        + '\',\'领用出库单明细\',800,400);">'
                                        + '<i class="ace-icon fa fa-check green"></i>明细查看</button>';
                                if(rowObject.status == 10){
                                    returnVal += '<button class="btn btn-minier btn-white btn-default btn-bold zs-auth"'
                                        + ' permission="/warehouse/used/cancel"'
                                        + ' onclick="usedQuery.cancel('+rowObject.id+')">'
                                        + ' <i class="ace-icon fa fa-check green"></i>取消</button>';
                                }
                                returnVal += '<button class="btn btn-minier btn-white btn-default btn-bold zs-auth"'
                                    + ' permission="/warehouse/used/export"'
                                    + ' onclick="usedQuery.exportHistoryDetail('+rowObject.id+')">'
                                    + ' <i class="ace-icon fa fa-check green"></i>导出</button>';
                                return returnVal
                            }
                        } ],
                rowNum : 10,
                rowList : [ 10, 20, 50 ],
                pager : usedQuery.pager_selector,
                pagerpos : 'left',
                height : 350,
                viewrecords : true,
                autoHeight : true,
                loadComplete : function() {
                    var table = this;
                    setTimeout(function() {
                     // 自适应宽度
                        $.resizeGrid(usedQuery.grid_selector);
                        updatePagerIcons(table);
                        $.authenticate();
                        $.removeScrollX(usedQuery.grid_selector);
                    }, 0);
                },
            });
        }
    },
    //仓库编码
    fillWarehouseInfo:function(id, code, jsonStr) {
        var obj = eval("("+jsonStr+")");
        var warehouseName = obj.name;
         $("#usedQuery #warehouseNameAdd").val(warehouseName);
        var warehouseNameId = obj.id;
        $("#usedQuery #warehouseNameId").val(warehouseNameId);
    },
     exportHistoryDetail:function(id){
        window.location.href='/warehouse/used/export?usedId='+id;
    },
    cancel : function(id) {
        $.dialog.confirm('确定要取消吗？', function(){
            var url = '/warehouse/used/cancel?id='+id+'&nd=' + Math.random();
            $.post(url, null, function(result){
                if(result.code == '000000') {
                    usedQuery.loadDate();
                } else {
                    $.dialog.alert(result.message);
                }
            });
        });
    }
}
$(function() {
    inputSelectUtil.init();
    $.initDatePicker('#usedQuery #dateRange');
    $.initDatePicker('#usedQuery #delveryDateRange');
    $('#usedQuery #searchBtn').click(function(){
        usedQuery.loadDate();
    });
});
