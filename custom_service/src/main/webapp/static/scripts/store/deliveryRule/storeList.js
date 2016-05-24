var storeFacade = {
    detailsGrid: null, // 数据详情
   
    query: function () {
        // 构建 queryString
        var queryString = "";
        //获取城市号
        var cityId = $('#cityId').val();
        //获取门店名称
        var storeName = $('#store_name').val();
        //获取门店编码
        var storeCode = $("#storeCode").val();
        var storeType = $("#storeType  option:selected").val();
        
       
        if (cityId) {
            queryString = 'cityId=' + cityId;
        }
        if (storeCode) {
            queryString = queryString + '&storeCode=' + storeCode;
        }
        if (storeName) {
            queryString = queryString + '&storeName=' + storeName;
        }
        if (storeType) {
            queryString = queryString + '&storeType=' + storeType;
        }
        
        
        var ruleId = $('#ruleId').val(); 
        if (ruleId) {
            queryString = queryString + '&ruleId=' + ruleId;
        }
        // 加载详情
        storeFacade.loadDetails(queryString);
    },
    // 加载数据详情
    loadDetails: function (params) {
        var _this = this;
        var grid_selector = "#store_table_data_list";
        var pager_selector = "#store_table_data_list_pager";
        var url = '/store/deliveryRule/getStoreList';

        if (_this.detailsGrid) {
            // 根据搜索条件，重新加载
            $(grid_selector).jqGrid('setGridParam', {
                url: url + '?' + params,
                page: 1,
                datatype: 'json',
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url: url + '?' + params,
                type: 'post',
                datatype: 'json',
                colNames: ['门店Id','门店编码', '门店名称', '门店类型', '所在城市', '门店地址'],
                jsonReader: {
                    root: "data",
                    page: "curPage",
                    total: "totalPage",
                    records: "totalRows"
                },
                multiselect:true,
                prmNames: {page: 'curPage', rows: 'pageSize', sort: 'sidx', order: 'sort'},
                cmTemplate: {sortable:true},
                colModel: [{
                    name: 'id',
                    align: 'center',
                    width: 40
                }, {
                    name: 'storeCode',
                    align: 'center',
                    width: 40
                }, {
                    name: 'storeName',
                    width: 100
                }, {
                    name: 'storeType',
                    width: 40,
                    align: 'center',
                    formatter: function (storeType) {
                        var map = {1:'自营', 2:'联营', 3:'商超'};
                        return map[storeType];
                    }
                }, {
                    name: 'cityName',
                    align: 'center',
                    width: 50
                }, {
                    name: 'address',
                    width: 180
                }],
                rowNum: 200,
                rowList: [50,100,200,500],
                pager: pager_selector,
                pagerpos: 'left',
                height: 341,
                viewrecords: true,
                autoHeight: true,
                loadComplete: function (result) {
                    var table = this;
                    
                    var rowIds = jQuery("#store_table_data_list").jqGrid('getDataIDs');
                    
                    for(var k=0; k<rowIds.length; k++) {
                        var curChk = $("#"+rowIds[k]+"").find(":checkbox");
                        var curRowData = jQuery("#store_table_data_list").jqGrid('getRowData', rowIds[k]);
                        curChk.attr('value', curRowData['id']); 
                        curChk.attr('name', "sdlist["+k+"].storeId");  
                    }
                    
                    $.authenticate();
                    setTimeout(function () {
                    	$.removeScrollX('#data-list');
                    	updatePagerIcons(table);
                    }, 0);
                }
            });
        }
        // 自适应宽度
        $.resizeGrid(grid_selector);
    },
    //unValidStore: function (storeId, storeName) {
    //    $.dialog({
    //        lock: true,
    //        content: '是否确认禁用该门店信息？"' + storeName + '"？',
    //        width: 200,
    //        height: 100,
    //        drag: false,
    //        resize: false,
    //        icon: 'alert.gif',
    //        ok: function () {
    //            $.ajax({
    //                type: 'get',
    //                url: '/store/unValid',
    //                data: {
    //                    'id': storeId
    //                },
    //                dataType: "text",
    //                success: function (data) {
    //                    if (data == 'exitRestaurant') {
    //                        $.dialog({title: '提示', content: '该门店有网店使用中，不能禁用', icon: 'alert.gif', ok: '确定'});
    //                    }
    //                    storeFacade.query();
    //                },
    //                error: function (msg) {
    //                    $.dialog({title: '提示', content: msg.responseText, icon: 'alert.gif', ok: '确定'});
    //                }
    //            });
    //            return true;
    //        },
    //        cancel: true
    //    });
    //},
    //validStore: function (storeId, storeName) {
    //    $.dialog({
    //        lock: true,
    //        content: '是否确认启用该门店信息？"' + storeName + '"？',
    //        width: 200,
    //        height: 100,
    //        drag: false,
    //        resize: false,
    //        icon: 'alert.gif',
    //        ok: function () {
    //            $.ajax({
    //                type: 'get',
    //                url: '/store/valid',
    //                data: {
    //                    'id': storeId
    //                },
    //                dataType: "text",
    //                success: function (data) {
    //                    storeFacade.query();
    //                },
    //                error: function (msg) {
    //                    $.dialog({title: '提示', content: msg.responseText, icon: 'alert.gif', ok: '确定'});
    //                }
    //            });
    //            return true;
    //        },
    //        cancel: true
    //    });
    //},
    updateStore: function (storeId) {
        edit("/store/toUpdate?id=" + storeId, "门店修改", 400, 300, false);
    },
    addStore: function () {
        edit("/store/toAdd", "添加门店", 400, 300, false);
    },
    toFixedCost: function (storeId) {
        edit("/store/fixedCost?storeId=" + storeId, "门店固定费用", 840, 480, false);
    },
    toStoreDetail: function (storeId) {
        edit("/store/storeDetail?storeId=" + storeId, "门店信息", 400, 300, false);
    },
    cityBlur: function (id) {
        if (!$.trim($("#cityId").val())) {
            $(id).val('');
            inputSelectUtil.clean(id);
        }
        ;
    }
};
$(function () {
    storeFacade.query();
    $("#store_searchBtn").click(storeFacade.query);
    $("#store_addBtn").click(storeFacade.addStore);
    $('#store_exportStatusBtn').click(storeFacade.exportStatus);
    //初始化可输入下拉框
    inputSelectUtil.init().load("#cityName");
    //storeFacade.loadDetails()

});

//城市下拉框响应函数
function loadStoreCity(id, code,jsonStr) {
    var obj = eval("(" + jsonStr + ")");
    var supplierName = obj.name;
    var cityId = obj.code;
    $("#name").val(supplierName);
    $("#cityId").val(cityId);
}
//清除城市
function cleanStoreCity() {
    $("#name").val("");
    $("#cityId").val("");
}
//门店编码下拉框响应函数
function loadStoreByStoreCode(id, code, jsonStr) {
    var obj = eval("(" + jsonStr + ")");
    $("#storeCode").val(obj.name);
    $("#storeC").val(obj.name);
    $("#store_name").val(obj.storeName);
}
function cleanStoreCode() {
    $("#storeC").val();
}