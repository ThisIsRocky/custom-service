var usedAdd = {
    queryMatByWarehouseUrl : '/common/findMatListByWarehouse',
    queryMatBatchUrl : '/common/findMatBatch',
    confirm : function () {
        var params = usedAdd.getParams();
        $('#usedAdd #saveBtn').attr('disabled',"true");
        if (!params) {
            $('#usedAdd #saveBtn').removeAttr('disabled');
            return;
        }
        $.dialog.confirm('确定要提交领用单吗？', function() {
            $.post('/warehouse/used/add', params, function(data) {
                if (data.code == '000000') {
                    $.dialog.alert("创建成功");
                    window.location.reload();
                } else {
                    $.dialog.alert("操作失败：" + data.message);
                }
                $('#usedAdd #saveBtn').removeAttr('disabled');
            }, 'json').error(function() {
                $('#usedAdd #saveBtn').removeAttr('disabled');
            });
        });
       
    },
    getParams: function(){
        
        if(!$("#usedAdd #warehouseId").val() || $("#usedAdd #warehouseId").val() == '') {
            $.dialog.alert('请下拉选择仓库');
            return false;
        }
        if($("#usedAdd #userId").val()  ==null || $("#usedAdd #userId").val() =='') {
            $.dialog.alert('请下拉选择领用人');
            return false;
        }
        if($('#usedAdd .mat_tr').length <= 0) {
            $.dialog.alert('请添加物料');
            return false;
        }

        var params = 'warehouseId=' + $("#usedAdd #warehouseId").val() +
                '&userId=' + $("#usedAdd #userId").val() +
                '&remark=' + $("#usedAdd #remark").val();
        var i = 0;
        $('#usedAdd .mat_tr').each(function() {
            params += '&itemList['+i+'].materialId=' + $(this).find('.materialId').val()
                +'&itemList['+i+'].productionDate=' + $(this).find('.productionDate').html()
                +'&itemList['+i+'].quantity=' + $(this).find('.quantity').html()
            i++;
        });
        return params;
    },
    findMaterialList : function(warehouseId) {
        inputSelectUtil.clean("#usedAdd #matName");
        usedAdd.cleanMatInfo();
        inputSelectUtil.init().load("#usedAdd #matName", {'warehouseId' : warehouseId});
        $("#usedAdd #mat_body").html("");
    },
    findMaterialInfo : function(id, name, obj, node) {
        usedAdd.cleanMatInfo();
        obj = eval("("+obj+")");
        $.post(usedAdd.queryMatBatchUrl,
            {'warehouseId' : $("#usedAdd #warehouseId").val(), 'materialId' : obj.id},
            function(data){
                if(data) {
                    usedAdd.fillMatInfo(data);
                }
            }, 'json'
        );
    },
    fillMatInfo : function(data) {
        if(data) {
            var mat = data.mat;
            var batch = data.batch;
            if(mat) {
                $("#usedAdd #materialName").val(mat.name);
                $("#usedAdd #materialId").val(mat.id);
                $("#usedAdd #standardName").val(mat.standardName);
                $("#usedAdd #transportUnit").val(mat.transportUnit);
                $("#usedAdd #transportUnitId").val(mat.transportUnitId);
            }
            if(batch && batch.length > 0) {
                $("#usedAdd #productionDate").append('<option value="">请选择</option>');
                $(batch).each(function() {
                    var opt = $.dateFormat(this.productionDate, 'yyyy-MM-dd') + "/库存" + this.goodNum;
                    $("#usedAdd #productionDate").append('<option value="'+this.batchNo+'" num="'+this.goodNum+'" prodDate="'+$.dateFormat(this.productionDate, 'yyyy-MM-dd')+'">'+opt+'</option>');
                });
            }
        }
    },
     fillWarehouseInfo:function(id, code, jsonStr) {
        var obj = eval("("+jsonStr+")");
        var warehouseName = obj.name;
         $("#usedAdd #warehouseName").val(warehouseName);
        var warehouseId = obj.id;
        $("#usedAdd #warehouseId").val(warehouseId);
        usedAdd.findMaterialList(warehouseId);
    },
    filUserInfo:function(id, code, jsonStr) {
        var obj = eval("("+jsonStr+")");
        var userName = obj.name;
         $("#usedAdd #userName").val(userName);
        var userId = obj.id;
        $("#usedAdd #userId").val(userId);
    },
    cleanMatInfo : function() {
        $("#usedAdd #productionDate").find('option').remove();
        $("#usedAdd .mat_info").val('');
    },
    addMaterial : function() {
        if(!$("#usedAdd #materialName").val()) {
            $.dialog.alert("请选择物料");
            return false;
        }
        if(!$("#usedAdd #productionDate").val()) {
            $.dialog.alert("请选择生产日期");
            return false;
        }
        if(!$("#usedAdd #quantity").val()  || isNaN($("#usedAdd #quantity").val())) {
              $.dialog.alert("请填写正确的数量");
            return false;
        }
        if( $("#usedAdd #quantity").val() <= 0) {
            $.dialog.alert("数量必须大于0的整数");
            return false;
        }
        if(parseInt($("#usedAdd #quantity").val()) > parseInt($("#usedAdd #productionDate").find('option:selected').attr('num'))) {
            $.dialog.alert("数量不能大于库存");
            return false;
        }
        var flag = true;
        $('#usedAdd .mat_tr').each(function() {
            if($("#usedAdd #materialCode").val() == $(this).find('.materialCode').html()
                && $("#usedAdd #productionDate").find('option:selected').attr('prodDate') == $(this).find('.productionDate').html()
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
            "<td><a class='btn btn-default btn-xs' onclick='usedAdd.deleteRow(this);'>删除</a>" +
            "<input class='materialId' type='hidden' value='"+$("#materialId").val()+"'>" +
            "</td>" +
            "</tr>";
        $("#mat_body").append(tr);
    },
    deleteRow : function(obj) {
        $(obj).parent().parent().remove();
    }
};
$(function () {
    inputSelectUtil.init();
});