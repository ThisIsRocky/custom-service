var supplierPurchaseItem = {
    // 加载数据详情
    confirmPurchase : function() {
        
        if($("#supplierPurchase #supplierId").val() == null || $("#supplierPurchase #supplierId").val() ==''){
            $.dialog.alert('请选择供应商！');
            return false;
        }
        
        var data = "&providerId=" +$("#supplierPurchase #supplierId").val() + "&providerName=" 
            +$.trim($("#supplierPurchase #supplierId").find('option:selected').text()) +"&nd="+ Math.random();
        var items = $("#supplierPurchase .purchaseQuantity");
        var receiverDate = $("#supplierPurchase .receiverDate");
        
        if(items == null || items.length <= 0){
            $.dialog.alert('配送规则没有可选配送日期，请先添加！');
            return false;
        }
        for (var i = 0; i < items.length; i++) {
            if (!$(items[i]).val() || $.trim($(items[i]).val()) == ''
                    || isNaN($(items[i]).val()) || $(items[i]).val() < 0) {
                $(items[i]).css('border-color', 'red');
                $(items[i]).focus();
                $.dialog.alert('第' + (i + 1) + '列份数必须大于等于0');
                return false;
            } else if (parseInt($(items[i]).val()) != $(items[i]).val()) {
                $(items[i]).css('border-color', 'red');
                $(items[i]).focus();
                $.dialog.alert('第' + (i + 1) + '列数量非整数');
                return false;
            } else {
                $(items[i]).css('border-color', '');
                data += '&purchaseChildList[' + i + '].expectReceiveDate=' + $.trim($(receiverDate[i]).html());
                data += '&purchaseChildList[' + i + '].quantity=' + $(items[i]).val();
            }
        }
        $.post('/store/purchase/supplier/save', data, function(result) {
            if (result.code == "000000") {
            	$.dialog({title: '提示',content: '采购单订购成功',icon: 'success.gif', ok : '确定'});
                $(".receiverDate").val();
                for (var i = 0; i < items.length; i++) {
                    $(items[i]).val("");
                }
            } else {
                $.dialog.alert(result.message);
            }
        }, 'json');
    },
    changeDateItem : function(materialId) {
        //<td class="center"><input class=".purchaseQuantity">
        $("#expectDateTrId").html("");
        $("#querytityTrId").html("");
        var expectReceiveDateStr  = ($("#supplierPurchase #expectReceiveDate").val()).replace(/\[|\]/g,'');
        var expectDateHtml = '<th class="center">配送日期</th>';
        var querytityHtml = '<td class="center">预订份数</td>';
        $.each(expectReceiveDateStr.split(','), function(key, value) { 
            expectDateHtml += '<th class="center receiverDate" >'+ value +'</th>';
            querytityHtml += '<td class="center"><input class="purchaseQuantity"></td>';
         }); 
        $("#expectDateTrId").append(expectDateHtml);
        $("#querytityTrId").append(querytityHtml);
    },
    changeSupplierItem : function(materialId) {
        var param = "&supplierId=" +$("#supplierPurchase #supplierId").val() + "&nd="+ Math.random();
        $("#supplierPurchase #expectReceiveDate").html("");
        $.post('/store/purchase/supplier/findPurchaseRule', param, function(data) {
            
            if(data && data.code =='000000') {
                var dateHtml = "";
                result = data.data;
                if (result != null && result.length > 0) {
                    $.each(result, function(key, value) { 
                        dateHtml += '<option value="'+ value.dateList +'">'+value.desc +'</option>';
                    });
                    $("#supplierPurchase #expectDateId").show();
                    $("#supplierPurchase #noRuleWarnId").hide();
                    $("#supplierPurchase #expectReceiveDate").html(dateHtml);
                    supplierPurchaseItem.changeDateItem();
                    
                } else {
                    $("#supplierPurchase #expectDateId").hide();
                    $("#supplierPurchase #noRuleWarnId").show();
                }
            } else {
                $("#supplierPurchase #expectDateId").hide();
                $("#supplierPurchase #noRuleWarnId").html(data.message).show();
            }
        }, 'json');
    }
}

$(function() {
    $("#supplierPurchase #supplierId").change(function(){
        supplierPurchaseItem.changeSupplierItem();
  })
    $("#supplierPurchase #expectReceiveDate").change(function(){
        supplierPurchaseItem.changeDateItem();
      })
    $("#supplierPurchase #btn_supplier_purchase").click(function(){
            supplierPurchaseItem.confirmPurchase();
      });
});