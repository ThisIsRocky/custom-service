var storeLedgerFacade = {
    detailsGrid: null, // 数据详情
    url : '/store/ledger/list',
    exportUrl : '/store/ledger/export',
    query : function() {
        var queryString = storeLedgerFacade.getParams();
        if(!queryString) {
        	return false;
        }
        $('#data-list').show();
        // 加载详情
        storeLedgerFacade.loadDetails(queryString);
    },
    getParams : function() {
        var queryString ;
        var startDate = $('#startDateHid').val();
        var endDate = $('#endDateHid').val();
        
        if(startDate) {
            queryString = 'startDate=' + startDate.replace(/-/g, '');
        }else {
        	alert('日期为必填');
        	return null;
        }
        if(endDate) {
            queryString += '&endDate=' + endDate.replace(/-/g, '');
        }else {
        	alert('日期为必填');
        	return null;
        }
        return queryString;
    },
    // 加载数据详情
    loadDetails : function(params) {
        var _this = this;
        var grid_selector = "#table-data-list";
        var pager_selector = "#table-data-list-pager";
        if(_this.detailsGrid) {
            // 根据搜索条件，重新加载
            $(grid_selector).jqGrid('setGridParam',{
                url : storeLedgerFacade.url+'?'+params,
                page:1 
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : storeLedgerFacade.url+'?'+params,
                datatype : 'json',
                colNames : [ '进货日期', '物料编码' , '物料名称', '数量' , '单位', '规格' , '供应商名称', '保质期', 'id'],
                jsonReader : {  
                    root: "data",  
                    page: "curPage",  
                    total: "totalPage",  
                    records: "totalRows"
                },
                prmNames : {page:'curPage',rows:'pageSize', sort: 'sidx',order: 'sort'},
                cmTemplate: {sortable:true},
                colModel : [{
                    name : 'confirmReceiveDateStr',
                    width : 40
                },  {
                    name : 'materialCode',
                    width : 60
                }, {
                    name : 'materialName',
                    width : 70
                }, {
                    name : 'num',
                    align:'right',
                    width : 30
                }, {
                    name : 'unit',
                    width : 30
                }, {
                    name : 'standard',
                    width : 60
                }, {
                    name : 'supplierName',
                    width : 100
                }, {
                    name : 'shelfLife',
                    align:'center',
                    width : 30
                }, {
                    name : 'storeDeliveryId',
                    hidden : true,
                    key : true,
                } ],
                rowNum : 10,
                rowList : [ 10, 20, 50 ],
                pager : pager_selector,
                pagerpos : 'left',
                height : 330,
                viewrecords : true,
                autoHeight : true,
                loadComplete : function() {
                    var table = this;
                    setTimeout(function() {
                        updatePagerIcons(table);
                        $.removeScrollX('#data-list');
                    }, 0);
                }
            });
        }
        // 自适应宽度
        $.resizeGrid(grid_selector);
    },
    // 下载数据详情
    downloadReport: function(){
        var queryString = storeLedgerFacade.getParams();
        //        // 检查数据是否超过65535条
        var totalRecords = $('#table-data-list').jqGrid('getGridParam','records');
        if(totalRecords > 60000) {
            alert('您下载的数据量超过6万条，可能需要30秒到2分钟，请耐心等待，请勿重复下载。');
        }
        var url = storeLedgerFacade.exportUrl + "?" + Math.random() + '&' + queryString;
        $('#downloadIfm').attr('src', url);
    }
}

$(function() {
    $("#searchBtn").click(storeLedgerFacade.query);
    // 初始化查询条件
	$.initDatePicker('#dateRange');
	$("#download").click(storeLedgerFacade.downloadReport);
});