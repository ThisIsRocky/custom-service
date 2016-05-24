function save() {
	var configGroup = $.trim($("#p_configGroup").val());
	var configKey = $.trim($("#p_configKey").val());
	var  configValue = $.trim($("#p_configValue").val());
	var comments = $.trim($("#p_comments").val());

	var params = {};
	if($("#configId")) {
		params['id'] = $("#configId").val();
	}
	if(!configGroup) {
		configGroup = '0';//没有分组时默认为0
	}else if(configGroup.length > 30) {
		alert("配置组名最大长度30");
		return false;
	}
	params['configGroup'] = configGroup;
	if(!configKey) {
		alert("配置名不能为空");
		return false;
	}else if(configKey.length > 30) {
		alert("配置名最大长度30");
		return false;
	}else{
		params['configKey'] = configKey;
	}
	if(!configValue) {
		alert("配置值不能为空");
		return false;
	}else if(configValue.length > 1000) {
		alert("配置值最大长度1000");
		return false;
	}else {
		params['configValue'] = configValue;
	}
	if(!comments) {
		alert("配置说明不能为空");
		return false;
	}else if(comments.length > 100) {
		alert("配置说明最大长度100");
		return false;
	}else {
		params['comments'] = comments;
	}
	$.post($("#ctx").val()+"/systemConfig/save", params, function(data) {
		if(data.status == 'ERROR') {
			alert(data.message);
		}else {
			dialog.close();
			parent.queryByPage();
		}
	}, 'json');
}
