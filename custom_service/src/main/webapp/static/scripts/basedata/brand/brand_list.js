/**
 * Created by sunzheng on 15/12/10.
 */
/* Brand 品牌 */
var brandFacade = {
    detailsGrid: null, // 数据详情
    brandOnLoad: function() {
        brandFacade.query();
    },
    query : function() {
        // 构建 queryString
        var queryString = "";
        var brandName = $('#brand_name').val();
        if(brandName) {
            queryString = 'name=' + brandName;
        }
        // 显示 table
        $('#brand_data_list').show();
        // 加载详情
        brandFacade.loadDetails(queryString);
    },
    // 加载数据详情
    loadDetails : function(params) {
        var _this = this;
        var grid_selector = "#brand_table_data_list";
        var pager_selector = "#brand_table_data_list_pager";
        var url = '/brand/list';
        if(_this.detailsGrid) {
            // 根据搜索条件，重新加载
            $(grid_selector).jqGrid('setGridParam',{
                url : url+"?"+params,
                page:1
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : url+"?"+params,
                datatype : 'json',
                colNames : ['品牌名称', '操作列'],
                jsonReader : {
                    root: "data",
                    page: "curPage",
                    total: "totalPage",
                    records: "totalRows"
                },
                prmNames : {page:'curPage',rows:'pageSize', sort: 'sidx',order: 'sort'},
                cmTemplate: {sortable:true},
                colModel : [ {
                    name : 'name',
                    width : 140
                }, {
                    name : '',
                    sortable : false,
                    width : 100,
                    align : 'center',
                    formatter : function(cellvalue, options, rowObject) {
                        /*var retVal = '<a class="btn btn-minier btn-white btn-warning btn-bold brand-btn-update zs-auth" permission="/brand/edit"  href="javascript:void(0);" id="brand-edit-'+rowObject.id+'" brand-id="'+rowObject.id+'" brand-name="'+rowObject.name+'"><i class="ace-icon fa fa-wrench bigger-120 orange"></i></a>';*/
                        /*retVal += ' <a class="btn btn-minier btn-white btn-danger btn-bold zs-auth" permission="/brand/delete" href="javascript:void(0);" onclick="brandFacade.showCommonDeleteDialog('+rowObject.id+',\''+rowObject.name+'\');"><i class="ace-icon fa fa-trash-o bigger-120 red"></i>删除</a>';*/
                        var retVal = ' <a class="btn btn-minier btn-white btn-info btn-bold zs-auth" permission="/foodCategory/toList" href="javascript:void(0);" onclick="brandFacade.foodCategoryMng('+rowObject.id+');"><i class="ace-icon fa fa-wrench bigger-120 blue"></i>菜品分类</a>';
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
                        $.removeScrollX('#brand_data_list');
                    }, 0);
                    $.authenticate();
                }
            });
        }
        // 自适应宽度
        $.resizeGrid(grid_selector);
    },
    // 删除确认
    showCommonDeleteDialog : function (brandId, brandName) {
        $.dialog({
            lock: true,
            content : '确认删除品牌"'+brandName+'"吗？',
            width: 200,
            height: 100,
            drag: false,
            resize: false,
            icon: 'alert.gif',
            ok: function () {
                $.ajax({
                    url: "/brand/delete",
                    type: "GET",
                    data: {
                        id: brandId
                    },
                    success: function (data) {
                        if (data.code == '000000') {
                            $("#brand_table_data_list").trigger("reloadGrid");
                        } else {
                            $.dialog({
                                lock: true,
                                content: data.code + "，" + data.msg,
                                width: 200,
                                height: 100,
                                ok: function() {
                                    return true;
                                }
                            });
                        }
                    },
                    error: function (data) {
                        console.log(data);
                    },
                    before : function() {
                        $("#brand_addBtn").addClass("disabled");
                    },
                    complete : function() {
                        $("#brand_addBtn").removeClass("disabled");
                    }
                });
                return true;
            },
            cancel: true
        });
    },
    // 菜品分类
    foodCategoryMng : function(brandId) {
        edit("/foodCategory/toList?brandId="+brandId,"菜品分类",450,450,false);
    },
    // 添加品牌
    addBrand: function(){
        edit("/brand/toAdd","添加品牌",290,260,false);
        //// 避免重复提交
        //if ($("#brand_addBtn").hasClass("disabled")) {
        //    return;
        //}
        //var brandName = $.trim($("#brand_name_toAdd").val());
        //if (!$.trim(brandName)) {
        //    $.dialog({
        //        lock: true,
        //        content: '请确保品牌信息填写完整。',
        //        width: 200,
        //        height: 100
        //    });
        //    return;
        //}
        //$.ajax({
        //    url: "/brand/add",
        //    type: "POST",
        //    data: {
        //        name: brandName
        //    },
        //    success: function (data) {
        //        $("#brand_addBtn").addClass("disabled");
        //        if (data.code == "000000") {
        //            $("#brand_name_toAdd").val('');
        //            brandFacade.query();
        //        } else if (data.code == "024301") {
        //            $.dialog({
        //                lock: true,
        //                content: data.code + "，" + data.msg,
        //                width: 200,
        //                height: 100,
        //                ok: function() {
        //                    return true;
        //                }
        //            });
        //        } else {
        //            $.dialog({
        //                lock: true,
        //                content: "操作失败",
        //                width: 200,
        //                height: 100
        //            });
        //        }
        //    },
        //    error: function (data) {
        //        console.log(data);
        //    },
        //    beforeSend : function() {
        //        $("#brand_addBtn").addClass("disabled");
        //    },
        //    complete : function() {
        //        $("#brand_addBtn").removeClass("disabled");
        //    }
        //});
    },
    // 修改品牌
    toEditBrand: function(brandId, brandName, eleObj){
        if (!brandId || !brandName || !eleObj) {
            return false;
        }
        var _ele = eleObj,
            _td = _ele.parent("td").prev("td"),
            _ipt = $("<input id='brand-name-"+brandId+"' value='"+brandName+"' />");
        _td.empty().append(_ipt);
        _ele.removeClass('brand-btn-update').addClass('brand-btn-save');
    },
    // 提交修改品牌
    editBrand: function (brandId, brandName, eleObj) {
        var _ele = eleObj,
            _td = _ele.parent("td").prev("td"),
            _newName = $.trim($("#brand-name-" + brandId).val()),
            _showName = brandName;

        if (!brandId || !brandName || !eleObj || !_newName) {
            if (!_newName) {
                $("#brand-name-" + brandId).css("border", "1px solid red");
            } else {
                $("#brand-name-" + brandId).css("border", "");
            }
            return false;
        }

        if ($.trim(_newName) != brandName) {
            // 避免重复提交
            if (_ele.hasClass('disabled')) {
                return;
            }
            $.ajax({
                type: 'post',
                url: '/brand/edit',
                data: {
                    id: brandId,
                    name: _newName
                },
                dataType: "json",
                success: function (data) {
                    if (data.code === '000000') {
                        _showName = _newName;
                    } else {
                        $.dialog({
                            lock: true,
                            content: data.code + "，" + data.msg,
                            width: 200,
                            height: 100,
                            ok: function() {
                                return true;
                            }
                        });
                    }
                    $("#brand-edit-"+brandId).attr("brand-id", brandId).attr("brand-name", _showName);
                    _td.empty().append(_showName);
                    _ele.removeClass('brand-btn-save').addClass('brand-btn-update');
                },
                error: function (msg) {
                    $.dialog({
                        lock: true,
                        content: "操作失败",
                        width: 200,
                        height: 100
                    });
                },
                beforeSend: function () {
                    _ele.addClass("disabled");
                },
                complete: function () {
                    _ele.removeClass("disabled");
                }
            });
        } else {
            _td.empty().append(_showName);
            _ele.removeClass('brand-btn-save').addClass('brand-btn-update');
        }
    },
    load: function() {
        setTimeout(function(){
            brandFacade.query();
        }, 300);
    }
};

$(function () {
    $("#brand_searchBtn").click(brandFacade.query);
    $("#brand_addBtn").click(brandFacade.addBrand);
    //brandFacade.query();
    // 编辑按钮
    $(document).on('click', '.brand-btn-update', function(event) {
        var _this = $(this);
        brandFacade.toEditBrand(_this.attr("brand-id"), _this.attr("brand-name"), _this);
    });
    $(document).on('click', '.brand-btn-save', function(event) {
        var _this = $(this);
        brandFacade.editBrand(_this.attr("brand-id"), _this.attr("brand-name"), _this);
    });
});