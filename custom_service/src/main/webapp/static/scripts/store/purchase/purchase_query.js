var purchaseQuery = {
    
    grid_selector : "#query-table-data-list",
    pager_selector : "#query-table-data-list-pager",
    url : '/store/purchase/query/findParentList',
    detailsGrid : null, // 数据详情
    queryStr : function() {
        var queryString = "?startDate=" + $('#purchaseQuery #startDateHid').val()
        + "&endDate=" + $('#purchaseQuery #endDateHid').val()
        + "&status=" + $('#purchaseQuery #status').val();    
        return queryString;
    },
    // 加载数据详情
    loadDate : function() {
        // 自适应宽度
        if (purchaseQuery.detailsGrid) {
            // 根据搜索条件，重新加载
            $(purchaseQuery.grid_selector).jqGrid('setGridParam', {
                url : purchaseQuery.url + purchaseQuery.queryStr(),
                page : 1,
                forceFit : true,
            }).trigger("reloadGrid");
        } else {
            var _this = this;
            // 首次加载
            _this.detailsGrid = $(purchaseQuery.grid_selector).jqGrid({
                url : purchaseQuery.url + purchaseQuery.queryStr(),
                datatype : 'json',
                colNames : [ '订货单号', '供货方', '强配备注', '订货日期', '配送日期','订货单状态', '操作' ],
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
                            name : 'id',
                            align : 'center',
                            width : 50
                        },
                        {
                            name : 'providerTypeStr',
                            align : 'left',
                            width : 150,
                            formatter : function(cellvalue,
                                    options, rowObject) {
                            	var ext = "";
                            	if (rowObject.purchaseType == 2) {
                            		ext += "<span style='color:red;'>[强配]</span>"
                            	}
                            	var content = "<div style='word-break: break-all;word-wrap: break-word;'>[" + cellvalue + "]" + rowObject.providerName + ext + "</div>";
                            	return content;
                            },
                        },
                        {
                            name : 'remark',
                            width : 100,
                            formatter : function(cellvalue, options, rowObject) {
                            	if (rowObject.purchaseType == 2 && rowObject.remark) {
                            		return rowObject.remark;
                            	}
                            	return "";
                            }
                        },
                        {
                            name : 'createTime',
                            align : 'center',
                            formatter : function(cellvalue,
                                    options, rowObject) {
                                return $.dateFormat(cellvalue,
                                        'yyyy-MM-dd');
                                ;
                            },
                            width : 80
                        },
                        {
                            name : 'expectReceiveDate',
                            align : 'center',
                            width : 80,
                            formatter : function(cellvalue,
                                    options, rowObject) {
                                return $.dateFormat(cellvalue,
                                        'yyyy-MM-dd');
                                ;
                            },
                        },
                        {
                            name : 'statusStr',
                            align : 'center',
                            width : 80,
                        },
                        {
                            name : '',
                            width : 100,
                            align : 'center',
                            formatter : function(cellvalue,options, rowObject) {
                                var url = '/store/purchase/viewDetail?purchaseId='
                                        + rowObject.id
                                        + "&deliverType="
                                        + rowObject.deliverType;
        
                                var returnVal = '<button class="btn btn-minier btn-white btn-default btn-bold zs-auth"'
                                        + 'permission="/store/purchase/viewDetail"'
                                        + 'onclick="$.showCommonEditDialog(\''
                                        + url
                                        + '\',\'订货单详情\',800,400);">'
                                        + '<i class="ace-icon fa fa-check green"></i>订货单明细</button>';
//                                returnVal += ' <button class="btn btn-minier btn-white btn-default btn-bold"><i class="ace-icon fa fa-list"></i>导出</button>';
                                return returnVal
                            }
                        } ],
                rowNum : 10,
                rowList : [ 10, 20, 50 ],
                pager : purchaseQuery.pager_selector,
                pagerpos : 'left',
                height : 350,
                viewrecords : true,
                autoHeight : true,
                loadComplete : function() {
                    var table = this;
                    setTimeout(function() {
                     // 自适应宽度
                        $.resizeGrid(purchaseQuery.grid_selector);
                        updatePagerIcons(table);
                        $.authenticate();
                        $.removeScrollX(purchaseQuery.grid_selector);
                    }, 0);
                },
            });
        }
    }
}

$(function() {
    $.initDatePicker('#dateRange');
    $('#purchaseQuery #searchBtn').click(function(){
        purchaseQuery.loadDate();
    });
});
