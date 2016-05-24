var warehouseMatFacade = {
    grid_selector : "#table-data-list",
    pager_selector : "#table-data-list-pager",
    detailsGrid: null, // 数据详情
    url : '/supplier/warehouse/findWarehouseMatPage',
    count : 0,
    init : true,
    idsToAdd : [],
    idsToDelete : [],
    resetIds : function() {
    	warehouseMatFacade.idsToAdd=[];
    	warehouseMatFacade.idsToDelete=[];
    },
    // 加载数据详情
    query : function() {
        var _this = this;
        // 首次加载
        _this.detailsGrid = $(warehouseMatFacade.grid_selector).jqGrid({
        	url : warehouseMatFacade.url,
            postData : {'warehouseId' : $("#id").val()},
            datatype : 'json',
            prmNames : {page:'curPage',rows:'pageSize', sort: 'sidx',order: 'sort'},
            colNames : [ '物料编号', '物料名称', '规格', '物流单位', '供应商编码', '供应商名称', '保质期', '是否启用', '采购价', '配送价', '大类', '小类', '物料组', '操作'],
            cmTemplate: {sortable:true},
            jsonReader : {  
                root: "data",
                page: "curPage",
                total: "totalPage",
                records: "totalRows"
            },
            colModel : [ {
                name : 'code',
                align : 'center',
                width : 100,
                key: true,
                formatter : function(value, options, rowObject) {
                	var val = '';
                	
                	if(value) {
            			val = '<input id="inputMaterialNameHid" class="idVal" type="hidden" value="'+rowObject.id+'" autocomplete="off"/>'+
            			'<input readonly="true" value="'+value+'"';
            			return val;
                	}else {
            			val = '<span class="">'+
            			'<input id="inputMaterialNameHid" class="idVal" type="hidden" autocomplete="off"/>'+
            			'<input id="inputMaterialName_'+warehouseMatFacade.count+'" class="inputSelect matName" keyId="id" keyName="{name}{#code}" ajax="true" url="/common/material/findByNameOrShortName?purchaseType=2" paramName="name" liClick="warehouseMatFacade.fillMaterial" selectMargin="0px" name="cityName" style="width:100px;" autocomplete="off" isNull="false" checkType="empty" placeholder="输入物料"/>'+
            			'</span>';
                	}
                	warehouseMatFacade.count++;
                	return val;
                }
            },  {
                name : 'name',
                width : 150,
                align : 'center',
            }, {
                name : 'standardName',
                width : 60,
                align : 'center'
            }, {
                name : 'transportUnit',
                align : 'center',
                width : 70
            }, {
                name : 'supplierCode',
                align : 'center',
                width : 70
            }, {
                name : 'supplierName',
                align : 'center',
                width : 100
            }, {
                name : 'shelfLife',
                align : 'center',
                width : 50
            }, {
                name : 'isValid',
                align : 'center',
                width : 50,
                formatter : function(value, options, rowObject) {
                	if(!value) {
                		return "";
                	}
                	return value == 1 ? '是' : '否';
                }
            }, {
                name : 'costPrice',
                align : 'center',
                width : 40
            }, {
                name : 'supplierPrice',
                align : 'center',
                width : 40
            }, {
                name : 'categoryLevel1Name',
                align : 'center',
                width : 40
            }, {
                name : 'categoryLevel2Name',
                align : 'center',
                width : 40
            }, {
                name : 'materialGroupName',
                align : 'center',
                width : 40
            }, {
                name : 'id',
                width : 50,
                align : 'center',
                formatter : function(cellvalue, options, rowObject) {
                	return '<button class="btn btn-minier btn-white btn-warning btn-bold" onclick="warehouseMatFacade.deleteItem('+options.rowId+','+cellvalue+');"><i class="ace-icon fa fa-trash-o bigger-120 orange"></i>删除</button>';
                }
            }],
            rowNum : 10,
            rowList : [ 10, 30, 50 ],
            pager : warehouseMatFacade.pager_selector,
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
                warehouseMatFacade.init = false;
                $("#table-data-list").parent().css("position", "");
                $("#table-data-list").parent().parent().removeClass("ui-jqgrid-bdiv");
            }
        });
        // 自适应宽度
        $.resizeGrid(warehouseMatFacade.grid_selector);
    },
    reload : function() {
        // 根据搜索条件，重新加载
        $(warehouseMatFacade.grid_selector).jqGrid('setGridParam',{
            url : warehouseMatFacade.url,
            //postData : params,
            page:1
        }).trigger("reloadGrid");
        warehouseMatFacade.resetIds();
    },
    save : function () {
    	var params = 'warehouseId='+$("#id").val();
    	var items = $(".matName");
    	for(var i = 0; i < items.length; i++) {
    		if(!$.trim($(items[i]).val())) {
    			$(items[i]).focus();
    			parent.$.dialog.alert('第'+(i+1) + '行物料为空');
    			return false;
    		}else {
    			params += '&matIdToAdd='+$(items[i]).parent().find('.idVal').val();
    		}
    	}
    	for(var i = 0; i < warehouseMatFacade.idsToDelete.length; i++) {
    		if(warehouseMatFacade.idsToDelete.length > 0) {
    			params += '&matIdToDelete='+warehouseMatFacade.idsToDelete[i];
    		}
    	}
    	$.ajax({
    		type : 'POST',
    		url: '/supplier/warehouse/saveWarehouseMat', 
    		traditional : true,
    		data : params,
    		success : function(data) {
				if(data.code == 1) {
					parent.$.dialog({lock : true, title: '提示',content : "保存成功",icon: 'success.gif', ok : function() {
						warehouseMatFacade.reload();
					}});
				}else {
					parent.$.dialog.alert(data.msg ? data.msg : '保存失败');
				}
			},
			dataType : 'json'
    	});
    },
    fillMaterial : function(id, name, jsonStr, node) {
    	//判断物料是否在新增但未提交的物料中
    	var flag = true;
    	$(".inputSelect").each(function(){
    		var addedMat = $(this).parent().find(".idVal").val();
    		if(id == addedMat && node != "#" + $(this).attr("id")) {
    			alert("物料已添加，请勿重复添加");
    			flag = false;
    			inputSelectUtil.clean(node);
    			return false;
    		}
    	});
    	
    	if(!flag) {
    		return false;
    	}
    	
    	//查询物料，也要校验物料是否已维护
    	$.post('/common/material/findMaterialSupInfo', {'id': id, 'warehouseId' : $("#id").val()}, function(data) {
    		if(data.error) {
    			alert(data.error);
    			inputSelectUtil.clean(node);
    			return false;
    		}
    		var tr = $(node).parent().parent().parent();
    		var propArr = ['name','standardName','transportUnit','supplierCode','supplierName',
    		               'shelfLife','isValid','costPrice','supplierPrice',
    		               'categoryLevel1Name','categoryLevel2Name','materialGroupName'];
    		for(var i = 1; i <= propArr.length; i++) {
    			if(propArr[i-1] == 'isValid') {
    				$($(tr).find("td").get(i)).html(data.obj[propArr[i-1]] == 1 ? '是' : '否');
    			}else {
    				$($(tr).find("td").get(i)).html(data.obj[propArr[i-1]]);
    			}
    		}
    	}, 'json');
    },
    addItem : function() {
    	//判断是否添加过
        var ids = jQuery("#table-data-list").jqGrid('getDataIDs');  
        //获得当前最大行号（数据编号）  
        var rowid = Math.max.apply(Math,ids);  
        //获得新添加行的行号（数据编号）  
        var newrowid = rowid+1;
        var dataRow = {
            
        };
        $("#table-data-list").jqGrid("addRowData", newrowid,dataRow , "last");
        $.resizeGrid(warehouseMatFacade.grid_selector);
    	inputSelectUtil.init();
    },
    deleteItem : function(rowId, id) {
        if(!rowId){
        	alert("请选择要删除的行");
        	return;
        }else{
            var data = $("#table-data-list").jqGrid("getRowData", rowId);
            $("#table-data-list").jqGrid("delRowData", rowId);
            if(id) {
            	warehouseMatFacade.idsToDelete.push(id);
            }
        }
        $.resizeGrid(warehouseMatFacade.grid_selector);
    }
}

$(function() {
	warehouseMatFacade.query();
	
//	$("#confirmReceive").click(warehouseMatFacade.confirmReceive);
//	inputSelectUtil.init();
});