var addTransFacard = {
	queryWarehouseByCityUrl : '/common/findWarehouseByCityId',
	queryMatByWarehouseUrl : '/common/findMatListByWarehouse',
	queryMatBatchUrl : '/common/findMatBatch',
	saveUrl : '/warehouse/transfer/save',
	matBatchMap : {},
	matList : {},
    findWarehouse : function(obj) {
    	var id = "#" + $(obj).attr('target');
    	$(id).find('option').remove();
    	if($(obj).attr('target') == 'fromWarehouseId') {
    		inputSelectUtil.clean("#matName");
    		addTransFacard.cleanMatList();
    	}
    	addTransFacard.cleanMatInfo();
    	if($(obj).val() != null && $(obj).val() != '') {
    		$.post(addTransFacard.queryWarehouseByCityUrl, {cityId : $(obj).val()}, function(list){
    			$(id).find('option').remove();
    			if(list && list.length > 0) {
					$(id).append('<option value="">请选择</option>');
    				$(list).each(function() {
    					$(id).append('<option value="'+this.id+'">'+this.name+'</option>');
    				});
    			}
    		}, 'json');
    	}
    },
    findMaterialList : function(warehouseId) {
//    	var id = "#materialCode";
//    	$(id).find('option').remove();
//    	if(warehouseId != null && warehouseId != '') {
//    		$.post(addTransFacard.queryMatByWarehouseUrl, {'warehouseId' : warehouseId}, function(list){
//    			if(list && list.length > 0) {
//					$(id).append('<option value="">请选择</option>');
//    				$(list).each(function() {
//	    				var opt = $('<option value="'+this.code+'" matId="'+this.id+'">'+this.name+'</option>');
//	    				$(id).append(opt);
//    				});
//    				
//    			}
//    		}, 'json');
//    	}
    	inputSelectUtil.clean("#matName");
    	addTransFacard.cleanMatInfo();
    	addTransFacard.cleanMatList();
    	inputSelectUtil.init().load("#matName", {'warehouseId' : warehouseId});
    },
    findMaterialInfo : function(id, name, obj, node) {
    	addTransFacard.cleanMatInfo();
    	obj = eval("("+obj+")");
		$.post(addTransFacard.queryMatBatchUrl, 
			{'warehouseId' : $("#fromWarehouseId").val(), 'materialId' : obj.id}, 
			function(data){
    			if(data) {
    				addTransFacard.fillMatInfo(data);
    			}
    		}, 'json'
    	);
    },
    fillMatInfo : function(data) {
		if(data) {
			var mat = data.mat;
			var batch = data.batch;
			if(mat) {
				$("#materialName").val(mat.name);
				$("#materialId").val(mat.id);
				$("#standardName").val(mat.standardName);
				$("#transportUnit").val(mat.transportUnit);
				$("#transportUnitId").val(mat.transportUnitId);
				$("#supplierName").val(mat.supplierName);
				$("#costPrice").val(mat.costPrice);
			}
			if(batch && batch.length > 0) {
				$("#productionDate").append('<option value="">请选择</option>');
				$(batch).each(function() {
					var opt = $.dateFormat(this.productionDate, 'yyyy-MM-dd') + "/库存" + (this.goodNum);
    				$("#productionDate").append('<option value="'+this.id+'" num="'+(this.goodNum)+'" prodDate="'+$.dateFormat(this.productionDate, 'yyyy-MM-dd')+'">'+opt+'</option>');
				});
			}else {
				$("#productionDate").append('<option value="">无数据</option>');
			}
		}
    },
    cleanMatInfo : function() {
    	$("#productionDate").find('option').remove();
    	$(".mat_info").val('');
    },
    cleanMatList : function() {
    	$(".mat_tr").remove();
    },
    addMat : function() {
    	if(!$("#materialName").val()) {
    		alert("请选择物料");
    		return false;
    	}
    	if(!$("#productionDate").val()) {
    		alert("请选择生产日期");
    		return false;
    	}
    	if(!$("#expectQuantity").val() || $("#expectQuantity").val() <= 0 || isNaN($("#expectQuantity").val())) {
    		alert("请填写正确的数量");
    		return false;
    	}
    	if(parseInt($("#expectQuantity").val()) > parseInt($("#productionDate").find('option:selected').attr('num'))) {
    		alert("数量不能大于库存");
    		return false;
    	}
    	var flag = true;
    	$('.mat_tr').each(function() {
    		if($("#materialCode").val() == $(this).find('.materialCode').html()
	    		&& $("#productionDate").find('option:selected').attr('prodDate') == $(this).find('.productionDate').html()
	    		) {
    			flag = false;
    			alert('请勿重复添加物料');
    			return false;
    		}
    	});
    	if(!flag) {
    		return false;
    	}
    	var tr = 
    	"<tr class='mat_tr'><td class='materialCode'>" + $("#materialCode").val() + "</td>" +
    	"<td class='materialName'>" + $("#materialName").val() + "</td>" +
    	"<td class='productionDate'>" + $("#productionDate").find('option:selected').attr('prodDate') + "</td>" +
    	"<td class='expectQuantity'>" + $("#expectQuantity").val() + "</td>" +
    	"<td class='standardName'>" + $("#standardName").val() + "</td>" +
    	"<td class='transUnitName'>" + $("#transportUnit").val() + "</td>" +
    	"<td><a class='btn btn-default btn-xs' onclick='addTransFacard.deleteRow(this);'>删除</a>" +
    	"<input class='transUnitId' type='hidden' value='"+$("#transportUnitId").val()+"'>" + 
    	"<input class='materialId' type='hidden' value='"+$("#materialId").val()+"'>" + 
    	"<input class='costPrice' type='hidden' value='"+$("#costPrice").val()+"'>" + 
    	"</td>" +
    	"</tr>";
		$("#mat_body").append(tr);
    },
    deleteRow : function(obj) {
    	$(obj).parent().parent().remove();
    },
    getParams: function(){
    	if(!$("#fromCityId").val() || $("#fromCityId").val() == '') {
    		alert('请选择调出仓库城市');
    		return false;
    	}
    	if(!$("#fromWarehouseId").val() || $("#fromWarehouseId").val() == '') {
    		alert('请选择调出仓库');
    		return false;
    	}
    	if(!$("#toCityId").val() || $("#toCityId").val() == '') {
    		alert('请选择调入仓库城市');
    		return false;
    	}
    	if(!$("#toWarehouseId").val() || $("#toWarehouseId").val() == '') {
    		alert('请选择调入仓库');
    		return false;
    	}
    	if(!$("#expectDeliverTime").val() || $("#expectDeliverTime").val() == '') {
    		alert('请选择期望发货日期');
    		return false;
    	}
    	if($('.mat_tr').length == 0) {
    		alert('请添加调拨物料');
    		return false;
    	}
    	if($("#fromWarehouseId").val() == $("#toWarehouseId").val()) {
    		alert('调入仓库不能与调出仓库相同');
    		return false;
    	}
    	
    	var params = 'fromCityId=' + $("#fromCityId").val() +
    	'&fromWarehouseId=' + $("#fromWarehouseId").val() + 
    	'&toCityId=' + $("#toCityId").val() + 
    	'&toWarehouseId=' + $("#toWarehouseId").val() +
    	'&fromCityName=' + $("#fromCityId").find('option:selected').html() + 
    	'&fromWarehouseName=' + $("#fromWarehouseId").find('option:selected').html() +
    	'&toCityName=' + $("#toCityId").find('option:selected').html() +
    	'&toWarehouseName=' + $("#toWarehouseId").find('option:selected').html() +
    	'&expectDeliverTimeStr=' + $("#expectDeliverTime").val()
    	;
    	var i = 0;
    	$('.mat_tr').each(function() {
    		params += '&items['+i+'].materialId=' + $(this).find('.materialId').val()
    			+'&items['+i+'].materialName=' + $(this).find('.materialName').html()
    			+'&items['+i+'].materialCode=' + $(this).find('.materialCode').html()
    			+'&items['+i+'].productionDateStr=' + $(this).find('.productionDate').html()
    			+'&items['+i+'].expectQuantity=' + $(this).find('.expectQuantity').html()
    			+'&items['+i+'].transUnitId=' + $(this).find('.transUnitId').val()
    			+'&items['+i+'].transUnitName=' + $(this).find('.transUnitName').html()
    			+'&items['+i+'].costPrice=' + $(this).find('.costPrice').val()
    			+'&items['+i+'].standardName=' + $(this).find('.standardName').html();
    		i++;
    	});
    	return params;
    },
    save : function() {
    	var params = addTransFacard.getParams();
    	if(!params) {
    		return false;
    	}
    	$.post(addTransFacard.saveUrl, params, function(res){
    		if(res != null && res.code == '000000') {
    			alert('发起成功');
    			dialog.close();
    			parent.warehouseTransFacade.transList();
    		}else {
    			if(res.message) {
    				alert('发起失败:' + res.message);
    			} else {
    				alert('发起失败');
    			}
    		}
    	}, 'json');
    }
};

$(function() {
	$(".citySel").change(function() {
		addTransFacard.findWarehouse(this);
	});
	$("#fromWarehouseId").change(function() {
		addTransFacard.findMaterialList($(this).val());
	});
	$("#materialCode").change(function() {
		addTransFacard.findMaterialInfo($(this).val());
	});
	$("#addMatBtn").click(function() {
		addTransFacard.addMat();
	});
	$("#saveBtn").click(function() {
		addTransFacard.save();
	});
	$('#expectDeliverTime').daterangepicker({
        'singleDatePicker' : true,
        'autoUpdateInput':false,
        'locale' : lan_local
    }).on('apply.daterangepicker', function(ev, picker){
        $(this).val(picker.startDate.format('YYYY-MM-DD'));
    });
});