var deliveryItemFacard = {
    getParams: function(){
        var storePurchaseId = $('#storePurchaseId').val();
        var data = '&id='+ storePurchaseId +'&deliveryTime=' + $('#deliverDate').val();
        var i = 0;
        $('#tb_delivery_item tbody tr').each(function() {
            // 校验发货数量
            var _this = $(this).find("input.deliveryQuantity");
            if (!_this) {
                return true;
            }
            if (!_this.val().match(/^-?\d+$/)) {
                parent.$.dialog.alert('请输入正确的数量', function(){
                    _this.focus();
                });
                return false;
            }
            if (_this.val() < 0) {
                parent.$.dialog.alert('发货数量不能为负数', function(){
                    _this.focus();
                });
                return false;
            }
            data += '&purchaseItemList[' + i + '].id=' + _this.attr('id');
            data += '&purchaseItemList[' + i + '].deliveryQuantity=' + _this.val();

            // 校验发货差异原因
            _this = $(this).find("input.differenceReason");
            var row = _this.closest("tr");
            var quantity = parseInt(row.find(".quantity").text());
            var delivered = row.find(".deliveryQuantity").val();
            var reason = _this.val().trim();
            if (delivered != quantity) {
                var materialName = row.find(".materialName").text();
                if (!reason) {
                    parent.$.dialog.alert(materialName + ': 物料差异原因未填');
                    return false;
                } else if (reason.length > 50) {
                    parent.$.dialog.alert(materialName + ': 物料差异原因过长，请不要超过50字');
                    return false;
                }
                data += '&purchaseItemList[' + i + '].deliveryDifferenceReason=' + _this.val();
            }

            i++;
        });
        
        if(i == 0) {
            parent.$.dialog.alert('未找到待发货的物料');
            return false;
        } else if( i !=  $('#tb_delivery_item tbody tr').size()) {
            return false;
        }
        
        return data;
    },
    save : function() {
        var data = 'action=save';
        var params = deliveryItemFacard.getParams();
        if(!params) {
            return;
        }
        data += params;
        
        var url = '/warehouse/delivery/saveDeliveryItem?nd=' + Math.random();
        $.post(url, data, function(result){
            if(result.code == '000000') {
            	parent.$.dialog({title: '提示',content: '保存成功',icon: 'success.gif', ok : '确定'});
            } else {
                parent.$.dialog.alert(result.message);
            }
        });
    },
    deliver: function(){
        var data = 'action=deliver';
        var params = deliveryItemFacard.getParams();
        if(!params) {
            return;
        }
        data += params;
        parent.$.dialog.confirm('确定要发货吗？', function(){
            var url = '/warehouse/delivery/saveDeliveryItem?nd=' + Math.random();
            $.post(url, data, function(result){
                if(result.code == '000000') {
                    parent.$.dialog({title: '提示',content: '发货成功',icon: 'success.gif', ok : function(){
                        dialog.close();
                        parent.warehouseShipping.unDeliveredList('#needShipping');
                    }});
                } else {
                    parent.$.dialog.alert(result.message);
                }
            });
        });
    }
};

function changeDifferenceReason(reasonSelect) {
    var reasonInput = $(reasonSelect).siblings(".differenceReason");
    var selectedIndex = reasonSelect.options.selectedIndex;
    var size = reasonSelect.options.length;
    if (selectedIndex > 0) {
        reasonInput.val(reasonSelect.options[selectedIndex].value);
    }
    if (selectedIndex == size - 1) {
        reasonInput.show();
    } else {
        reasonInput.hide();
    }
}

$(function() {
    lan_local.format = 'YYYY-MM-DD';
    $('#deliverDate').daterangepicker({
        'singleDatePicker': true,
        'locale': lan_local
    });
    $('#tb_delivery_item input.differenceReason').each(function () {
        var _this = $(this);
        var reason = _this.val();
        var options = _this.siblings("select").get(0).options;
        if (reason) {
            for (var i = 0; i < options.length; i ++) {
                if (i == options.length - 1 || reason == options[i].value) {
                    options.selectedIndex = i;
                    break;
                }
            }
            if (i == options.length - 1) {
                _this.show();
            }
        }
    });
});