var returnSupplierAdd = {
    queryMatByWarehouseUrl : '/common/findMatListByWarehouse',
    queryMatBatchUrl : '/common/findMatBatch',
    confirm : function () {
        $('#returnSupplier #saveBtn').attr('disabled',"true");
        var params = returnSupplierAdd.getParams();
        if (!params) {
            $('#returnSupplier #saveBtn').removeAttr('disabled');
            return;
        }
        $.dialog.confirm('确定要提交退货单吗？', function() {
            $.post('/warehouse/returnSupplier/add', params, function(data) {
                if (data.code == '000000') {
                    $.dialog.alert("创建成功");
                    window.location.reload();
                } else {
                    $.dialog.alert("操作失败：" + data.message);
                }
                $('#returnSupplier #saveBtn').removeAttr('disabled');
            }, 'json').error(function() {
                $('#returnSupplier #saveBtn').removeAttr('disabled');
            });
        });
    },
    getParams: function(){
        if(!$("#returnSupplier #warehouseId").val() || $("#returnSupplier #warehouseId").val() == '') {
            $.dialog.alert('请下拉选择仓库');
            return false;
        }
        if(!$("#returnSupplier #supplierId").val() || $("#returnSupplier #supplierId").val() == '') {
            $.dialog.alert('请下拉选择供应商');
            return false;
        }
      //判断如果是选的其他，详细原因必须写
        var reasonType = $('#returnSupplier #reasonType').val();
        if(!reasonType || reasonType == '') {
            $.dialog.alert('请选择退货原因');
            return false;
        }
        var remark = $("#returnSupplier #reasonRemark").val();
        if(reasonType == 0 && (remark == null || remark == '')){
            $.dialog.alert('请填写具体提报原因');
            return false;
        }
        if($('#returnSupplier .mat_tr').length == 0) {
            $.dialog.alert('请添加物料');
            return false;
        }

        var params = 'warehouseId=' + $("#returnSupplier #warehouseId").val() +
                '&supplierId=' + $("#returnSupplier #supplierId").val() +
                '&reasonType=' + $("#returnSupplier #reasonType").val() +
                '&reasonRemark=' + $("#returnSupplier #reasonRemark").val();
        var i = 0;
        $('#returnSupplier .mat_tr').each(function() {
            params += '&itemList['+i+'].materialId=' + $(this).find('.materialId').val()
                +'&itemList['+i+'].productionDate=' + $(this).find('.productionDate').html()
                +'&itemList['+i+'].returnQuantity=' + $(this).find('.quantity').html()
            i++;
        });
        return params;
    },
    findMaterialList : function(warehouseId) {
        inputSelectUtil.clean("#returnSupplier #matName");
        returnSupplierAdd.cleanMatInfo();
        inputSelectUtil.init().load("#returnSupplier #matName", {'warehouseId' : warehouseId});
        $("#mat_body").html("");
    },
    findMaterialInfo : function(id, name, obj, node) {
        returnSupplierAdd.cleanMatInfo();
        obj = eval("("+obj+")");
        $.post(returnSupplierAdd.queryMatBatchUrl,
            {'warehouseId' : $("#returnSupplier #warehouseId").val(), 'materialId' : obj.id},
            function(data){
                if(data) {
                    returnSupplierAdd.fillMatInfo(data);
                }
            }, 'json'
        );
    },
    fillMatInfo : function(data) {
        if(data) {
            var mat = data.mat;
            var batch = data.batch;
            if(mat) {
                $("#returnSupplier #materialName").val(mat.name);
                $("#returnSupplier #materialId").val(mat.id);
                $("#returnSupplier #standardName").val(mat.standardName);
                $("#returnSupplier #transportUnit").val(mat.transportUnit);
                $("#returnSupplier #transportUnitId").val(mat.transportUnitId);
            }
            if(batch && batch.length > 0) {
                $("#returnSupplier #productionDate").append('<option value="">请选择</option>');
                $(batch).each(function() {
                    var opt = $.dateFormat(this.productionDate, 'yyyy-MM-dd') + "/库存" + this.goodNum;
                    $("#returnSupplier #productionDate").append('<option value="'+this.batchNo+'" num="'+this.goodNum+'" prodDate="'+$.dateFormat(this.productionDate, 'yyyy-MM-dd')+'">'+opt+'</option>');
                });
            }
        }
    },
    cleanMatInfo : function() {
        $("#returnSupplier #productionDate").find('option').remove();
        $(".mat_info").val('');
    },
    addMaterial : function() {
        if(!$("#returnSupplier #materialName").val()) {
            $.dialog.alert("请选择物料");
            return false;
        }
        if(!$("#returnSupplier #productionDate").val()) {
            $.dialog.alert("请选择生产日期");
            return false;
        }
        if(!$("#returnSupplier #quantity").val()|| isNaN($("#quantity").val())) {
              $.dialog.alert("请填写正确的数量");
            return false;
        }
        if( $("#returnSupplier #quantity").val() <= 0) {
            $.dialog.alert("数量必须大于0的整数");
            return false;
        }
        if(parseInt($("#returnSupplier #quantity").val()) > parseInt($("#returnSupplier #productionDate").find('option:selected').attr('num'))) {
            $.dialog.alert("数量不能大于库存");
            return false;
        }
        var flag = true;
        $('#returnSupplier .mat_tr').each(function() {
            if($("#returnSupplier #materialCode").val() == $(this).find('.materialCode').html()
                && $("#returnSupplier #productionDate").find('option:selected').attr('prodDate') == $(this).find('.productionDate').html()
            ) {
                flag = false;
                $.dialog.alert('请勿重复添加物料');
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
            "<td class='quantity'>" + $("#quantity").val() + "</td>" +
            "<td class='transUnitName'>" + $("#transportUnit").val() + "</td>" +
            "<td class='standardName'>" + $("#standardName").val() + "</td>" +
            "<td><a class='btn btn-default btn-xs' onclick='returnSupplierAdd.deleteRow(this);'>删除</a>" +
            "<input class='materialId' type='hidden' value='"+$("#materialId").val()+"'>" +
            "</td>" +
            "</tr>";
        $("#returnSupplier #mat_body").append(tr);
    },
    deleteRow : function(obj) {
        $(obj).parent().parent().remove();
    },
     fillWarehouseInfo:function(id, code, jsonStr) {
        var obj = eval("("+jsonStr+")");
        var warehouseName = obj.name;
         $("#returnSupplier #warehouseNameAdd").val(warehouseName);
        var warehouseId = obj.id;
        $("#returnSupplier #warehouseId").val(warehouseId);
        returnSupplierAdd.findMaterialList(id);
    },
    fillSuplierInfo:function(id, code, jsonStr) {
        var obj = eval("("+jsonStr+")");
        var supplierName = obj.name;
         $("#returnSupplier #supplierNameAdd").val(supplierName);
        var supplierId = obj.id;
        $("#returnSupplier #supplierId").val(supplierId);
    },
    reasonTypeSelect:function(){
        var reasonType = $('#returnSupplier #reasonType').val();
        if(reasonType == 0){
            $('#returnSupplier #reasonRemark').css("display","");
        }else{
            $('#returnSupplier #reasonRemark').css("display","none");
        }
    }
};
$(function () {
    inputSelectUtil.init();
});