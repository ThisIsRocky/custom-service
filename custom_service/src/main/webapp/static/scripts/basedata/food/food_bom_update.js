var _unitGroup = {rowIndex:0};
$(function () {
    $.ajax({
        url: '/food/getBom',
        type: 'GET',
        dataType: 'JSON',
        data: {id:$('#foodId').val()}
    }).done(function (ret) {
        var arr = ret.foodBoms;
        for(var i=0;i<arr.length;i++){
            var item = arr[i];
            _unitGroup.rowIndex++;
            item['rowIndex'] = _unitGroup.rowIndex ;
            var html = $('#row_tmpl').render(item);
            $('#static-unit-rows').append(html);
        }
    }).fail(function () {

    }).always(function () {

    });

    //保存bom
    $('#food-bom-add-btn').click(function () {
        saveBom(false);
    });
    //保存bom
    $('#used-food-bom-modify-btn').click(function () {
        saveBom(true);
    });
    
    // modifyUsedBom 是否是已启用的bom
    function saveBom(modifyUsedBom) {
        if (!checkParam()) {
            return;
        }
        var url = '';
        if(modifyUsedBom) {
            url = '/food/modifyUsedBom';
        } else {
            url = '/food/addFoodBom';
        }
        
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            data: buildAddParam()
        }).done(function (data) {
            if (data.code == "000000") {
                alert('修改成功');
                frameElement.api.close();
            }else{
                alert('操作失败：' + data.message);
            }
        }).fail(function () {

        }).always(function () {

        });
    }
    
    //追加单位
    $('#static-unit-add-btn').click(function(){
        _unitGroup.rowIndex++;
        var html = $('#row_tmpl').render(_unitGroup);
        $('#static-unit-rows').append(html);
        inputSelectUtil.init();
    });

    $('#copy-bom-btn').click(function() {
        var bom = buildAddParam();
        if (bom["materialCount"] > 0) {
            alert("当前配方已设置物料，无法复制配方，请删除当前所有物料再使用复制配方功能");
            return;
        }
        var foodIdToCopy = $('#food_id_to_copy').val();
        if (!foodIdToCopy) {
            alert("请选择复制配方的原菜品");
            return;
        }
        $.ajax({
            url: '/food/getBom',
            type: 'GET',
            dataType: 'JSON',
            data: {id : foodIdToCopy}
        }).done(function (ret) {
            var arr = ret.foodBoms;
            if(arr.length > 0) {
                for(var i=0;i<arr.length;i++){
                    var item = arr[i];
                    _unitGroup.rowIndex++;
                    item['rowIndex'] = _unitGroup.rowIndex ;
                    var html = $('#row_tmpl').render(item);
                    $('#static-unit-rows').append(html);
                }
                $.gritter.add({
                    title: '',
                    text: '复制成功',
                    sticky: false,
                    time: '2000',
                    class_name: 'gritter-success'
                });
            } else {
                $.gritter.add({
                    title: '',
                    text: '复制失败：被复制的菜品未配置BOM',
                    sticky: false,
                    time: '3000',
                    class_name: 'gritter-error'
                });
            }
        }).fail(function () {
            alert("复制失败: 系统错误");
        });
    });
});

//校验参数
function checkParam() {
    var isValid = true;
    var minNum = 0;
    $('.static-unit-row').each(function(){
        var index = $(this).attr('data-row-index');
        var val = $.trim($('#materialCode-'+index).val());
        if (val === '') {
            alert('物料编码必填!');
            isValid = false;
            return false;
        }
        var val = $.trim($('#materialId-'+index).val());
        if (val === '') {
            alert('必须是正确的物料!');
            isValid = false;
            return false;
        }
        var val = $.trim($('#quantity-'+index).val());
        if (val === '') {
            alert('数量必填!');
            isValid = false;
            return false;
        }else if(val<1){
            alert('数量必须大于0!');
            isValid = false;
            return false;
        }
        minNum++;
    });
    return isValid;
}
function buildAddParam(){
    var data = {};
    var foodId = parseInt($('#foodId').val());
    data['id'] = foodId;
    data['foodBomVos'] = new Array();
    var num=0;
    $('.static-unit-row').each(function(){
        var index = $(this).attr('data-row-index');
        data['foodBomVos['+num+'].materialId'] = $.trim($('#materialId-'+index).val());
        data['foodBomVos['+num+'].quantity'] = $.trim($('#quantity-'+index).val());
        num++;
    });
    data['materialCount'] = num;
    return data;
}

function deleteRow(rowIndex){
    $('#static-unit-row-'+rowIndex).remove();
}
