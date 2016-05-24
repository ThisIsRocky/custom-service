var allotConfirm = {

    detailsGrid : null, // 数据详情
    // 加载数据详情
    loadDate : function(params) {
        var _this = this;
        //$('#page_tabs').tabs("select", 1);
        $( "#page_tabs" ).tabs( "option", "active", 1 );
        var grid_selector = "#apply_table_data_list";
        var pager_selector = "#confirm_store_table_data_list_pager";
        var url = '/store/transfer/queryStoreApply';
        if (_this.detailsGrid) {
            // 根据搜索条件，重新加载
            $(grid_selector).jqGrid('setGridParam', {
                url : url,
                page : 1
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : url,
                type: 'post',
                datatype : 'json',
                colNames : [ '调拨单编号', '调出门店', '调出申请时间','操作' ],
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
                        width : 50,
                        align : 'center',

                    },
                    {
                        name : 'fromStoreName',
                        width : 100,
                        align : 'center',
                    },
                    {
                        name : 'createTime',
                        formatter : function(cellvalue,
                                             options, rowObject) {
                            return $.dateFormat(cellvalue,
                                'yyyy-MM-dd');
                            ;
                        },
                        align : 'center',
                        width : 100
                    },
                    {
                        name : '',
                        width : 100,
                        align : 'center',
                        formatter : function(cellvalue,options, rowObject) {
                            var returnVal = ' <button class="btn btn-minier btn-white btn-default btn-bold zs-auth" permission="/store/transfer/orderDetail" onclick="allotOrderInfo('+rowObject.id+');"><i class="ace-icon fa fa-list"></i>调入确认</button>';
                            return returnVal
                        }
                    } ],
                rowNum : 10,
                rowList : [ 10, 20, 50 ],
                pager : pager_selector,
                pagerpos : 'left',
                height : 341,
                viewrecords : true,
                autoHeight : true,
                loadComplete : function() {
                    var table = this;
                    setTimeout(function() {
                        $.removeScrollX('#confirm-data-list');
                        updatePagerIcons(table);
                    }, 0);
                    $.authenticate();
                }
            });
        }
        // 自适应宽度
        $.resizeGrid(grid_selector);
    },

}
function loadAllotApply(){
    allotConfirm.loadDate()
}
function allotOrderInfo(id) {
    edit("/store/transfer/orderDetail?id="+id,"调拨单详情",600,350,false);
}