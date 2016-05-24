var warehousePurchaseItem = {
    grid_selector : "#table-data-list",
    pager_selector : "#table-data-list-pager",
    detailsGrid : null, // 数据详情
    tempSelectedMat : null,
    url : '/store/purchase/warehouse/materialList', //xxx
    // 加载数据详情
    query : function() {
        $(warehousePurchaseItem.detailsGrid).jqGrid("clearGridData");
        if (warehousePurchaseItem.detailsGrid) {
            // 根据搜索条件，重新加载
            var url = warehousePurchaseItem.url + "?categoryId="+$('#categoryList').val();
            $(warehousePurchaseItem.grid_selector).jqGrid('setGridParam', {
                url : url ,
                page : 1
            }).trigger("reloadGrid");
        } else {
            var _this = this;
            // 首次加载
            var url = warehousePurchaseItem.url + "?categoryId="+$('#categoryList').val();
            _this.detailsGrid = $(warehousePurchaseItem.grid_selector).jqGrid({
                cmTemplate: {sortable:false},
                url : url,
                datatype : 'json',
                colNames : [ '物料编号', '物料名称', '前8日销量', '前次订货数量',
                             '当前库存', '订购数量', '单位', '规格', '操作' ],
                 cmTemplate: {sortable:true},
                 jsonReader : {
                     root : "data"
                 },
                 prmNames : {
                     page : 'curPage',
                     rows : 'pageSize',
                     sort : 'sidx',
                     order : 'sort'
                 },
                 colModel : [
                 {
                     name : 'materialCode',
                     align : 'center',
                     width : 100,
                     key: true
                 },
                 {
                     name : 'materialName',
                     width : 140,
                     align : 'center',
                 },
                 {
                     name : 'totalNum',
                     width : 140,
                     align : 'center',
                 },
                 {
                     name : 'lastReceiveQuantity',
                     width : 140,
                     align : 'center',
                 },
                 {
                     name : 'stockNum',
                     width : 140,
                     align : 'center',
                 },
                 {
                     name : 'quantity',
                     width : 60,
                     align : 'center',
                     formatter : function(cellvalue,
                             options, rowObject) {
                        return '<input class="purchaseQuantity" style="text-align:right" materialId="'
                         + rowObject.materialId
                         + '" width="50" value="'
                         + cellvalue + '">';
                     }
                 },
                 {
                     name : 'unitName',
                     align : 'center',
                     width : 100
                 },
                 {
                     name : 'materialStandard',
                     align : 'center',
                     width : 100
                 },
                 {
                     name : '',
                     width : 50,
                     align : 'center',
                     formatter : function(cellvalue,options, rowObject) {
                         return '<button class="btn btn-minier btn-white btn-warning btn-bold" onclick="warehousePurchaseItem.deleteItem('
                         + rowObject.materialId
                         + ');"><i class="ace-icon fa fa-trash-o bigger-120 orange"></i>删除</button>';
                     }
                 } ],
                 rowNum : 999,
                 rowList : [ 10, 20, 30 ],
                 height : 'auto',
                 viewrecords : true,
                 autoHeight : true,
                 loadComplete : function() {
                     // 自适应宽度
                     $.resizeGrid(warehousePurchaseItem.grid_selector);
                     var table = this;
                     setTimeout(function() {
                         $.removeScrollX(warehousePurchaseItem.grid_selector);
                     }, 0);
                 },
            });
        }
    },
    confirmPurchase : function() {
        //var data = "&expectReceiveDate=" + $("#warehousePurchase #expectReceiveDate").val() + "&nd=' + Math.random()"
        
        
        var data = "&expectReceiveDate=" + $("#expectReceiveDate").html() + "&nd=' + Math.random()";
        
        var categoryId =  $('#categoryList').val();
        if (categoryId == null || categoryId == "") {
            $.dialog.alert('请选择物料分类');
            return false;
        }
        data += "&categoryId=" + categoryId;
        var items = $("#warehousePurchase .purchaseQuantity");
        if(items == null || items.length <= 0){
            $.dialog.alert('请添加物料！');
            return false;
        }
        for (var i = 0; i < items.length; i++) {
            if (!$(items[i]).val() || $.trim($(items[i]).val()) == ''
                    || isNaN($(items[i]).val()) || $(items[i]).val() <= 0) {
                $(items[i]).css('border-color', 'red');
                $(items[i]).focus();
                $.dialog.alert('第' + (i + 1) + '行数量错误，必须为大于0整数');
                return false;
            } else if (parseInt($(items[i]).val()) != $(items[i]).val()) {
                $(items[i]).css('border-color', 'red');
                $(items[i]).focus();
                $.dialog.alert('第' + (i + 1) + '行数量非整数');
                return false;
            } else {
                $(items[i]).css('border-color', '');
                data += '&purchaseItemList[' + i + '].materialId=' + $(items[i]).attr("materialId");
                data += '&purchaseItemList[' + i + '].quantity=' + $(items[i]).val();
            }
        }
        $.post('/store/purchase/warehouse/save', data, function(data) {
            if (data.code == "000000") {
            	$.dialog({title: '提示',content: '采购单订购成功',icon: 'success.gif', ok : '确定'});
                warehousePurchaseItem.query();
            } else {
                $.dialog.alert(data.message);
            }
        }, 'json');
    },
    fillMaterial : function(id, name, jsonStr) {
        var obj = eval('(' + jsonStr + ')');
        warehousePurchaseItem.tempSelectedMat = obj;
        $("#warehousePurchase #unitName").html(obj.transportUnit);
        $("#warehousePurchase #materialId").val(obj.id);
        $("#warehousePurchase #standardName").html(obj.standardName);
    },
    addItem : function() {
       
        var materialId = $("#warehousePurchase #materialId").val();
        var materialName = $("#warehousePurchase #materialName").val();
        var perchaseQuantity = $("#warehousePurchase #perchaseQuantity").val();
        if ((materialId == null || materialId == "")
                || (materialName == null || materialName == "")) {
            $.dialog.alert('请选择物料');
            return false;
        }
        if(isNaN(perchaseQuantity) || perchaseQuantity <= 0) {
            $.dialog.alert('数量请填写大于0的整数');
            return false;
        }
        
        var categoryId =  $('#categoryList').val();
        if (categoryId == null || categoryId == "") {
            $.dialog.alert('请选择物料分类');
            return false;
        }
        $.post('/store/purchase/warehouse/addMaterial', {
            'materialId' : materialId,
            'quantity' : perchaseQuantity,
            'categoryId':categoryId
        }, function(data) {
            if (data.code == "000000") {
                $("#warehousePurchase #unitName").html("");
                $("#warehousePurchase #standardName").html("");
                $("#warehousePurchase #perchaseQuantity").val("");
                inputSelectUtil.clean("#warehousePurchase #materialName");
                warehousePurchaseItem.query();
            } else {
                $.dialog.alert(data.message);
            }
        }, 'json');
    },
    deleteItem : function(materialId) {
        if (!materialId) {
            alert("请选择要删除的行");
            return;
        } else {
            $.post('/store/purchase/warehouse/delMaterial', {
                'materialId' : materialId,
                'categoryId':$('#categoryList').val()
            }, function(data) {
                if (data.code == "000000") {
                    warehousePurchaseItem.query();
                } else {
                    $.dialog.alert(data.message);
                }
            }, 'json');
        }
    }
}

$(function() {
    $("#warehousePurchaseItem #confirmReceive").click(function(){
        warehousePurchaseItem.confirmReceive;});
    inputSelectUtil.init();
    
    
    $('#categoryList').change(function(){
        if($(this).val() == ''){
            $('#exceptoinTip').css('display','none');
            $('#expectReceiveDateDivRow').css('display','none');
            $('#materailDivRow').css('display','none');
            $('#data-list').css('display','none');
            return '请选择物料分类';
        }
        
        var url = $('#materialName').attr('url');
        var urlTmp = url.split('categoryLevel1')[0] + "categoryLevel1=" + $('#categoryList').val();
        $('#materialName').attr('url',urlTmp);
        
        $.post('/store/purchase/finaRuleDateByCategoryId', {
            'categoryId' :  $('#categoryList').val()
        }, function(data) {
            if(data.code== '000000'){
                $('#exceptoinTip').css('display','none');
                $('#expectReceiveDate').html(data.data);
                $('#expectReceiveDateDivRow').css('display','block');
                $('#materailDivRow').css('display','block');
                $('#data-list').css('display','block');
                warehousePurchaseItem.query();
            } else {
                $('#exceptoinTip').html(data.message).css('display','block');
                $('#expectReceiveDateDivRow').css('display','none');
                $('#materailDivRow').css('display','none');
                $('#data-list').css('display','none');
            }
        });
    });
    $('#materialName').attr('url',$('#materialName').attr('url')+"&categoryLevel1=" +$('#categoryList').val());
});