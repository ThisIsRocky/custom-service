var orderReportFacade = {
    detailsGrid: null, // 数据详情
    query : function() {

        var queryString = "";
        var cityId = $('#cityId').val();
        var warehouseId = $('#warehouseId').val();
        var name = $('#name').val();
        if(cityId) {
            queryString += '&cityId=' + cityId;
        }
        if(warehouseId) {
            queryString += '&id=' + warehouseId;
        }
        if(name) {
            queryString += '&name=' + name;
        }

        $('#data-list').show();
        // 加载详情
        orderReportFacade.loadDetails(queryString);

    },
    // 加载数据详情
    loadDetails : function(params) {
        var _this = this;
        var grid_selector = "#table-data-list";
        var pager_selector = "#table-data-list-pager";
        var url = '/supplier/warehouse/queryWarehouse?'+params;
        if(_this.detailsGrid) {
            // 根据搜索条件，重新加载
            $(grid_selector).jqGrid('setGridParam',{
                url : url,
                //postData : params,
                page:1
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : url,
                //postData : params,
                datatype : 'json',
                colNames : [ '仓库编码', '仓库名称' , '仓库类型','所在城市','操作列'],
                jsonReader : {
                    root: "data",
                    page: "curPage",
                    total: "totalPage",
                    records: "totalRows"
                },
                prmNames : {page:'curPage',rows:'pageSize', sort: 'sidx',order: 'sort'},
                cmTemplate: {sortable:true},
                colModel : [ {
                    name : 'code',
                    width : 80
                },  {
                    name : 'name',
                    width : 120
                },  {
                    name : 'type',
                    width : 60,
                    formatter : function(cellvalue, options, rowObject) {
                          if(cellvalue == 10){
                              return "大仓";
                          }else if(cellvalue == 20){
                            return "小仓";
                          }

                    }
                }, {
                    name : 'cityName',
                    width : 100
                },{
                    name : '',
                    sortable : false,
                    width : 250,
                    align : 'center',
                    formatter : function(cellvalue, options, rowObject) {
                        var retVal = '<a class="btn btn-minier btn-white btn-warning btn-bold zs-auth" permission="/supplier/warehouse/updateWarehouse"  href="javascript:void(0);" onclick=updateWarehouse('+rowObject.id+');><i class="ace-icon fa fa-pencil-square-o orange"></i>修改</a>';
                        retVal +='&nbsp'+'<a class="btn btn-minier btn-white btn-danger btn-bold zs-auth" permission="/supplier/warehouse/deleteWarehouseById" href="javascript:void(0);" onclick="orderReportFacade.showDeleteDialog('+rowObject.id+');"><i class="ace-icon fa fa-trash-o bigger-120 red2"></i>删除</a>';
                        retVal +='&nbsp'+ '<a class="btn btn-minier btn-white btn-info btn-bold zs-auth" permission="/supplier/warehouse/warehouseStore" href="javascript:void(0);" onclick=warehouseStore('+rowObject.id+');><i class="ace-icon fa fa-shopping-cart bigger-120 green"></i>服务门店</a>';
                        retVal +='&nbsp'+ '<a class="btn btn-minier btn-white btn-info btn-bold zs-auth" permission="/supplier/warehouse/warehouseStore" href="javascript:void(0);" onclick=downloadStore('+rowObject.id+');><i class="glyphicon glyphicon-download bigger-120 default"></i>门店导出</a>';
                        retVal +='&nbsp'+ '<a class="btn btn-minier btn-white btn-info btn-bold zs-auth" permission="/supplier/warehouse/warehouseMat" href="javascript:void(0);" onclick=warehouseMat('+rowObject.id+');><i class="glyphicon glyphicon-th-list bigger-120 green"></i>物料维护</a>';
                        retVal +='&nbsp'+ '<a class="btn btn-minier btn-white btn-info btn-bold zs-auth" permission="/supplier/warehouse/warehouseMat" href="javascript:void(0);" onclick=downloadMat('+rowObject.id+');><i class="glyphicon glyphicon-download bigger-120 default"></i>物料导出</a>';
                        return retVal;
                    }
                }],
                rowNum : 30,
                rowList : [ 30, 20, 50 ],
                pager : pager_selector,
                pagerpos : 'left',
                height : 350,
                viewrecords : true,
                autoHeight : true,
                loadComplete : function() {
                    var table = this;
                    setTimeout(function() {
                        updatePagerIcons(table);
                        $.authenticate();
                    }, 0);
                }
            });
        }
        // 自适应宽度
        _this.resizeGrid('#data-list', grid_selector, 326);
//        $(window).triggerHandler('resize.jqGrid');
        $("#scroll_data_parent_div").find(".ui-jqgrid-bdiv").css({ "overflow-x" : "hidden" });

    },
    // 表格自适应宽高
    // areaId 表格所在区域的ID，找全屏按钮用
    // grid_selector:表格ID
    resizeGrid: function(areaId, grid_selector, defaultHeight){
        // 1.resize to fit page size
        var parent_column = $(grid_selector).closest('[class*="col-"]');
        $(window).on('resize.jqGrid', function() {
            $(grid_selector).jqGrid('setGridWidth', parent_column.width());
        })
        // 2.resize on sidebar collapse/expand
        $(document).on('settings.ace.jqGrid', function(ev, event_name, collapsed) {
            alert(1);
            if (event_name === 'sidebar_collapsed' || event_name === 'main_container_fixed') {
                setTimeout(function() {
                    $(grid_selector).jqGrid('setGridWidth', parent_column.width());
                }, 0);
            }
        })
        $(window).triggerHandler('resize.jqGrid');
        $.resizeGrid(grid_selector);

    },
    showDeleteDialog : function (value) {
        $.dialog({
             lock: true,
            content : '确认吗？',
            width: 200,
            height: 100,
            drag: false,
            resize: false,
            icon: 'alert.gif',
            ok:
                function () {
                    $.ajax({
                        type : "post",
                        url : '/supplier/warehouse/deleteWarehouseById',
                        data : {
                            "id" : value,
                            "isDelete" : 1
                        },
                        success : function(data) {
                            if(data.code ==1){
                                alert("删除成功");
                                $("#table-data-list").trigger("reloadGrid");
                                return true;
                            }else if(data.code ==0){
                                alert(data.msg);
                                return true;
                            }else{
                                alert("删除失败");
                                return true;
                            }
                        },
                        error : function(msg) {
                            alert("系统异常，删除失败");
                        }
                    })
            }

            ,
            cancel: true
        });
    }
}

$(function() {
    // 初始化查询条件
    $("#searchBtn").click(orderReportFacade.query);
    $.initDatePicker('#dateRange');

    //初始化可输入下拉框
    inputSelectUtil.init().load("#cityName");

    //表单校验
    //初始化
    //formValidate();

    orderReportFacade.query();



});

// 仓库下拉框响应函数
function fillWarehouseCodeInfo(id, code, jsonStr) {
    var obj = eval("("+jsonStr+")");
    $("#name").val(obj.name);
    $("#warehouseId").val(obj.id);
 }
 function cleanWarehouseCodeInfo(){
     $("#name").val("");
     $("#warehouseId").val("");
 }

function fillCityInfo(id, name, jsonStr){
    var obj = eval("("+jsonStr+")");
    var id = obj.id;
    $("#cityId").val(id);
}

function cleanCityInfo(){
    $("#cityId").val("");
}



/**
 * 添加供应商
 */
function addWarehouse(){
    $.dialog({
        id : 'addWarehouse',
        lock: true,
        title : "添加仓库",
        content : 'url:/supplier/warehouse/addWarehouse',
        width: 400,
        height: 300,
        drag: true,
        resize: true,
        icon: 'alert.gif'
    });
}


/**
 * 添加供应商
 */
function updateWarehouse(id){
    $.dialog({
        id : 'addWarehouse',
        lock: true,
        title : "修改仓库",
        content : 'url:/supplier/warehouse/updateWarehouse?id='+id,
        width: 400,
        height: 200,
        drag: true,
        resize: true,
        icon: 'alert.gif'
    });
}

/**
 * 商品采购
 * @param id
 */
function warehouseStore(id){
    $.dialog({
        id : 'warehouseStore',
        lock: true,
        title : "服务门店设置",
        content : 'url:/supplier/warehouse/warehouseStore?id='+id,
        width: 1000,
        height: 400,
        drag: true,
        resize: true,
        icon: 'alert.gif'
    });
}
/**
 * 物料维护
 * @param id
 */
function warehouseMat(id){
    $.dialog({
        id : 'warehouseMat',
        lock: true,
        title : "仓库物料维护",
        content : 'url:/supplier/warehouse/warehouseMat?warehouseId='+id,
        width: 1000,
        height: 450,
        drag: true,
        resize: true,
        icon: 'alert.gif'
    });
}

function downloadStore(id) {
	if($("#downloadIfm").attr('src')) {
		$("#downloadIfm").attr('src', '');
	}
	$("#downloadIfm").attr('src', '/supplier/warehouse/downloadStore?id='+id);
}

function downloadMat(id) {
	if($("#downloadIfm").attr('src')) {
		$("#downloadIfm").attr('src', '');
	}
	$("#downloadIfm").attr('src', '/supplier/warehouse/downloadMat?warehouseId='+id);
}
