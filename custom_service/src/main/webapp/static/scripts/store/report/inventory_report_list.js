var inventoryReport = {
    grid_selector : "#table-data-report-list",
    pager_selector : "#table-data-report-list-pager",
    url : '/store/report/inventory/queryInventoryReport?',
    exportUrl : '/store/report/inventory/exporWithPrice',
    detailsGrid: null, // 数据详情
 // 下载数据详情
    downloadReport: function() {
        var cityIdList = $('#cityIdList').val();
        var storeType = $('#storeType').val();
        if (!cityIdList || !storeType) {
            $.dialog.alert('请确保填写日期、城市、门店类型信息');
            return false;
        }
        if (cityIdList.length > 1) {
            $.dialog.alert('导出数据请选择单个城市');
            return false;
        }
        var startTime =$('#startDateHid').val() ;
        var endTime = $('#endDateHid').val();
        var startDateObj = parseDateFromISO(startTime);
        var endDateObj = parseDateFromISO(endTime);
        if (dateDiffInDays(startDateObj, endDateObj) > 30) {
            $.dialog.alert('请确保填写日期在30天内');
            return false;
        }
        var queryString = initParams();
        if(!queryString){
            return;
        }
        // 检查数据是否超过65535条
        var totalRecords = $('#table-data-list').jqGrid('getGridParam','records');
        if(totalRecords > 60000) {
            alert('您下载的数据量超过6万条，可能需要30秒到2分钟，请耐心等待，请勿重复下载。');
        }
        var url = inventoryReport.exportUrl + "?" + Math.random() + '&' + queryString;
        $('#downloadIfm').attr('src', url);
    },
    // 加载数据详情
    query : function(params) {
        $('#data-report-list').show();
        var _this = this;
        // 首次加载
        var params1 = initParams();
        if(!params1){
            return;
        }
        _this.detailsGrid = $(inventoryReport.grid_selector).jqGrid({
            cmTemplate: {sortable:false},
            url : inventoryReport.url+params1,
            datatype : 'json',
            colNames : [ '门店编号','门店','物料编号', '物料名称' ,'单位', '规格',
                "期初", "期初(税前)", "期初(税后)", "进货", "进货(税前)", "进货(税后)",
                "调拨", "调拨(税前)", "调拨(税后)", "报废", "报废(税前)", "报废(税后)",
                "退货", "退货(税前)", "退货(税后)", "销售", "销售(税前)", "销售(税后)",
                "期末账面", "期末账面(税前)", "期末账面(税后)", "期末", "期末(税前)", "期末(税后)",
                "差异", "差异(税前)", "差异(税后)"],
            jsonReader : {  
                root: "data",  
                page: "curPage",  
                total: "totalPage",  
                records: "totalRows"
            },
            prmNames : {page:'curPage',rows:'pageSize', sort: 'sidx',order: 'sort'},
            cmTemplate: {sortable:true},
            colModel : [
            {
                name : 'storeCode',
                align : 'center',
                width : 80
            },
            {
                name : 'storeName',
                align : 'center',
                width : 80
            }, {
                name : 'materialCode',
                align : 'left',
                width : 80
            }, {
                name : 'materialName',
                align : 'left',
                width : 150
            },{
                name : 'unitName',
                align : 'left',
                width : 30
            },{
                name : 'standardName',
                align : 'left',
                width : 120
            },{
                name : 'inventoryStartStr',
                align : 'right',
                width : 80
            },{
                name : 'inventoryStartAmountStr',
                align : 'right',
                width : 80
            },{
                name : 'inventoryStartAmountExclTaxStr',
                align : 'right',
                width : 80
            },{
                name : 'inCount',
                align : 'right',
                width : 80
            },{
                name : 'inAmount',
                align : 'right',
                width : 80
            },{
                name : 'inAmountExclTax',
                align : 'right',
                width : 80
            },{
                name : 'transferCount',
                align : 'right',
                width : 80
            },{
                name : 'transferAmountStr',
                align : 'right',
                width : 80
            },{
                name : 'transferAmountExclTaxStr',
                align : 'right',
                width : 80
            },{
                name : 'breakdownCount',
                align : 'right',
                width : 80
            },{
                name : 'breakdownAmount',
                align : 'right',
                width : 80
            },{
                name : 'breakdownAmountExclTax',
                align : 'right',
                width : 80
            },{
                name : 'returnCount',
                align : 'right',
                width : 80
            },{
                name : 'returnAmount',
                align : 'right',
                width : 80
            },{
                name : 'returnAmountExclTax',
                align : 'right',
                width : 80
            },{
                name : 'orderSaleCount',
                align : 'right',
                width : 80
            },{
                name : 'orderSaleAmount',
                align : 'right',
                width : 80
            },{
                name : 'orderSaleAmountExclTax',
                align : 'right',
                width : 80
            },{
                name : 'endPaper',
                align : 'right',
                width : 80
            },{
                name : 'endPaperAmount',
                align : 'right',
                width : 80
            },{
                name : 'endPaperAmountExclTax',
                align : 'right',
                width : 80
            },{
                name : 'inventoryEndStr',
                align : 'right',
                width : 80
            },{
                name : 'inventoryEndAmountStr',
                align : 'right',
                width : 80
            },{
                name : 'inventoryEndAmountExclTaxStr',
                align : 'right',
                width : 80
            },{
                name : 'diffNum',
                align : 'right',
                width : 80
            },{
                name : 'diffAmount',
                align : 'right',
                width : 80
            },{
                name : 'diffAmountExclTax',
                align : 'right',
                width : 80
            },],
            rowNum : 10,
            rowList : [ 10, 20, 50 ],
            pager : inventoryReport.pager_selector,
            pagerpos : 'left',
            height : 'auto',
            viewrecords : true,
            autoHeight : true,
            shrinkToFit: false,
            //forceFit : true,
            loadComplete : function() {
                var table = this;
                updatePagerIcons(table);
                /*setTimeout(function() {

                    $.removeScrollX('#data-report-list');
                }, 0);*/
                localSort.close();
            },
            beforeRequest : function() {
            	if(localSort.col) {
                    localSort.sort(inventoryReport.grid_selector);
            		return false;
            	}else {
            		localSort.reset(inventoryReport.grid_selector);
                    localSort.open();
                    return true;
            	}
            },
            onSortCol : function(col, index, order) {
            	localSort.setParam(inventoryReport.grid_selector, "materialCode", col, index, order);
            }
        });
     // 自适应宽度
        $.resizeGrid(inventoryReport.grid_selector);
    },
    reload : function() {
        if(inventoryReport.detailsGrid) {
            var params1 = initParams();
            if(!params1){
                return;
            }
            // 根据搜索条件，重新加载
            $(inventoryReport.grid_selector).jqGrid('setGridParam',{
                url : inventoryReport.url+params1,
                page : 1
            }).trigger("reloadGrid");
            $.resizeGrid(inventoryReport.grid_selector);
        }else {
            inventoryReport.query();
        }
    },
    cleanParam : function() {
        inputSelectUtil.clean("#storeId");
    }
};


$(function() {
    //初始化可输入下拉框
    MultiSelectUtil.init();
    inputSelectUtil.init().load('#selectInventoryTemplateReportName');
    $.initDatePicker('#dateRange');
    $('#dateRange').val('');
    
    $('#download').click(function(){
        var params1 = initParams();
        if(!params1){
           return;
        }
        inventoryReport.downloadReport();
   });
	$('#submitReportBtn').click(function(){
	     var params1 = initParams();
         if(!params1){
            return;
         }
         inventoryReport.reload();
    })
	
});
function initParams(){
    var templateId = $("#selectInventoryTemplateReport").val();
    var materialType = $("#materialType").val();
    var materialName = $("#materialName").val();
    if(templateId=='' && materialType == '' && materialName.trim() == '') {
        $.dialog.alert("请选择或输入物料种类、物料名称、盘点模版中至少一项");
        return false;
    }

    var startTime =$('#startDateHid').val() ;
    var endTime = $('#endDateHid').val();
    if(startTime=='' || endTime ==''){
        $.dialog.alert("请选中日期");
        return false;
    }
    return $("form").serialize();
}
var templateOption = {
	    fill : function(id, name) {
	        $('#selectInventoryTemplateReportName').attr('idVal',id);
	        $('#selectInventoryTemplateReportName').attr('nameVal',name);
	        $('#selectInventoryTemplateReport').val(id);
	    },
	    check : function(nodeId) {
	        if (!$(nodeId).val() || $(nodeId).val()=='') {
	            $(nodeId).removeAttr('nameVal');
	            $(nodeId).removeAttr('idVal');
		        $('#selectInventoryTemplateReport').val('');
	        }
	        else if ($(nodeId).attr('nameVal') != $(nodeId).val()) {
	            $(nodeId).val($(nodeId).attr('nameVal'));
	        }
	    }

	}


