var $level1CategoryMap = {};
var $level2CategoryMap = {};
var matGroupFacade = {
    detailsGrid: null, // 数据详情
    query : function() {
        // 构建 queryString
        var queryString = $("#mg_form").serialize();
        // 显示 table
        $('#matGroup_data_list').show();
        // 加载详情
        matGroupFacade.loadDetails(queryString);
    },
    // 加载数据详情
    loadDetails : function(queryString) {
        var _this = this;
        var grid_selector = "#matGroup_table_data_list";
        var pager_selector = "#matGroup_table_data_list_pager";
        var url = '/matGroup/matGroupList?'+queryString;
        if(_this.detailsGrid) {
            // 根据搜索条件，重新加载
            $(grid_selector).jqGrid('setGridParam',{
                url : url,
                forceFit : true,
                page:1
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : url,
                type: 'post',
                datatype : 'json',
                colNames : [ '物料组编码', '物料组名称', '物料大类','物料小类','用量单位', '操作'],
                jsonReader : {
                    root: "data",
                    page: "curPage",
                    total: "totalPage",
                    records: "totalRows"
                },
                prmNames : {page:'curPage',rows:'pageSize', sort: 'sidx',order: 'sort'},
                cmTemplate: {sortable:true},
                colModel : [ {
                    name : 'code',
                    width : 60,
                    align : 'center'
                },  {
                    name : 'name',
                    width : 120
                }, {
                    name : 'categoryLevel1Str',
                    width : 60,
                    align : 'center'
                }, {
                    name : 'categoryLevel2Str',
                    width : 60,
                    align : 'center'
                }, {
                    name : 'unitBaseName',
                    width : 60,
                    align : 'center'
                }, {
                    name : '',
                    sortable : false,
                    width : 180,
                    align : 'center',
                    formatter : function(cellvalue,options, rowObject) {
                        var retVal = '<a class="zs-auth btn btn-minier btn-white btn-warning btn-bold" href="javascript:void(0);" permission="/matGroup/toUpdate" onclick="$.showCommonEditDialog(\'/matGroup/toUpdate?id='+rowObject.id+'\',\'修改物料组\',400,250);"><i class="ace-icon fa fa-pencil-square-o blue"></i>修改</a>';
                        if(rowObject.canModify) {
                        	retVal += ' <a class="zs-auth btn btn-minier btn-white btn-danger btn-bold" href="javascript:void(0);" permission="/matGroup/deleteById" onclick="matGroupFacade.showCommonValidDialog('+rowObject.id+',\''+rowObject.name+'\');"><i class="ace-icon fa fa-times red2"></i>删除</a>';
                        }
                        retVal += ' <a class="zs-auth btn btn-minier btn-white btn-info btn-bold" href="javascript:void(0);" permission="/matGroup/findMats" onclick="$.showCommonEditDialog(\'/matGroup/findMats?id='+rowObject.id+'&canModify='+rowObject.canModify+'\',\'查看物料\',600,350);"><i class="ace-icon fa fa-share-alt blue"></i>查看物料</a>';
                        return retVal;
                    }
                }],
                rowNum : 10,
                rowList : [ 10, 30, 50 ],
                pager : pager_selector,
                pagerpos : 'left',
                height : 350,
                viewrecords : true,
                autoHeight : true,
                loadComplete : function() {
                    var table = this;
                    setTimeout(function() {
                        updatePagerIcons(table);
                        $.removeScrollX('#matGroup_data_list');
                    }, 0);
                    $.authenticate();
                }
            });
        }
        // 自适应宽度
        $.resizeGrid(grid_selector);
    },
    showCommonValidDialog : function (matGroupId, matGroupName) {
        $.dialog({
            lock: true,
            content : '是否确认删除物料组"'+matGroupName+'"？',
            width: 200,
            height: 100,
            drag: false,
            resize: false,
            icon: 'alert.gif',
            ok: function () {
                $.ajax({
                    type: 'get',
                    url: '/matGroup/deleteById',
                    data: {
                        'id':matGroupId
                    },
                    dataType: "json",
                    success: function (data) {
                        if (data.success) {
                            alert('删除成功');
                            matGroupFacade.query();
                        }else {
                        	alert(data.msg);
                        }
                    }
//                    ,
//                    error: function (msg) {
//                        alert(msg.responseText);
//                    }
                });


                return true;
            },
            cancel: true
        });
    }
};
function initCat() {
	initCategoryLevel1AndCallBack(null, null, function () {
//        var categoryCode = $('#category_code_modify').val();
//        var code = $('#code_modify').val();
//        var newCode = code.replace(categoryCode, '');
//        $('#material_code_modify').val(newCode);
    	$("#material_category_level1_modify").prepend("<option selected value=''>请选择</option>");
    	$("#material_category_level2_modify").empty();
    	$("#material_category_level2_modify").prepend("<option selected value=''>请选择</option>");
    });

    $('#material_category_level1_modify').change(function () {
        initCategoryLevel2AndCallBack($('#material_category_level1_modify').val(), null, function(){
        	$("#material_category_level2_modify").prepend("<option selected value=''>请选择</option>");
        });
    });
}
$(function () {
    $("#matGroup_searchBtn").click(matGroupFacade.query);
    initCat();
});

