var MultiSelectUtil = {
    init : function() {
        $('select[multiple="multiple"]').each(function() {
            var selectObj = $(this);
            var loadOnInit = selectObj.attr("loadOnInit");
            if (typeof loadOnInit !== typeof undefined && loadOnInit != false) {
                var url = selectObj.attr("url");
                $.get(url, {}, function(data) {
                    MultiSelectUtil.initData(selectObj, data);
                    MultiSelectUtil.initMultiselect(selectObj);
                }, 'json');
            } else {
                MultiSelectUtil.initMultiselect(selectObj);
            }
        });
    },
    initData : function(selectObj, data) {
        var idProp = selectObj.attr("idProp") || "id";
        var nameProp = selectObj.attr("nameProp") || "name";
        for (var i = 0; i < data.length; i++) {
            var option = $("<option/>").attr("value", data[i][idProp]).text(data[i][nameProp]);
            selectObj.append(option);
        }
    },
    initMultiselect : function(selectObj) {
        var onSelectChange = selectObj.attr("onSelectChange");
        $.initMultiselect(selectObj, {
            enableFiltering: true,
            numberDisplayed: 2,
            //全选时也触发onchange事件，与api网页的文档不同，所以此处注释掉
            /*onSelectAll: function() {
                if (onSelectChange) {
                    eval(onSelectChange + "()");
                }
            },*/
            onChange: function(option, checked, select) {
                if (onSelectChange) {
                    eval(onSelectChange + "()");
                }
            }
        });
    },
    rebuildMultiselect : function(selectObj) {
        selectObj.multiselect('rebuild');
    }
};