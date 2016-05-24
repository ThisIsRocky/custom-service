var returnSupplierQuery = {
    
    grid_selector : "#query-table-data-list",
    pager_selector : "#query-table-data-list-pager",
    url : '/warehouse/returnSupplier/query/findList',
    detailsGrid : null, // 数据详情
    queryStr : function() {
        var queryString = "?startDate=" + $('#returnSupplierQuery #startDateHid').val()
        + "&endDate=" + $('#returnSupplierQuery #endDateHid').val()
        + "&startDeliveryDate="+$('#returnSupplierQuery #startDeliveryDateHid').val()
        + "&endDeliveryDate=" + $('#returnSupplierQuery #endDeliveryDateHid').val()
        + "&warehouseId=" +$('#returnSupplierQuery #warehouseId').val()
        + "&supplierId=" + $('#returnSupplierQuery #supplierId').val()
        + "&id=" + $('#returnSupplierQuery #no').val()
        + "&status=" + $('#returnSupplierQuery #status').val();    
        return queryString;
    },
    // 加载数据详情
    loadDate : function() {
        // 自适应宽度
        if (returnSupplierQuery.detailsGrid) {
            // 根据搜索条件，重新加载
            $(returnSupplierQuery.grid_selector).jqGrid('setGridParam', {
                url : returnSupplierQuery.url + returnSupplierQuery.queryStr(),
                page : 1,
                forceFit : true,
            }).trigger("reloadGrid");
        } else {
            var _this = this;
            // 首次加载
            _this.detailsGrid = $(returnSupplierQuery.grid_selector).jqGrid({
                url : returnSupplierQuery.url + returnSupplierQuery.queryStr(),
                datatype : 'json',
                colNames : [ '创建日期', '退货单号', '供应商', '仓库', '状态','退货日期','退货处理人','创建人', '操作' ],
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
                            name : 'supplierName',
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
                                var url = '/warehouse/returnSupplier/viewDetail?returnSupplierId='
                                        + rowObject.id
                                var returnVal = '<button class="btn btn-minier btn-white btn-default btn-bold zs-auth"'
                                        + 'permission="/warehouse/returnSupplier/viewDetail"'
                                        + 'onclick="$.showCommonEditDialog(\''
                                        + url
                                        + '\',\'退供应商单明细\',800,400);">'
                                        + '<i class="ace-icon fa fa-check green"></i>明细查看</button>';
                                if(rowObject.status == 10){
                                    returnVal += '<button class="btn btn-minier btn-white btn-default btn-bold zs-auth"'
                                        + ' permission="/warehouse/returnSupplier/cancel"'
                                        + ' onclick="returnSupplierQuery.cancel('+rowObject.id+')">'
                                        + ' <i class="ace-icon fa fa-check green"></i>取消</button>';
                                }
                                returnVal += '<button class="btn btn-minier btn-white btn-default btn-bold zs-auth"'
                                    + ' permission="/warehouse/returnSupplier/export"'
                                    + ' onclick="returnSupplierQuery.exportHistoryDetail('+rowObject.id+')">'
                                    + ' <i class="ace-icon fa fa-check green"></i>导出</button>';
                                return returnVal
                            }
                        } ],
                rowNum : 10,
                rowList : [ 10, 20, 50 ],
                pager : returnSupplierQuery.pager_selector,
                pagerpos : 'left',
                height : 350,
                viewrecords : true,
                autoHeight : true,
                loadComplete : function() {
                    var table = this;
                    setTimeout(function() {
                     // 自适应宽度
                        $.resizeGrid(returnSupplierQuery.grid_selector);
                        updatePagerIcons(table);
                        $.authenticate();
                        $.removeScrollX(returnSupplierQuery.grid_selector);
                    }, 0);
                },
            });
        }
    },
  //供应商编码
     fillSuplierInfo:function(id, code, jsonStr) {
        var obj = eval("("+jsonStr+")");
        var supplierName = obj.name;
         $("#returnSupplierQuery #supplierName").val(supplierName);
        var supplierId = obj.id;
        $("#returnSupplierQuery #supplierId").val(supplierId);
    },

    //仓库编码
     fillWarehouseInfo:function(id, code, jsonStr) {
        var obj = eval("("+jsonStr+")");
        var warehouseName = obj.name;
         $("#returnSupplierQuery #warehouseName").val(warehouseName);
        var warehouseId = obj.id;
        $("#returnSupplierQuery #warehouseId").val(warehouseId);
    },
    exportHistoryDetail:function(id){
        window.location.href='/warehouse/returnSupplier/export?returnSupplierId='+id;
    },
    cancel : function(id) {
        $.dialog.confirm('确定要取消吗？', function(){
            var url = '/warehouse/returnSupplier/cancel?id='+id+'&nd=' + Math.random();
            $.post(url, null, function(result){
                if(result.code == '000000') {
                    returnSupplierQuery.loadDate();
                } else {
                    $.dialog.alert(result.message);
                }
            });
        });
    }
}

$(function() {
    inputSelectUtil.init();
    $.initDatePicker('#returnSupplierQuery #dateRange');
    $.initDatePicker('#returnSupplierQuery #delveryDateRange');
    $('#returnSupplierQuery #searchBtn').click(function(){
        returnSupplierQuery.loadDate();
    });
});
