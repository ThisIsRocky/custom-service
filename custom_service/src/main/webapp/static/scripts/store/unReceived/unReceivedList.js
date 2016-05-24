var storeUnrRceived = {
    grid_selector : "#table-data-list",
    pager_selector : "#table-data-list-pager",
    url : '/store/unReceived/getList',
    detailsGrid: null, // 数据详情
    // 加载数据详情
    query : function() {
        $('#data-list').show();
        var _this = this;
        // 首次加载
        _this.detailsGrid = $(storeUnrRceived.grid_selector).jqGrid({
            url : storeUnrRceived.url,
            datatype : 'json',
            colNames : [ '订货单号', '供货方' , '强配备注' , '订货日期', '应配日期', '操作'],
            jsonReader : {
                root: "data",
                page: "curPage",
                total: "totalPage",
                records: "totalRows"
            },
            prmNames : {page:'curPage',rows:'pageSize'},
            cmTemplate: {sortable:false},
            colModel : [ {
                name : 'purchaseId',
                width : 100
            },  {
                name : 'providerType',
                width : 100,
                align:"left",
                formatter : function(cellvalue, options, rowObject) {
                	var pType =  (cellvalue == 1) ? '仓库' : '供应商';
                	var ext = "";
                	if (rowObject.purchaseType == 2) {
                		ext += "<span style='color:red;'>[强配]</span>"
                	}
                	var content = "<div style='word-break: break-all;word-wrap: break-word;'>" + pType + ext + "</div>";
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
            }, {
                name : 'storePurchaseTime',
                formatter : function(cellvalue, options, rowObject) {
                    return $.dateFormat(cellvalue, 'yyyy-MM-dd');;
                },
                width : 100
            }, {
                name : 'expectReceiverDate',
                width : 100,
                formatter : function(cellvalue, options, rowObject) {
                	return $.dateFormat(cellvalue, 'yyyy-MM-dd');;
                },
            }, {
                name : '',
                width : 100,
                align : 'right',
                formatter : function(cellvalue, options, rowObject) {
                	var url = '/store/unReceived/toReceiveDetail?id=' + rowObject.id + "&deliverType=" + rowObject.deliverType;
                	return '<button class="btn btn-minier btn-white btn-default btn-bold zs-auth" permission="/store/unReceived/toReceiveDetail" onclick="$.showCommonEditDialog(\''+url+'\',\'订货单详情\',850,500);"><i class="ace-icon fa fa-check green"></i>订货单确认</button>';
                }
            }],
            rowNum : 10,
            rowList : [ 10, 20, 50 ],
            pager : storeUnrRceived.pager_selector,
            pagerpos : 'left',
            height : 350,
            viewrecords : true,
            autoHeight : true,
            loadComplete : function() {
                var table = this;
                setTimeout(function() {
                    updatePagerIcons(table);
                    $.authenticate();
                    $.removeScrollX('#data-list');
                }, 0);
            }
        });
        // 自适应宽度
        $.resizeGrid(storeUnrRceived.grid_selector);
    },
    reload : function() {
        if(storeUnrRceived.detailsGrid) {
            // 根据搜索条件，重新加载
            $(storeUnrRceived.grid_selector).jqGrid('setGridParam',{
                url : storeUnrRceived.url,
                page:1 ,
                datatype : 'json',
            }).trigger("reloadGrid");
        }else {
        	storeUnrRceived.query();
        }
        // 自适应宽度
        $.resizeGrid(storeUnrRceived.grid_selector);
    }
}

$(function() {
	storeUnrRceived.query();
});