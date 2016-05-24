var stockReportFacade = {
    detailsGrid: null, // 数据详情
    url : '/report/storeStock/list',
    query : function() {
        var queryString = stockReportFacade.getParams();
        if(!queryString) {
        	return false;
        }
        $('#data-list').show();
        // 加载详情
        stockReportFacade.loadDetails(queryString);
    },
    getParams : function() {
        return $("form").serialize();
    },
    // 加载数据详情
    loadDetails : function(params) {
        var _this = this;
        var grid_selector = "#table-data-list";
        var pager_selector = "#table-data-list-pager";
        if(_this.detailsGrid) {
            // 根据搜索条件，重新加载
            $(grid_selector).jqGrid('setGridParam',{
                url : stockReportFacade.url+'?'+params,
                page:1 
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : stockReportFacade.url+'?'+params,
                datatype : 'json',
                colNames : [ '城市', '门店编码', '门店名称', '物料编号' , '物料名称' , '单位', '规格', '库存'],
                jsonReader : {  
                    root: "data",  
                    page: "curPage",  
                    total: "totalPage",  
                    records: "totalRows"
                },
                prmNames : {page:'curPage',rows:'pageSize', sort: 'sidx',order: 'sort'},
                cmTemplate: {sortable:true},
                colModel : [ {
                    name : 'cityName',
                    width : 80
                }, {
                    name : 'storeCode',
                    width : 80
                },{
                    name : 'storeName',
                    width : 80
                }, {
                    name : 'materialCode',
                    width : 100
                }, {
                    name : 'materialName',
                    width : 100
                }, {
                    name : 'unitName',
                    align:'right',
                    width : 100
                }, {
                    name : 'standard',
                    width : 100
                }, {
                    name : 'totalNum',
                    align:'right',
                    width : 100
                }],
                rowNum : 30,
                pager : pager_selector,
                pagerpos : 'left',
                height : 350,
                viewrecords : true,
                autoHeight : true,
                loadComplete : function() {
                    var table = this;
                    setTimeout(function() {
                        updatePagerIcons(table);
                        $.removeScrollX('#data-list');
                        $.authenticate();
                    }, 0);
                }
            });
        }
        // 自适应宽度
        $.resizeGrid(grid_selector);
    },
    fillMaterial : function(id, name, jsonStr) {
        var obj = eval('(' + jsonStr + ')');
        $("#materialId").val(obj.id);

    },
    cleanParam : function() {
    	inputSelectUtil.clean("#storeId");
    },
    clearMaterialId: function(){
        $('#materialId').val('');
    },
    exportList : function() {
    	//校验城市和门店、门店类型
    	if($("#cityIdList option:selected").length == 0) {
    		alert("请选择城市");
    		return false;
    	}
    	if(!$("#storeType option:selected").val()) {
    		alert("请选择门店类型");
    		return false;
    	}
        if($('#downloadIfm').attr('src')) {
            $('#downloadIfm').attr('');
        }
        var queryString = stockReportFacade.getParams();
        if(!queryString) {
        	return false;
        }
        $('#downloadIfm').attr('src', "/report/storeStock/export?" + queryString);
    },
}

$(function() {
    MultiSelectUtil.init();
    $("#searchBtn").click(stockReportFacade.query);
    $("#exportBtn").click(stockReportFacade.exportList);
});