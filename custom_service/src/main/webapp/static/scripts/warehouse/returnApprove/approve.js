var returnItemRceived = {
	grid_selector : "#itemList",
	url : '/returnApprove/getItemListById',
	updateUrl : '/returnApprove/updateStatus',
    // 加载数据详情
    query : function() {
        var _this = this;
        // 首次加载
        $(returnItemRceived.grid_selector).jqGrid({
            url : returnItemRceived.url,
            postData : {'id' : $("#id").val()},
            datatype : 'json',
            colNames : [ '物料编号', '物料名称' , '规格', '物流单位','生产日期', '数量','实收数量'],
            cmTemplate: {sortable:true},
            colModel : [ {
                name : 'materialCode',
                width : 90
            },  {
                name : 'materialName',
                width : 100,
            }, {
                name : 'materialStandard',
                width : 60
            }, {
                name : 'unitName',
                width : 60
            }, 
            
            
            {
                name : 'productionDate',
                width : 60,
                formatter : function(cellvalue, options, rowObject) {
                    return $.dateFormat(rowObject.productionDate,'yyyy-MM-dd');
                }
            }, {
                name : 'quantity',
                width : 60,
                align : 'center'
            }, {
                name : 'actualQuantity',
                width : 60,
                align : 'center'
            }],
            height : 'auto',
            viewrecords : true,
            autoHeight : true,
        });
        // 自适应宽度
        $.resizeGrid(returnItemRceived.grid_selector);
    },
    confirmReceive : function(status) {
    	var params = {};
    	params['id'] = $("#id").val();
    	params['status'] = status;
    	if(status == 20) {
    		if($("#result option:selected").val() == 0) {
    			alert('请选择处理结果');
    			return false;
    		}
    		params['result'] = $("#result").find("option:selected").val();
    	} else {
    		if(!$.trim($("#remark").val())) {
    			alert('请填写不通过原因备注');
    			return false;
    		}
    		params['remark'] = $("#remark").val();
    	}
    	$('.approve_btn').attr('disabled', true);
    	$.post(returnItemRceived.updateUrl, params, function(data) {
    	    $('.approve_btn').attr('disabled', false);
    		if(data.code != '000000') {
    			alert("操作成功");
    			dialog.close();
    			parent.returnApproveFacade.approveList();
    		} else {
    			alert(data.message);
    		}
    	}, 'json');
    },
    zoomOut : function(obj) {
    	var img = new Image();
    	img.src = $(obj).attr('src');
    	var bigLine = img.width > img.height ? img.width : img.height;
    	var width = img.width/(bigLine/400);
    	var height = img.height/(bigLine/400);
    	$(obj).parent().find('.img_big').css({'width' : width, 'height' : height});
    }
}

$(function() {
	returnItemRceived.query();
	
	$("#pass").click(function() {
		returnItemRceived.confirmReceive(20);
	});
	$("#reject").click(function() {
		returnItemRceived.confirmReceive(30);
	});
});