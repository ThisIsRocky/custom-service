var warehouseShipping = {
    undeliveredGrid: null,
    deliveredGrid: null,
    iframeCount : 0,
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
        
        var queryString = warehouseShipping.getQueryString($(area));
        
        var _this = this;
        var grid_selector = "#table-data-list-undelivered";
        var pager_selector = "#table-data-list-pager-undelivered";
        var url = '/warehouse/delivery/getUnApprovedList?' + queryString;
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
                colNames : [ '订货日期', '期望配送日期', '订货单号', '门店编码', '门店名称', '门店类型', '所在城市', '发货仓库', '操作' ],
                cmTemplate: {sortable:true},
                colModel : [ {
                    name : 'createTime',
                    align : 'center',
                    width : 80,
                    formatter : function(value) {
                        return $.dateFormat(value, 'yyyy-MM-dd');
                    }
                }, {
                    name : 'expectReceiveDateStr',
                    align : 'center',
                    width : 80
                }, {
                    name : 'purchaseNo',
                    align : 'center',
                    width : 60,
                    key: true
                }, {
                    name : 'storeCode',
                    align : 'center',
                    width : 60
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
                    width : 150
                }, {
                    name : '',
                    sortable : false,
                    width : 100,
                    align : 'center',
                    formatter : function(cellvalue, options, rowObject) {
                        var retVal = ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="$.showCommonEditDialog(\'/warehouse/delivery/itemDetails?purchaseId='+rowObject.purchaseNo+'\',\'发货审核\',1200,400);"><i class="ace-icon fa fa-truck blue"></i>审核</button>';
                        retVal += ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="javascript:warehouseShipping.exportItemDetails('+rowObject.purchaseNo+', '+false+');"><i class="ace-icon fa fa-list"></i>导出</button>';
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
        var queryString = warehouseShipping.getQueryString($(area));
        
        var _this = this;
        var grid_selector = "#table-data-list-delivered";
        var pager_selector = "#table-data-list-pager-delivered";
        var url = '/warehouse/delivery/getDeliveredList?' + queryString;
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
                colNames : [ '订货日期', '期望配送日期', '订货单号', '门店编码', '门店名称', '门店类型', '所在城市', '发货仓库', '状态', '发货日期', '操作' ],
                cmTemplate: {sortable:true},
                colModel : [{
                    name : 'createTime',
                    align : 'center',
                    width : 80,
                    formatter : function(value) {
                        return $.dateFormat(value, 'yyyy-MM-dd');
                    }
                },{
                    name : 'expectReceiveDateStr',
                    align : 'center',
                    width : 80
                }, {
                    name : 'purchaseNo',
                    align : 'center',
                    width : 60,
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
                    width : 60,
                    formatter : function(value) {
                        var map = {1:'自营', 2:'联营', 3:'商超'};
                        return map[value];
                    }
                }, {
                    name : 'cityName',
                    width : 80
                }, {
                    name : 'providerName',
                    width : 120
                }, {
                    name : 'status',
                    align : 'center',
                    width : 80,
                    formatter : function(value) {
                        return {0:'待配送', 10:'待配送',15:'待审核', 16:'审核通过', 20:'配送中', 30:'部分收货', 40:'已收货'}[value];
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
                        var retVal = ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="warehouseDeliveryDialog=$.showCommonEditDialog(\'/warehouse/delivery/itemDetails?purchaseId='+rowObject.purchaseNo+'&view=true\',\'详情\',1000,400);"><i class="ace-icon fa fa-truck blue"></i>详情</button>';
                        retVal += ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="javascript:warehouseShipping.exportItemDetails('+rowObject.purchaseNo+', '+true+');"><i class="ace-icon fa fa-list"></i>导出</button>';
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
        var url = '/warehouse/delivery/exportDetails?purchaseId=' + purchaseId + "&view=" + view;
        if($('#downloadIfm').attr('src')) {
        	$('#downloadIfm').attr('');
        }
        $('#downloadIfm').attr('src', url);
    },
    downloadUnDeliveredList : function() {
    	$("#needShipping #exportBtn").attr("disabled", "disabled");
    	var url = '/warehouse/delivery/exportShipping?'
    		+ warehouseShipping.getQueryString("#needShipping");
    	warehouseShipping.iframeCount++;
		var iframe = document.createElement("iframe");
		iframe.id = "iframe"+warehouseShipping.iframeCount;
		iframe.src = url;
		if (iframe.attachEvent) {
			iframe.attachEvent("onload", function() {
				$("#needShipping #exportBtn").removeAttr("disabled");
				if(warehouseShipping.iframeCount > 1) {
					$("#iframe"+(warehouseShipping.iframeCount-1)).remove();
				}
			});
		} else {
			iframe.onload = function() {
				$("#needShipping #exportBtn").removeAttr("disabled");
				if(warehouseShipping.iframeCount > 1) {
					$("#iframe"+(warehouseShipping.iframeCount-1)).remove();
				}
			};
		}
		document.body.appendChild(iframe);
		setTimeout(function() {
			if($("#needShipping #exportBtn").attr("disabled") == "disabled") {
				$("#needShipping #exportBtn").removeAttr("disabled");
			}
		},20000);
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
        warehouseShipping.unDeliveredList('#needShipping');
    });
    $('#needShipping #exportBtn').click(function(){
    	warehouseShipping.downloadUnDeliveredList('#needShipping');
    });
    $('#delivered #searchBtn').click(function(){
        warehouseShipping.deliveredList('#delivered');
    });
    
    // 加载发货处理列表
    warehouseShipping.unDeliveredList('#needShipping');

});
