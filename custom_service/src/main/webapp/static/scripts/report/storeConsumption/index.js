var storeConsumption = {
    detailsGrid:null,
    // 加载数据详情
    query : function() {
        var startMonth = $('#startDateHid').val();
        var endMonth = $('#endDateHid').val();
        var storeIdList = $('#storeIdList').val();
        var cityIdList = $('#cityIdList').val();
        var storeType = $('#storeType').val();
        if(startMonth ==''){
            $.dialog.alert("请先选择开始月份!");
            return;
        }
        if(endMonth ==''){
            $.dialog.alert("请先选择结束月份!");
            return;
        }
        var params = {};
        params["startMonth"] = startMonth;
        params["endMonth"] = endMonth;
        if (cityIdList) {
            params["cityIdList"] = cityIdList;
        }
        if (storeIdList) {
            params["storeIdList"] = storeIdList;
        }
        if (storeType && storeType !='') {
            params["storeType"] = storeType;
        }
        var queryString = $.param(params, true);
        var grid_selector = "#store-consumption-data-list";
        var pager_selector = "#store-consumption-data-list-pager";
        if(storeConsumption.detailsGrid) {
            // 根据搜索条件，重新加载
            $(grid_selector).jqGrid('setGridParam',{
                url : "/report/storeConsumption/list?"+queryString,
                page:1
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            storeConsumption.detailsGrid = $(grid_selector).jqGrid({
                url : "/report/storeConsumption/list?"+queryString,
                datatype : 'json',
                mtype : 'GET',
                jsonReader : {
                    root: "data",
                    page: "curPage",
                    total: "totalPage",
                    records: "totalRows"
                },
                prmNames : {page:'curPage',rows:'pageSize', sort: 'sidx',order: 'sort'},
                cmTemplate: {sortable:true},
                colNames : ['门店编码','门店','月份', '差异成本', '差异成本占比', '报废成本', '报废成本占比', '销售成本', '销售成本占比', '盘点成本', '盘点成本占比'],
                // prmNames : {page:'curPage',rows:'pageSize', sort: 'sidx',order: 'sort'},
                colModel : [
                {
                    name : 'storeCode',
                    index : 'storeCode',
                    align:'center',
                    width : 200,
                },
                {
                    name : 'storeName',
                    index : 'storeName',
                    align:'center',
                    width : 200,
                },{
                    name : 'statisticalMonth',
                    index : 'statisticalMonth',
                    align:'center',
                    width : 200,
                }, {
                    name : 'differenceCost',
                    index : 'differenceCost',
                    align : 'center',
                    width : 200,
                }, {
                    name : 'differenceCostProportion',
                    index : 'differenceCostProportion',
                    align : 'center',
                    width : 200,
                }, {
                    name : 'scrapCost',
                    index : 'scrapCost',
                    align : 'center',
                    width : 200,
                }, {
                    name : 'scrapCostProportion',
                    index : 'scrapCostProportion',
                    align : 'center',
                    width : 200,
                }, {
                    name : 'salesCost',
                    index : 'salesCost',
                    align : 'center',
                    width : 200,
                }, {
                    name : 'salesCostProportion',
                    index : 'salesCostProportion',
                    align : 'center',
                    width : 200,
                }, {
                    name : 'inventoryCost',
                    index : 'inventoryCost',
                    align : 'center',
                    width : 200,
                }, {
                    name : 'inventoryCostProportion',
                    index : 'inventoryCostProportion',
                    align : 'center',
                    width : 200,
                }
                ],
                rowNum : 30,
                rowList : [ 10, 30, 50 ],
                pager : pager_selector,
                pagerpos : 'left',
                viewrecords : true,
                height:350,
                autoHeight : true,
                sortable: true,
                loadComplete : function(xhr) {
                    updatePagerIcons(this);
                }
            });
        }
        // 自适应宽度
        // resizeGrid('#data-list', grid_selector, 326);
    }
}