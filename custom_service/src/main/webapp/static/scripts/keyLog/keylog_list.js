var currentPage = 1; //第几页 
var recordsPerPage = 20; //每页显示条数
var currentSelectedLineUserName = 1;

var currentDialog;
$(function() {
	//初始化

	page_init();
});

function page_init() {

	pageControl();
	$('.input-daterange').datepicker({autoclose:true, format:'yyyy-mm-dd'});
	$("#businessId").change(getColumns);

//	searchAction();
}

function getColumns() {
	//校验参数
	if(!$("#businessId").val()) {
		//TODO 
		$("#columnName").html("");
	}else {
		$.post($("#ctx").val()+"/keyLog/findColumnsByBId", {businessId : $("#businessId").val()}, function(data){
			if(data && data.length > 0) {
				$("#columnName").html("");
				var str = "<option value=''></option>";
				for(var i = 0; i < data.length; i++) {
					str += "<option value='" + data[i] + "'>" + data[i] + "</option>";
				}
				$("#columnName").append(str);
			}
		}, 'json');
	}
}

function queryByPage() {
	
	//校验参数
	if(!$("#businessId").val()) {
		$.dialog.alert("请选择业务ID");
		return false;
	}
	var params = {curPage : currentPage, 
				  pageSize : recordsPerPage, 
				  businessId : $.trim($("#businessId").val())
				  };
	if($.trim($("#dataId").val())) {
		params['dataId'] = $.trim($("#dataId").val());
	}
	if($.trim($("#columnName").val())) {
		params['columnName'] = $.trim($("#columnName").val());
	}
	if($.trim($("#startTime").val())) {
		params['startTimeStr'] = $.trim($("#startTime").val());
	}
	if($.trim($("#endTime").val())) {
		params['endTimeStr'] = $.trim($("#endTime").val());
	}
	
	$("#tby tr").remove();
	$.post($("#ctx").val()+"/keyLog/list", params, function(data) {
		var array = data.data;
		$("#tby").html("");
		var tby = $("#tby");
		var totalPages = Math.ceil(data.totalCount / recordsPerPage);
		function translateStatus(status) {
			if (status == 0) {
				return "正常";
			} else if (status == 1) {
				return "失效";
			}
		}
		if (array && array.length > 0) {
			for (var i = 0, len = array.length; i < len; i++) {
				var tr = $("<tr style='border-bottom:1px solid;'></tr>");
				var td1 = $("<td style='word-wrap:break-word;word-break:break-all;white-space: pre-wrap;vertical-align: middle;'>" + array[i].businessId + "</td>");
				var td2 = $("<td style='word-wrap:break-word;word-break:break-all;white-space: pre-wrap;vertical-align: middle;'>" + array[i].idColumn + "</td>");
				var td3 = $("<td style='word-wrap:break-word;word-break:break-all;white-space: pre-wrap;vertical-align: middle;'>" + array[i].dataId + "</td>");
				tr.append(td1).append(td2).append(td3);
				if(array[i].details && array[i].details.length > 1) {
					var td4 = $("<td style='word-wrap:break-word;word-break:break-all;white-space: pre-wrap;padding:0;' height='100%' colspan='3'></td>");
					if(array[i].details) {
						var tb2 = $("<table class='table table-bordered' height='100%'></table>");
						for(var j = 0; j < array[i].details.length; j++) {
							var tdd3 = $("<td width='150' style='word-wrap:break-word;word-break:break-all;white-space: pre-wrap;margin:0;'>" + array[i].details[j].propName + "</td>");
							var tdd4 = $("<td width='100' style='word-wrap:break-word;word-break:break-all;white-space: pre-wrap;margin:0;'>" + array[i].details[j].preValue + "</td>");
							var tdd5 = $("<td width='100' style='word-wrap:break-word;word-break:break-all;white-space: pre-wrap;margin:0;'>" + array[i].details[j].postValue + "</td>");
							var tr2 = $("<tr height='100%' align='left' valign='middle'></tr>");
							tr2.append(tdd3).append(tdd4).append(tdd5);
							tb2.append(tr2);
						}
						td4.append(tb2);
					}
					tr.append(td4);
				}else if(array[i].details && array[i].details.length == 1){
					var tdd3 = $("<td width='150' style='word-wrap:break-word;word-break:break-all;white-space: pre-wrap;margin:0;'>" + array[i].details[0].propName + "</td>");
					var tdd4 = $("<td width='100' style='word-wrap:break-word;word-break:break-all;white-space: pre-wrap;margin:0;'>" + array[i].details[0].preValue + "</td>");
					var tdd5 = $("<td width='100' style='word-wrap:break-word;word-break:break-all;white-space: pre-wrap;margin:0;'>" + array[i].details[0].postValue + "</td>");
					tr.append(tdd3).append(tdd4).append(tdd5);
				}else{
					var tdd3 = $("<td width='150' style='word-wrap:break-word;word-break:break-all;white-space: pre-wrap;margin:0;'> </td>");
					var tdd4 = $("<td width='100' style='word-wrap:break-word;word-break:break-all;white-space: pre-wrap;margin:0;'> </td>");
					var tdd5 = $("<td width='100' style='word-wrap:break-word;word-break:break-all;white-space: pre-wrap;margin:0;'> </td>");
					tr.append(tdd3).append(tdd4).append(tdd5);
				}
				var td6 = $("<td style='word-wrap:break-word;word-break:break-all;white-space: pre-wrap;vertical-align: middle;'>" + $.dateFormat(array[i].createTime, 'yyyy-MM-dd hh:mm:ss') + "</td>");
				var td7 = $("<td style='word-wrap:break-word;word-break:break-all;white-space: pre-wrap;vertical-align: middle;'>" + array[i].createName + "</td>");
				tr.append(td6).append(td7);
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
