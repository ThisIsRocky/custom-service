var brandReportFacade = {
    detailsGrid: null, // 数据详情
    url : '/report/brand/list',
    query : function() {
        debugger;
        var queryString = brandReportFacade.getParams();
        if(!queryString) {
        	return false;
        }
        $('#data-list').show();
        // 加载详情
        brandReportFacade.loadDetails(queryString);
    },
    getParams : function() {
        var startDate =$('#startDateHid').val() ;
        var endDate = $('#endDateHid').val();
        if (startDate == '' || endDate == ''){
            $.dialog.alert("请选择日期");
            return false;
        }
        return $("form").serialize();
    },
    // 加载数据详情
    loadDetails : function(params) {
        var _this = this;
        var grid_selector = "#table-data-list";
        var pager_selector = "#table-data-list-pager";
        if(_this.detailsGrid) {
            // 根据搜索条件，重新加载
            $(grid_selector).jqGrid('setGridParam',{
                url : brandReportFacade.url+'?'+params,
                page:1 
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : brandReportFacade.url+'?'+params,
                datatype : 'json',
                colNames : [ '品牌', '餐厅id', '餐厅名称','实体店ID','实体店名称','城市','销售额','成本','有效订单','无效订单','饿了么补贴','餐厅补贴','餐盒费','配送费','毛利','毛利率'],
                jsonReader : {  
                    root: "data",  
                    page: "curPage",  
                    total: "totalPage",  
                    records: "totalRows"
                },
                prmNames : {page:'curPage',rows:'pageSize', sort: 'sidx',order: 'sort'},
                cmTemplate: {sortable:true},
                colModel : [ {
                    name : 'brandName',
                    width : 80
                }, {
                    name : 'restaurantId',
                    width : 80
                },{
                    name : 'restaurantName',
                    width : 80
                }, {
                    name : 'storeCode',
                    width : 100
                }, {
                    name : 'storeName',
                    width : 100
                }, {
                    name : 'cityName',
                    align:'right',
                    width : 100
                }, {
                    name : 'salesAmount',
                    width : 100
                }, {
                    name : 'cost',
                    align:'right',
                    width : 100
                }, {
                    name : 'effectOrderCount',
                    align:'right',
                    width : 100
                }, {
                    name : 'noEffectOrderCount',
                    align:'right',
                    width : 100
                }, {
                    name : 'elemeSubsidy',
                    align:'right',
                    width : 100
                }, {
                    name : 'restaurantSubsidy',
                    align:'right',
                    width : 100
                }, {
                    name : 'packageFee',
                    align:'right',
                    width : 100
                }, {
                    name : 'deliverFee',
                    align:'right',
                    width : 100
                }, {
                    name : 'grossProfit',
                    align:'right',
                    width : 100
                }, {
                    name : 'grossProfitRate',
                    align:'right',
                    width : 100,
                    formatter : function(cellvalue, options, rowObject){
                        var content = cellvalue + "%"
                        return content;
                    }
                }],
                rowNum : 30,
                pager : pager_selector,
                pagerpos : 'left',
                height : 350,
                viewrecords : true,
                autoHeight : true,
                loadComplete : function() {
                    var table = this;
                    setTimeout(function() {
                        updatePagerIcons(table);
                        $.removeScrollX('#data-list');
                        $.authenticate();
                    }, 0);
                }
            });
        }
        // 自适应宽度
        $.resizeGrid(grid_selector);
    },
    export : function() {
        //var cityIdList = $('#cityIdList').val();
        //var storeType = $('#storeType').val();
        //if(!cityIdList || !storeType) {
        //    $.dialog.alert('数据导出，请确保填写城市、门店类型信息');
        //    return false;
        //}
        var startDate =$('#startDateHid').val() ;
        var endDate = $('#endDateHid').val();
        if (startDate == '' || endDate == ''){
            $.dialog.alert("请选择日期");
            return false;
        }
        var queryString = brandReportFacade.getParams();
        if(!queryString) {
            return false;
        }
        var url = '/report/brand/export?' + queryString;
        if($("#downloadIfm").attr('src')) {
            $("#downloadIfm").attr('src', '');
        }
        $("#downloadIfm").attr('src', url);
    },
}

$(function() {
    $.initDatePicker('#dateRange');
    $('#dateRange').val('');
    $("form").submit(function(event) {event.preventDefault();});
    $("#searchBtn").click(brandReportFacade.query);
    MultiSelectUtil.init();
});