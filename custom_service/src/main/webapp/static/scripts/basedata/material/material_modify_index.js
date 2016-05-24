var $level1CategoryMap = {};
var $level2CategoryMap = {};
$(function () {
    formValidate();
    inputSelectUtil.init();
    
    //保存单位组
    $('#material_modify_submit_btn').click(function () {
        var action = $('#action').val();
        if(action != 'seniorModify') {
            $('#code_modify').val($('#category_code_modify').val().concat($('#material_code_modify').val()))
        }
        if (!checkParam()) {
            return;
        }
        var costPrice = $("#costPrice").val();
        if ($.trim(costPrice) == ''|| isNaN(costPrice) || costPrice <= 0) {
            parent.$.dialog.alert('采购价必须大于0');
            return false;
        }
        var supplierPrice = $("#supplierPrice").val();
        if ($.trim(supplierPrice) == ''|| isNaN(supplierPrice) || supplierPrice <= 0) {
            parent.$.dialog.alert('配送价必须大于0');
            return false;
        }
        
        var url,id = $("#id").val(); // 存在ID修改，否则新增
        if(id) {
            var action = $('#action').val();
            if(action == 'seniorModify') {
                // 启用后编辑
                url = '/material/materials/seniorModify'
            } else {
                // 编辑
                url = '/material/materials/modify'
            }
        } else {
            // 物料新增
            url = '/material/materials/add'
        }
        
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            data: $('#material_modify_form').formSerialize()
        }).done(function (ret) {
            if (ret.code === 1) {
                if(id){
                    alert('修改成功');
                } else {
                    alert('新增成功');
                }
                parent.materialReload();
                frameElement.api.close();
            } else {
                alert(ret.msg);
            }
        }).fail(function () {

        }).always(function () {

        });
    });

    $('#material_modify_cancel_btn').click(function () {
        frameElement.api.close();
    });

    initCategoryLevel1($('#material_category_level1_default').val(), $('#material_category_level2_default').val(), function () {
        var categoryCode = $('#category_code_modify').val();
        var code = $('#code_modify').val();
        var newCode = code.replace(categoryCode, '');
        $('#material_code_modify').val(newCode);
        queryGroupByCatId();
    });
    $('#material_category_level1_modify').change(function () {
        var code = $level1CategoryMap[$('#material_category_level1_modify').val()];
        $('#category_code_modify').val(code);
        initCategoryLevel2($('#material_category_level1_modify').val(), null, queryGroupByCatId);
    });

    $('#material_category_level2_modify').change(function () {
            var code = $level1CategoryMap[$('#material_category_level1_modify').val()].concat($level2CategoryMap[$('#material_category_level2_modify').val()]);
            $('#category_code_modify').val("");
            $('#category_code_modify').val(code);
            queryGroupByCatId();
        }
    );

    var action = $('#action').val();
    if(action == 'modify' || action == '') {
        $("#materialGroupId").change(getUnitGroup);
    }else if(action == 'seniorModify') {
        queryGroupByCatIdSenior();
    }

    $('#unit_group_id_modify').change(function () {
        initUnit($('#unit_group_id_modify').val());
    });
    
    if($('#action').val() == 'view') {
        $('input').attr('readonly', true);
        $('select').attr('disabled', true);
    }else {
        queryGroupByCatIdSenior();
    }
    
    $('#costPrice').change(function(){
        if(!$('#supplierPrice').val()) {
            $('#supplierPrice').val(this.value);
        }
    });
    
});

function getUnitGroup() {
    var unitBaseId = $("#materialGroupId").find("option:selected").attr('unitBaseId');
    initUnitGroup($('#unit_group_id_default').val(), $('#material_transport_unit_id_default').val(), $('#material_inventory_unit_id_default').val(), unitBaseId);
}

function queryGroupByCatId() {
        var catId = $('#material_category_level2_modify').val();
        var id = $("#material_group_id_default").val();
        $.post('/common/materialGroup/findMatGroupByCatId', {'catId':catId}, function(list){
            if(list) {
                $("#materialGroupId").empty();
                $(list).each(function() {
                    var selected = '';
                    if(id && id == this.id) {
                        selected = ' selected ';
                    }
                    $("#materialGroupId").append('<option '+selected+' unitBaseId="'+this.unitBaseId+'" value="'+this.id+'">'+this.name+'</option>');
                });
            }
            var action = $('#action').val();
            if(action != 'seniorModify' && action !='view') {
                getUnitGroup();
            }
        }, 'json');
}
function queryGroupByCatIdSenior() {
    var catId = $('#material_category_level2_default').val();
    var id = $("#material_group_id_default").val()
    $.post('/common/materialGroup/findMatGroupByCatId', {'catId':catId}, function(list){
        if(list) {
            $("#materialGroupId").empty();
            $(list).each(function() {
                var selected = '';
                if(id && id == this.id) {
                    selected = ' selected ';
                }
                $("#materialGroupId").append('<option '+selected+' unitBaseId="'+this.unitBaseId+'" value="'+this.id+'">'+this.name+'</option>');
            });
        }
    }, 'json');
}

function queryUnitGroupByMatGroupId(mgId) {
    $.post('/common/materialGroup/findMatGroupByCatId', {'catId':catId}, function(list){
        if(list) {
            $(list).each(function() {
                var selected = '';
                if(id && id == this.id) {
                    selected = ' selected ';
                }
                $("#materialGroupId").append('<option '+selected+' value="'+this.id+'">'+this.name+'</option>');
            });
        }
    }, 'json');
}

/**
 * 参数校验
 */
function checkParam() {
    var selfLifeResult = true;
    var selfLife = $.trim($('#shelf_life_modify').val());
    if (selfLife == null || selfLife == '') {
        selfLifeResult = false;
        $('#shelf_life_modify').addClass('tooltipinputerr');
    } else {
        $('#shelf_life_modify').removeClass('tooltipinputerr');
    }
    var validResult = validat();
    if (!validResult || !selfLifeResult) {
        alert('请确保物料信息填写完整');
        return false;
    }
    var numReg = /^[1-9]\d*$/;
    if (!numReg.test(selfLife)) {
        alert('保质期必须为正整数');
        return false;
    }
    if (selfLife > 1000000) {
        alert('保质期不可超过1000000');
        return false;
    }
    var action = $('#action').val();
    if(action != 'seniorModify') {
        var codeReg = /^\d{9}$/;
        var code = $.trim($('#code_modify').val());
        if (!codeReg.test(code)) {
            alert('物料编码不符合九位数字限制，不可重复添加');
            return false;
        }
    }
    var materialType = $('input[name="type"]:checked');
    if(materialType.size() < 1) {
        alert('请选择一个物料种类');
        return false;
    }
    return true;
}

/**
 * 初始化单位组
 */
function initUnitGroup(unitGroupId, tranportUnitId, inventoryUnitId, unitBaseId) {
    if(!unitBaseId) {
        unitBaseId = 0;
    }
    $.ajax({
        url: '/unitGroup/allUnitGroups/list?unitBaseId='+unitBaseId,
        type: 'GET',
        dataType: 'JSON'
    }).done(function (ret) {
        $('#unit_group_id_modify').empty();
        var html = '';
        if (ret != null && ret.length > 0) {
            for (var i = 0; i < ret.length; i++) {
                var item = ret[i];
                html += '<option value=' + item.id + '>' + item.groupName + '</option>';
            }
        }
        $('#unit_group_id_modify').html(html);
        if (unitGroupId != null && unitGroupId != '') {
            $('#unit_group_id_modify').val(unitGroupId);
        }
        initUnit($('#unit_group_id_modify').val(), tranportUnitId, inventoryUnitId);
    }).fail(function () {

    }).always(function () {

    });

}
//清除供应商名称输入框数据
function cleanFillSuplierInfo() {
    $("#supplierName").val("");
    $("#supplierId").val("");
}

//供应商编码
function fillSuplierInfo(id, code, jsonStr) {
    var obj = eval("("+jsonStr+")");
    var supplierName = obj.name;
     $("#supplierName").val(supplierName);
    //$("#cityId").parent().children(".idVal").val(id);
    var supplierId = obj.id;
    $("#supplierId").val(supplierId);
}
//单位组下拉的时候给隐藏域复制
function unitGroupToHidden() {
    $("#unitGroupHidden").val($('#unit_group_id_modify option:selected').text());
}

/**
 * 初始化单元
 * @param unitList
 */
function initUnit(groupId, transportUnitId, inventoryUnitId) {
    if(!groupId) {
        $('#transport_unit_id_modify').empty();
        $('#inventory_unit_id_modify').empty();
        $('#min_unit_name_modify').val('');
        $('#min_unit_id_modify').val('');
    }else {
        $.ajax({
            url: '/unitGroup/units/find',
            type: 'GET',
            dataType: 'json',
            data: {unitGroupId: groupId}
        }).done(function (ret) {
            $('#transport_unit_id_modify').empty();
            $('#inventory_unit_id_modify').empty();
            if (ret != null && ret.length > 0) {
                var html = '';
                for (var i = 0; i < ret.length; i++) {
                    var item = ret[i];
                    html += '<option value=' + item.id + '>' + item.name + '</option>';
                    if (item.isMin === 1) {
                        $('#min_unit_name_modify').val(item.name);
                        $('#min_unit_id_modify').val(item.id);
                    }
                }
                $('#transport_unit_id_modify').html(html);
                $('#inventory_unit_id_modify').html(html);
            }
            if (transportUnitId != null && transportUnitId != '') {
                $('#transport_unit_id_modify').val(transportUnitId);
            }
            if (inventoryUnitId != null && inventoryUnitId != '') {
                $('#inventory_unit_id_modify').val(inventoryUnitId);
            }
        }).fail(function () {

        }).always(function () {

        });
    }
}

var logIndex = 1;
function loadLog(materialId,url) {
    $('#loadLogBtn').addClass('disabled');
    $.ajax({
        type: 'get',
        url: url,
        data: {
            materialId: materialId,
            curPage: logIndex++,
            pageSize: 10
        },
        dataType: "json",
        success: function (data) {
            if (data) {
                var content = "";
                var contentPanel = $('#log_list').find('.scroll-content');
                $(data.data).each(function () {
                    if (this.preValue != this.postValue) {
                        contentPanel.append("<small>" + $.dateFormat(this.createTime, 'yyyy-MM-dd hh:mm:ss') + " <span style=\"color: red; \">" + this.createName + "</span> 将 " + this.propComments + " 从 '" + this.preValue + "' <span style=\"color: green; \">修改为</span> '" + this.postValue + "'" + "</small><div class='hr hr8'></div>");
                    }
                });
                if (data.pgNumber > 1) {
                    contentPanel.scrollTop(contentPanel.prop("scrollHeight") / 2);
                }
                if (data.pgNumber >= data.totalPage) {
                    $('#loadLogBtn').hide();
                    return;
                }
            }
            $('#loadLogBtn').removeClass('disabled');
        },
        error: function (msg) {
        }
    });
}
