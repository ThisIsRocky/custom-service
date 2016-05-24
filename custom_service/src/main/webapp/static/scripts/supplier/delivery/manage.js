var supplierShipping = {
    undeliveredGrid: null,
    deliveredGrid: null,
    getQueryString : function(area) {
        var startDate = $('#startDateHid', area).val();
        var endDate = $('#endDateHid', area).val();
        var cityId = $('#city', area).val();
        var purchaseNo = $('#purchaseNo', area).val();
        var storeType = $('#storeType', area).val();
        var storeCode = $('#storeCode', area).val();
        var storeName = $('#storeName', area).val();
        
        var queryString = '';
        queryString += 'deliverDateStart=' + startDate;
        queryString += '&deliverDateEnd=' + endDate;
        if(cityId) {
            queryString += '&cityId=' + cityId;
        }
        if(purchaseNo) {
            queryString += '&purchaseNo=' + purchaseNo;
        }
        if(storeType) {
            queryString += '&storeType=' + storeType;
        }
        if(storeCode) {
            queryString += '&storeCode=' + storeCode;
        }
        if(storeName) {
            queryString += '&storeName=' + storeName;
        }
        
        return queryString;
    },
    unDeliveredList : function(area) {
        
        var queryString = supplierShipping.getQueryString($(area));
        
        var _this = this;
        var grid_selector = "#table-data-list-undelivered";
        var pager_selector = "#table-data-list-pager-undelivered";
        var url = '/supplier/delivery/getUnDeliveredList?' + queryString;
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
                cmTemplate: {sortable:true},
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
                colNames : [ '订货日期', '订货单号', '门店编码', '门店名称', '门店类型', '所在城市', '供应商', '操作' ],
                colModel : [ {
                    name : 'expectReceiveDateStr',
                    align : 'center',
                    width : 80
                }, {
                    name : 'purchaseNo',
                    width : 80,
                    key: true
                }, {
                    name : 'storeCode',
                    align : 'center',
                    width : 80
                }, {
                    name : 'storeName',
                    width : 150
                }, {
                    name : 'storeType',
                    align : 'center',
                    width : 80,
                    formatter : function(value) {
                        var map = {1:'自营', 2:'联营', 3:'商超'};
                        return map[value];
                    }
                }, {
                    name : 'cityName',
                    width : 80
                }, {
                    name : 'providerName',
                    width : 100
                }, {
                    name : '',
                    sortable : false,
                    width : 100,
                    align : 'center',
                    formatter : function(cellvalue, options, rowObject) {
                        var retVal = ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="$.showCommonEditDialog(\'/supplier/delivery/itemDetails?purchaseId='+rowObject.purchaseNo+'\',\'集中采购处理\',1000,400);"><i class="ace-icon fa fa-truck blue"></i>采购</button>';
                        retVal += ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="javascript:supplierShipping.exportItemDetails('+rowObject.purchaseNo+', '+false+');"><i class="ace-icon fa fa-list"></i>导出</button>';
                        return retVal;
                    }
                }],
                rowNum : 10,
                rowList : [ 10, 20, 30 ],
                pager : pager_selector,
                height : 300,
                autoHeight : true,
                viewrecords : true,
                loadComplete : function() {
                    var table = this;
                    setTimeout(function() {
                        updatePagerIcons(table);
                        $.removeScrollX($('#data-list-undelivered'));
                    }, 0);
                }
            });
        }
        // 自适应宽度
        $.resizeGrid(grid_selector);
    },
    deliveredList : function(area) {
        var queryString = supplierShipping.getQueryString($(area));
        
        var _this = this;
        var grid_selector = "#table-data-list-delivered";
        var pager_selector = "#table-data-list-pager-delivered";
        var url = '/supplier/delivery/getDeliveredList?' + queryString;
        if (_this.deliveredGrid) {
            // 根据搜索条件，重新加载
            $(grid_selector).jqGrid('setGridParam', {
                url : url,
                page : 1,
                forceFit : true
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.deliveredGrid = $(grid_selector).jqGrid({
                cmTemplate: {sortable:true},
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
                colNames : [ '配送日期', '订货单号', '门店编码', '门店名称', '门店类型', '所在城市', '发货仓库', '状态', '发货日期', '操作' ],
                colModel : [ {
                    name : 'expectReceiveDateStr',
                    index : 'expectReceiveDateStr',
                    align : 'center',
                    width : 80
                }, {
                    name : 'purchaseNo',
                    width : 80,
                    key: true
                }, {
                    name : 'storeCode',
                    align : 'center',
                    width : 80
                }, {
                    name : 'storeName',
                    width : 150
                }, {
                    name : 'storeType',
                    align : 'center',
                    width : 80,
                    formatter : function(value) {
                        var map = {1:'自营', 2:'联营', 3:'商超'};
                        return map[value];
                    }
                }, {
                    name : 'cityName',
                    width : 80
                }, {
                    name : 'providerName',
                    width : 100
                }, {
                    name : 'status',
                    align : 'center',
                    width : 80,
                    formatter : function(value) {
                        if (value == 0) {
                            return '初始化';
                        }
                        else if (value == 15) {
                            return '审核中';
                        }
                        else if (value == 10) {
                            return '待配送';
                        }
                        else if (value == 16) {
                            return '审核通过';
                        }
                        else if(value == 20) {
                            return '配送中';
                        } else if(value == 30) {
                            return '部分收货';
                        } else if(value == 40) {
                            return '已收货';
                        }
                    }
                }, {
                    name : 'deliveryTime',
                    align : 'center',
                    width : 80
                }, {
                    name : '',
                    sortable : false,
                    width : 100,
                    align : 'center',
                    formatter : function(cellvalue, options, rowObject) {
                        var retVal = ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="$.showCommonEditDialog(\'/supplier/delivery/itemDetails?purchaseId='+rowObject.purchaseNo+'&view=true\',\'详情\',1000,400);"><i class="ace-icon fa fa-truck blue"></i>详情</button>';
                        retVal += ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="javascript:supplierShipping.exportItemDetails('+rowObject.purchaseNo+', '+true+');"><i class="ace-icon fa fa-list"></i>导出</button>';
                        return retVal;
                    }
                }],
                rowNum : 10,
                rowList : [ 10, 20, 30 ],
                pager : pager_selector,
                height : 300,
                autoHeight : true,
                viewrecords : true,
                loadComplete : function() {
                    var table = this;
                    setTimeout(function() {
                        updatePagerIcons(table);
                        $.removeScrollX($('#data-list-delivered'));
                    }, 0);
                }
            });
        }
        // 自适应宽度
        $.resizeGrid(grid_selector);
    },
    exportItemDetails : function(purchaseId, view) {
        var url = '/supplier/delivery/exportDetails?purchaseId=' + purchaseId + "&view=" + view;
        if($('#downloadIfm').attr('src')) {
        	$('#downloadIfm').attr('');
        }
        $('#downloadIfm').attr('src', url);
    }
}
var warehouseDeliveryDialog = null;
$(function() {
    $.initDatePicker('#needShipping #dateRange');
    $.initDatePicker('#delivered #dateRange');

    // 初始化可输入下拉框
    inputSelectUtil.init().load("#needShipping #cityId");
    inputSelectUtil.init().load("#delivered #cityId");
    
    $('#needShipping #searchBtn').click(function(){
        supplierShipping.unDeliveredList('#needShipping');
    });
    $('#delivered #searchBtn').click(function(){
        supplierShipping.deliveredList('#delivered');
    });
    
    // 加载发货处理列表
    supplierShipping.unDeliveredList('#needShipping');

});