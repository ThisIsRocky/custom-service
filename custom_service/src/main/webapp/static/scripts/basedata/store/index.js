var storeFacade = {
    detailsGrid: null, // 数据详情
    
    exportStatus: function() {
    	 // 构建 queryString
        var queryString = "";
        //获取城市号
        var cityId = $('#cityId').val();
        //获取门店名称
        var storeName = $('#store_name').val();
        //获取门店编码
        var storeCode = $("#storeCode").val();

        var storeType = $("#storeType  option:selected").val();
        
        var businessStatus = $('#businessStatus option:selected').val();

        var closedExplain = $('#closedExplain option:selected').val();

        var businessLicenceType = $('#businessLicenceType option:selected').val();

        var environmentEvaluationType = $('#environmentEvaluationType option:selected').val();

        var foodBusinessLicenceType = $('#foodBusinessLicenceType option:selected').val();
        
        var governmentOversightStatus = $('#governmentOversightStatus option:selected').val();
        
        var constructionStatus = $('#constructionStatus option:selected').val();

        var remouldStatus = $('#remouldStatus option:selected').val();

        var constructionVersion = $('#constructionVersion option:selected').val();

        var expandStatus = $('#expandStatus option:selected').val();

        var backRentStatus = $('#backRentStatus option:selected').val();

        var reletStatus = $('#reletStatus option:selected').val();
        
        var supplementingCapacityStatus = $('#supplementingCapacityStatus option:selected').val();

        var disinfectionStatus = $('#disinfectionStatus option:selected').val();

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
        if (businessStatus) {
        	queryString = queryString + '&businessStatus=' + businessStatus;
        }
        if (closedExplain) {
        	queryString = queryString + '&closedExplain=' + closedExplain;
        }
        if (businessLicenceType) {
        	queryString = queryString + '&businessLicenceType=' + businessLicenceType;
        }

        if (environmentEvaluationType) {
        	queryString = queryString + '&environmentEvaluationType=' + environmentEvaluationType;
        }

        if (foodBusinessLicenceType) {
        	queryString = queryString + '&foodBusinessLicenceType=' + foodBusinessLicenceType;
        }

        if (governmentOversightStatus) {
        	queryString = queryString + '&governmentOversightStatus=' + governmentOversightStatus;
        }

        if (constructionStatus) {
        	queryString = queryString + '&constructionStatus=' + constructionStatus;
        }

        if (remouldStatus) {
        	queryString = queryString + '&remouldStatus=' + remouldStatus;
        }

        if (constructionVersion) {
        	queryString = queryString + '&constructionVersion=' + constructionVersion;
        }

        if (expandStatus) {
        	queryString = queryString + '&expandStatus=' + expandStatus;
        }

        if (backRentStatus) {
        	queryString = queryString + '&backRentStatus=' + backRentStatus;
        }

        if (reletStatus) {
        	queryString = queryString + '&reletStatus=' + reletStatus;
        }

        if (supplementingCapacityStatus) {
        	queryString = queryString + '&supplementingCapacityStatus=' + supplementingCapacityStatus;
        }

        if (disinfectionStatus) {
            queryString = queryString + '&disinfectionStatus=' + disinfectionStatus;
        }

    	var url = '/store/exportStatus?' + queryString;
        if($('#downloadIfm').attr('src')) {
            $('#downloadIfm').attr('');
        }
        $('#downloadIfm').attr('src', url);
    },
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
        
        var businessStatus = $('#businessStatus option:selected').val();

        var closedExplain = $('#closedExplain option:selected').val();

        var businessLicenceType = $('#businessLicenceType option:selected').val();

        var environmentEvaluationType = $('#environmentEvaluationType option:selected').val();

        var foodBusinessLicenceType = $('#foodBusinessLicenceType option:selected').val();
        
        var governmentOversightStatus = $('#governmentOversightStatus option:selected').val();
        
        var constructionStatus = $('#constructionStatus option:selected').val();

        var remouldStatus = $('#remouldStatus option:selected').val();

        var constructionVersion = $('#constructionVersion option:selected').val();

        var expandStatus = $('#expandStatus option:selected').val();

        var backRentStatus = $('#backRentStatus option:selected').val();

        var reletStatus = $('#reletStatus option:selected').val();
        
        var supplementingCapacityStatus = $('#supplementingCapacityStatus option:selected').val();

        var disinfectionStatus = $('#disinfectionStatus option:selected').val();

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
        if (businessStatus) {
        	queryString = queryString + '&businessStatus=' + businessStatus;
        }
        if (closedExplain) {
        	queryString = queryString + '&closedExplain=' + closedExplain;
        }
        if (businessLicenceType) {
        	queryString = queryString + '&businessLicenceType=' + businessLicenceType;
        }

        if (environmentEvaluationType) {
        	queryString = queryString + '&environmentEvaluationType=' + environmentEvaluationType;
        }

        if (foodBusinessLicenceType) {
        	queryString = queryString + '&foodBusinessLicenceType=' + foodBusinessLicenceType;
        }

        if (governmentOversightStatus) {
        	queryString = queryString + '&governmentOversightStatus=' + governmentOversightStatus;
        }

        if (constructionStatus) {
        	queryString = queryString + '&constructionStatus=' + constructionStatus;
        }

        if (remouldStatus) {
        	queryString = queryString + '&remouldStatus=' + remouldStatus;
        }

        if (constructionVersion) {
        	queryString = queryString + '&constructionVersion=' + constructionVersion;
        }

        if (expandStatus) {
        	queryString = queryString + '&expandStatus=' + expandStatus;
        }

        if (backRentStatus) {
        	queryString = queryString + '&backRentStatus=' + backRentStatus;
        }

        if (reletStatus) {
        	queryString = queryString + '&reletStatus=' + reletStatus;
        }

        if (supplementingCapacityStatus) {
        	queryString = queryString + '&supplementingCapacityStatus=' + supplementingCapacityStatus;
        }

        if (disinfectionStatus) {
            queryString = queryString + '&disinfectionStatus=' + disinfectionStatus;
        }
        
        // 加载详情
        storeFacade.loadDetails(queryString);
    },
    // 加载数据详情
    loadDetails: function (params) {
        var _this = this;
        var grid_selector = "#store_table_data_list";
        var pager_selector = "#store_table_data_list_pager";
        var url = '/store/list';

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
                colNames: ['门店编码', '门店名称', '门店类型', '所在城市', '地址', '联系人', '联系电话', '操作列'],
                jsonReader: {
                    root: "data",
                    page: "curPage",
                    total: "totalPage",
                    records: "totalRows"
                },
                prmNames: {page: 'curPage', rows: 'pageSize', sort: 'sidx', order: 'sort'},
                cmTemplate: {sortable:true},
                colModel: [{
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
                }, {
                    name: 'contact',
                    align: 'center',
                    width: 60
                }, {
                    name: 'contactPhone',
                    width: 60,
                    align: 'center',
                }, {
                    name: '',
                    sortable: false,
                    width: 150,
                    align: 'center',
                    formatter: function (cellvalue, options, rowObject) {
                        var retVal = '<button class="btn btn-minier btn-white btn-default btn-bold zs-auth" permission="/store/toUpdate" onclick="storeFacade.updateStore(' + rowObject.id + ');"><i class="ace-icon fa fa-pencil-square-o blue"></i>修改</button>';
                        //if (rowObject.isValid == 1) {
                        //    retVal += ' <button class="btn btn-minier btn-white btn-default btn-bold zs-auth"permission="/store/unValid" onclick="storeFacade.unValidStore(' + rowObject.id + ',\'' + rowObject.storeName + '\');"><i class="ace-icon fa fa-wrench green"></i>禁用</button>';
                        //} else {
                        //    retVal += ' <button class="btn btn-minier btn-white btn-default btn-bold zs-auth" permission="/store/valid" onclick="storeFacade.validStore(' + rowObject.id + ',\'' + rowObject.storeName + '\');"><i class="ace-icon fa fa-wrench green"></i>启用</button>';
                        //}
                        retVal += ' <button class="btn btn-minier btn-white btn-default btn-bold zs-auth" permission="/store/toStoreDetail" onclick="storeFacade.toStoreDetail(' + rowObject.id + ',\'' + rowObject.storeName + '\');"><i class="ace-icon fa fa-wrench green"></i>门店</button>';
                        retVal += ' <button class="btn btn-minier btn-white btn-default btn-bold zs-auth" permission="/store/fixedCost" onclick="storeFacade.toFixedCost(' + rowObject.id + ',\'' + rowObject.storeName + '\');"><i class="ace-icon fa fa-wrench green"></i>固定费用</button>';
                        retVal += '<br><a class="zs-auth btn btn-mini btn-white btn-default btn-bold fa fa-group btn-role" permission="/store/toStoreLicence" href="javascript:void(0);" onclick="$.showCommonEditDialog(\'/store/toStoreLicence?storeId='+rowObject.id+'\',\'门店证照信息\',850,600);">政府</a>';
                        retVal += '<a class="zs-auth btn btn-mini btn-white btn-default btn-bold fa fa-group btn-role" permission="/store/toStoreConstruction" href="javascript:void(0);" onclick="$.showCommonEditDialog(\'/store/toStoreConstruction?storeId='+rowObject.id+'\',\'营建信息\',800,600);">营建</a>';
                        retVal += '<a class="zs-auth btn btn-mini btn-white btn-default btn-bold fa fa-group btn-role" permission="/store/toStoreExpand" href="javascript:void(0);" onclick="$.showCommonEditDialog(\'/store/toStoreExpand?storeId='+rowObject.id+'\',\'拓展信息\',800,600);">拓展</a>';
                        retVal += '<a class="zs-auth btn btn-mini btn-white btn-default btn-bold fa fa-group btn-role" permission="/store/toStoreFoodSafety" href="javascript:void(0);" onclick="$.showCommonEditDialog(\'/store/toStoreFoodSafety?storeId='+rowObject.id+'\',\'食品安全\',800,600);">食品安全</a>';
                        return retVal;
                    }
                }],
                rowNum: 10,
                rowList: [10, 20, 50],
                pager: pager_selector,
                pagerpos: 'left',
                height: 341,
                viewrecords: true,
                autoHeight: true,
                loadComplete: function (result) {
                    var table = this;
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
    $("#store_searchBtn").click(storeFacade.query);
    $("#store_addBtn").click(storeFacade.addStore);
    $('#store_exportStatusBtn').click(storeFacade.exportStatus);
    //初始化可输入下拉框
    inputSelectUtil.init().load("#cityName");
    storeFacade.loadDetails()

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