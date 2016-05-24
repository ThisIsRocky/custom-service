(function($) {
	$.fn.datepicker.dates['zh-CN'] = {
        days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
        daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        daysMin:  ["日", "一", "二", "三", "四", "五", "六", "日"],
        months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        today: "今日",
        format: "yyyy年mm月dd日",
        weekStart: 1,
        clear: "清空"
    };
	$.fn.extend({
              // 设置 apDiv
        hintError:function (msg,timer) {
            timer = timer ? timer : 1000;
            var hintPanel = $(this).parents('.panel');
            $(hintPanel).addClass('hint-err-panel');
            $(hintPanel).children('.fa-hint').addClass('fa-hint-err');
            $(hintPanel).children('.fa-hint').children('span:first').html(msg);
            setTimeout(function() {
                $(hintPanel).removeClass('hint-err-panel');
                $(hintPanel).children('.fa-hint').children('span:first').html('');
                $(hintPanel).children('.fa-hint').removeClass('fa-hint-err');
            }, 1000);
        },
        hintOk:function (msg,timer) {
            timer = timer ? timer : 1000;
            var hintPanel = $(this).parents('.panel');
            $(hintPanel).children('.fa-hint').children('span:first').html(msg);
            setTimeout(function() {
                $(hintPanel).children('.fa-hint').children('span:first').html('');
            }, 1000);
        }
      });
	$.extend({
		alertSuccess : function(msg) {
			var alert = $('<div class="alert alert-success" style="position: fixed;top: 1%;right: 1%;width:400px;"><button type="button" class="close" data-dismiss="alert"><i class="ace-icon fa fa-times"></i></button>'+msg+'</div>').appendTo($("body"));
		    setTimeout(function(){
		        alert.fadeOut(2000, function() {
		            alert.remove();
		        });  
		    },3000);
		},
		alertError : function(msg) {
			var alert = $('<div class="alert alert-danger" style="position: fixed;top: 1%;right: 1%;width:400px;"><button type="button" class="close" data-dismiss="alert"><i class="ace-icon fa fa-times"></i></button>'+msg+'</div>').appendTo($("body"));
		    setTimeout(function(){
		        alert.fadeOut(2000, function() {
		            alert.remove();
		        });  
		    },3000);
		},
		authenticate : (function (callback) {
            var permissions = null;
            var authImpl = function () {
                var toAuthenticate = $(".zs-auth");
                if (permissions != null && permissions != "") {
                    for (var i = 0; i < permissions.length; i++) {
                        toAuthenticate.filter("[permission='" + permissions[i] + "']").removeClass("zs-auth");
                    }
                }
            };
            return function (callback) {
                if (permissions) {
                    authImpl();
                } else {
                    $.ajax({
                        type: "get",
                        url: "/authenticate",
                        dataType: "json",
                        success: function (data) {
                            permissions = data;
                            authImpl();
                            if(callback) {
                                callback();
                            }
                        },
                        error: function (msg) {
                            alert(msg);
                        }
                    });
                }
            };
        })(),
		dateFormat: function(now,fmt) {
			if(now !=null){
				var dateTime = new Date(now);
				return dateTime.format(fmt)
			}
			return "";
		},
	    initDatePicker : function(id, callback) {
	    	if($(id)) {
	    		var options = {'minDate' : "2015-01-01",
//	    				'locale': lan_local,
	    				'applyClass' : 'btn-sm btn-success',
		    			'cancelClass' : 'btn-sm btn-default'};
	    		var separator = '-';
	    		if($(id).attr('separator')) {
	    			separator = $(id).attr('separator');
	    			lan_local['separator'] = separator;
	    		}
	    		if($(id).attr('startDate')) {
	    			options['startDate'] = $(id).attr('startDate');
		    		$(id).parent().find(".startDateHid").val($(id).attr('startDate'));
	    		}
	    		if($(id).attr('endDate')) {
	    			options['endDate'] = $(id).attr('endDate');
		    		$(id).parent().find(".endDateHid").val($(id).attr('endDate'));
	    		}
	    		if($(id).attr('minDate')) {
	    			options['minDate'] = $(id).attr('minDate');
	    		}
	    		if($(id).attr('dateLimit')) {
	    			options['dateLimit'] = {
	    				"days": $(id).attr('dateLimit')
	    			};
	    		}
	    		if($(id).attr('maxDate')) {
	    			options['maxDate'] = $(id).attr('maxDate');
	    		}
	    		if($(id).attr('data-date-format')) {
	    			lan_local['format'] = $(id).attr('data-date-format');
	    		}
	    		if($(id).attr('autoUpdateInput')) {
	    			options['autoUpdateInput'] = $(id).attr('autoUpdateInput');
	    		}
	    		options['locale'] = lan_local;

	    		$(id).daterangepicker(options).on('apply.daterangepicker', function(){
	    			var start = $(id).val().split(lan_local.separator)[0];
	    			var end = $(id).val().split(lan_local.separator)[1];
	    			$(id).parent().find(".startDateHid").val(start);
	    			$(id).parent().find(".endDateHid").val(end);
	    			if(callback) {
	    				callback();
	    			}
	    		}).prev().on(ace.click_event, function(){
	    			$(this).next().focus();
	    		});
	    		if($(id).attr('defaultNull') && $(id).attr('defaultNull') == "true") {
	    			$(id).val("");
	    		}
	    	}
	    },
	    initTree : function(id, zTreeNodes, userSetting) {
	    	var setting = {
	    		data: {
	    			simpleData: {
	    				enable: true,
	    				idKey: "id",
	    				pIdKey: "pId",
	    				rootPId: 0
	    			}
	    		},
	            view: {
	        		addHoverDom: addHoverDom,
	        		removeHoverDom: removeHoverDom,
	                selectedMulti: false
	            },
	            check: {
	                enable: true,
	                chkStyle: 'checkbox',
	            },
	            edit: {
	                enable: true,
	        		showRemoveBtn: true,
	        		showRenameBtn: true
	            }
	    	};
	    	$(id).addClass("ztree");
	    	return $.fn.zTree.init($(id), setting, zTreeNodes);
	    },
	    showCommonEditDialog : function(url, title, width, height) {
			$.dialog({
	    		id : 'showCommonDeleteDialog',
			    lock: true,
				title : title,
				content : "url:"+url,
			    width: width,
			    height: height,
			    drag: true,
			    resize: true,
			    icon: 'alert.gif'
			});
	    },
	    showImageView : function(src) {
	    	var img = new Image();
	        img.src = src;
	        img.onload = function () 
	        { 
	        	var bigLine = img.width > img.height ? img.width : img.height;
	            var width = img.width/(bigLine/400);
	            var height = img.height/(bigLine/400);
	            $.dialog({
		    		id : 'showCommonDeleteDialog',
				    lock: true,
					title : "图片预览",
					content : "<i class='ace-icon fa fa-2x fa-floppy-o img-save' style='position: absolute;right:0%;top: 6px;' title='保存图片'></i><img class='img_big'></img>",
				    width: width,
				    height: height,
				    drag: true,
				    resize: true,
				    min:false,
				    max:false
				});
	            $(parent.document).on('click', '.img-save', function(event) {
	            	var src = $(this).next().attr('src');
	            	window.open(src,"_blank");
	            });
	            $('.img_big',parent.document).css({'width' : width, 'height' : height});
	            $('.img_big',parent.document).attr('src', src);
	        }
	    },
	    showAjaxEditDialog : function(url, title, width, height) {
	        
	        var _dialog = $.dialog({
                id : 'showAjaxEditDialog',
                lock: true,
                title : title,
                width: width,
                height: height,
                drag: true,
                resize: true
            });
	        
	        $.ajax({
	            url: url,
	            success:function(data){
	                _dialog.content(data);
	            },
	            cache:false
	        });
        },
	    // 表格自适应宽高
	    // grid_selector:表格ID
	    resizeGrid: function(grid_selector){
	        // 1.resize to fit page size
	        var parent_column = $(grid_selector).closest('[class*="col-"]');
	        $(window).on('resize.jqGrid.' + grid_selector, function() {
	            if(!parent_column.is(':hidden')){
	                $(grid_selector).jqGrid('setGridWidth', parent_column.width());
	                setTimeout(function(){
	                    $(grid_selector).jqGrid('setGridWidth', parent_column.width());
                        var div = parent_column;
                        if(!div.is(':hidden')) {
                            var head = div.find(".ui-jqgrid-bdiv");
                            head.width(head.width()+1);
                            var body = div.find(".ui-jqgrid-hdiv");
                            body.width(body.width() + 1)
                        }
	                }, 300);
	            }
	        })
	        // 2.resize on sidebar collapse/expand
	        $(document).on('settings.ace.jqGrid', function(ev, event_name, collapsed) {
	            if (event_name === 'sidebar_collapsed' || event_name === 'main_container_fixed') {
	                setTimeout(function() {
	                    if(!parent_column.is(':hidden')){
	                        $(grid_selector).jqGrid('setGridWidth', parent_column.width());
	                    }
	                }, 0);
	            }
	        })
	        $(grid_selector).closest(".ui-jqgrid-bdiv").css({ 'overflow-x' : 'hidden' });
	        $(window).triggerHandler('resize.jqGrid.' + grid_selector);
	    },
	    removeScrollX: function(id){
//	    	var div = $(id);
//	    	if(!div.is(':hidden')) {
//	    	    var head = div.find(".ui-jqgrid-bdiv");
//	    	    head.width(head.width()+1);
//	    	    var body = div.find(".ui-jqgrid-hdiv");
//	    	    body.width(body.width() + 1)
//	    	}
	    },
	    initTabs : function (id) {
	        $(id).tabs();
	        $(id).find("ul>li").each(function(index) {
	            if($(this).css('display') != 'none') {
	                $(this).click();
	                $(id).tabs( "option", "active", index );
	                return false;
	            }
	        });
	    },
	    keepAlive : function(min) {
            var intervalId = window.setInterval(function() {
            	$.post('/common/keepAlive');
            }, 1000 * 60 * min);//9分钟请求一次 
            
	    },
        initMultiselect : function($element, options) {
            var defaultOptions = {
                disableIfEmpty: true,
                nonSelectedText: '未选择',
                nSelectedText: '项已选择',
                allSelectedText: '已选择全部',
                includeSelectAllOption: true,
                selectAllText: '全选',
                filterPlaceholder: "搜索",
                buttonClass: 'btn btn-white',
                templates: {
                    button: '<button type="button" class="multiselect dropdown-toggle" data-toggle="dropdown"><span class="multiselect-selected-text"></span> &nbsp;<b class="fa fa-caret-down"></b></button>',
                    ul: '<ul class="multiselect-container dropdown-menu"></ul>',
                    filter: '<li class="multiselect-item filter"><div class="input-group"><span class="input-group-addon"><i class="fa fa-search"></i></span><input class="form-control multiselect-search" type="text"></div></li>',
                    filterClearBtn: '<span class="input-group-btn"><button class="btn btn-default btn-white btn-grey multiselect-clear-filter" type="button"><i class="fa fa-times-circle red2"></i></button></span>',
                    li: '<li><a tabindex="0"><label></label></a></li>',
                    divider: '<li class="multiselect-item divider"></li>',
                    liGroup: '<li class="multiselect-item multiselect-group"><label></label></li>'
                }
            };
            $element.multiselect($.extend(defaultOptions, options || {}));
        }
	});
})(jQuery);

function addHoverDom(treeId, treeNode) {
	var aObj = $("orgTree_" + treeNode.tId + "_a");
	if ($("#diyBtn_"+treeNode.id).length>0) return;
	var editStr = "<span id='diyBtn_space_" +treeNode.id+ "' > </span>"
		+ "<button type='button' class='diyBtn1' id='diyBtn_" + treeNode.id
		+ "' title='"+treeNode.name+"' onfocus='this.blur();'></button>";
	aObj.append(editStr);
	var btn = $("#diyBtn_"+treeNode.id);
	if (btn) btn.bind("click", function(){alert("diy Button for " + treeNode.name);});
};
function removeHoverDom(treeId, treeNode) {
	$("#diyBtn_"+treeNode.id).unbind().remove();
	$("#diyBtn_space_" +treeNode.id).unbind().remove();
};


// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.format = function(fmt)
{ //author: meizz
	var o = {
		"M+" : this.getMonth()+1,                 //月份
		"d+" : this.getDate(),                    //日
		"h+" : this.getHours(),                   //小时
		"m+" : this.getMinutes(),                 //分
		"s+" : this.getSeconds(),                 //秒
		"q+" : Math.floor((this.getMonth()+3)/3), //季度
		"S"  : this.getMilliseconds()             //毫秒
	};
	if(/(y+)/.test(fmt))
		fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
	for(var k in o)
		if(new RegExp("("+ k +")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
	return fmt;
};

function isInteger(val) {
    return $.isNumeric(val) && Math.floor(val) == val;
}

function parseDateFromISO(isoStr) {
    var dateStr = isoStr.replace(/\-/g, "/");
    return new Date(isoStr);
}

function parseDateFromYYYYMMDD(dateStr) {
    var year = dateStr.substring(0, 4);
    var month = dateStr.substring(4, 6);
    var day = dateStr.substring(6);
    return new Date(year + "/" + month + "/" + day);
}

function dateDiffInDays(a, b) {
    var _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}
/**
 * 初始化1级类目
 * @param level1Id
 * @param level2Id
 */
function initCategoryLevel1(level1Id, level2Id, callBack) {
    $.ajax({
        url: '/materialCategory/level1Categories/list',
        type: 'GET',
        dataType: 'json'
    }).done(function (ret) {
        var html = '';
        if (ret != null && ret.length > 0) {
            for (var i = 0; i < ret.length; i++) {
                var item = ret[i];
                html += '<option value="' + item.id + '">' + item.name + '</option>';
                $level1CategoryMap[item.id] = item.code;
            }
        }
        $('#material_category_level1_modify').html(html);
        if (level1Id != null && level1Id != '') {
            $('#material_category_level1_modify').val(level1Id);
        }
        initCategoryLevel2($('#material_category_level1_modify').val(), level2Id, callBack);
        var code = $level1CategoryMap[$('#material_category_level1_modify').val()];
        $('#category_code_modify').val(code);
    }).fail(function () {

    }).always(function () {

    });

}

/**
 * 初始化2级类目
 * @param level2Id
 */
function initCategoryLevel2(level1Id, level2Id, callBack) {
    $.ajax({
        url: '/materialCategory/level2Categories/find',
        type: 'GET',
        dataType: 'json',
        data: {id: level1Id}
    }).done(function (ret) {
        var html = '';
        if (ret != null && ret.length > 0) {
            for (var i = 0; i < ret.length; i++) {
                var item = ret[i];
                html += '<option value="' + item.id + '" data_category_code="' + item.code + '">' + item.name + '</option>';
                $level2CategoryMap[item.id] = item.code;
            }
        }
        $('#material_category_level2_modify').html(html);
        if (level2Id != null && level2Id != '') {
            $('#material_category_level2_modify').val(level2Id);
        }
        if ($('#category_code_modify').val()) {
            var code = $('#category_code_modify').val().concat($level2CategoryMap[$('#material_category_level2_modify').val()]);
            $('#category_code_modify').val(code);
            if (callBack != null) {
                callBack();
            }
        }
    }).fail(function () {

    }).always(function () {

    });
}


/**
 * 初始化1级类目
 * @param level1Id
 * @param level2Id
 */
function initCategoryLevel1AndCallBack(level1Id, level2Id, callBack) {
    $.ajax({
        url: '/materialCategory/level1Categories/list',
        type: 'GET',
        dataType: 'json'
    }).done(function (ret) {
        var html = '';
        if (ret != null && ret.length > 0) {
            for (var i = 0; i < ret.length; i++) {
                var item = ret[i];
                html += '<option value="' + item.id + '">' + item.name + '</option>';
                $level1CategoryMap[item.id] = item.code;
            }
        }
        $('#material_category_level1_modify').html(html);
        if (level1Id != null && level1Id != '') {
            $('#material_category_level1_modify').val(level1Id);
        }
        initCategoryLevel2AndCallBack($('#material_category_level1_modify').val(), level2Id, callBack);
        var code = $level1CategoryMap[$('#material_category_level1_modify').val()];
        $('#category_code_modify').val(code);
    }).fail(function () {

    }).always(function () {

    });

}

/**
 * 初始化2级类目
 * @param level2Id
 */
function initCategoryLevel2AndCallBack(level1Id, level2Id, callBack) {
    $.ajax({
        url: '/materialCategory/level2Categories/find',
        type: 'GET',
        dataType: 'json',
        data: {id: level1Id}
    }).done(function (ret) {
        var html = '';
        if (ret != null && ret.length > 0) {
            for (var i = 0; i < ret.length; i++) {
                var item = ret[i];
                html += '<option value="' + item.id + '" data_category_code="' + item.code + '">' + item.name + '</option>';
                $level2CategoryMap[item.id] = item.code;
            }
        }
        $('#material_category_level2_modify').html(html);
        if (level2Id != null && level2Id != '') {
            $('#material_category_level2_modify').val(level2Id);
        }
        if (callBack != null) {
            callBack();
        }
    }).fail(function () {

    }).always(function () {

    });
}
function getSafePath(url) {
	return "/common/fussDownload?url=" + url;
}
function zoomOut(obj, tagName) {
    var img = new Image();
    img.src = $("a[name='"+tagName+"']").attr('href');
    var bigLine = img.width > img.height ? img.width : img.height;
    var width = img.width/(bigLine/400);
    var height = img.height/(bigLine/400);
    $(obj).parent().find('.img_big').css({'width' : width, 'height' : height});
}