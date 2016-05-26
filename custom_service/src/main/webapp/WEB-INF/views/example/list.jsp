<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="sitemesh"
    uri="http://www.opensymphony.com/sitemesh/decorator"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
    <form role="form" class="row form-inline queryParams">
	    <div class="form-group">
		    <label for="name" class="col-sm-3 control-label text-right">姓名：</label>
		    <div class="col-sm-4">
		        <input type="text" class="form-control" id="name" placeholder="姓名">
		    </div>
	    </div>
        <div class="form-group">
            <label for="name" class="col-sm-3 control-label text-right">姓名：</label>
            <div class="col-sm-4">
                <input type="text" class="form-control" id="name" placeholder="姓名">
            </div>
        </div>
        <div class="form-group">
            <label for="name" class="col-sm-3 control-label text-right">姓名：</label>
            <div class="col-sm-4">
                <input type="text" class="form-control" id="name" placeholder="姓名">
            </div>
        </div>
        <div class="form-group">
            <label for="name" class="col-sm-3 control-label text-right">姓名：</label>
            <div class="col-sm-4">
                <input type="text" class="form-control" id="name" placeholder="姓名">
            </div>
        </div>
        <div class="form-group">
            <label for="name" class="col-sm-3 control-label text-right">姓名：</label>
            <div class="col-sm-4">
                <input type="text" class="form-control" id="name" placeholder="姓名">
            </div>
        </div>
        <div class="form-group">
            <label for="name" class="col-sm-3 control-label text-right">姓名：</label>
            <div class="col-sm-4">
                <input type="text" class="form-control" id="name" placeholder="姓名">
            </div>
        </div>
        <div class="form-group">
            <label for="name" class="col-sm-3 control-label text-right">姓名：</label>
            <div class="col-sm-4">
                <input type="text" class="form-control" id="name" placeholder="姓名">
            </div>
        </div>
    </form>
	<div class="jqGrid_wrapper">
		<table id="table_list_1"></table>
		<div id="pager_list_1"></div>
	</div>

<script type="text/javascript">
    $(function() {
    	/* $("#table_list_1").jqGrid({
            url: '${ctx}/index/findList',
            datatype : 'json',
            height: 250,
            autowidth: true,
            shrinkToFit: true,
            rowNum: 10,
            rowList: [10, 20, 30],
            colNames: ['姓名', '年龄'],
            colModel: [
                {name: 'name', width: 100, key:true},
                {name: 'age', width: 50}
            ],
            jsonReader : {root : "data",page : "curPage",total : "totalPage",records : "totalRows"},
            prmNames : {page : 'pagination.curPage',rows : 'pagination.pageSize',sort : 'pagination.sidx',order : 'pagination.sort'},
            pager: "#pager_list_1",
            viewrecords: true,
            caption: "列表示例",
            hidegrid: false
        }); */
    	var cols = [
                    {desc:'姓名', name: 'name', width: 100, key:true},
                    {desc:'年龄', name: 'age', width: 50}
                ];
	    loadTable("#table_list_1", "#pager_list_1", '${ctx}/index/findList', cols, '列表测试');
    });
    
    function loadTable(tableId, pagerId, actionUrl, columns, title){
    	var colNames = [];
    	if(columns && columns.length > 0) {
    		for(var i = 0; i < columns.length; i++) {
    			colNames.push(columns[i].desc);
    			columns[i]['sortable'] = false;
    		}
    		var options = {
                    url: actionUrl,
                    datatype : 'json',
                    height: 300,
                    autowidth: true,
                    shrinkToFit: true,
                    rowNum: 10,
                    rowList: [10, 20, 30],
                    colNames: colNames,
                    colModel: columns,
                    jsonReader : {root : "data",page : "curPage",total : "totalPage",records : "totalRows"},
                    prmNames : {page : 'pagination.curPage',rows : 'pagination.pageSize',sort : 'pagination.sidx',order : 'pagination.sort'},
                    pager: pagerId,
                    viewrecords: true,
                    hidegrid: false,
                    sortable:false,
                };
    		if(title) {
    			options['caption'] = title;
    		}
	    	$(tableId).jqGrid(options);
    	}
    }
    
</script>