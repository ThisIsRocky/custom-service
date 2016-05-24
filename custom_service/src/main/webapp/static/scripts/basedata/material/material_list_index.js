$(function() {
	initTree();
	initGrid();
	//初始化可输入下拉框
	inputSelectUtil.init();
	$('#material_add_btn').click(
			function() {
				var unitCategoryLevel1Id = $('#material_category_level1_id')
						.val();
				var unitCategoryLevel2Id = $('#material_category_level2_id')
						.val();
				$.dialog({
					width : 850,
					height : 500,
					title : '添加物料',
					lock : true,
					content : 'url:/material/index/add?categoryLevel1='
							+ unitCategoryLevel1Id + '&categoryLevel2='
							+ unitCategoryLevel2Id
				});
			});
	$('#material_search_btn').click(function() {
		materialSearch();
	});
	$('#material_export_btn').click(function() {
		materialExport();
	});
});

function initTree() {
	var setting = {
		callback : {
			onClick : itemSelect
		},
		data : {
			simpleData : {
				enable : true,
				idKey : "levelId",
				pIdKey : "parentLevelId",
				rootPId : 0
			}
		}
	};
	$.ajax({
		url : '/materialCategory/categories/get',
		type : 'get',
		dataType : 'json'
	}).done(function(ret) {
		$.fn.zTree.init($("#orgTree"), setting, ret);
	}).fail(function() {
		$.dialog.alert('加载物料类目错误！');
	}).always(function() {

	});
}

function initGrid() {
	$("#material_grid")
			.jqGrid(
					{
						url : '/material/materials/list',
						datatype : 'json',
						colNames : [ '物料编号', '物料大类', '物料小类', '物料组', '物料名称', '助记码',
								'规格', '单位组', '采购模式', '是否启用', '操作列' ],
						jsonReader : {
							root : "data",
							page : "curPage",
							total : "totalPage",
							records : "totalRows"
						},
						prmNames : {
							page : 'curPage',
							rows : 'pageSize',
							sort : 'sidx',
							order : 'sort'
						},
						cmTemplate : {
							sortable : true
						},
						colModel : [
								{
									name : 'code',
									width : 80,
									align : 'center'
								},
								{
									name : 'categoryLevel1Name',
									width : 80,
									align : 'center'
								},
								{
									name : 'categoryLevel2Name',
									width : 80,
									align : 'center'
								},
								{
									name : 'materialGroupName',
									width : 80,
									align : 'center'
								},
								{
									name : 'name',
									width : 150,
									align : 'center'
								},
								{
									name : 'shortName',
									width : 80,
									align : 'center'
								},
								{
									name : 'standardName',
									width : 120,
									align : 'center'
								},
								{
									name : 'unitGroup',
									width : 100,
									align : 'center'
								},
								{
									name : 'purchaseType',
									width : 80,
									align : 'center',
									formatter : function(cellvalue) {
										if (cellvalue === 1) {
											return '集订分收';
										} else if (cellvalue === 2) {
											return '集采集配';
										} else {
											return '其它';
										}
									}
								},
								{
									name : 'isValid',
									index : 'isValid',
									width : 80,
									align : 'center',
									formatter : function(cellvalue) {
										if (cellvalue === 0) {
											return '否';
										} else if (cellvalue === 1) {
											return '是';
										} else {
											return '其它';
										}
									}
								},
								{
									name : 'id',
									index : 'id',
									width : 150,
									align : 'left',
									formatter : function(cellvalue, option,
											rowData) {
										var html = '';
										if (rowData.isEverValid === 1) {
											html += '<a href="javascript:void(0);" class="btn btn-minier btn-white btn-default btn-bold zs-auth" permission="/material/index/detail" onclick="openDetailWin('
													+ cellvalue + ')">详情</a>';
										} else {
											html += '<a href="javascript:void(0);" class="btn btn-minier btn-white btn-success btn-bold zs-auth" permission="/material/index/modify"  onclick="openEditWin('
													+ cellvalue + ')">编辑</a>';
										}
										html += '|';
										if (rowData.isValid === 1) {
											html += '<a href="javascript:void(0);" class="btn btn-minier btn-white btn-default btn-bold zs-auth" permission="/material/materials/disable"  onclick="disableMaterial('
													+ cellvalue + ')">禁用</a>';
										} else {
											html += '<a href="javascript:void(0);" class="btn btn-minier btn-white btn-success btn-bold zs-auth" permission="/material/materials/enable"  onclick="enableMaterial('
													+ cellvalue + ')">启用</a>';
										}
										if (rowData.isEverValid === 1) {
											html += '<span class="zs-auth" permission="/material/index/seniorModify">|</span><a href="javascript:void(0);" class="btn btn-minier btn-white btn-default btn-bold zs-auth" permission="/material/index/seniorModify" onclick="seniorModify('
													+ cellvalue + ')">编辑</a>';
										}
										return html;
									}
								} ],
						rowNum : 30,
						rowList : [ 10, 30, 50 ],
						pager : "#material_grid_pager",
						pagerpos : 'left',
						viewrecords : true,
						height : 320,
						width : 920,
						loadComplete : function() {
							var table = this;
							setTimeout(function() {
								updatePagerIcons(table);
							}, 0);
							$.authenticate();
						}
					});
}

function itemSelect(event, treeId, treeNode) {
	$(".level_name").html('');
	$(".level_id").val('');
	if(treeNode.categoryLevel == 0) {
		$('#material_category_level1_name').text('全部');
		$('#material_category_level1_id').val('');
	}else {
		for(var i = treeNode.categoryLevel; i > 0; i--) {
			var name = treeNode.name;
			var id = treeNode.id;
			$('#material_category_level'+i+'_name').text(name);
			$('#material_category_level'+i+'_id').val(id);
			treeNode = treeNode.getParentNode();
		}
	}
}

/**
 * 物料查询
 */
function materialSearch() {
	$("#material_grid").jqGrid(
			'setGridParam',
			{
				url : '/material/materials/list?'
						+ $('#material_form_search').formSerialize(),
				//        postData: $('#material_form_search').formSerialize(),
				page : 1
			}).trigger("reloadGrid");
}

/**
 * 物料批量导出
 */
function materialExport() {
	var url = '/material/materials/export?'
			+ $('#material_form_search').formSerialize();
	if ($("#downloadIfm").attr('src')) {
		$("#downloadIfm").attr('src', '');
	}
	$("#downloadIfm").attr('src', url);
}
function materialReload() {
	$("#material_grid").jqGrid('setGridParam', {
	//        url: '/material/materials/list?' + $('#material_form_search').formSerialize(),
	//        postData: $('#material_form_search').formSerialize(),
	//        page: 1
	}).trigger("reloadGrid");
}

/**
 * 打开编辑窗口
 * @param materiald
 */
function openEditWin(materialId) {
	$.dialog({
		width : 850,
		height : 500,
		title : '修改物料',
		content : 'url:/material/index/modify?id=' + materialId
	});
}

/**
 * 打开详情窗口
 * @param materiald
 */
function openDetailWin(materialId) {
	$.dialog({
		width : 850,
		height : 500,
		title : '物料详情',
		content : 'url:/material/index/detail?id=' + materialId
	});
}

function seniorModify(materialId) {
	$.dialog({
		width : 850,
		height : 500,
		title : '修改物料',
		content : 'url:/material/index/seniorModify?id=' + materialId
	});
}
/**
 * 禁用物料
 * @param materialId
 */
function disableMaterial(materialId) {
	$.dialog({
		content : '禁用物料后，门店将不可订购该物料。是否确认禁用该类别？',
		ok : function() {
			$.ajax({
				url : '/material/materials/disable',
				type : 'post',
				dataType : 'json',
				data : {
					id : materialId
				}
			}).done(function(ret) {
				if (ret.code === 1) {
					materialSearch();
				} else {
					$.dialog.alert(ret.msg);
				}
			}).fail(function() {

			}).always(function() {

			});
		},
		okVal : '确认禁用',
		cancelVal : '取消',
		cancel : true
	/*为true等价于function(){}*/
	});
}

/**
 * 启用物料
 * @param materialId
 */
function enableMaterial(materialId) {
	$.dialog({
		content : '启用物料后，门店可订购该物料。是否确认启用该类别？',
		ok : function() {
			$.ajax({
				url : '/material/materials/enable',
				type : 'post',
				dataType : 'json',
				data : {
					id : materialId
				}
			}).done(function(ret) {
				if (ret.code == '000000') {
					materialSearch();
				} else {
					$.dialog.alert(ret.msg);
				}
			}).fail(function() {

			}).always(function() {

			});
		},
		okVal : '确认启用',
		cancelVal : '取消',
		cancel : true
	/*为true等价于function(){}*/
	});
}