var inventoryReport = {
    grid_selector : "#table-data-report-list",
    pager_selector : "#table-data-report-list-pager",
    url : '/store/inventory/queryInvetoryHistory?',
    exportUrl : '/store/inventory/exportInventoryReport',
    detailsGrid: null, // 数据详情
    // 下载数据详情
    downloadReport: function(){
        var queryString = initParams();
        if(!queryString){
            return;
        }
        //        // 检查数据是否超过65535条
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
        var params1 = initParams();
        if(!params1){
            return;
        }
        _this.detailsGrid = $(inventoryReport.grid_selector).jqGrid({
            url : inventoryReport.url+params1,
            datatype : 'json',
            colNames : [ '物料编号', '物料名称' ,'单位', '规格',"期初","进货","调拨","报废","退货","销售","期末","差异"],
            jsonReader : {  
                root: "data",  
                page: "curPage",  
                total: "totalPage",  
                records: "totalRows"
            },
            prmNames : {page:'curPage',rows:'pageSize', sort: 'sidx',order: 'sort'},
            cmTemplate: {sortable:true},
            colModel : [ {
                name : 'materialCode',
                align : 'center',
                width : 100
            }, {
                name : 'materialName',
                align : 'center',
                width : 100
            },{
                name : 'unitName',
                align : 'center',
                width : 100
            },{
                name : 'standardName',
                align : 'center',
                width : 100
            },{
                name : 'inventoryStart',
                align : 'center',
                width : 100
            },{
                name : 'purchaseNum',
                align : 'center',
                width : 100
            },{
                name : 'transferNum',
                align : 'center',
                width : 100
            },{
                name : 'scrappedNum',
                align : 'center',
                width : 100
            },{
                name : 'returnPurchaseNum',
                align : 'center',
                width : 100
            },{
                name : 'orderNum',
                align : 'center',
                width : 100
            },{
                name : 'inventoryEnd',
                align : 'center',
                width : 100
            },{
                name : 'diffNumForStore',
                align : 'center',
                width : 100,
                formatter: function (cellvalue, options, rowObject) {
                    localSort.addRow(rowObject);
                    return cellvalue;
                }
            }],
            rowNum : 10,
            rowList : [ 10, 20, 50 ],
            pager : inventoryReport.pager_selector,
            pagerpos : 'left',
            height : 'auto',
            viewrecords : true,
            autoHeight : true,
            loadComplete : function() {
                var table = this;
                setTimeout(function() {
                    updatePagerIcons(table);
                    $.removeScrollX('#data-report-list');
                }, 0);
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
            $(inventoryReport.grid_selector).jqGrid('setGridParam',{
                url : inventoryReport.url+params1
            }).trigger("reloadGrid");
            $.resizeGrid(inventoryReport.grid_selector);
        }else {
            inventoryReport.query();
        }
    }
}


function initParams(){
    var checked = 0;
    if($('#showDiff').is(':checked')) {
        checked=1;
    }
    var templateId = $("#selectInventoryTemplateReport").val();
    if(templateId==''){
        alert("请选中盘点模版");
        return false;
    }
    
    var startTime =$('#startDateHid').val() ;
    var endTime = $('#endDateHid').val();
    if(startTime=='' || endTime ==''){
        alert("请选中日期");
        return false;
    }
    
    var params = "templateId="+ templateId
         +"&startTime="+startTime
         +"&endTime=" + endTime
         +"&showDiff=" + checked;
    return params;
}


$(function() {
    $.initDatePicker('#dateRange');
    $("#dateRange").val('');
    //$("#download").click(inventoryReport.downloadReport);
    
    $('#download').click(function(){
        var params1 = initParams();
        if(!params1){
            return;
        }
        inventoryReport.downloadReport();
    })
    
	$('#submitReportBtn').click(function(){
	    var params1 = initParams();
        if(!params1){
            return;
        }
        inventoryReport.reload();
    })
	
});