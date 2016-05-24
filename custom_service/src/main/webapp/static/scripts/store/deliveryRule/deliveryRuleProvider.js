var deliveryRuleProvider = {
    insertWarehouse : function() {
        var row = $('<tr>');
        
        var selector = $('<input/>');
        
        var name = $('<td/>');
        var type = $('<td/>');
        var city = $('<td/>');
        var cancel = $('<a href="#"/>').html('删除 ');
        var saveBtn = $('<button class="btn btn-minier btn-white btn-info btn-bold"><i class="ace-icon fa fa-floppy-o bigger-120 blue"></i>保存 </button>');
        row.append($('<td/>').append(selector)).append(name).append(type).append(city).append($('<td>').append(cancel).append(saveBtn));
        $('#tb_rule_provider tbody').append(row);
        
        // 自动选择
        selector.autocomplete({
            autoFocus: true,
            source: function( request, response) {
                $.get('/store/deliveryRule/searchWarehouse',{code: request.term}, function(data){
                    response($.map(data, function(item) {
                        return {
                            label: item.code + " - " + item.name,
                            value: item.code,
                            data: item
                        }
                    }));
                });
            },
            select: function( event, ui ) {
                name.html(ui.item.data.name);
                type.html(ui.item.data.type==10?'大仓':'小仓');
                city.html(ui.item.data.cityName);
                selector.data('id', ui.item.data.id);
            }
        });
        // 保存
        saveBtn.click(function(){
            var url = '/store/deliveryRule/saveRuleProvider';
            $.post(url, {ruleId: $('#ruleId').val(), warehouseId: selector.data('id'), providerType: $('#providerType').val()}, function(result){
                if(result.code != '000000') {
                    deliveryRuleProvider.showError('保存失败，原因：' + result.message);
                } else {
                    location.reload();
                }
            })
        });
        // 删除
        cancel.click(function(){
            row.remove();
        });
    },
    insertSupplier : function() {
        var row = $('<tr>');
        
        var selector = $('<input/>');
        
        var name = $('<td/>');
        var type = $('<td/>');
        var city = $('<td/>');
        var cancel = $('<a href="#"/>').html('删除 ');
        var saveBtn = $('<button class="btn btn-minier btn-white btn-info btn-bold"><i class="ace-icon fa fa-floppy-o bigger-120 blue"></i>保存 </button>');
        row.append($('<td/>').append(selector)).append(name).append(type).append(city).append($('<td>').append(cancel).append(saveBtn));
        $('#tb_rule_provider tbody').append(row);
        
        // 自动选择
        selector.autocomplete({
            autoFocus: true,
            source: function( request, response) {
                $.get('/store/deliveryRule/searchSupplier',{code: request.term}, function(data){
                    response($.map(data, function(item) {
                        return {
                            label: item.code + " - " + item.name,
                            value: item.code,
                            data: item
                        }
                    }));
                });
            },
            select: function( event, ui ) {
                name.html(ui.item.data.name);
                
                
                type.html((ui.item.data.isSupplyStore?'供应门店': '') + (ui.item.data.isSupplyWarehouse?' 供应仓库': ''));
                city.html(ui.item.data.cityName);
                selector.data('id', ui.item.data.id);
            }
        });
        // 保存
        saveBtn.click(function(){
            var url = '/store/deliveryRule/saveRuleProvider';
            $.post(url, {ruleId: $('#ruleId').val(), supplierId: selector.data('id'), providerType: $('#providerType').val()}, function(result){
                if(result.code != '000000') {
                    deliveryRuleProvider.showError('保存失败，原因：' + result.message);
                } else {
                    location.reload();
                }
            })
        });
        // 删除
        cancel.click(function(){
            row.remove();
        });
    },
    remove: function(id){
        parent.$.dialog.confirm('确定要删除吗？', function(){
            var url = '/store/deliveryRule/deleteRuleProvider';
            $.post(url, {id: id}, function(result){
                if(result.code != '000000') {
                    deliveryRuleProvider.showError('删除失败，原因：' + result.message);
                } else {
                    location.reload();
                }
            })
        });
    },
    showError: function(msg) {
        $('#warning').show();
        $('#warning font').html(msg);
    },
    hideError: function(){
        
    }
}