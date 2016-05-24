var roleFacade = {
    detailsGrid: null, // 数据详情
    url : "/system/role/list",
    grid_selector : "#table-data-list",
    pager_selector : "#table-data-list-pager",
    init : function() {
        var _this = roleFacade;
        _this.detailsGrid = $(_this.grid_selector).jqGrid({
            url : _this.url,
            datatype : 'json',
            mtype : 'POST',
            jsonReader : {
                root: "data",
                page: "curPage",
                total: "totalPage",
                records: "totalRows"
            },
            colNames : [ 'ID', '系统', '角色名' , '角色类型', '权限级别', '操作'],
            prmNames : {page:'curPage',rows:'pageSize', sort: 'sidx',order: 'sort'},
            cmTemplate: {sortable:true},
            colModel : [
                {name : 'id', width : 60, key : true},
                {name : 'systemName', width : 60},
                {name : 'roleName', width : 200},
                {name : 'typeName', width : 200},
                {name : 'level', width : 200},
                {name : 'myac', width:220, fixed:true, sortable:false, resize:false, align:'center',
                    formatter : function(cellvalue, options, rowObject) {
                        var retVal = '<button class="btn btn-minier btn-white btn-success btn-bold zs-auth" permission="/system/role/showRoleMenu" onclick="roleFacade.auConfig('+rowObject.id+');"><i class="ace-icon fa fa-wrench bigger-120 green"></i>菜单权限</button>';
                        retVal += ' <button class="btn btn-minier btn-white btn-warning btn-bold zs-auth" permission="/system/role/toUpdate" onclick="roleFacade.editRole('+rowObject.id+');"><i class="ace-icon fa fa-pencil-square-o orange"></i>修改</button>';
                        retVal += ' <button class="btn btn-minier btn-white btn-danger btn-bold zs-auth" permission="/system/role/deleteRole" onclick="roleFacade.delRole('+rowObject.id+');"><i class="ace-icon fa fa-trash-o bigger-120 red2"></i>删除</button>';
                        return retVal;
                    }
                }],
            rowNum : 10,
            rowList : [ 10, 20, 50 ],
            pager : _this.pager_selector,
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
        // 自适应宽度
        $.resizeGrid(_this.grid_selector);
    },
    query : function() {
        var _this = roleFacade;
        // 根据搜索条件，重新加载
        $(_this.grid_selector).jqGrid('setGridParam',{
            url : roleFacade.url+"?"+$("form").serialize(),
            page: 1
        }).trigger("reloadGrid");
        // 自适应宽度
        $.resizeGrid(_this.grid_selector);
    },
    delRole : function(roleId) {
        if(confirm("是否删除")){
            $.ajax({
                type : "post",
                url : "/system/role/deleteRole",
                data : {"id":roleId},
                success:function(response) {
                    if (response.code == "000000") {
                        $.gritter.add({
                            title: '',
                            text: '删除成功',
                            sticky: false,
                            time: '2000',
                            class_name: 'gritter-success'
                        });
                        roleFacade.query();
                    } else {
                        $.gritter.add({
                            title: '',
                            text: response.message,
                            sticky: false,
                            time: '2000',
                            class_name: 'gritter-warning'
                        });
                    }
                },
                error:function(msg){
                    errorDialog.show(msg);
                }
            });
        }
    },
    auConfig : function(roleId) {
        edit("/system/role/showRoleMenu?roleId="+roleId,"设置权限",400,400,false);
    },
    addRole : function() {
        edit("/system/role/add","添加角色",350,200,false);
    },
    editRole : function(roleId) {
        edit("/system/role/toUpdate?id="+roleId,"修改角色",300,200,false);
    }
};

$(function() {
    roleFacade.init();
    // 初始化查询条件
	$("#searchBtn").click(roleFacade.query);
    roleFacade.query();
});
