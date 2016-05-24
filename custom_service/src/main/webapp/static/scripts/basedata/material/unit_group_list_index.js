$(function () {

    //#data-list默认是隐藏的
    $('#data-list').show();
    $('#unit_group_add_btn').click(function(){
        $.dialog({
            title: '添加单位组',
            width: '700px',
            height: 500,
            content: 'url:/unitGroup/index/add'
        });
    });
    $('#unit_group_search_btn').click(function(){
        search();
    });
});

//打开删除窗口
function openUnitGroupDeleteWin(id,groupeName){
    $.dialog({
        content: '确定删除单位组：'+groupeName+'?',
        ok: function(){
            $.ajax({
                url: '/unitGroup/unitGroups/delete',
                type: 'POST',
                dataType: 'json',
                data: {id: id}
            }).done(function (ret) {
                if(ret.code===1){
                	$.dialog({title: '提示',content: '删除成功',icon: 'success.gif', ok : '确定'});
                    search();
                }else{
                    $.dialog.alert(ret.msg);
                }
            }).fail(function () {

            }).always(function () {

            });
        },
        cancelVal: '关闭',
        cancel: true /*为true等价于function(){}*/
    });
}

function search(){
    $("#unit_group_grid").jqGrid('setGridParam',{
        url : "/unitGroup/unitGroups/list?groupName="+$.trim($('#unit_group_name_search').val()),
        page:1
    }).trigger("reloadGrid");
    // 自适应宽度
    $.resizeGrid("#unit_group_grid");
}

//打开单位组编辑窗口
function openUnitGroupEditWin(id){
    $.dialog({
        title: '修改单位组',
        width: '700px',
        height: 500,
        content: 'url:/unitGroup/index/modify?id='+id
    });
}

function initUnitGroupGrig(){
    $("#unit_group_grid").jqGrid({
        url: '/unitGroup/unitGroups/list',
        datatype: 'json',
        colNames: ['单位组编码', '单位组名称', '操作列'],
        jsonReader: {
            root: "data",
            page: "curPage",
            total: "totalPage",
            records: "totalRows"
        },
        prmNames: {page: 'curPage', rows: 'pageSize', sort: 'sidx', order: 'sort'},
        cmTemplate: {sortable:true},
        colModel: [
            {
                name: 'id',
                width: 300,
                align: 'center'
            },
            {
                name: 'groupName',
                width: 500,
                align: 'center'
            },
            {
                name: 'id',
                width: 300,
                align: 'center',
                formatter : function(cellvalue,option,rowObject) {
                    var html = ' <button class="btn btn-minier btn-white btn-default btn-bold zs-auth" permission="/unitGroup/index/modify" onclick="openUnitGroupEditWin('+cellvalue+');"><i class="ace-icon fa fa-pencil-square-o blue"></i>修改</button>';
                    html += ' <button class="btn btn-minier btn-white btn-warning btn-bold zs-auth" permission="/unitGroup/unitGroups/delete" onclick="openUnitGroupDeleteWin('+cellvalue+',\''+rowObject.groupName+'\');"><i class="ace-icon fa fa-trash-o bigger-120 orange"></i>删除</button>';
                    return html;
                }
            }
        ],
        rowNum: 30,
        rowList: [30, 40, 50],
        pager: "#unit_group_grid_pager",
        pagerpos: 'left',
        width:1150,
        viewrecords: true,
        autoHeight : true,
        height:350,
        loadComplete: function () {
            var table = this;
            setTimeout(function () {
                updatePagerIcons(table);
                $.removeScrollX('#data-list');
            }, 0);
            $.authenticate();
        }
    });
    $.resizeGrid("#unit_group_grid");
}

