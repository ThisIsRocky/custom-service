var allotApply = {
    // 加载数据详情
    loadGrid: function () {
        //$( "#page_tabs" ).tabs( "option", "active", 0 );
        var grid_selector = "#allot_table_data_list";
        var _this = this;

        var url = '/store/transfer/getdata'
        $(grid_selector).jqGrid("clearGridData");
        $(grid_selector).jqGrid({
            url: url,
            type: 'post',
            datatype: 'json',
            colNames: ['物料编号', '物料名称', '数量', '单位', '规格', '操作', '物料ID', '物料单位ID'],
            cmTemplate: {sortable:true},
            colModel: [{
                name: 'materialCode',
                align: 'center',
                width: 40
            }, {
                name: 'materialName',
                width: 100
            }, {
                name: 'quantity',
                width: 40,
                align: 'center',
            }, {
                name: 'unitName',
                align: 'center',
                width: 50
            }, {
                name: 'standardName',
                width: 200
            }, {
                name: 'operation',
                width: 100,
                align: 'center',
            }, {
                name: 'materialId',
                hidden: true,
            }, {
                name: 'unitId',
                hidden: true,
            }]
            ,
        });
        // 自适应宽度
        $.resizeGrid(grid_selector);
    },
};
var newrowid;
//初始化
var dialog, parent;
try {
    dialog = frameElement.api, parent = dialog.opener;
} catch (e) {
}
$(function () {

    //初始化可输入下拉框
    allotApply.loadGrid();
    inputSelectUtil.init();
    //行号初始为空
    newrowid = 0;
});

//添加一行
function addOneRow() {
    //物料的id
    var materialid = $("#mmid").val();
    //物料的编号
    var materialCode = $("#mmcode").val();
    //物料的名字
    var materialName = $("#materialName").val();

    if (materialName == '') {
        $.dialog({title: '提示',content: '请选择物料并输入大于等于0的整数',icon: 'alert.gif', ok : '确定'});
        return;
    }
    //物料的数量
    var materialCount = $("#materialCount").val();

    var reg = new RegExp("^[0-9]*$");

    if(!reg.test(materialCount)){
        $.dialog({title: '提示',content: '请选择物料并输入大于等于0的整数',icon: 'alert.gif', ok : '确定'});
        return;
    }

    if (materialCount <= 0) {
        $.dialog({title: '提示',content: '请选择物料并输入大于等于0的整数',icon: 'alert.gif', ok : '确定'});
        return;
    }
    //物料单位的名字
    var materialUnit = $("#unitName").text();
    //物料单位的id
    var Unitid = $("#unitName").val();

    //物料的规格名字
    var standardName = $("#standardName").text();

    //获得新添加行的行号（数据编号）
    newrowid = newrowid + 1;

    var retVal = '<button class="btn btn-minier btn-white btn-default btn-bold" onclick="deleteOneRow(' + newrowid + ')">' +
        '<i class="ace-icon fa fa-pencil-square-o blue" ></i>删除</button>';
    var dataRow = {
        materialCode: materialCode,
        materialName: materialName,
        quantity: materialCount,
        unitName: materialUnit,
        standardName: standardName,
        operation: retVal,
        materialId: materialid,
        unitId: Unitid
    };
    //将新添加的行插入到第一列
    $("#allot_table_data_list").jqGrid("addRowData", newrowid, dataRow, "first")
    $("#allot_table_data_list").jqGrid('editRow',newrowid,true);
    //清空不要的数据
    cleanPublicData();
}
//删除一行
function deleteOneRow(newrowid) {
    $("#allot_table_data_list").jqGrid("delRowData", newrowid);
}
//提交申请
function sumbmitApplayData() {
    var to_storeId = $("#storeInfo").val();
    if (to_storeId == '') {
        $.dialog({title: '提示',content: '请选择调入门店',icon: 'alert.gif', ok : '确定'});
        return;
    }



    var rowData = $("#allot_table_data_list").jqGrid("getRowData");
    if (rowData.length < 1) {
        $.dialog({title: '提示',content: '请选择调入门店并添加调出物料',icon: 'alert.gif', ok : '确定'});
        return;
    }

    var datalength = rowData.length;
    var allotInfo = '['
    for (var i = 0; i < datalength; i++) {
        allotInfo += '{';
        allotInfo += '"materialCode":"' + rowData[i].materialCode + '",',
            allotInfo += '"materialName":"' + rowData[i].materialName + '",',
            allotInfo += '"quantity":"' + rowData[i].quantity + '",',
            allotInfo += '"unitName":"' + rowData[i].unitName + '",',
            allotInfo += '"standardName":"' + rowData[i].standardName + '",',
            allotInfo += '"materialId":"' + rowData[i].materialId + '",',
            allotInfo += '"unitId":"' + rowData[i].unitId + '"'
        if (i == datalength - 1) {
            allotInfo += '}'
        } else {
            allotInfo += '},'
        }
    }
    allotInfo += ']';

    var param = '&toStoreId=' + to_storeId + '&allotInfo=' + allotInfo
    $("#submitApplybnt").attr({"disabled":"disabled"});
    $.ajax({
        type: 'post',
        url: '/store/transfer/addMaterialAllotApply',
        data: param,
        datatype: 'json',
        success: function (data) {
            console.log(data);
            if (data == "success") {
                $("#submitApplybnt").removeAttr("disabled");
                allotApply.loadGrid();
                $.dialog({title: '提示',content: '调拨申请成功',icon: 'success.gif', ok : '确定'});
            } else if (data == 'failure') {
                $("#submitApplybnt").removeAttr("disabled");
                $.dialog({title: '提示',content: '调拨申请失败',icon: 'alert.gif', ok : '确定'});
            } else {
                $("#submitApplybnt").removeAttr("disabled");
                $.dialog({title: '提示',content: '服务器错误,请联系管理员',icon: 'error.gif', ok : '确定'});
            }
        },
        error: function (msg) {
            $("#submitApplybnt").removeAttr("disabled");
            $.dialog({title: '提示',content: '服务器错误,请联系管理员',icon: 'error.gif', ok : '确定'});
        }
    });
}
//清除门店名称输入框数据
function cleanFillStoreInfo() {
    $("#storeInfo").val("");
}

//门店编码
function fillStoreInfo(id, storeCode, jsonStr) {
    var obj = eval("("+jsonStr+")");
    var storeId = obj.id;
    $("#storeInfo").val(storeId);
}
//加载物料数据
function loadMaterial(id, code, jsonStr) {
    var obj = eval("(" + jsonStr + ")");
    $("#name").val(obj.name);
    $("#mmid").val(obj.id);
    $("#mmcode").val(obj.code);
    $("#unitName").text(obj.minUnit);
    $("#unitName").val(obj.minUnitId);
    $("#standardName").text(obj.standardName);
}
function  clearinput(){
    $("#materialName").val("");
    $("#unitName").text("");
    $("#unitName").val("");
    $("#standardName").text("");
}

function cleanPublicData(){
    $("#materialName").val("");
    $("#materialCount").val("");
    $("#unitName").text("");
    $("#unitName").val("");
    $("#standardName").text("");
}

//清楚物料数据
function cleanMaterial() {
    $("#name").val("");
    $("#mmid").val("");
    $("#materialCode").val("");
}
