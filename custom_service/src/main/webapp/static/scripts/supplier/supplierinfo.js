var orderReportFacade = {
    detailsGrid: null, // 数据详情
    query : function() {
        var queryString = "";
        var cityId = $('#cityId').val();
        //var code = $('#code').val();
        var supplierId = $("#supplierId").val();
        var name = $('#name').val();

        if(cityId) {
            queryString += '&cityId=' + cityId;
        }
        if(supplierId) {
            queryString += '&id=' + supplierId;
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
        var url = '/supplier/baseinfo/querySupplier?' + params;
        if(_this.detailsGrid) {
            // 根据搜索条件，重新加载
            $(grid_selector).jqGrid('setGridParam',{
                url : url,
                page:1
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                cmTemplate: {sortable:true},
                url : url,
                datatype : 'json',
                colNames : [ '供应商编码', '供应商名称' , '所在城市','供应商邮箱','操作列'],
                jsonReader : {
                    root: "data",
                    page: "curPage",
                    total: "totalPage",
                    records: "totalRows"
                },
                prmNames : {page:'curPage',rows:'pageSize', sort: 'sidx',order: 'sort'},
                colModel : [ {
                    name : 'code',
                    width : 80
                },  {
                    name : 'name',
                    width : 120
                },  {
                    name : 'cityName',
                    width : 60
                }, {
                    name : 'supplierMail',
                    width : 100
                },{
                    name : '',
                    width : 100,
                    align : 'center',
                    formatter : function(cellvalue, options, rowObject) {
                        var retVal = '<a class="btn btn-minier btn-white btn-warning btn-bold zs-auth" permission="/supplier/baseinfo/updateSupplier" href="javascript:void(0);" onclick=updateSupplier('+rowObject.id+');><i class="ace-icon fa fa-pencil-square-o orange"></i>修改</a>';
                        retVal +='&nbsp'+'<a class="btn btn-minier btn-white btn-danger btn-bold zs-auth"  permission="/supplier/baseinfo/deleteSupplierById"  href="javascript:void(0);" onclick="orderReportFacade.showDeleteDialog('+rowObject.id+');"><i class="ace-icon fa fa-trash-o bigger-120 red2"></i>删除</a>';
                        retVal +='&nbsp'+ '<a class="btn btn-minier btn-white btn-info btn-bold zs-auth" permission="/supplier/baseinfo/supplierPurchase"  href="javascript:void(0);" onclick=supplierPurchase('+rowObject.id+');><i class="ace-icon fa fa-shopping-cart bigger-120 green"></i>采购商品</a>';
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
                        url : '/supplier/baseinfo/deleteSupplierById',
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
                                alert("删除失败:"+data.msg);
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
    inputSelectUtil.init().load('#cityName');

    //表单校验
    //初始化
    //formValidate();
    orderReportFacade.query();
});

function fillCityId(id, name, jsonStr){
    var obj = eval("("+jsonStr+")");
    var id = obj.id;
    $("#cityId").val(id);
}
//供应商编码
function fillInfo(id, code, jsonStr) {
    var obj = eval("("+jsonStr+")");
    var supplierName = obj.name;
     $("#name").val(supplierName);
    //$("#cityId").parent().children(".idVal").val(id);
    var supplierId = obj.id;
    $("#name").val(supplierName);
    $("#supplierId").val(supplierId);
}
//清除供应商名称输入框数据
function cleanFillInfo() {
    $("#name").val("");
    $("#supplierId").val("");
}

function cleanSupplierCity() {
    $('#cityId').val("");
}

/**
 * 添加供应商
 */
function addSupplier(){
    $.dialog({
        id : 'addSupplier',
        lock: true,
        title : "添加供应商",
        content : 'url:/supplier/baseinfo/addSupplier',
        width: 400,
        height: 500,
        drag: true,
        resize: true,
        icon: 'alert.gif'
    });
}


/**
 * 添加供应商
 */
function updateSupplier(id){
    $.dialog({
        id : 'addSupplier',
        lock: true,
        title : "修改供应商",
        content : 'url:/supplier/baseinfo/updateSupplier?id='+id,
        width: 400,
        height: 500,
        drag: true,
        resize: true,
        icon: 'alert.gif'
    });
}

/**
 * 商品采购
 * @param id
 */
function supplierPurchase(id){
    $.dialog({
        id : 'supplierPurchase',
        lock: true,
        title : "采购商品信息",
        content : 'url:/supplier/baseinfo/supplierPurchase?id='+id,
        width: 1200,
        height: 400,
        drag: true,
        resize: true,
        icon: 'alert.gif'
    });
}
