var foodFacade = {
    detailsGrid: null, // 数据详情
    query : function() {
        // 构建 queryString
        var queryString;
        var foodName = $('#food_name').val();
        var foodCode = $('#food_code').val();
        var isValid = $('#isValid option:selected').val();
        var isVirtual = $('#isVirtual option:selected').val();
        var materialGroupId = $('#materialGroupId').val();
        var isDelete = $('#isDelete').val();
        if(foodName) {
            queryString = 'name=' + foodName;
        }
        if(foodCode) {
            queryString = queryString+'&code=' + foodCode;
        }
        if(isValid) {
            queryString = queryString+'&isValid=' + isValid;
        }
        if(isVirtual) {
            queryString = queryString+'&isVirtual=' + isVirtual;
        }
        if(materialGroupId) {
            queryString += '&materialGroupId=' + materialGroupId;
        }
        if(isDelete) {
            queryString += '&isDelete=' + isDelete;
        }
        // 显示 table
        $('#food_data_list').show();
        // 加载详情
        foodFacade.loadDetails(queryString);
    },
    // 加载数据详情
    loadDetails : function(queryString) {
        var _this = this;
        var grid_selector = "#food_table_data_list";
        var pager_selector = "#food_table_data_list_pager";
        var url = '/food/list?'+queryString;
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
                colNames : [ '菜品编码', '菜品名称', '是否虚拟菜品', '是否启用', '是否已使用', '是否废弃', '操作列'],
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
                    width : 40,
                    align : 'center'
                },  {
                    name : 'name',
                    width : 120
                }, {
                    name : 'isVirtual',
                    width : 40,
                    align : 'center',
                    formatter : function(isValid) {
                        return isValid == 1 ? '是' : '否';
                    }
                }, {
                    name : 'isValid',
                    width : 60,
                    align : 'center',
                    formatter : function(isValid) {
                        return isValid == 1 ? '有效' : '无效';
                    }
                }, {
                    name : 'isUse',
                    width : 60,
                    align : 'center',
                    formatter : function(isUse) {
                        return isUse == 1 ? '已使用' : '未使用';
                    }
                }, {
                    name : 'isDelete',
                    width : 60,
                    align : 'center',
                    formatter : function(value) {
                        return value == 1 ? '是' : '否';
                    }
                }, {
                    name : '',
                    sortable : false,
                    width : 180,
                    align : 'center',
                    formatter : function(cellvalue,options, rowObject) {
                        var retVal = '';
                        if(rowObject.isDelete!=1){
                            retVal += '<a class="zs-auth btn btn-minier btn-white btn-warning btn-bold" href="javascript:void(0);" permission="/food/toUpdate" onclick="foodFacade.updateFood('+rowObject.id+');"><i class="ace-icon fa fa-pencil-square-o blue"></i>修改</a>';
                            
                            if(rowObject.isValid==1){
                                retVal += ' <a class="zs-auth btn btn-minier btn-white btn-danger btn-bold" href="javascript:void(0);" permission="/food/unValid" onclick="foodFacade.showCommonUnValidDialog('+rowObject.id+',\''+rowObject.name+'\');"><i class="ace-icon fa fa-times red2"></i>禁用</a>';
                            }else{
                                retVal += ' <a class="zs-auth btn btn-minier btn-white btn-success btn-bold" href="javascript:void(0);" permission="/food/valid" onclick="foodFacade.showCommonValidDialog('+rowObject.id+',\''+rowObject.name+'\');"><i class="ace-icon fa fa-check green"></i>启用</a>';
                                retVal += ' <a class="zs-auth btn btn-minier btn-white btn-success btn-bold" href="javascript:void(0);" permission="/food/delete" onclick="foodFacade.deleteFood('+rowObject.id+',\''+rowObject.name+'\');"><i class="ace-icon fa fa-check green"></i>废弃</a>';
                            }
                            retVal += '<br/>';
                        }
                        if(rowObject.isVirtual == 0) {
                            retVal += ' <a class="zs-auth btn btn-minier btn-white btn-info btn-bold" href="javascript:void(0);" permission="/food/bom/exportById" onclick="foodFacade.exportBomById('+rowObject.id+');"><i class="ace-icon fa fa-wrench blue"></i>导出一品多供配方</a>';
                            retVal += ' <a class="zs-auth btn btn-minier btn-white btn-info btn-bold" href="javascript:void(0);" permission="/food/bom" onclick="foodFacade.addBom('+rowObject.id+');"><i class="ace-icon fa fa-wrench blue"></i>一品多供配方设置</a>';
                        }
                        retVal += ' <a class="zs-auth btn btn-minier btn-white btn-info btn-bold" href="javascript:void(0);" permission="/food/onNapos" onclick="foodFacade.showNaposFood('+rowObject.id+');"><i class="ace-icon fa fa-share-alt blue"></i>已匹配napos菜品</a>';

                        return retVal;
                    }
                }],
                rowNum : 30,
                rowList : [ 30, 50 ],
                pager : pager_selector,
                pagerpos : 'left',
                height : 350,
                viewrecords : true,
                autoHeight : true,
                loadComplete : function() {
                    var table = this;
                    setTimeout(function() {
                        updatePagerIcons(table);
                        $.removeScrollX('#food_data_list');
                    }, 0);
                    $.authenticate();
                }
            });
        }
        // 自适应宽度
        $.resizeGrid(grid_selector);
    },
    showCommonUnValidDialog : function (foodId, foodName) {
        $.dialog({
            lock: true,
            content : '禁用菜品后,门店将不可新增上传该菜品。是否禁用该菜品："'+foodName+'"？',
            width: 200,
            height: 100,
            drag: false,
            resize: false,
            icon: 'alert.gif',
            ok: function () {
                $.ajax({
                    type: 'get',
                    url: '/food/unValid',
                    data: {
                        'id':foodId
                    },
                    dataType: "text",
                    success: function (data) {
                        foodFacade.query();
                    },
                    error: function (msg) {
                        alert(msg.responseText);
                    }
                });
                return true;
            },
            cancel: true
        });
    },
    showCommonValidDialog : function (foodId, foodName) {
        $.dialog({
            lock: true,
            content : '启用菜品后，门店可新增上传该菜品。是否确认启用该菜品？"'+foodName+'"？',
            width: 200,
            height: 100,
            drag: false,
            resize: false,
            icon: 'alert.gif',
            ok: function () {
                $.ajax({
                    type: 'get',
                    url: '/food/valid',
                    data: {
                        'id':foodId
                    },
                    dataType: "text",
                    success: function (data) {
                        if (data == 'noBom') {
                            alert('未配置菜品配方信息，该菜品无法启用。');
                            return;
                        }
                        if (data == 'invalidBom') {
                            alert('未配置一品多供配方信息，或配方中物料组下没有物料，该菜品无法启用。');
                            return;
                        }
                        foodFacade.query();
                    },
                    error: function (msg) {
                        alert(msg.responseText);
                    }
                });


                return true;
            },
            cancel: true
        });
    },
    updateFood : function(foodId) {
        edit("/food/toUpdate?id="+foodId,"菜品修改",400,150,false);
    },
    addFood : function() {
        edit("/food/toAdd","添加菜品",400,150,false);
    },
    addFoodBom : function(foodId) {
        edit("/food/addBom?id="+foodId,"配方设置",1000,600,false);
    },
    addBom : function(foodId) {
        edit("/food/bom?id="+foodId,"配方设置",1000,600,false);
    },
    // 根据编码，回调填充菜名
    fillFood : function(id, code, jsonStr, nodeId){
        var json = eval("("+jsonStr+")");
        $(nodeId).val(json.code);
        $(nodeId).parent().parent().parent().find("#food_name").val(json.name);
    },
    exportById : function(id) {
    	var url = '/food/exportById?id='+id;
    	if($("#downloadIfm").attr('src')) {
    		$("#downloadIfm").attr('src', '');
    	}
    	$("#downloadIfm").attr('src', url);
    },
    exportByCondition : function() {
        // 构建 queryString
        var queryString;
        var foodName = $('#food_name').val();
        var foodCode = $('#food_code').val();
        var isValid = $('#isValid option:selected').val();
        var isVirtual = $('#isVirtual option:selected').val();
        if(foodName) {
            queryString = '&name=' + foodName;
        }
        if(foodCode) {
            queryString = queryString+'&code=' + foodCode;
        }
        if(isValid) {
            queryString = queryString+'&isValid=' + isValid;
        }
        if(isVirtual) {
            queryString = queryString+'&isVirtual=' + isVirtual;
        }
    	var url = '/food/exportByCondition?1=1' + queryString;
    	if($("#downloadIfm").attr('src')) {
    		$("#downloadIfm").attr('src', '');
    	}
    	$("#downloadIfm").attr('src', url);
    },
    exportBomById : function(id) {
        var url = '/food/bom/exportById?id='+id;
        if($("#downloadIfm").attr('src')) {
            $("#downloadIfm").attr('src', '');
        }
        $("#downloadIfm").attr('src', url);
    },
    exportBomByCondition : function() {
        // 构建 queryString
        var queryString;
        var foodName = $('#food_name').val();
        var foodCode = $('#food_code').val();
        var isValid = $('#isValid option:selected').val();
        var isVirtual = $('#isVirtual option:selected').val();
        if(foodName) {
            queryString = '&name=' + foodName;
        }
        if(foodCode) {
            queryString = queryString+'&code=' + foodCode;
        }
        if(isValid) {
            queryString = queryString+'&isValid=' + isValid;
        }
        if(isVirtual) {
            queryString = queryString+'&isVirtual=' + isVirtual;
        }
        var url = '/food/bom/exportByCondition?1=1' + queryString;
        if($("#downloadIfm").attr('src')) {
            $("#downloadIfm").attr('src', '');
        }
        $("#downloadIfm").attr('src', url);
    },
    showNaposFood : function(foodId){
        $.showCommonEditDialog('/food/onNapos?foodId='+foodId + '&' + Math.random(),'已匹配napos菜品' ,900,450);
    },
    deleteFood : function(id, name) {
        $.dialog.confirm('确定要将' + name + '废弃吗？', function() {
            var url = '/food/delete/getNaposFoodNums?foodId=' + id + "&nd=" + Math.random();
            $.get(url, function(result) {
                if (result.code == '000000') {
                    if (result.data > 0) {
                        $.dialog.alert('系统检测到线上共有<span color="red">' +result.data
                                 + '</span>个napos菜品与此菜品关联（具体请参考[已匹配napos菜品]），不能删除');
                        // $.dialog.confirm('系统检测到线上共有<span color="red">' +result.data
                        // + '</span>个napos菜品与此菜品关联（具体请参考[已匹配napos菜品]）,<br/>'
                        // + '废弃此菜品后，所有线上菜品都会<span color="red">删除</span>，<br/>'
                        // + '如果关联菜品较多，本次操作耗时较长，请耐心等待，'
                        // +'请确认是否要继续操作？' , function(){
                        // doDelete(id);
                        // });
                    } else {
                        doDelete(id);
                    }
                } else {
                    $.dialog.alert(result.message);
                }
            });
        });
        function doDelete() {
            var url = '/food/delete?foodId=' + id + "&nd=" + Math.random();
            $.get(url, function(result){
                if(result.code == '000000') {
                    foodFacade.query();
                } else {
                    $.dialog.alert(result.message);
                }
            });
        }
    }
};
$(function () {
    $('#page_tabs').tabs();
    $("#food_searchBtn").click(foodFacade.query);
    $("#food_addBtn").click(foodFacade.addFood);
    inputSelectUtil.init();
    foodFacade.query();
});
