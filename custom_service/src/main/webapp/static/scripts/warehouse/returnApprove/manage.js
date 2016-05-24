var storeFacade = {
    fill : function(id, name,jsonStr, nodeId) {
        var obj = eval('(' + jsonStr + ')');
        $(nodeId).attr('idVal',id);
        $('#storeName').val(obj.storeName);
    },
    check : function(nodeId) {
        if (!$(nodeId).val() || $(nodeId).val()=='') {
            $(nodeId).removeAttr('idVal');
            $('#storeName').val('');
        }
        else if ($(nodeId).attr('idVal') != $(nodeId).val()) {
            $(nodeId).val($(nodeId).attr('idVal'));
        }
    }
}

var returnApproveFacade = {
    approveGrid: null,
    getQueryString : function() {
        var startDate = $('#startDateHid').val();
        var endDate = $('#endDateHid').val();
        var cityId = $('#city').val();
        var id = $('#id').val();
        var storeType = $('#storeType').val();
        var storeCode = $('#storeCode').attr('idval');
        var storeName = $('#storeName').val();
        var status = $('#status').val();
        
        var queryString = '1=1';
        queryString += '&startTime=' + startDate;
        queryString += '&endTime=' + endDate;
        if(cityId) {
            queryString += '&cityId=' + cityId;
        }
        if(id) {
            queryString += '&id=' + id;
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
        if(status) {
            queryString += '&status=' + status;
        }
        
        var needDiffReason = $('#needDiffReason').val();
        if(needDiffReason==0){
            queryString += '&needDiffReason=' + needDiffReason;
        }
        return queryString;
    },
    approveList : function() {
        
        var queryString = returnApproveFacade.getQueryString();
        
        var _this = this;
        var grid_selector = "#table-data-list";
        var pager_selector = "#table-data-list-pager";
        var url = '/returnApprove/getApproveList?' + queryString;
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
                colNames : [ '提报日期', '退货单号', '提报人', '提报人电话', '门店编码', '门店名称', '门店类型', '所在城市', '状态', '操作' ],
                cmTemplate: {sortable:true},
                colModel : [ {
                    name : 'createTime',
                    align : 'center',
                    width : 80,
                    formatter : function(cellvalue, options, rowObject) {
                        return $.dateFormat(rowObject.createTime,'yyyy-MM-dd');
                    }
                }, {
                    name : 'id',
                    align : 'center',
                    width : 80,
                    key: true
                }, {
                    name : 'createBy',
                    align : 'center',
                    width : 80
                }, {
                    name : 'creatorPhone',
                    align : 'center',
                    width : 80
                }, {
                    name : 'storeCode',
                    align : 'center',
                    width : 80
                }, {
                    name : 'storeName',
                    align : 'center',
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
                    align : 'center',
                    width : 80
                }, {
                    name : 'status',
                    align : 'center',
                    width : 100,
                    formatter : function(value) {
                    	if(value == 9) {
                    		return '待审核[仅可在ERP2.0审核]';
                    	}
                    	if(value == 10) {
                    		return '待审核[仅可在ERP2.0以下版本审核]';
                    	}
                    	if(value == 19) {
                    		return '审核通过[需在ERP2.0确认退货]';
                    	}
                    	if(value == 20) {
                    		return '审核通过';
                    	}
                    	if(value == 30) {
                    		return '审核不通过';
                    	}
                    	if(value == 40) {
                    		return '已发货';
                    	}
                    	if(value == 50) {
                    		return '仓库已收货';
                    	}
                    	return "";
                    }
                }, {
                    name : 'status',
                    sortable : false,
                    width : 100,
                    align : 'center',
                    formatter : function(cellvalue, options, rowObject) {
                    	var act = (cellvalue == 9 ? '审核' : '明细');
                        var retVal = ' <button class="zs-auth btn btn-minier btn-white btn-default btn-bold" permission="/returnApprove/getItemListById" onclick="$.showCommonEditDialog(\'/returnApprove/toManage?id='+
                        rowObject.id+'\',\'退货'+act+'\',1000,500);">'+act+'</button>';
                        retVal += ' <button class="zs-auth btn btn-minier btn-white btn-default btn-bold" permission="/returnApprove/downloadItems" onclick="javascript:returnApproveFacade.exportItemDetails('+rowObject.id+');"><i class="ace-icon fa fa-list"></i>导出</button>';
                      //是否有差异 
                        var needDiffReason = rowObject.needDiffReason;
                        if(needDiffReason != 0){
                            retVal += ' <button class="zs-auth btn btn-minier btn-white btn-default btn-bold" permission="/returnApprove/findDiffReason" onclick="$.showCommonEditDialog(\'/returnApprove/findDiffReason?id='+
                            rowObject.id+'\',\'差异备注'+act+'\',390,400);">'+"差异备注"+'</button>';
                        }
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
                        $.removeScrollX($('#data-list-approve'));
                        $.authenticate();
                    }, 0);
                }
            });
        }
        // 自适应宽度
        $.resizeGrid(grid_selector);
    },
    exportItemDetails : function(id) {
        var url = '/returnApprove/downloadItems?id=' + id;
        if($('#downloadIfm').attr('src')) {
        	$('#downloadIfm').attr('');
        }
        $('#downloadIfm').attr('src', url);
    }
}
$(function() {
    $.initDatePicker('#dateRange');

    // 初始化可输入下拉框
    inputSelectUtil.init().load("#cityId");

    
    $('#searchBtn').click(function(){
        returnApproveFacade.approveList();
    });
    
    // 加载发货处理列表
    returnApproveFacade.approveList();

});