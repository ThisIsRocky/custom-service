var orderQueryFacard = {
    dataGrid: null,
    getQueryString : function() {
        var queryString = '?orderCreateTimeStart=' + $('#startDateHid').val() 
            + '&orderCreateTimeEnd=' + $('#endDateHid').val() ;
        var cityId = $('#city').val();
        var storeId = $('#storeIdHid').val();
        var restaurantId = $('#restaurantIdHid').val();
        var orderIds = $('#orderIds').val();
        if(cityId) {
            queryString += '&cityId=' + cityId;
        }
        if(storeId) {
            queryString += '&storeId=' + storeId;
        }
        if(restaurantId) {
            queryString += '&restaurantId=' + restaurantId;
        }
        if(orderIds) {
            var orderIdArray = orderIds.split(',');
            for(var i=0; i< orderIdArray.length; i++) {
                queryString += '&elemeOrderIds['+ i +']=' + orderIdArray[i];
            }
        }
        return queryString + '&rd=' + Math.random();
    },
    loadOrderList : function() {
        var _this = this;
        var grid_selector = "#table-data-list";
        var pager_selector = "#table-data-list-pager";
        var url = '/order/query/orderList' + orderQueryFacard.getQueryString() ;
        if (_this.dataGrid) {
            // 根据搜索条件，重新加载
            $(grid_selector).jqGrid('setGridParam', {
                url : url,
                page : 1,
                forceFit : true,
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.dataGrid = $(grid_selector).jqGrid({
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
                colNames : ['城市', '门店名称', '餐厅名称','订单号', '订单总金额', 'eleme补贴', '餐厅补贴', '下单时间' ],
                cmTemplate: {sortable:true},
                colModel : [ {
                    name : 'cityName',
                    align : 'center',
                    width : 60
                }, {
                    name : 'storeName',
                    width : 100
                }, {
                    name : 'restaurantName',
                    width : 100
                }, {
                    name : 'elemeOrderIdString',
                    width : 80,
                    align : 'center',
                    key: true
                }, {
                    name : 'originalPrice',
                    width : 50,
                    align : 'right'
                }, {
                    name : 'elemeSubsidy',
                    width : 50,
                    align : 'right'
                }, {
                    name : 'restaurantSubsidy',
                    width : 50,
                    align : 'right'
                }, {
                    name : 'createdAt',
                    width : 100,
                    align : 'center',
                    formatter : function(cellvalue, options, rowObject) {
                        return $.dateFormat(cellvalue, 'yyyy-MM-dd hh:mm:ss');;
                    }
                }],
                rowNum : 20,
                rowList : [ 10, 20, 50 ],
                pager : pager_selector,
                height : _this.getFixedHeight(),
                autoHeight : true,
                viewrecords : true,
                loadComplete : function() {
                    var table = this;
                    setTimeout(function() {
                        updatePagerIcons(table);
                        $.removeScrollX($('#data-list'));
                    }, 0);
                    $.authenticate();
                }
            });
        }
        // 自适应宽度
        $.resizeGrid(grid_selector);
    },
    getFixedHeight: function(){
        var height = $(window).height() -310;
        return height > 300 ? height : 300;
    }
}
$(function() {
    // 加载订单列表
    setTimeout(function(){
        orderQueryFacard.loadOrderList();
    },100);
    
    $.initDatePicker('#dateRange');

    // 初始化可输入下拉框
    inputSelectUtil.init().load("#cityId");
    
    $('#searchBtn').click(function(){
        orderQueryFacard.loadOrderList();
    });
    
});