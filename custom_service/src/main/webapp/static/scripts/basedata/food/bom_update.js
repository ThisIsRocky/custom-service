var _bom = {rowIndex:0};
$(function () {
    $.ajax({
        url: '/food/bom/getBom',
        type: 'GET',
        dataType: 'JSON',
        data: {foodId:$('#foodId').val()}
    }).done(function (ret) {
        var arr = ret.boms;
        for(var i=0;i<arr.length;i++){
            var item = arr[i];
            _bom.rowIndex++;
            item['rowIndex'] = _bom.rowIndex ;
            var html = $('#row_tmpl').render(item);
            $('#static-unit-rows').append(html);
        }
    });

    //保存bom
    $('#bom-add-btn').click(function () {
        saveBom(false);
    });
    //保存bom
    $('#used-bom-modify-btn').click(function () {
        saveBom(true);
    });
    
    // modifyUsedBom 是否是已启用的bom
    function saveBom(modifyUsedBom) {
        if (!checkParam()) {
            return;
        }
        var url = '';
        if(modifyUsedBom) {
            url = '/food/bom/modifyUsedBom';
        } else {
            url = '/food/bom/add';
        }
        
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            data: buildAddParam()
        }).done(function (data) {
            if (data.code == "000000") {
                alert('修改成功');
                window.location.reload();
            }else{
                alert('操作失败：' + data.message);
            }
        });
    }
    
    //追加单位
    $('#static-unit-add-btn').click(function(){
        _bom.rowIndex++;
        var html = $.templates('#row_tmpl').render(_bom);
        $('#static-unit-rows').append(html);
        inputSelectUtil.init();
    });

    $('#copy-bom-btn').click(function() {
        var bom = buildAddParam();
        if (bom["materialGroupCount"] > 0) {
            alert("当前配方已设置物料组，无法复制配方，请删除当前所有物料组再使用复制配方功能");
            return;
        }
        var foodIdToCopy = $('#food_id_to_copy').val();
        if (!foodIdToCopy) {
            alert("请选择复制配方的原菜品");
            return;
        }
        $.ajax({
            url: '/food/bom/copyBom',
            type: 'GET',
            dataType: 'JSON',
            data: {foodId : parseInt($('#foodId').val()), sourceFoodId : foodIdToCopy}
        }).done(function (ret) {
            if (ret.code == "000000") {
                if (ret && ret.data.boms && ret.data.boms.length > 0) {
                    var arr = ret.data.boms;
                    for (var i = 0; i < arr.length; i++) {
                        var item = arr[i];
                        _bom.rowIndex++;
                        item['rowIndex'] = _bom.rowIndex;
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
            } else {
                $.gritter.add({
                    title: '',
                    text: ret.message,
                    sticky: false,
                    time: '3000',
                    class_name: 'gritter-error'
                });
            }
        }).fail(function (data) {
            alert(data.msg);
        });
    });
});

//校验参数
function checkParam() {
    var isValid = true;
    var minNum = 0;
    $('.static-unit-row').each(function(){
        var index = $(this).attr('data-row-index');
        var val = $.trim($('#materialGroupCode-'+index).val());
        if (val === '') {
            alert('物料组编码必填!');
            isValid = false;
            return false;
        }
        var val = $.trim($('#materialGroupId-'+index).val());
        if (val === '') {
            alert('必须是正确的物料组!');
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
    data['boms'] = new Array();
    var num=0;
    $('.static-unit-row').each(function(){
        var index = $(this).attr('data-row-index');
        data['boms['+num+'].id'] = $.trim($('#bomId-'+index).val());
        data['boms['+num+'].materialGroupId'] = $.trim($('#materialGroupId-'+index).val());
        data['boms['+num+'].quantity'] = $.trim($('#quantity-'+index).val());
        num++;
    });
    data['materialGroupCount'] = num;
    return data;
}

function deleteRow(rowIndex){
    $('#static-unit-row-'+rowIndex).remove();
}

function showBomMaterial(id) {
    if (id) {
        var url = "/food/bom/editBomMaterial?bomId=" + id;
        parent.$.dialog({
            id : 'editMaterial',
            lock: true,
            title : "物料信息",
            content : "url:"+url,
            width: 800,
            height: 600,
            drag: true,
            resize: true,
            icon: 'alert.gif'
        });
    };
}
