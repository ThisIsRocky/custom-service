var currentPage = 1; //第几页 
var recordsPerPage = 20; //每页显示条数
var currentSelectedLineUserName = 1;

var currentDialog;
$(function() {
	//初始化

	page_init();
});

function queryByPage() {
	$("#tby tr").remove();
	
	var params = {page : currentPage, rows : recordsPerPage, configKey : $.trim($("#configKey").val()), configGroup : $.trim($("#configGroup").val())};
	
	$.post($("#ctx").val()+"/systemConfig/list", params, function(data) {
		var array = data.data;
		$("#tby").html("");
		var tby = $("#tby");
		var totalPages = Math.ceil(data.totalRows / recordsPerPage);
		function translateStatus(status) {
			if (status == 0) {
				return "正常";
			} else if (status == 1) {
				return "失效";
			}
		}
		if (array.length > 0) {
			for (var i = 0, len = array.length; i < len; i++) {
				var td1 = $("<td style='word-wrap:break-word;word-break:break-all;white-space: pre-wrap;'>" + array[i].comments + "</td>");
				var td2 = $("<td style='word-wrap:break-word;word-break:break-all;white-space: pre-wrap;'>" + array[i].configGroup + "</td>");
				var td3 = $("<td style='word-wrap:break-word;word-break:break-all;white-space: pre-wrap;'>" + array[i].configKey + "</td>");
				var td4 = $("<td style='word-wrap:break-word;word-break:break-all;white-space: pre-wrap;'><pre>" + array[i].configValue + "</pre></td>");
				var td5 = $("<td style='word-wrap:break-word;word-break:break-all;white-space: pre-wrap;'>" + (array[i].createBy ? array[i].createBy : '') + "</td>");
				var td6 = $("<td style='word-wrap:break-word;word-break:break-all;white-space: pre-wrap;'>" + timeFormatter(array[i].createTime, 'yyyy-MM-dd hh:mm:ss') + "</td>");
				var td7 = $("<td style='word-wrap:break-word;word-break:break-all;white-space: pre-wrap;'>" + "<a class='btn btn-primary btn-xs' onclick='editConfig(\""+array[i].id+"\")'>编辑</a>&nbsp;&nbsp;<a class='btn btn-warning btn-xs' onclick='deleteConfig("+array[i].id+")' >删除</a>" + "</td>");
				var tr = $("<tr style='border-bottom:1px solid;'></tr>");
				tr.append(td1).append(td2).append(td3).append(td4).append(td5).append(td6).append(td7);
				tr.appendTo(tby);
			}
		} else {
			$("#tby").html("没有找到纪录！");
		}
		$("#totalPage_input").val(totalPages);
		$("#currentPage").html(currentPage);
		$("#totalRows").html(data.totalRows);
		$("#totalPage").html(totalPages);
	}, 'json');
	
}

function pageControl() {
	$("#searchBtn").click(searchAction);
	
	// 首页
	$("#firstPage").bind("click", function() {
		if (currentPage == 1) {
			$.gritter.add({
				title : '警告',
				text : '已到达首页',
				sticky : false,
				time : '5',
				class_name : 'gritter-warning'
			});
			return false;
		} else {
			currentPage = 1;
			queryByPage();
		}
	});

	// 上一页
	$("#prevPage").click(function() {
		if (currentPage == 1) {
			$.gritter.add({
				title : '警告',
				text : '已到达首页',
				sticky : false,
				time : '5',
				class_name : 'gritter-warning'
			});

			return false;

		} else {
			currentPage--;
			queryByPage();
		}
	});

	// 下一页
	$("#nextPage").click(function() {
		if (currentPage == $("#totalPage_input").val()) {
			$.gritter.add({
				title : '警告',
				text : '已到达末页',
				sticky : false,
				time : '5',
				class_name : 'gritter-warning'
			});

			return false;

		} else {
			currentPage++;
			queryByPage();
		}
	});

	// 末页
	$("#lastPage").bind("click", function() {
		currentPage = $("#totalPage_input").val();
		queryByPage();
	});
}

function searchAction() {
	currentPage = 1;
	queryByPage();
}

function page_init() {

	pageControl();
	searchAction();
}
var currentEditId;

function addConfig() {
	currentEditId = null;
	$("#p_configKey").attr('disabled', false);
	$("#p_configGroup").attr('disabled', false);
    opendWindow("新增配置");
}
function editConfig(configId) {
	currentEditId = configId;
	$("#p_configKey").attr('disabled', true);
	$("#p_configGroup").attr('disabled', true);
    opendWindow("编辑配置", configId);
}


function opendWindow(title, configId) {
	var url = $("#ctx").val()+'/systemConfig/toSave' + (configId ? ('?id='+configId) : '');
	$.showCommonEditDialog(url, title, 500, 240);
};

function save() {
	var configGroup = $.trim($("#p_configGroup").val());
	var configKey = $.trim($("#p_configKey").val());
	var  configValue = $.trim($("#p_configValue").val());
	var comments = $.trim($("#p_comments").val());

	var params = {};
	if(currentEditId) {
		params['id'] = currentEditId;
	}
	if(!currentEditId && !configGroup) {
		configGroup = '0';//没有分组时默认为0
	}
	params['configGroup'] = configGroup;
	if(!currentEditId && !configKey) {
		alert("配置名不能为空");
		return false;
	}else {
		params['configKey'] = configKey;
	}
	if(!configValue) {
		alert("配置值不能为空");
		return false;
	}else {
		params['configValue'] = configValue;
	}
	if(!comments) {
		alert("配置说明不能为空");
		return false;
	}else {
		params['comments'] = comments;
	}
	$.post($("#ctx").val()+"/systemConfig/save", params, function(data) {
		if(data.status == 'ERROR') {
			alert(data.message);
		}else {
			currentDialog.close();
			queryByPage();
		}
	}, 'json');
}

function deleteConfig(configId) {
	

    $.dialog.confirm('确定要删除吗？', function() {
    	$.post($("#ctx").val()+"/systemConfig/deleteConfig", {id:configId}, function(data) {
    		if(data.status == 'ERROR') {
    			$.dialog.alert(data.message);
    		}else {
    			$.dialog.alert("删除成功");
    			queryByPage();
    		}
    	}, 'json');
        return true;
    });

}


function loadDialog(titleStr) {
	currentDialog = $
            .dialog({
                title : titleStr,
                widht : 400,
                content : $("#editDiv").html()
            });
}
function timeFormatter(timeStamp, format) {
	var time = new Date(timeStamp);
	var o = {
		"M+" : time.getMonth() + 1,
		// month
		"d+" : time.getDate(),
		// day
		"h+" : time.getHours(),
		// hour
		"m+" : time.getMinutes(),
		// minute
		"s+" : time.getSeconds(),
		// second
		"q+" : Math.floor((time.getMonth() + 3) / 3),
		// quarter
		"S" : time.getMilliseconds()
	// millisecond
	};
	if (/(y+)/.test(format) || /(Y+)/.test(format)) {
		format = format.replace(RegExp.$1, (time.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	}
	for ( var k in o) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
					: ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
};