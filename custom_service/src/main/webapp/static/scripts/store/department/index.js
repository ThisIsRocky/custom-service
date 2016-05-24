var userFacade = {
    detailsGrid:null,
    query : function() {
        // 构建 queryString
        var queryString="";
        var treeNode = tree.getSelected();
        if (!treeNode) {
            return;
        }
        var id = treeNode.id;
        if(id == null) {
            return;
        }
        queryString = 'dataType=1&departmentId=' + id;
        // 显示 table
        $('#user_data_list').show();
        // 加载详情
        userFacade.loadDetails(queryString);
    },
    // 加载数据详情
    loadDetails : function(params) {
        var _this = this;
        var grid_selector = "#user_table_data_list";
        var url = '/system/user/store/list';
        if(_this.detailsGrid) {
            // 根据搜索条件，重新加载
            $(grid_selector).jqGrid('setGridParam',{
                url : url,
                postData:params,
                page:1
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : url,
                datatype : 'json',
                mtype : 'POST',
                postData : params,
                colNames : [ '部门', '姓名', '手机', '邮箱', '操作列'],
                jsonReader : {
                    root: "data",
                    page: "curPage",
                    total: "totalPage",
                    records: "totalRows"
                },
                prmNames : {page:'curPage',rows:'pageSize', sort: 'sidx',order: 'sort'},
                cmTemplate: {sortable:true},
                colModel : [ {
                    name : 'departmentName',
                    width : 120
                },  {
                    name : 'name',
                    width : 120
                },  {
                    name : 'phoneNo',
                    width : 120
                },  {
                    name : 'email',
                    width : 120,
                    key : true
                }, {
                    name : '',
                    width : 100,
                    formatter : function(cellvalue, options, rowObject) {
                        var retVal = '<a class="zs-auth btn btn-mini btn-white btn-default btn-bold fa fa-minus-square-o btn-delete" permission="/system/user/store/delete" href="javascript:void(0);" user_id='+rowObject.userId+'>删除</a>';
                        //var retVal = '修改，删除';
                        return retVal;
                    }
                }],
                rowNum : -1,
                rowList : [ 10, 30, 50 ],
                viewrecords : true,
                autoHeight : true,
                loadComplete : function(xhr) {
                    $.authenticate();
                }
            });
        }
        // 自适应宽度
        $.resizeGrid(grid_selector);
    }
}
var subUserFacade = {
    detailsGrid:null,
    query : function(fuzzy) {
        // 构建 queryString
        var queryString="";
        var treeNode = tree.getSelected();
        if (!treeNode) {
            return;
        }
        var id = treeNode.id;
        if(id == null) {
            return;
        }
        queryString = '?dataType=2&departmentId=' + id;
        if (fuzzy) {
            var name = $('#name_for_query').val();
            var email = $('#email_for_query').val();
            if (name && name != '') {
                queryString = queryString + '&name=' + name;
            }
            if (email && email != '') {
                queryString = queryString + '&email=' + email;
            }
        }
        // 显示 table
        $('#sub_user_data_list').show();
        // 加载详情
        subUserFacade.loadDetails(queryString);
    },
    // 加载数据详情
    loadDetails : function(params) {
        var _this = this;
        var grid_selector = "#sub_user_table_data_list";
        var pager_selector = "#sub_user_table_data_list_pager";
        var url = '/system/user/store/list';
        if(_this.detailsGrid) {
            // 根据搜索条件，重新加载
            $(grid_selector).jqGrid('setGridParam',{
                url : url+params,
                page:1
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : url+params,
                datatype : 'json',
                mtype : 'POST',
                colNames : [ '姓名', '部门', '角色', '手机', '邮箱', '状态', '操作列'],
                jsonReader : {
                    root: "data",
                    page: "curPage",
                    total: "totalPage",
                    records: "totalRows"
                },
                prmNames : {page:'curPage',rows:'pageSize', sort: 'sidx',order: 'sort'},
                cmTemplate: {sortable:true},
                colModel : [{
                    name : 'name',
                    width : 50
                },  {
                    name : 'departmentName',
                    width : 100
                },  {
                    name : 'roleName',
                    width : 100
                },  {
                    name : 'phoneNo',
                    width : 100
                },  {
                    name : 'email',
                    width : 120,
                    key : true
                },  {
                    name : 'status',
                    width : 50,
                    formatter : function(cellvalue, options, rowObject) {
                        if (rowObject.status == 1) {
                            return "启用";
                        }
                        return "禁用";
                    }
                }, {
                    name : '',
                    width : 300,
                    formatter : function(cellvalue, options, rowObject) {
                        var clz = 'btn-suspend';
                        if (rowObject.status == 0) {
                            clz = 'btn-active';
                        }
                        var retVal = '<a class="zs-auth btn btn-mini btn-white btn-default btn-bold fa '+clz+'" permission="/system/user/store/suspend" href="javascript:void(0);" user_id='+rowObject.userId+'></a>';
                        retVal += '<a class="zs-auth btn btn-mini btn-white btn-default btn-bold fa fa-minus-square-o btn-delete" permission="/system/user/store/delete" href="javascript:void(0);" user_id='+rowObject.userId+'>删除</a>';
                        retVal += '<a class="zs-auth btn btn-mini btn-white btn-default btn-bold fa fa-database btn-access" permission="/system/user/store/brand/update" href="javascript:void(0);" onclick="$.showCommonEditDialog(\'/system/user/store/brand/update?userId='+rowObject.userId+'\',\'数据权限设置\',800,300);">数据权限</a>';
                        retVal += '<a class="zs-auth btn btn-mini btn-white btn-default btn-bold fa fa-group btn-role" permission="/store/department/addRole" href="javascript:void(0);" onclick="$.showCommonEditDialog(\'/store/department/addRole?userId='+rowObject.userId+'\',\'角色设置\',400,200);">角色设置</a>';
                        //var retVal = '修改，删除';
                        return retVal;
                    }
                }],
                rowNum : 30,
                rowList : [ 10, 30, 50 ],
                pager : pager_selector,
                pagerpos : 'left',
                height : 300,
                viewrecords : true,
                autoHeight : true,
                loadComplete : function(xhr) {
                    $.authenticate();
                }
            });
        }
        // 自适应宽度
        $.resizeGrid(grid_selector);
    }
}
$(document).on('click', '.btn-suspend', function(event) {
    if(!confirm("是否确定禁用？")) {
        return;
    }
    var _this =this;
    var userId = $(_this).attr('user_id');
    $.ajax({
            type: 'post',
            url: '/system/user/store/suspend',
            data: {
                userId:userId
            },
            dataType: "json",
            success: function (data) {
                if (data.result) {
                    if (data.result == 1) {
                        $(_this).removeClass('btn-suspend').addClass('btn-active');
                        $(_this).parents('tr').children("td[aria-describedby='sub_user_table_data_list_status']").html('禁用');
                    }
                }
            },
            error: function (msg) {
                if(msg.status == 500){
                    $.alertError(" 数据加载失败,请联系管理员！");
                }
                if(msg.status == 200){
                    location.href = "/ajax_noPermission";
                }
            }
        });
    /* Act on the event */
});
$(document).on('click', '.btn-active', function(event) {
    if(!confirm("是否确定启用？")) {
        return;
    }
    var _this =this;
    var userId = $(_this).attr('user_id');
    $.ajax({
            type: 'post',
            url: '/system/user/store/active',
            data: {
                userId:userId
            },
            dataType: "json",
            success: function (data) {
                if (data.result) {
                    if (data.result == 1) {
                        $(_this).removeClass('btn-active').addClass('btn-suspend');
                        $(_this).parents('tr').children("td[aria-describedby='sub_user_table_data_list_status']").html('启用');
                    }
                }
            },
            error: function (msg) {
                if(msg.status == 500){
                    $.alertError(" 数据加载失败,请联系管理员！");
                }
                if(msg.status == 200){
                    location.href = "/ajax_noPermission";
                }
            }
        });
    /* Act on the event */
});
$(document).on('click', '.btn-delete', function(event) {
    if(!confirm("是否确定删除？")) {
        return;
    }
    var _this =this;
    var userId = $(_this).attr('user_id');
    $.ajax({
            type: 'post',
            url: '/system/user/store/delete',
            data: {
                userId:userId
            },
            dataType: "json",
            success: function (data) {
                if (data.result) {
                    if (data.result == 1) {
                        $(_this).parents('tr').remove();
                    }
                }
            },
            error: function (msg) {
                if(msg.status == 500){
                    $.alertError(" 数据加载失败,请联系管理员！");
                }
                if(msg.status == 200){
                    location.href = "/ajax_noPermission";
                }
            }
        });
    /* Act on the event */
});

$(document).on('click', '#updateBtn', function() {
    if ($(this).attr('disabled')) {
        return;
    }
    tree.update();
});
$(document).on('click', '#addBtn', function() {
    if ($(this).attr('disabled')) {
        return;
    }
    if (tree.toAdd()) {
        treeUIControll.toAddMode();
    }
});
$(document).on('click', '#addUndoBtn', function() {
    tree.undoAdd();
    treeUIControll.exitAddMode();
});    
$(document).on('click', '#addSaveBtn', function() {
    if (tree.saveAdd()) {
        treeUIControll.exitAddMode();
    }
      /* Act on the event */
});
$(document).on('click', '#deleteBtn', function() {
    if ($(this).attr('disabled')) {
        return;
    }
    tree.delete();
      /* Act on the event */
});
$(document).on('click', '#queryBtn', function(event) {
    subUserFacade.query(true);
    /* Act on the event */
});

$(document).on('click', '#addUserBtn', function(){
	var treeNode = tree.getSelected();
	if (!treeNode) {
		$.alertError("请选择节点");
		return;
	}
	var id = treeNode.id;
	var email = $('#email').val();
	if (!email || email == '') {
		$.alertError("有未填写信息，请填写完整");
        return;
    }
	$.ajax({
        type: 'post',
        url: '/system/user/store/add',
        data: {
            email:email,
            id:id
        },
        dataType: "json",
        success: function (data) {
        	if (data) {
        		var code = data.res.code;
                if (code == "000003") {
                    $.alertError("没有在该层级下增加用户的权限");
                }
        		else if (code == "002001") {
        			$.alertError("用户不存在！");
        		}
        		else if (code == "031008") {
        			$.alertError("用户已经被分配到别的层级下");
        		}
                else if (code == "031009") {
                    $.alertError("用户已经被分配到当前层级下");
                }
        		else {
        			userFacade.query();
        		}
        	}
        },
        error: function (msg) {
            if(msg.status == 500){
                $.alertError(" 数据加载失败,请联系管理员！");
            }
            if(msg.status == 200){
                location.href = "/ajax_noPermission";
            }
        }
    });
});
$(function(){
    $.authenticate();
});
