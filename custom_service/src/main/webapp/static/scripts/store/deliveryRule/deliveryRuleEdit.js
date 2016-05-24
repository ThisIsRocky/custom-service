var deliveryRuleEditor = {
    saveRule: function(){
        var id = $('#id').val();
        var ruleName = $('#ruleName').val();
        if(!ruleName) {
            parent.$.dialog.alert('请输入规则名称');
            return false;
        }
        var providerType = $('#providerType').val();
        var beforeTime = $('#beforeTime').val();
        if (!beforeTime.match(/^-?\d+$/)) {
            parent.$.dialog.alert('请输入正确的提前预定天数');
            return false;
        }
        if( beforeTime < 1) {
            parent.$.dialog.alert('请至少提前1天');
            return false;
        }

        var beforeTimeUnit = $('#beforeTimeUnit').val();
        var deliverNum = 1;
        var deliverNumUnit = $('#deliverNumUnit').val();
        var weekDays = '';
        var dateType = $('#dateType').val();
        if(providerType == 1) {
            $('input[name="weekDays"]').each(function(){
                var _dateType = $(this).attr('dateType');
                if(dateType == _dateType){
                    var _this = $(this);
                    if(_this.is(':checked')) {
                        weekDays += (weekDays?',':'') + _this.val();
                    }
                }
            });
            if(!weekDays){
                parent.$.dialog.alert('请选择配送日期');
                return false;
            }
        }
       
        
        var url = '/store/deliveryRule/save';
        var data = 'id=' + id + '&ruleName=' + ruleName + '&providerType=' + providerType + '&beforeTime=' + beforeTime 
            + '&beforeTimeUnit=' + beforeTimeUnit ;
        
        if(dateType != undefined) {
            data +=  '&dateType=' + dateType;
        }
        if(deliverNumUnit) {
            data +=  '&deliverNum=' + deliverNum;
            data +=  '&deliverNumUnit=' + deliverNumUnit;
        }
        if(weekDays) {
            data +=  '&weekDays=' + weekDays;
        }
        
        
        if(providerType==1){
            //
            var categoryId = $('#categoryId').val();
            if(!categoryId){
                parent.$.dialog.alert('请选择物料分类');
                return false;
            }
            if(categoryId) {
                data +=  '&categoryId=' + categoryId;
            }
        }
        
        $.post(url, data, function(result){
            if(result.code == '000000') {
            	parent.$.dialog({title: '提示',content: '保存成功',icon: 'success.gif', ok : '确定'});
                dialog.close();
                parent.deliveryRule.loadRuleList();
            } else {
                parent.$.dialog.alert(result.message);
            }
        });
    }
}

$(function(){
    
    $.initMultiselect($('#categoryId'));
   // MultiSelectUtil.init();
    var id = $('#id').val();
    $('#dateType').change(function(){
        if($(this).val()==4){
            $('#monthDate').css('display','block');
            
            $('#weekDate ').hide();
            $('#weekDate').hide();
            $('#monthDate').show();
        }
        if($(this).val()==3){
            $('#monthDate').hide();
            $('#weekDate').show();
        }
        
    })
})