var deliveryItemFacard = {
    getParams: function(){
        var storePurchaseId = $('#storePurchaseId').val();
        var data = '&id='+ storePurchaseId +'&deliveryTime=' + $('#deliverDate').val();
        var i = 0;
        $('#tb_delivery_item input.deliveryQuantity').each(function() {
            var _this = $(this);
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
            data += '&purchaseChildList[' + i + '].id=' + _this.attr('id');
            data += '&purchaseChildList[' + i + '].deliveryQuantity=' + _this.val();
            i++;
        });
        
        if(i == 0) {
            parent.$.dialog.alert('未找到待发货的采购单');
            return false;
        } else if( i !=  $('#tb_delivery_item input.deliveryQuantity').size()) {
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
        
        var url = '/supplier/delivery/saveDelivery?nd=' + Math.random();
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
        parent.$.dialog.confirm('确定要采购吗？', function(){
            var url = '/supplier/delivery/saveDelivery?nd=' + Math.random();
            $.post(url, data, function(result){
                if(result.code == '000000') {
                	parent.$.dialog({title: '提示',content: '采购成功',icon: 'success.gif', ok : function(){
                        dialog.close();
                        parent.supplierShipping.unDeliveredList('#needShipping');
                    }});
                } else {
                    parent.$.dialog.alert(result.message);
                }
            });
        });
    }
}

$(function() {
    lan_local.format = 'YYYY-MM-DD';
    $('#deliverDate').daterangepicker({
        'singleDatePicker' : true,
        'locale' : lan_local
    });
    $(".diffRemark").change(function() {
    	if($(this).find('option:selected').val() == "other") {
    		$(this).parent().find(".remark").show();
    	}else {
    		$(this).parent().find(".remark").hide();
    	}
    });
});