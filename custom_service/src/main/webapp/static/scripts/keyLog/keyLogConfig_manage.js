var configManageFacade = {
	getColumnsUrl : '/keyLogConfig/getColumnsByTable',
	saveConfigUrl : '/keyLogConfig/saveConfig',
	getColumnsByTable : function() {
		var name = $("#tableNameHid").val();
		var _this = this;
		$.post(_this.getColumnsUrl, {'tableName' : name}, function(data) {
			if(data && data.length > 0) {
				$("#choseColumn").html('');
				var content = $("#columsText").val();
				var cols = [];
				if(content && content != '') {
					cols = content.split(',');
				}
				$(data).each(function() {
					var div = $("<div>");
					div.addClass('col-xs-6');
					
					var checked = '';
					for(var i = 0; i < cols.length; i++) {
						if(cols[i] == this) {
							checked = 'checked';
							break;
						}
					};
					
					div.html('<input class="columnBox" type="checkbox" '+checked+' value="'+this+'">' + this);
					$("#choseColumn").append(div);
				});
			}
		},'json');
	},
	selectColumn : function(id) {
		var content = '';
		if($(".columnBox:checked")) {
			$(".columnBox:checked").each(function(index) {
				content += $(this).val();
				if(index < ($(".columnBox:checked").length - 1)) {
					content += ",";
				}
			});
		}
		$("#columsText").val(content);
		closePop(id);
	},
	saveConfig : function() {
		var jsonParam = {};
		jsonParam['id'] = $("#configId").val();
		jsonParam['tableName'] = $.trim($("#tableNameHid").val());
		jsonParam['businessId'] = $.trim($("#businessId").val());
		jsonParam['idColumn'] = $("#idColumn").val();
		jsonParam['idComments'] = $("#idComments").val();
		jsonParam['conditions'] = $("#conditions").val();
		
		var columnText = $("#columsText").val();
		if(!columnText || columnText == "") {
			parent.$.dialog.alert('请选择监控字段');
			return false;
		}
		jsonParam['detailList'] = columnText;
		
		$.post(configManageFacade.saveConfigUrl, jsonParam, function(data){
			if(data.success) {
				parent.$.dialog({title: '提示',content: '保存成功',icon: 'success.gif', ok : '确定'});
				dialog.close();
				parent.keyLogconfigFacade.reload();
			}else {
				parent.$.dialog.alert('保存失败：' + data.msg);
			}
		}, 'json');
//		$.ajax({
//		      url:configManageFacade.saveConfigUrl,
//		      traditional: true,
//		      data:jsonParam,
//		      success : function(data) {
//		    	  
//		      }
//		});
	}
}
function closePop(id) {
	$("#"+id).dropdown('close');
}

$(function() {
	inputSelectUtil.init().load("#tableName", null);
	$("#confirmReceive").click(configManageFacade.saveConfig);
});