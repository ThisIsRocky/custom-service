var inventoryTemplate = {
    grid_selector : "#table-data-list",
    pager_selector : "#table-data-list-pager",
    url : '/store/inventoryTemplate/getList',
    detailsGrid: null, // 数据详情
    getQueryString : function() {
        var cityId = $('#city').val();
        var storeType = $('#storeType').val();
        var queryString = '?rd=' + Math.random();
        if(cityId) {
            queryString += '&cityId=' + cityId;
        }
        if(storeType) {
            queryString += '&type=' + storeType;
        }
        return queryString;
    },
    // 加载数据详情
    query : function(params) {
        $('#data-list').show();
        var _this = this;
        var url = inventoryTemplate.url + _this.getQueryString();
        
        if (_this.detailsGrid) {
            // 根据搜索条件，重新加载
            $(inventoryTemplate.grid_selector).jqGrid('setGridParam', {
                url : url,
                page : 1,
                forceFit : true,
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(inventoryTemplate.grid_selector).jqGrid({
                url : url,
                datatype : 'json',
                colNames : [ '模版编码', '模版名称' ,'适用门店','适用城市','模版状态', '操作列'],
                jsonReader : {  
                    root: "data",  
                    page: "curPage",  
                    total: "totalPage",  
                    records: "totalRows"
                },
                cmTemplate: {sortable:true},
                prmNames : {page:'curPage',rows:'pageSize', sort: 'sidx',order: 'sort'},
                colModel : [ {
                    name : 'code',
                    width : 100
                }, {
                    name : 'name',
                    width : 100
                }, {
                    name : 'typeName',
                    width : 100,
                    
                },{
                    name : 'cityName',
                    width : 100,
                    
                },{
                    name : 'statusName',
                    width : 100,
                    align : 'center'
                    
                },{
                    name : '',
                    width : 100,
                    align : 'center',
                    formatter : function(cellvalue, options, rowObject) {
                        var status  = rowObject.status;
                        var retVal ="";
                        if(status == 20){
                            retVal += ' <button  onclick="viewTemplate('+rowObject.id +')"  class="btn btn-minier btn-white btn-default btn-bold zs-auth "  permission="/store/inventoryTemplate/toEdit" ><i class="ace-icon fa fa-pencil-square-o blue"></i>查看</button>';
                        }else{
                            retVal += ' <button  onclick="editTemplate('+rowObject.id +')"  class="btn btn-minier btn-white btn-default btn-bold zs-auth "  permission="/store/inventoryTemplate/toEdit" ><i class="ace-icon fa fa-pencil-square-o blue"></i>修改</button>';
                            retVal += ' <button  onclick="deleteTemplate('+rowObject.id +')" class="btn btn-minier btn-white btn-warning btn-bold zs-auth " permission="/store/inventoryTemplate/delete" ><i class="ace-icon fa fa-trash-o bigger-120 orange"></i>删除</button>';
                            retVal += ' <button  onclick="discardTemplate('+rowObject.id +')" class="btn btn-minier btn-white btn-warning btn-bold zs-auth " permission="/store/inventoryTemplate/discard" ><i class="ace-icon fa fa-trash-o bigger-120 orange"></i>废弃</button>';
                        }
                        return retVal;
                    }
                }],
                rowNum : 10,
                rowList : [ 10, 20, 50],
                pager : inventoryTemplate.pager_selector,
                pagerpos : 'left',
                height : 'auto',
                viewrecords : true,
                autoHeight : true,
                loadComplete : function() {
                    var table = this;
                    setTimeout(function() {
                        updatePagerIcons(table);
                        $.removeScrollX('#data-list');
                    }, 0);
                    $.authenticate();
                }
            });
        }
        // 自适应宽度
        $.resizeGrid(inventoryTemplate.grid_selector);
    },
    reload : function() {
        if(inventoryTemplate.detailsGrid) {
            // 根据搜索条件，重新加载
            $(inventoryTemplate.grid_selector).jqGrid('setGridParam',{
                url : inventoryTemplate.url,
            }).trigger("reloadGrid");
            
        }else {
            inventoryTemplate.query();
        }
    }
}


function deleteTemplate(id){
    if(confirm("是否确认删除该模版？")){
        $.ajax({
            type : "get",
            url : "/store/inventoryTemplate/delete",
            data : {"id":id},
            success:function(msg){
                inventoryTemplate.reload();
            },
            error:function(msg){
                errorDialog.show(msg);
            }
        });
    }
}
function viewTemplate(id){
    var url = "/store/inventoryTemplate/view?id=" + id;
    edit(url,"查看盘点模版",900,450,false);
}
function discardTemplate(id){
    if(confirm("是否确认废弃该模版？")){
        $.ajax({
            type : "get",
            url : "/store/inventoryTemplate/discard",
            data : {"id":id},
            success:function(msg){
                inventoryTemplate.reload();
            },
            error:function(msg){
                errorDialog.show(msg);
            }
        });
    }
}

function down(id){
    $.ajax({
        type : "get",
        url : "/store/inventoryTemplate/export",
        data : {"id":id},
        success:function(msg){
            
        },
        error:function(msg){
            errorDialog.show(msg);
        }
    });
}

function editTemplate(id){
    var url = "/store/inventoryTemplate/toEdit";
    var tips = "新增盘点模版";
    if(id!=null){
        url += "?id=" + id;
        tips = "修改盘点模版";
    }
    edit(url,tips,900,450,false);
}

$(function() {
    inputSelectUtil.init().load("#cityId");
    inventoryTemplate.query();
});

