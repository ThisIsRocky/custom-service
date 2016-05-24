/**
 * Created by sunzheng on 16/4/18.
 */
var inventoryList = {
    grid_selector : "#table-data-report-list",
    pager_selector : "#table-data-report-list-pager",
    url : '/warehouse/inventory/list?',
    exportUrl : '/warehouse/inventory/export?',
    detailsGrid: null, // 数据详情
    // 下载数据详情
    downloadReport: function() {
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
        var url = inventoryList.exportUrl + "?" + Math.random() + '&' + queryString;
        $('#downloadIfm').attr('src', url);
    },
    // 加载数据详情
    query : function(params) {
        var _this = this;
        // 首次加载
        var params1 = initParams();
        if(!params1){
            return;
        }
        _this.detailsGrid = $(inventoryList.grid_selector).jqGrid({
            cmTemplate: {sortable:false},
            url : inventoryList.url+params1,
            datatype : 'json',
            colNames : [ '仓库', '盘点单号' ,'状态', '物料大类',
                "供应商", "备注", "盘点结束时间", "盘点人", "操作"],
            jsonReader : {
                root: "data",
                page: "curPage",
                total: "totalPage",
                records: "totalRows"
            },
            prmNames : {page:'curPage',rows:'pageSize', sort: 'sidx',order: 'sort'},
            cmTemplate: {sortable:false},
            colModel : [
                {
                    name : 'warehouseName',
                    align : 'center',
                    width : 160
                }, {
                    name : 'code',
                    align : 'center',
                    width : 80
                },{
                    name : 'statusName',
                    align : 'center',
                    width : 80
                },{
                    name : 'materialCategoryName',
                    align : 'center',
                    width : 50
                },{
                    name : 'supplierName',
                    align : 'center',
                    width : 80
                },{
                    name : 'remark',
                    align : 'center',
                    width : 100
                },{
                    name : 'inventoryFinishTime',
                    align : 'center',
                    width : 80,
                    formatter : function(cellvalue, options, rowObject) {
                        return $.dateFormat(rowObject.inventoryFinishTime,'yyyy-MM-dd');
                    }
                },{
                    name : 'inventoryUserName',
                    align : 'center',
                    width : 60
                },{
                    name : '',
                    sortable : false,
                    width : 160,
                    align : 'center',
                    formatter : function(cellvalue,options, rowObject) {
                        var retVal = "";
                        retVal += '<a class="zs-auth btn btn-minier btn-white btn-info btn-bold" href="javascript:void(0);" permission="/warehouse/inventory/" onclick="inventoryList.exportDetail('+rowObject.id+');"><i class="ace-icon fa fa-share-alt blue"></i>导出</a>';
                        retVal += '<a class="zs-auth btn btn-minier btn-white btn-info btn-bold" href="javascript:void(0);" permission="/warehouse/inventory/" onclick="inventoryList.toDetail('+rowObject.id+');"><i class="ace-icon fa fa-share-alt blue"></i>查看明细</a>';
                        if(rowObject.status == 30){
                            retVal += '<a class="zs-auth btn btn-minier btn-white btn-danger btn-bold" href="javascript:void(0);" permission="/warehouse/inventory/toApprove" onclick="inventoryList.toApprove('+rowObject.id+');"><i class="ace-icon fa fa-times red2"></i>审核</a>';
                        }
                        return retVal;
                    }
                }],
            rowNum : 30,
            rowList : [ 20, 50, 100 ],
            pager : inventoryList.pager_selector,
            pagerpos : 'left',
            height : 350,
            viewrecords : true,
            autoHeight : true,
            loadComplete : function() {
                var table = this;
                setTimeout(function() {
                    updatePagerIcons(table);
                }, 0);
                $.authenticate();
            }
        });
        // 自适应宽度
        $.resizeGrid(inventoryList.grid_selector);
    },
    reload : function() {
        if(inventoryList.detailsGrid) {
            var params1 = initParams();
            if(!params1){
                return;
            }
            // 根据搜索条件，重新加载
            $(inventoryList.grid_selector).jqGrid('setGridParam',{
                url : inventoryList.url+params1,
                page : 1
            }).trigger("reloadGrid");
            $.resizeGrid(inventoryList.grid_selector);
        }else {
            inventoryList.query();
        }
    },
    exportDetail : function(id) {
        var url = '/warehouse/inventory/export?inventoryId=' + id;
        if($("#downloadIfm").attr('src')) {
            $("#downloadIfm").attr('src', '');
        }
        $("#downloadIfm").attr('src', url);
    },
    toDetail : function(id) {
        edit("/warehouse/inventory/toDetail?inventoryId="+id,"盘点单明细",1000,600,false);
    },
    toApprove : function(id) {
        edit("/warehouse/inventory/toApprove?inventoryId="+id,"盘点单审核",400,200,false);
    }
};


$(function() {
    //初始化可输入下拉框
    inputSelectUtil.init();
    $.initDatePicker('#dateRange');

    $('#download').click(function(){
        var params1 = initParams();
        if(!params1){
            return;
        }
        inventoryList.downloadReport();
    });
    $('#searchBtn').click(function(){
        var params1 = initParams();
        if(!params1){
            return;
        }
        inventoryList.reload();
    });
    inventoryList.reload();
});
function initParams(){
    return $("form").serialize();
}