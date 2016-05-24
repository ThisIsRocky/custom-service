$(function () {
    $('#save-btn').click(function () {
        saveBomMaterial();
    });
    $('.useGroupQuantity').on("change", function() {
        this.value ^= 1;
        var index = $(this).attr('data-row-index');
        if ($(this).is(":checked")) {
            $('#quantity-'+index).prop("readonly", true);
            $('#quantity-'+index).val($('#defaultQuantity-'+index).val());
        } else {
            $('#quantity-'+index).prop("readonly", false);
        }
    });
});

// modifyUsedBom 是否是已启用的bom
function saveBomMaterial() {
    if (!checkParam()) {
        return;
    }
    var url = '/food/bom/saveBomMaterial';

    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: buildParam()
    }).done(function (data) {
        if (data.code == "000000") {
            alert('修改成功');
            frameElement.api.close();
        }else{
            alert('操作失败：' + data.message);
        }
    });
}

//校验参数
function checkParam() {
    var isValid = true;
    $('.data-row').each(function(){
        var index = $(this).attr('data-row-index');
        var useGroupQuantity = $("#useGroupQuantity-" + index).val();
        var val = $.trim($('#quantity-'+index).val());
        if (useGroupQuantity == 0) {
            if (val === '') {
                alert('数量必填!');
                isValid = false;
                return false;
            } else if (val < 1) {
                alert('数量必须大于0!');
                isValid = false;
                return false;
            }
        }
    });
    return isValid;
}

function buildParam(){
    var data = {};
    var bomId = parseInt($('#bomId').val());
    data['id'] = bomId;
    var num=0;
    $('.data-row').each(function(){
        var index = $(this).attr('data-row-index');
        data['materialVoList['+num+'].id'] = $.trim($('#id-'+index).val());;
        data['materialVoList['+num+'].bomId'] = bomId;
        data['materialVoList['+num+'].materialId'] = $.trim($('#materialId-'+index).val());
        data['materialVoList['+num+'].quantity'] = $.trim($('#quantity-'+index).val());
        data['materialVoList['+num+'].useGroupQuantity'] = $.trim($('#useGroupQuantity-'+index).val());
        num ++;
    });
    return data;
}
