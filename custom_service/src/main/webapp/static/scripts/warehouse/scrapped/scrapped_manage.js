$(function () {
    $('#page_tabs').tabs();
    $.initDatePicker('#dateRange');
    inputSelectUtil.init();
    $("#saveBtn").click(scrappedAdd.confirm);
    $("#searchBtn").click(scrappedHistory.query);
});

function tab2(){
    $( "#page_tabs" ).tabs( "option", "active", 1 );
    scrappedHistory.query();
}

function reasonTypeSelect(){
    var reasonType = $('#reasonType').val();
    if(reasonType == 0){
        $('#remarkDiv').css("display","");
    }else{
        $('#remarkDiv').css("display","none");
    }

}

var scrappedAdd = {
    queryMatByWarehouseUrl : '/common/findMatListByWarehouse',
    queryMatBatchUrl : '/common/findMatBatch',
    confirm : function () {
        if(scrappedAdd.acting) {
            return false;
        }
        var params = scrappedAdd.getParams();
        if (!params) {
            return;
        }
        scrappedAdd.acting = true;
        $.post('/warehouse/scrapped/create',
            params,
            function(data) {
                if(data.success) {
                    alert("创建成功");
                    window.location.reload();
                }else {
                    alert("操作失败：" + data.message);
                }
                scrappedAdd.acting = false;
            }, 'json')
            .error(function() {
                scrappedAdd.acting = false;
            });
    },
    getParams: function(){
        if(!$("#warehouseIdHid").val() || $("#warehouseIdHid").val() == '') {
            alert('请选择仓库');
            return false;
        }
        //判断如果是选的其他，详细原因必须写
        var reasonType = $('#reasonType').val();
        var remark = $("#remarkDiv").val();
        if(!reasonType || reasonType == '') {
            alert('请选择报废原因');
            return false;
        }
        if(reasonType == 0) {
            if (remark == null || remark == '') {
                parent.$.dialog.alert('请填写具体提报原因');
                scrappedAdd.acting = false;
                return false;
            }
        } else {
            remark = $('#reasonType option:selected').text();
        }
        if($('.mat_tr').length == 0) {
            alert('请添加物料');
            return false;
        }

        var params = 'warehouseId=' + $("#warehouseIdHid").val() +
                '&reasonType=' + reasonType +
                '&reasonRemark=' + remark;
        var i = 0;
        $('.mat_tr').each(function() {
            params += '&itemList['+i+'].materialId=' + $(this).find('.materialId').val()
                +'&itemList['+i+'].materialName=' + $(this).find('.materialName').html()
                +'&itemList['+i+'].materialCode=' + $(this).find('.materialCode').html()
                +'&itemList['+i+'].productionDate=' + $(this).find('.productionDate').html()
                +'&itemList['+i+'].quantity=' + $(this).find('.expectQuantity').html()
                +'&itemList['+i+'].transUnitId=' + $(this).find('.transUnitId').val()
                +'&itemList['+i+'].transUnitName=' + $(this).find('.transUnitName').html()
                +'&itemList['+i+'].costPrice=' + $(this).find('.costPrice').val()
                +'&itemList['+i+'].minCostPrice=' + $(this).find('.minCostPrice').val()
                +'&itemList['+i+'].standardName=' + $(this).find('.standardName').html()
                +'&itemList['+i+'].supplierId=' + $(this).find('.supplierId').val()
                +'&itemList['+i+'].supplierName=' + $(this).find('.supplierName').val();
            i++;
        });
        return params;
    },
    findMaterialList : function(warehouseId) {
        scrappedAdd.clearMatList();
        inputSelectUtil.clean("#matName");
        scrappedAdd.cleanMatInfo();
        inputSelectUtil.init().load("#matName", {'warehouseId' : warehouseId});
    },
    findMaterialInfo : function(id, name, obj, node) {
        scrappedAdd.cleanMatInfo();
        obj = eval("("+obj+")");
        $.post(scrappedAdd.queryMatBatchUrl,
            {'warehouseId' : $("#warehouseIdHid").val(), 'materialId' : obj.id},
            function(data){
                if(data) {
                    scrappedAdd.fillMatInfo(data);
                }
            }, 'json'
        );
    },
    fillMatInfo : function(data) {
        if(data) {
            var mat = data.mat;
            var batch = data.batch;
            if(mat) {
                $("#materialName").val(mat.name);
                $("#materialId").val(mat.id);
                $("#standardName").text(mat.standardName);
                $("#transportUnit").text(mat.transportUnit);
                $("#transportUnitId").val(mat.transportUnitId);
                $("#supplierName").val(mat.supplierName);
                $("#costPrice").val(mat.costPrice);
                $("#minCostPrice").val(mat.minCostPrice);
                $("#supplierId").val(mat.supplierId);
                $("#supplierName").val(mat.supplierName);
            }
            $("#productionDate").append('<option value="">请选择</option>');
            if(batch && batch.length > 0) {
                $(batch).each(function() {
                    if (this.damageNum > 0) {
                        var opt = $.dateFormat(this.productionDate, 'yyyy-MM-dd') + "/坏品" + this.damageNum;
                        $("#productionDate").append('<option value="'+this.id+'" num="'+this.damageNum+'" prodDate="'+$.dateFormat(this.productionDate, 'yyyy-MM-dd')+'">'+opt+'</option>');
                    }
                });
            }
        }
    },
    clearMatList : function() {
        $("#mat_body").empty();
    },
    cleanMatInfo : function() {
        $("#productionDate").find('option').remove();
        $(".mat_info").val('');
    },
    addMaterial : function() {
        if(!$("#materialName").val()) {
            alert("请选择物料");
            return false;
        }
        if(!$("#productionDate").val()) {
            alert("请选择生产日期");
            return false;
        }
        if(!$("#expectQuantity").val() || $("#expectQuantity").val() <= 0 || isNaN($("#expectQuantity").val())) {
            alert("数量不正确，请填写大于0的整数");
            return false;
        }
        if(parseInt($("#expectQuantity").val()) > parseInt($("#productionDate").find('option:selected').attr('num'))) {
            alert("数量不能大于坏品库存");
            return false;
        }
        var flag = true;
        $('.mat_tr').each(function() {
            if($("#materialCode").val() == $(this).find('.materialCode').html()
                && $("#productionDate").find('option:selected').attr('prodDate') == $(this).find('.productionDate').html()
            ) {
                flag = false;
                alert('请勿重复添加物料');
                return false;
            }
        });
        if(!flag) {
            return false;
        }
        var tr =
            "<tr class='mat_tr'><td class='materialCode'>" + $("#materialCode").val() + "</td>" +
            "<td class='materialName'>" + $("#materialName").val() + "</td>" +
            "<td class='productionDate'>" + $("#productionDate").find('option:selected').attr('prodDate') + "</td>" +
            "<td class='availableQuantity'>" + $("#productionDate").find('option:selected').attr('num') + "</td>" +
            "<td class='expectQuantity'>" + $("#expectQuantity").val() + "</td>" +
            "<td class='transUnitName'>" + $("#transportUnit").text() + "</td>" +
            "<td class='standardName'>" + $("#standardName").text() + "</td>" +
            "<td><a class='btn btn-default btn-xs' onclick='scrappedAdd.deleteRow(this);'>删除</a>" +
            "<input class='transUnitId' type='hidden' value='"+$("#transportUnitId").val()+"'>" +
            "<input class='materialId' type='hidden' value='"+$("#materialId").val()+"'>" +
            "<input class='costPrice' type='hidden' value='"+$("#costPrice").val()+"'>" +
            "<input class='minCostPrice' type='hidden' value='"+$("#minCostPrice").val()+"'>" +
            "<input class='supplierId' type='hidden' value='"+$("#supplierId").val()+"'>" +
            "<input class='supplierName' type='hidden' value='"+$("#supplierName").val()+"'>" +
            "</td>" +
            "</tr>";
        $("#mat_body").append(tr);
    },
    deleteRow : function(obj) {
        $(obj).parent().parent().remove();
    }
};

/***************history****************/
var scrappedHistory = {
    detailsGrid: null, // 数据详情
    query : function() {
        $('#hisory_list').show();
        var params = $("#historyForm").serialize();
        // 加载详情
        scrappedHistory.loadhistoryDetails(params);

    },
    // 加载数据详情
    loadhistoryDetails : function(params) {
        var _this = this;
        var grid_selector = "#history_table_list";
        var pager_selector = "#history_table_list_pager";
        var url = '/warehouse/scrapped/history/list?' + params;
        if(_this.detailsGrid) {
            // 根据搜索条件，重新加载
            $(grid_selector).jqGrid('setGridParam',{
                url : url,
                page:1
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : url,
                datatype : 'json',
                colNames : [ '创建日期', '报废单号', '仓库', '状态ID', '状态', '报废处理人','创建人','操作'],
                cmTemplate: {sortable:false},
                jsonReader : {
                    root: "data",
                    page: "curPage",
                    total: "totalPage",
                    records: "totalRows"
                },
                prmNames : {page:'curPage',rows:'pageSize', sort: 'sidx',order: 'sort'},
                colModel : [
                    {
                    name : 'createTime',
                    formatter : function(cellvalue, options, rowObject) {
                        return $.dateFormat(cellvalue, 'yyyy-MM-dd hh:mm:ss');;
                    },
                    width : 80
                }, {
                    name : 'id',
                    width : 80
                },{
                    name : 'warehouseName',
                    width : 100
                },{
                    name : 'status',
                    hidden: true
                },{
                    name : 'statusName',
                    width : 50
                },{
                    name : 'deliveryUserName',
                    width : 80
                },{
                    name : 'createBy',
                    width : 80
                },{
                    name : '',
                    width : 120,
                    align : 'center',
                    formatter : function(cellvalue, options, rowObject) {
                        console.info(rowObject);
                        var retVal = '<a class="btn btn-minier btn-white btn-warning btn-bold zs-auth"  permission="/warehouse/scrapped/history/toDetail" href="javascript:void(0);" onclick=lookHistoryDetail('+rowObject.id+');><i class="ace-icon fa fa-search orange"></i>查询明细</a>';
                        retVal +='&nbsp'+ '<a class="btn btn-minier btn-white btn-info btn-bold zs-auth" permission="/warehouse/scrapped/export" href="javascript:void(0);" onclick=exportHistoryDetail('+rowObject.id+');><i class="ace-icon fa fa-download bigger-120 green"></i>导出</a>';
                        if (rowObject["status"] == 10) {
                            retVal +='&nbsp'+ '<a class="btn btn-minier btn-white btn-info btn-bold zs-auth" permission="/warehouse/scrapped/cancel" href="javascript:void(0);" onclick=cancelScrapped('+rowObject.id+');><i class="ace-icon fa fa-download bigger-120 green"></i>取消</a>';
                        }
                        return retVal;
                    }
                }],
                rowNum : 30,
                rowList : [ 30, 20, 50 ],
                pager : pager_selector,
                pagerpos : 'left',
                height : 300,
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
    }

};

function lookHistoryDetail(id){
    $.dialog({
        id : 'lookHistoryDetail',
        lock: true,
        title : "报废单详情",
        content : 'url:/warehouse/scrapped/history/toDetail?id='+id,
        width: 800,
        height: 480,
        drag: true,
        resize: true,
        icon: 'alert.gif'
    });
}

function exportHistoryDetail(id){
    window.location.href='/warehouse/scrapped/export?id='+id;
}

function cancelScrapped(id) {
    $.post('/warehouse/scrapped/cancel',
    {"id" : id},
    function(data) {
        if(data.success) {
            alert("取消成功");
            scrappedHistory.query();
        }else {
            alert("操作失败：" + data.message);
        }
    }, 'json')
    .error(function() {
        alert("操作失败：系统错误");
    });
}
