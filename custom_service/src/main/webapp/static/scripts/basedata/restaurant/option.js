/* Restaurant 网店 */
var cityOption = {
    fill : function(id, name) {
        $('#restaurantCityId').attr('idVal',id);
        $('#restaurantCityId').attr('nameVal',name);
    },
    clean : function(id, name) {

    },
    check : function(nodeId) {
        if (!$(nodeId).val() || $(nodeId).val()=='') {
            $(nodeId).removeAttr('nameVal');
            $(nodeId).removeAttr('idVal');
        }
        else if ($(nodeId).attr('nameVal') != $(nodeId).val()) {
            $(nodeId).val($(nodeId).attr('nameVal'));
        }
    }

}
var elemeRestaurantIdOption = {
    fill : function(id, name,jsonStr, nodeId) {
        var obj = eval('(' + jsonStr + ')');
        $(nodeId).attr('idVal',id);
        $('#restaurantName').val(obj.name);
    },
    clean : function(id, name) {
        // $('#restaurantOid').attr('idVal',id);
    },
    check : function(nodeId) {
        if (!$(nodeId).val() || $(nodeId).val()=='') {
            $(nodeId).removeAttr('nameVal');
            $(nodeId).removeAttr('idVal');
        }
        else if ($(nodeId).attr('idVal') != $(nodeId).val()) {
            $(nodeId).val($(nodeId).attr('idVal'));
        }
    }

}
var storeOption = {
    fill : function(id, name, jsonStr, nodeId) {
        $(nodeId).attr('idVal',id);
        $(nodeId).attr('nameVal',name);
    },
    clean : function(id, name) {

    },
    check : function(nodeId) {
        if (!$(nodeId).val() || $(nodeId).val()=='') {
            $(nodeId).removeAttr('nameVal');
            $(nodeId).removeAttr('idVal');
        }
        else if ($(nodeId).attr('nameVal') != $(nodeId).val()) {
            $(nodeId).val($(nodeId).attr('nameVal'));
        }
    }

}
var brandOption = {
    fill : function(id, name, jsonStr, nodeId){
        $(nodeId).attr('idVal',id);
        $(nodeId).attr('nameVal',name);
    },
    // 根据编码，回调清空菜名
    clean : function(nodeId){

    },
    check : function(nodeId) {
        if (!$(nodeId).val() || $(nodeId).val()=='') {
            $(nodeId).removeAttr('nameVal');
            $(nodeId).removeAttr('idVal');
        }
        else if ($(nodeId).attr('nameVal') != $(nodeId).val()) {
            $(nodeId).val($(nodeId).attr('nameVal'));
        }
    }
}