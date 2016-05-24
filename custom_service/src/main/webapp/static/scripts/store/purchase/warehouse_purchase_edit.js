var warehousePurchaseEdit = {
    grid_selector : "#table-data-edit-list",
    pager_selector : "#table-data-list-edit-pager",
    detailsGrid : null, // 数据详情
    tempSelectedMat : null,
    url : '/store/purchase/viewDetail/item' + "?purchaseId=" + $("#purchaseId").val(),
    // 加载数据详情
    query : function() {
        $(warehousePurchaseEdit.detailsGrid).jqGrid("clearGridData");
        if (warehousePurchaseEdit.detailsGrid) {
            // 根据搜索条件，重新加载
            $(warehousePurchaseEdit.grid_selector).jqGrid('setGridParam', {
                url : warehousePurchaseEdit.url,
                page : 1
            }).trigger("reloadGrid");
        } else {
            var _this = this;
            // 首次加载
            _this.detailsGrid = $(warehousePurchaseEdit.grid_selector).jqGrid({
                cmTemplate: {sortable:false},
                url : warehousePurchaseEdit.url,
                datatype : 'json',
                colNames : [ '物料编码', '物料名称', '采购数量', '发货数量', '发货详情[生产日期｜数量]',
                             '实收数量', '物流单位', '规格'],
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
                     name : 'quantity',
                     width : 140,
                     align : 'center',
                     formatter : function(cellvalue,options, rowObject) {
                             return rowObject.quantity;
                     }
                 },
                 {
                     name : 'deliveryQuantity',
                     width : 140,
                     align : 'center',
                     formatter : function(cellvalue,options, rowObject) {
                    	 var deliveryQuantity = rowObject.deliveryQuantity != null ? rowObject.deliveryQuantity : "-";
                         if(rowObject.deliveryDifferenceReason != null && rowObject.deliveryDifferenceReason != ""){
                        	 return deliveryQuantity +'<i class="ace-icon fa fa-comments-o red2 cursor-pointer" data-rel="tooltip"' 
                             + 'title="' + rowObject.deliveryDifferenceReason + '"></i>';
                         }else{
                             return deliveryQuantity;
                         }
                         
                     }
                 },
                 {
                     name : 'deliveryQuantityDetail',
                     width : 180,
                     align : 'center',
                     formatter : function(cellvalue,options, rowObject) {
                         var ret = "";
                         $(rowObject.batchList).each(function(){
                        	 ret += $.dateFormat(this.productionDate, "yyyy-MM-dd") + " | " + this.quantity + "<br>";
                         });
                         return ret;
                     }
                 },
                 {
                     name : 'receiveQuantity',
                     width : 140,
                     align : 'center',
                     formatter : function(cellvalue,options, rowObject) {
                         var receiveQuantity = rowObject.receiveQuantity != null ? rowObject.receiveQuantity : "-";
                         if(rowObject.receiveDifferenceReason != null && rowObject.receiveDifferenceReason != ""){
                             return receiveQuantity +'<i class="ace-icon fa fa-comments-o red2 cursor-pointer" data-rel="tooltip"'
                             + 'title="' + rowObject.receiveDifferenceReason + '"></i>';
                         }else{
                             return receiveQuantity;
                         }
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
                 } ],
                 rowNum : 999,
                 rowList : [ 10, 20, 30 ],
                 height : 'auto',
                 viewrecords : true,
                 autoHeight : true,
                 loadComplete : function() {
                     // 自适应宽度
                     $.resizeGrid(warehousePurchaseEdit.grid_selector);
                     var table = this;
                     setTimeout(function() {
                         $.removeScrollX(warehousePurchaseEdit.grid_selector);
                     }, 0);
                 },
            });
        }
    },
    confirmPurchase : function() {
        
        var data = "&id=" + $("#warehousePurchaseEdit #purchaseId").val() + "&nd=' + Math.random()"
        var items = $("#warehousePurchaseEdit .purchaseQuantity");
        if(items == null || items.length <= 0){
            parent.$.dialog.alert('请添加物料！');
            return false;
        }
        for (var i = 0; i < items.length; i++) {
            if (!$(items[i]).val() || $.trim($(items[i]).val()) == ''
                    || isNaN($(items[i]).val()) || $(items[i]).val() <= 0) {
                $(items[i]).css('border-color', 'red');
                $(items[i]).focus();
                parent.$.dialog.alert('第' + (i + 1) + '行数量错误，必须为大于0整数');
                return false;
            } else if (parseInt($(items[i]).val()) != $(items[i]).val()) {
                $(items[i]).css('border-color', 'red');
                $(items[i]).focus();
                parent.$.dialog.alert('第' + (i + 1) + '行数量非整数');
                return false;
            } else {
                $(items[i]).css('border-color', '');
                data += '&purchaseItemList[' + i + '].materialId=' + $(items[i]).attr("materialId");
                data += '&purchaseItemList[' + i + '].quantity=' + $(items[i]).val();
            }
        }
        $.post('/store/purchase/update', data, function(data) {
            if (data.code == "000000") {
                parent.$.dialog({title: '提示',content: '采购单更新成功',icon: 'success.gif', ok : function(){
                    dialog.close();
                }});
                
            } else {
                parent.$.dialog.alert(data.message);
            }
        }, 'json');
    },
    fillMaterial : function(id, name, jsonStr,node) {
       
        var obj = eval('(' + jsonStr + ')');
        warehousePurchaseEdit.tempSelectedMat = obj;
        var materialId  = obj.id
        var items = $("#warehousePurchaseEdit .purchaseQuantity");
        for (var i = 0; i < items.length; i++) {
            if ($(items[i]).attr("materialId") == materialId) {
                parent.$.dialog.alert('物料已添加，请勿重复添加');
                inputSelectUtil.clean(node);
                return false;
            } 
        }
        $("#warehousePurchaseEdit #materialId").val(materialId);
        $("#warehousePurchaseEdit #unitName").html(obj.transportUnit);
        $("#warehousePurchaseEdit #materialCode").val(obj.code);
        $("#warehousePurchaseEdit #standardName").html(obj.standardName);
    },
    addItem : function() {
        
        var materialId = $("#warehousePurchaseEdit #materialId").val();
        var materialName = $("#warehousePurchaseEdit #materialName").val();
        var perchaseQuantity = $("#warehousePurchaseEdit #perchaseQuantity").val();
        var materialCode = $("#warehousePurchaseEdit #materialCode").val();
        if ((materialId == null || materialId == "")
                || (materialName == null || materialName == "")) {
            parent.$.dialog.alert('请选择物料');
            return false;
        }
        if(isNaN(perchaseQuantity) || perchaseQuantity <= 0) {
            parent.$.dialog.alert('数量请填写大于0的整数');
            return false;
        }
        
        //判断是否添加过
        var ids = jQuery(warehousePurchaseEdit.grid_selector).jqGrid('getDataIDs');  
        //获得当前最大行号（数据编号）  
        var rowid = Math.max.apply(Math,ids);  
        //获得新添加行的行号（数据编号）  
        var newrowid = rowid+1;
        var unitName  = $("#warehousePurchaseEdit #unitName").html();
        var standardName  = $("#warehousePurchaseEdit #standardName").html();
        var dataRow = {
                "materialCode":materialCode,
                "materialName":materialName,
                "materialId":materialId,
                "unitName":unitName,
                "materialStandard":standardName,
                "quantity":perchaseQuantity
        };
        $(warehousePurchaseEdit.grid_selector).jqGrid("addRowData", newrowid,dataRow , "last");
        $.resizeGrid(warehousePurchaseEdit.grid_selector);
        $("#warehousePurchaseEdit #unitName").html("");
        $("#warehousePurchaseEdit #standardName").html("");
        $("#warehousePurchaseEdit #perchaseQuantity").val("");
        inputSelectUtil.clean("#warehousePurchaseEdit #materialName");
    },
    deleteItem : function(rowId) {
        if(!rowId){
            alert("请选择要删除的行");
            return;
        }else{
            var data = $(warehousePurchaseEdit.grid_selector).jqGrid("getRowData", rowId);
            $(warehousePurchaseEdit.grid_selector).jqGrid("delRowData", rowId);
        }
        $.resizeGrid(warehouseMatFacade.grid_selector);
    }
}

$(function() {
    $("#warehousePurchaseEdit #confirmReceive").click(function(){
        warehousePurchaseEdit.confirmPurchase;});
    warehousePurchaseEdit.query();
    inputSelectUtil.init();
});