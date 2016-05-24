/**
 * 添加参数
 */
var i = 0;
function addRow(btn) {
    i++;
    var objContainer = $("#trContainer");
    var len = objContainer.children().length;
    var strTr = '';
    strTr += '<tr style="height:30px!important">';
    strTr += '<td>' + (len + 1) +'</td>' ;
    strTr += '<td style="text-align: center;">';
    strTr += '<input type="hidden" name="materialId" />';
    strTr += '<input type="hidden" name="materialCode" />';
    strTr += '<input type="hidden" name="inventoryUnitId" />';
    strTr += '<span class="input-icon input-icon-right">';
    strTr += '<input id="inputMaterialName_'+i+ '" class="inputSelect ipt" keyId="id" keyName="{name}({#code})" ajax="true" url="/common/material/findByNameOrShortName" paramName="name" liClick="fillInventory" input="cleanTr" selectMargin="0px" name="cityName" style="width:250px;" autocomplete="off" isNull="false" checkType="empty" placeholder="输入物料"/>';
    strTr += '<i style="margin-top:-3px;" class="ace-icon fa fa-angle-down icon-on-right arrow" ></i></span>';
    strTr += '</td>';
    strTr += '<td style="text-align: center;">';
    strTr += '';
    strTr += '</td>';
    strTr += '<td style="text-align: center;" >';
    strTr += '';
    strTr += '</td>';
    strTr += '<td style="text-align: center;">';
    strTr += '';
    strTr += '</td>';
    strTr += '<td>';
    strTr += '<a href="#" class="btn btn-minier btn-white btn-warning btn-bold"  onclick="delRow(this);return false;"><i class="ace-icon fa fa-trash-o bigger-120 orange"></i>删除</a>';
    strTr += '</td>';
    strTr += '</tr>';
    var trObj = $(strTr);
    var trContainer = $("#trContainer");
    trContainer.append(trObj);
    inputSelectUtil.init();
    $(btn).focus();
    
}
function delRow(obj) {
    var obj = $(obj);
    var trObj = obj.parent().parent();
    var tbodyObj = trObj.parent();
    trObj.remove();
    tbodyObj.children().each(function(index, tr) {
        $(tr).children('td').eq(0).html(index + 1);
    });
}

function setParameterJson()
{
    var objContainer=$("#trContainer");
    var len=objContainer.children().length;
    var children=objContainer.children() ;
    var json="[";
    children.each(function(i){
        var materialId= $.trim($(this).find('input[name=materialId]').val());
        var materialCode= $.trim($(this).find('input[name=materialCode]').val());
        var inventoryUnitId= $.trim($(this).find('input[name=inventoryUnitId]').val());
        var materialName =  $.trim($(this).children('td').eq(2).html());
        var standardName =  $.trim($(this).children('td').eq(3).html());
        var inventoryUnit =  $.trim($(this).children('td').eq(4).html());
        if(i<len-1){
            json+="{\"materialId\":\""+materialId
            +"\",\"inventoryUnitId\":\""+inventoryUnitId
            +"\",\"materialCode\":\""+materialCode
            +"\",\"materialName\":\""+materialName
            +"\",\"standardName\":\""+standardName
            +"\",\"inventoryUnitName\":\""+inventoryUnit+"\"},";
        }
        else{
            json+="{\"materialId\":\""+materialId
            +"\",\"inventoryUnitId\":\""+inventoryUnitId
            +"\",\"materialCode\":\""+materialCode
            +"\",\"materialName\":\""+materialName
            +"\",\"standardName\":\""+standardName
            +"\",\"inventoryUnitName\":\""+inventoryUnit+"\"}";
        }
           
         
    });
    json+="]";
    return json;
}

/**
 * 填充
 * @param id
 * @param name
 * @param json
 * @param nodeId
 */
function fillInventory(id, name, json, nodeId){
    var tr = $(nodeId).parent().parent().parent();
    tr.children('td').eq(2).html("");
    tr.children('td').eq(3).html("");
    tr.children('td').eq(4).html("");
    tr.children('td').eq(1).find("input[name=materialId]").val("");
    tr.children('td').eq(1).find("input[name=inventoryUnitId]").val("");
    tr.children('td').eq(1).find("input[name=materialCode]").val("");
    if(!checkMaterieRepeat(id,nodeId)){
        return false;
    };
    var jsonObj = eval("("+json+")");
    tr.children('td').eq(2).html(jsonObj.name);
    tr.children('td').eq(3).html(jsonObj.standardName);
    tr.children('td').eq(4).html(jsonObj.minUnit);
    tr.children('td').eq(1).find("input[name=materialId]").val(id);
    tr.children('td').eq(1).find("input[name=inventoryUnitId]").val(jsonObj.minUnitId);
    tr.children('td').eq(1).find("input[name=materialCode]").val(jsonObj.code);
    $(nodeId).removeClass('validateClass');
    return true;
}

function cleanTr(nodeId){
    var tr = $(nodeId).parent().parent().parent();
}

/**
 * 校验
 * @param id
 */
function checkMaterieRepeat(id,nodeId){
    var objContainer=$("#trContainer");
    var children=objContainer.children() ;
    var times = 0;
    children.each(function(i){
        var materialId=$(this).find('input[name=materialId]').val();
        if(materialId==id){
            times++;
        }
    });
    if(times>=1){
        parent.$.dialog.alert("物料不能重复");
        return false;
    }
    return true;
}

/**
 * 校验 inputSelect
 * @param id
 */
function validMaterieRepeat(){
    var objContainer=$("#trContainer");
    var children=objContainer.children() ;
    var times = 0;
    children.each(function(i){
        var materialId=$(this).find('input[name=materialId]').val();
        if(materialId==""){
            times++;
            $(this).find(".inputSelect").addClass("validateClass");
            $(this).find(".inputSelect").focus();
            return false;
        }
    });
    if(times>0){
        return false;
    }else{
        return true;
    }
}


//城市下拉框响应函数
function loadStoreCity(id, code,jsonStr) {
  var obj = eval("(" + jsonStr + ")");
  var supplierName = obj.name;
  var cityId = obj.code;
  $("#cityName").val(supplierName);
  $("#cityId").val(cityId);
}
//清除城市
function cleanStoreCity() {
  $("#cityName").val("");
  $("#cityId").val("");
}

//盘点模版下拉框响应函数
function loadTemplate(id, code,jsonStr) {
  var obj = eval("(" + jsonStr + ")");
  var supplierName = obj.name;
  var cityId = obj.code;
  $("#templateName").val(supplierName);
  $("#templateId").val(cityId);
}
//清除盘点模版
function cleanTemplate() {
  $("#templateName").val("");
  $("#templateId").val("");
}

function loadItem(templateId,copy){

    $("#trContainer").html("");
    $.post('/store/inventoryTemplate/toEdit/findItem', 
            {'id' : templateId }, 
            function(data) {
                if(data != null && data.length > 0) {
                    for(var i=0; i<data.length; i++) {  
                        var newTr  = '<tr>';
                        var index = i+1;
                           newTr += '<td>' +index+'</td>';
                           newTr += '<td>'+data[i].materialCode + '<input type="hidden" name="materialCode"';
                           newTr += 'value="' + data[i].materialCode +'"> <input type="hidden" name="materialId"';
                           newTr +=  'value="'+data[i].materialId +'"> <input type="hidden" name="inventoryUnitId"';
                           newTr += 'value="'+ data[i].inventoryUnitId +'">';
                           newTr += '</td>';
                           newTr += '<td>' +data[i].materialName +'</td>';
                           newTr += '<td>' +data[i].standardName +'</td>';
                           newTr += '<td>' +data[i].inventoryUnitName +'</td>';
                           newTr += '<td><a href="#" class="btn btn-minier btn-white btn-warning btn-bold"';
                           newTr += 'onclick="delRow(this);return false;"> <i class="ace-icon fa fa-trash-o bigger-120 orange"></i><span';
                           newTr += 'class="link-btn">删除</span></a></td>';
                           newTr += '</tr>';
                           $("#trContainer").append(newTr);
                    }  
                }else{
                    if(copy){
                        parent.$.dialog.alert("选择的模版没有物料，无法复制!");
                    }
                }
            }, 'json');
}
$(function(){
  //初始化可输入下拉框
    inputSelectUtil.init().load("#cityName");
    loadItem($("#id").val(),false);
    $('#submitBtn').click(function(){
        var name = $.trim($('#name').val())
        if(name == '' || name ==  null){
            parent.$.dialog.alert("模版名称不能为空!");
            $('#name').focus();
            return;
        }
        var type = $.trim($('#type').val())
        if(type == '' || type ==  null){
            parent.$.dialog.alert("请选择适用门店!");
            $('#type').focus();
            return;
        }
        var cityId = $.trim($('#cityId').val())
        if(cityId == '' || cityId ==  null){
            parent.$.dialog.alert("适用城市不能为空!");
            $('#cityName').focus();
            return;
        }
        //校验
        if(!validMaterieRepeat()){
            parent.$.dialog.alert("请选择物料，或删除行");
            return;
        }
        
        $('#parameterJson').val(setParameterJson());
        $.post('/store/inventoryTemplate/save', 
        {'id' : $("#id").val(), 
         'name': $("#name").val() ,
         'cityId': $("#cityId").val() ,
         'cityName': $("#cityName").val() ,
         'type': $("#type").val() ,
         'parameterJson'  : $("#parameterJson").val() 
         }, 
        function(data) {
            if(data.success) {
            	parent.$.dialog({title: '提示',content: '保存成功',icon: 'success.gif', ok : function() {
                    dialog.close();
                    parent.inventoryTemplate.reload();
                }});
            }else {
                parent.$.dialog.alert(data.msg);
            }
        }, 'json');
       
    })
    $('#copyTemplateBtn').click(function(){
        var templateId = $.trim($('#templateId').val())
        if(templateId == '' || templateId ==  null){
            parent.$.dialog.alert("请选择要复制的盘点模版!");
            $('#templateName').focus();
            return;
        }
        if ( $('#trContainer').children().length > 0 ) {
            parent.$.dialog.alert("已经存在物料，无法复制，请先删除列表!");
            return;
       }
        loadItem($('#templateId').val(),true);
    })
})