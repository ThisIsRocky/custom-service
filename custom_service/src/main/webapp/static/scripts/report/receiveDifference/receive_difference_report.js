var receiveDifferenceReportFacade = {
    detailsGrid: null, // 数据详情
    url : '/report/receiveDifference/list',
    query : function() {
        var queryString = receiveDifferenceReportFacade.getParams();
        if(!queryString) {
        	return false;
        }
        $('#data-list').show();
        // 加载详情
        receiveDifferenceReportFacade.loadDetails(queryString);
    },
    getParams : function() {
        var startDate =$('#startDateHid').val() ;
        var endDate = $('#endDateHid').val();
        if (startDate == '' || endDate == ''){
            $.dialog.alert("请选择收货日期");
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
                url : receiveDifferenceReportFacade.url+'?'+params,
                page:1 
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : receiveDifferenceReportFacade.url+'?'+params,
                datatype : 'json',
                colNames : [ '订货日期', '订货单号', '发货单号', '城市', '门店', '物料编码','物料名称','单位','规格','订货数量','实发数量','实收数量','预计配送时间','实际配送时间','发货差异备注','收货差异备注','供货方', '强配备注'],
                jsonReader : {  
                    root: "data",  
                    page: "curPage",  
                    total: "totalPage",  
                    records: "totalRows"
                },
                prmNames : {page:'curPage',rows:'pageSize', sort: 'sidx',order: 'sort'},
                cmTemplate: {sortable:true},
                colModel : [ {
                    name : 'createTime',
                    width : 100,
                    formatter:'date',
                    formatoptions: {srcformat: 'U/1000', newformat:'Y-m-d'}
                }, {
                    name : 'id',
                    width : 80
                }, {
                    name : 'deliveryId',
                    align:'right',
                    width : 80
                }, {
                    name : 'cityName',
                    align:'right',
                    width : 80
                }, {
                    name : 'storeName',
                    align:'right',
                    width : 100
                }, {
                    name : 'materialCode',
                    align:'right',
                    width : 100
                }, {
                    name : 'materialName',
                    align:'right',
                    width : 100
                }, {
                    name : 'unitName',
                    align:'right',
                    width : 50
                }, {
                    name : 'materialStandard',
                    align:'right',
                    width : 50
                },{
                    name : 'quantity',
                    align:'right',
                    width : 100
                },{
                    name : 'deliveryQuantity',
                    align:'right',
                    width : 100
                },{
                    name : 'receiveQuantity',
                    align:'right',
                    width : 100
                },{
                    name : 'expectReceiveDate',
                    align:'right',
                    width : 100,
                    formatter : function(cellvalue, options, rowObject) {
                        return $.dateFormat(cellvalue,'yyyy-MM-dd');
                    }
                },{
                    name : 'deliveryTime',
                    align:'right',
                    width : 100,
                    formatter : function(cellvalue, options, rowObject) {
                        return $.dateFormat(cellvalue,'yyyy-MM-dd');
                    }
                },{
                    name : 'deliveryDifferenceReason',
                    align:'right',
                    width : 100
                },{
                    name : 'receiveDifferenceReason',
                    align:'right',
                    width : 100
                }, {
                    name : 'providerName',
                    align:'left',
                    width : 100,
                    formatter : function(cellvalue, options, rowObject) {
                        var ext = "";
                        if (rowObject.purchaseType == 2) {
                            ext += "<span style='color:red;'>[强配]</span>"
                        }
                        var content = "<div style='word-break: break-all;word-wrap: break-word;'>" + cellvalue + ext + "</div>";
                        return content;
                    }
                }, {
                    name : 'remark',
                    width : 100,
                    formatter : function(cellvalue, options, rowObject) {
                    	if (rowObject.purchaseType == 2 && rowObject.remark) {
                    		return rowObject.remark;
                    	}
                    	return "";
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
    toggleDifferenceFlag : function() {
        var providerType = $("#providerType").val();
        if (providerType == 1) {
            $(".differenceFlag").show();
        } else {
            $(".differenceFlag").hide();
        }
    },
    export : function() {
        var cityIdList = $('#cityIdList').val();
        var storeType = $('#storeType').val();
        if(!cityIdList || !storeType) {
            $.dialog.alert('订单导出，请确保填写城市、门店类型信息');
            return false;
        }
        var queryString = receiveDifferenceReportFacade.getParams();
        if(!queryString) {
            return false;
        }
        var url = '/report/receiveDifference/export?' + queryString;
        if($("#downloadIfm").attr('src')) {
            $("#downloadIfm").attr('src', '');
        }
        $("#downloadIfm").attr('src', url);
    }
};

$(function() {
    $.initDatePicker('#dateRange');
    $('#dateRange').val('');
    $("form").submit(function(event) {event.preventDefault();});
    $("#searchBtn").click(receiveDifferenceReportFacade.query);
    MultiSelectUtil.init();
});