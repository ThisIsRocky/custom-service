var userFacade = {
    detailsGrid: null, // 数据详情
    url : "/system/user/list",
    grid_selector : "#table-data-list",
    pager_selector : "#table-data-list-pager",
    init : function() {
        var _this = userFacade;
        // 首次加载
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
            prmNames : {page:'curPage',rows:'pageSize', sort: 'sidx',order: 'sort'},
            cmTemplate: {sortable:true},
            colNames : [ 'ID', '用户名', '姓名', '角色', '邮箱', '手机号', '状态', '操作'],
            colModel : [
                {name : 'id',  width : 60, key : true},
                {name : 'userName', width : 200},
                {name : 'name', width : 200},
                {name : 'roleNames', width : 200},
                {name : 'email', width : 200},
                {name : 'phoneNo', width : 200},
                {name : 'status', width : 50},
                {name : 'myac', width:100, fixed:true, sortable:false, resize:false,align:'center',
                    formatter : function(cellvalue, options, rowObject) {
                        var retVal = '<button class="btn btn-minier btn-white btn-default btn-bold zs-auth" permission="/system/user/toUpdate" onclick="userFacade.editUser('+rowObject.id+');"><i class="ace-icon fa fa-pencil-square-o blue"></i>修改</button>';
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
                    $.authenticate();
                    $.removeScrollX('#data-list');
                }, 0);
            }
        });
        // 自适应宽度
        $.resizeGrid(_this.grid_selector);
    },
    query : function() {
        var _this = userFacade;
        // 根据搜索条件，重新加载
        $(_this.grid_selector).jqGrid('setGridParam',{
            url : userFacade.url+"?"+$("form").serialize(),
            page: 1
        }).trigger("reloadGrid");
        // 自适应宽度
        $.resizeGrid(_this.grid_selector);
    },
    editUser : function(userId) {
        edit("/system/user/toUpdate?id="+userId,"修改用户",400,380,false);
    },
    addUser : function(){
        edit("/system/user/toAdd", "添加用户", 400, 380, false);
    }
};

$(function() {
    userFacade.init();
    // 初始化查询条件
	$("#searchBtn").click(userFacade.query);
    $("#userAddBtn").click(userFacade.addUser);
    userFacade.query();
});
