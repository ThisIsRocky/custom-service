var foodOnNapos = {
    deliveredGrid: null,
    getQueryString : function() {
        var queryString = 'rd=' + Math.random();
        queryString += '&foodId=' + $('#foodId').val();
        return queryString;
    },
    getDataList : function() {
        var queryString = foodOnNapos.getQueryString();
        var _this = this;
        var grid_selector = "#table-data-list";
        var pager_selector = "#table-data-list-pager";
        var url = '/food/onNapos/findByFoodId?' + queryString;
        if (_this.detailsGrid) {
            // 根据搜索条件，重新加载
            $(grid_selector).jqGrid('setGridParam', {
                url : url,
                page : 1,
                forceFit : true,
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : url,
                datatype : 'json',
                jsonReader : {
                    root : "data",
                    page : "curPage",
                    total : "totalPage",
                    records : "totalRows"
                },
                prmNames : {
                    page : 'curPage',
                    rows : 'pageSize',
                    sort : 'sidx',
                    order : 'sort'
                },
                colNames : [ '城市', '餐厅编码', '餐厅名称', '品牌', '对应门店编码', '对应门店', 'napos名称', 'naposFoodId'],
                cmTemplate: {sortable:false},
                colModel : [ {
                    name : 'cityName',
                    width : 50
                }, {
                    name : 'elemeRestaurantId',
                    align : 'center',
                    width : 50
                }, {
                    name : 'elemeRestaurantName',
                    width : 120
                }, {
                    name : 'brandName',
                    align : 'center',
                    width : 50
                }, {
                    name : 'storeCode',
                    align : 'center',
                    width : 60
                }, {
                    name : 'storeName',
                    width : 120
                }, {
                    name : 'naposFoodName',
                    width : 150
                }, {
                    name : 'foodOid',
                    hidden : true,
                    key: true
                }],
                rowNum : 10,
                rowList : [ 10, 20, 30 ],
                pager : pager_selector,
                height : 300,
                autoHeight : true,
                viewrecords : true,
                loadComplete : function() {
                    var table = this;
                    setTimeout(function() {
                        updatePagerIcons(table);
                        $.removeScrollX($('#data-list'));
                    }, 0);
                }
            });
        }
        // 自适应宽度
        $.resizeGrid(grid_selector);
    }
}
$(function() {
    foodOnNapos.getDataList();
});