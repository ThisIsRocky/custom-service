/**
 * Created by wanzheng on 12/7/15.
 */
var _unitGroup = {rowIndex:0};
$(function () {
    //保存单位组
    $('#unit-group-add-btn').click(function () {
        if (!checkParam()) {
            return;
        }
        $.ajax({
            url: '/unitGroup/unitGroups/add',
            type: 'POST',
            dataType: 'json',
            data: buildAddParam()
        }).done(function (ret) {
            if (ret.code === 1) {
                alert('新增成功');
                frameElement.api.close();
            }else{
                alert(ret.msg);
            }
        }).fail(function () {

        }).always(function () {

        });

    });
    //追加单位
    $('#static-unit-add-btn').click(function(){
        _unitGroup.rowIndex++;
        var html = $('#content_tmpl').render(_unitGroup);
        $('#static-unit-rows').append(html);
        inputSelectUtil.init().load('#static-unit-name-' + _unitGroup.rowIndex);
    });

    $('#unit-group-name-add').bind("",function(){
        $('#non-unit-name').val($(this).val());
    });
});

//校验参数
function checkParam(){
    var isValid = true;
    var unitGroupName = $.trim($('#unit-group-name-add').val());
    if(unitGroupName===''){
        alert('请确保页面信息填写完整');
        return false;
    }
    //固定换算
    var nameMap = new Object();
    if($('.static-unit-name').length==0){
        alert('单位为空');
        return false;
    }
    $('.static-unit-name').each(function(item){
        if(isValid){
            var val = $.trim($(this).val());
            if(val===null||val===''){
                alert('请确保页面信息填写完整!');
                isValid=false;
                return;
            }else if(val.length>50){
                alert('单位名称不能大于50个字符!');
                isValid=false;
                return;
            }
            if(nameMap[val]===1){
                alert('单位名称不能重复!');
                isValid=false;
                return;
            }else{
                nameMap[val]=1;
            }
        }
    });
    if(!isValid){
        return isValid;
    }
    $('.static-unit-conversion-rate').each(function(){
        if(isValid){
            var val = $.trim($(this).val());
            if(val===''){
                alert('请正确填写单位换算率');
                isValid=false;
            }else{
                var intReg = /^[1-9]\d*$/;
                if(!intReg.test(val)){
                    alert('请正确填写单位换算率');
                    isValid=false;
                    return;
                }
                var num = parseInt(val);
                if(num>1000000){
                    alert('换算率不能大于1000000!');
                    isValid=false;
                    return;
                }
            }
        }
    });
    if(!isValid){
        return isValid;
    }
    var minNum = 0;
    $('.static-unit-is-min').each(function(){
        if(isValid){
            var val = parseInt($(this).val());
            var index = $(this).attr('data-row-index');
            if(val===1){
                minNum++;
                var conversionRate = parseInt($('#static-unit-conversion-rate-'+index).val());
                if(conversionRate>1){
                    isValid=false;
                    alert('请正确填写单位换算率');
                    return;
                }
            }
        }
    });
    if(!isValid){
        return isValid;
    }
    if(minNum>1){
        alert('请确保最小单位唯一');
        return false;
    }
    return isValid;
}

function buildAddParam(){
    var data = {};
    var unitGroupName = $.trim($('#unit-group-name-add').val());
    data['groupName'] = unitGroupName;
    data['unitVoList'] = new Array();
    var num=0;
    $('.static-unit-row').each(function(){
        var index = $(this).attr('data-row-index');
        data['unitVoList['+num+'].name'] = $.trim($('#static-unit-name-'+index).val());
        data['unitVoList['+num+'].unitBaseId'] = $.trim($('#static-unit-base-id-'+index).val());
        data['unitVoList['+num+'].conversionRate'] = $.trim($('#static-unit-conversion-rate-'+index).val());
        data['unitVoList['+num+'].isMin'] = $('#static-unit-is-min-'+index).val();
        num++;
    });
    return data;
}

//是否最小单位变化
function isMinChange(rowIndex){
    var isMin = parseInt($('#static-unit-is-min-'+rowIndex).val());
    if(isMin===0){
        $('#static-unit-conversion-rate-'+rowIndex).removeAttr('readonly');
    }else if(isMin===1){
        $('#static-unit-conversion-rate-'+rowIndex).val(1).attr('readonly','true');
        $('.static-unit-conversion-rate').each(function(){
            var index =$(this).attr('data-row-index');
            if(index!=rowIndex){
                $(this).removeAttr('readonly');
            }
        });
        $('.static-unit-is-min').each(function(){
            var index =$(this).attr('data-row-index');
            if(index!=rowIndex){
                $(this).val(0);
            }
        });
    }
}

function deleteRow(rowIndex){
    $('#static-unit-row-'+rowIndex).remove();
}

function groupNameChange(){
    $('#non-unit-name').val($('#unit-group-name-add').val());
}
