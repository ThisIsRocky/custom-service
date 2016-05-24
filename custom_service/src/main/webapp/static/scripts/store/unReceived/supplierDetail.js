var deilvieryItemRceived = {
    grid_selector : "#table-data-list",
    pager_selector : "#table-data-list-pager",
    detailsGrid: null, // 数据详情
    tempSelectedMat : null,
    acting : false,
    // 加载数据详情
    query : function() {
        $('#data-list').show();
        var _this = this;
        // 首次加载
        _this.detailsGrid = $(deilvieryItemRceived.grid_selector).jqGrid({
            postData : {'id' : $("#deliveryId").val()},
            datatype : 'json',
            colNames : [ '物料编号', '物料名称', '实收数量', '单位', '操作'],
            cmTemplate: {sortable:true},
            jsonReader : {  
                root: "data"
            },
            colModel : [ {
                name : 'materialCode',
                align : 'center',
                width : 100,
                key: true
            },  {
                name : 'materialName',
                width : 140,
                align : 'center',
            }, {
                name : 'receiveQuantity',
                width : 60,
                align : 'center',
                formatter : function(cellvalue, options, rowObject) {
                	return '<input class="receiveQuantity" style="text-align:right" materialId="'+rowObject.id+'" width="50" value="'+cellvalue+'">';
                }
            }, {
                name : 'transportUnit',
                align : 'center',
                width : 100
            }, {
                name : '',
                width : 50,
                align : 'center',
                formatter : function(cellvalue, options, rowObject) {
                	return '<button class="btn btn-minier btn-white btn-warning btn-bold" onclick="deilvieryItemRceived.deleteItem('+options.rowId+');"><i class="ace-icon fa fa-trash-o bigger-120 orange"></i>删除</button>';
                }
            }],
            pagerpos : 'left',
            height : 'auto',
            viewrecords : true,
            autoHeight : true,
            loadComplete : function() {
                var table = this;
                setTimeout(function() {
                    $.removeScrollX('#data-list');
                }, 0);
            }
        });
        // 自适应宽度
        $.resizeGrid(deilvieryItemRceived.grid_selector);
    },
    confirmReceive : function () {
    	if(deilvieryItemRceived.acting) {
    		return false;
    	}else {
    		$("#confirmReceive").attr("disabled","disabled");
    		deilvieryItemRceived.acting = true;
    	}
    	var itemIds = [];
    	var receiveQuantity = [];
    	var materialIds = [];
    	var items = $(".receiveQuantity");
    	if(!items || items.length == 0) {
			parent.$.dialog.alert('请先添加收到的物料');
			$("#confirmReceive").removeAttr("disabled");
    		deilvieryItemRceived.acting = false;
			return false;
    	}
    	for(var i = 0; i < items.length; i++) {
    		if(!$(items[i]).val() || $.trim($(items[i]).val()) == '' || isNaN($(items[i]).val())) {
    			$(items[i]).css('border-color', 'red');
    			$(items[i]).focus();
    			parent.$.dialog.alert('第'+(i+1) + '行数量错误');
				$("#confirmReceive").removeAttr("disabled");
        		deilvieryItemRceived.acting = false;
    			return false;
    		}else if(parseInt($(items[i]).val()) != $(items[i]).val() || $(items[i]).val() < 0) {
    			$(items[i]).css('border-color', 'red');
    			$(items[i]).focus();
    			parent.$.dialog.alert('第'+(i+1) + '行数量请填写大于0的整数');
				$("#confirmReceive").removeAttr("disabled");
        		deilvieryItemRceived.acting = false;
    			return false;
    		}else {
    			$(items[i]).css('border-color', '');
    			materialIds.push($(items[i]).attr("materialId"));
    			receiveQuantity.push($(items[i]).val());
    		}
    	}
    	$.post('/store/unReceived/receiveFromSupplier', 
    			{'id' : $("#deliveryId").val(), 
    			 'storeId'  : $("#storeId").val(), 
    			 'materialIds' : materialIds,
    			 'receiveQuantity' : receiveQuantity
    			 }, 
    			function(data) {
    				if(data.success) {
    					var msg = data.msg && data.msg != '' ? data.msg : '已确认收货成功';
    					if(parent){
    						parent.$.dialog({lock: true, title: '提示',content: msg,icon: 'success.gif', ok : function() {
    							dialog.close();
    							parent.storeUnrRceived.reload();
    						}});
    					}
    				}else {
    		    		deilvieryItemRceived.acting = false;
    					$("#confirmReceive").removeAttr("disabled");
    					if(parent) {
    						parent.$.dialog.alert(data.msg ? data.msg : '收货失败');
    					}else {
    						$.dialog.alert(data.msg ? data.msg : '收货失败');
    					}
    				}
    			}, 'json');
    },
    fillMaterial : function(id, name, jsonStr) {
    	var obj = eval('(' + jsonStr + ')');
    	deilvieryItemRceived.tempSelectedMat = obj;
    	$("#unitName").html(obj.transportUnit);
    },
    cleanData : function() {
    	deilvieryItemRceived.tempSelectedMat = null;
    	$("#unitName").html("");
    },
    addItem : function() {
    	if(!deilvieryItemRceived.tempSelectedMat) {
    		alert("请选择物料");
    		return false;
    	}
    	var rq = $("#receiveQuantity").val();
    	if(isNaN(rq) || rq < 0) {
    		alert("收货数量请填写大于零的整数");
    		return false;
    	}
    	//判断是否添加过
        var codes = $("#table-data-list").jqGrid("getCol", 'materialCode');
        for(var i = 0; i < codes.length; i++){
        	if(deilvieryItemRceived.tempSelectedMat.code == codes[i]) {
        		alert("此物料已添加，请选择其他物料");
        		return false;
        	}
        };
        var ids = jQuery("#table-data-list").jqGrid('getDataIDs');  
        //获得当前最大行号（数据编号）  
        var rowid = Math.max.apply(Math,ids);  
        //获得新添加行的行号（数据编号）  
        var newrowid = rowid+1;  
        var dataRow = {    
            id: deilvieryItemRceived.tempSelectedMat.id,  
            materialCode:deilvieryItemRceived.tempSelectedMat.code,
            materialName:deilvieryItemRceived.tempSelectedMat.name,
            receiveQuantity:rq,  
            transportUnit:deilvieryItemRceived.tempSelectedMat.transportUnit
        };
        $("#table-data-list").jqGrid("addRowData", newrowid,dataRow , "last");
        deilvieryItemRceived.tempSelectedMat = null;
    	$("#unitName").html("");
    	$("#receiveQuantity").val("");
    	inputSelectUtil.clean("#inputMaterialName");
        $.resizeGrid(deilvieryItemRceived.grid_selector);
    },
    deleteItem : function(rowId) {
        if(!rowId){
        	alert("请选择要删除的行");
        	return;
        }else{
            var data = $("#table-data-list").jqGrid("getRowData", rowId);
            $("#table-data-list").jqGrid("delRowData", rowId);
        }
        $.resizeGrid(deilvieryItemRceived.grid_selector);
    }
}

$(function() {
	deilvieryItemRceived.query();
	
	$("#confirmReceive").click(deilvieryItemRceived.confirmReceive);
	inputSelectUtil.init();
});