var inputSelectUtil = {
    params : {},
    init : function init() {
    	$("input.inputSelect").each(function() {
    		var _this = this;
    		var parent = $(this).parent();
    		if($(parent).find('.selectUl').length > 0) {
    			return true;
    		}
    		var ul = $("<ul>");
    		$(ul).addClass("selectUl");
    		
    		if($(this).parent().get(0).tagName == "SPAN") {
    			$(ul).css("min-width", $(this).parent().width());
    		} else {
    			$(ul).css("min-width", $(this).width());
    		}
    		
    		if($(this).is(':hidden')) {
                $(ul).css("min-width", '170px');
    		}
    		
    		if($(this).attr("height")) {
        		$(ul).css("height", $(this).attr("height"));
    		} else {
    			$(ul).css("height", "auto");
    			$(ul).css("max-height", "250px");
    		}
			$(ul).css("width", "auto");
    		$(ul).css("text-align", "left");
    		$(ul).css("overflow", "auto");
    		if($(this).attr('selectMargin')) {
    			$(ul).css("margin-left", $(this).attr('selectMargin'));
    		}
    		if($(this).attr('margin-top')) {
    			$(ul).css("margin-top", $(this).attr('margin-top'));
    		}
    		$(parent).append(ul);

    		$(this).click(function() {
    			$(ul).toggle();
    			inputSelectUtil.checkLiDisplay(_this, ul);
    		});
    		$(this).attr('inited', false);
    		$(parent).find('.arrow').click(function() {
    			$(ul).toggle();
    		});
    		var loadOnInit = $(this).attr("loadOnInit");
    		if (typeof loadOnInit !== typeof undefined && loadOnInit != false) {
    		    inputSelectUtil.load("#"+$(this).attr("id"));
    		}
    	});
    	inputSelectUtil.listenUl();

    	return inputSelectUtil;
    },
    checkLiDisplay : function(ipt, ul) {
		if($(ul).css("display") != "none") {
			if($(ipt).val() == '') {
				$(ul).children('li').show();
			}
		}
    },
    //加载下拉框
    load : function(id, params) {
    	var ipt = $(id);
    	var ul = $(ipt).parent().children("ul.selectUl");
    	var url = $(ipt).attr('url');
    	if($(ipt).attr('ajax') == 'true') {
        	inputSelectUtil.aotuQuery(id);
    	}else {
    		var callback = $(ipt).attr('getData');
    		if(callback) {
    			eval('var data= '+callback+'("'+id+'")');
    		} else {
    			inputSelectUtil.oneTimeQuery(id, params);
    		}
    	}
    },

    //填充下拉框的数据
    fillData : function(id, data) {
    	var ipt = $(id);
    	var ul = $(ipt).parent().children("ul.selectUl");
    	$(ul).html("");
    	for(var i = 0; i < data.length; i++) {
    		var li = $('<li>');
    		var idVal = data[i].idVal;
    		var nameVal = data[i].nameVal;
    		var obj = data[i].obj;
    		li.addClass('selectLi nothovered');
    		li.css('width', 'auto');
    		li.attr('idVal', idVal);
    		li.attr('nameVal', nameVal);
    		li.attr('obj', obj);
    		li.html(data[i].liHtml);
    		$(li).on('click', {'id': data[i].idVal, 'name' : data[i].nameVal, 'obj' : data[i].obj}, function(e) {
    	    	var callback = $(ipt).attr("liClick");
    	    	if(callback) {
					var result = true;
					eval("result = "+callback+"('"+e.data.id+"','"+e.data.name+"',\'"+e.data.obj+"\',\""+id+"\")");
					if(typeof result == 'undefined' || result == true) {
						$(ipt).val(e.data.name);
						$(ipt).parent().find('.idVal').val(e.data.id);
						$(".selectUl").hide();
						$(".hovered").removeClass("hovered");
					}
    	    	} else {
					$(ipt).val(e.data.name);
					$(ipt).parent().find('.idVal').val(e.data.id);
					$(".selectUl").hide();
					$(".hovered").removeClass("hovered");
    	    	}
    		});
    		ul.append(li);
    	}
//    	$(ul).show();
    },

	// 获取商圈数据
	oneTimeQuery : function(id, params) {
		var array = [];
		var url = $(id).attr('url');
		var idName = $(id).attr('keyId');
		var name = $(id).attr('keyName');
		var _deferredObj = $.get(url, params, function(data) {
			for (var i = 0; i < data.length; i++) {
				var json = {};
				var idVal;
				var nameVal;
				var htmlVal;
				if(idName == 'this') {
					idVal = data[i];
					nameVal = data[i];
					htmlVal = data[i];
				} else {
					idVal = data[i][idName];
					if(name.indexOf('{') > -1) {
						nameVal = inputSelectUtil.analyseExp(name, data[i]).nameVal;
						htmlVal = inputSelectUtil.analyseExp(name, data[i]).html;
					} else {
						nameVal = data[i][name];
						htmlVal = data[i][name];
					}
				}

				json['idVal'] = idVal;
				json['nameVal'] = nameVal;
				json['liHtml'] = htmlVal;

	    		var jsonStr;
                if (idName != 'this') {
                    jsonStr = JSON.stringify(data[i]);
                } else {
                    jsonStr = "[";
                    for(var x in data[i]){
                        jsonStr += data[i] + ",";
                    }
                    jsonStr = jsonStr.substr(0, jsonStr.length - 1);
                    jsonStr += "]";
                }
                json['obj'] = jsonStr;
				array[i] = json;
			}
		}, 'json');
		$.when(_deferredObj).done(function() {
			if(array.length > 0) {
				inputSelectUtil.fillData(id, array);
			}else {
		    	var ul = $(id).parent().children("ul.selectUl");
		    	$(ul).hide();
			}
		});
	},

	// 获取商圈数据
	aotuQuery : function(id) {
		if($(id).val() || $(id).attr("querynull")) {
			var array = [];
			var url = $(id).attr('url');
			var idName = $(id).attr('keyId') ? $(id).attr('keyId') : 'id';
			var name = $(id).attr('keyName') ? $(id).attr('keyName') : 'name';
			var params = {};
			var pName = $(id).attr('paramName') ? $(id).attr('paramName') : 'name';
			params[pName] = $(id).val();
			var _deferredObj = $.get(url, params, function(data) {
				for (var i = 0; i < data.length; i++) {
					var json = {};
					var idVal;
					var nameVal;
					var htmlVal;
					if(idName == 'this') {
						idVal = data[i];
						nameVal = data[i];
						htmlVal = data[i];
					} else {
						idVal = data[i][idName];
						if(name.indexOf('{') > -1) {
							nameVal = inputSelectUtil.analyseExp(name, data[i]).nameVal;
							htmlVal = inputSelectUtil.analyseExp(name, data[i]).html;
						} else {
							nameVal = data[i][name];
							htmlVal = data[i][name];
						}
					}

					json['idVal'] = idVal;
					json['nameVal'] = nameVal;
					json['liHtml'] = htmlVal;

                    var jsonStr;
                    if (idName != 'this') {
                        jsonStr = JSON.stringify(data[i]);
                    } else {
                        jsonStr = "[";
                        for(var x in data[i]){
                            jsonStr += data[i] + ",";
                        }
                        jsonStr = jsonStr.substr(0, jsonStr.length - 1);
                        jsonStr += "]";
                    }
                    json['obj'] = jsonStr;
					array[i] = json;
				}
			}, 'json');
			$.when(_deferredObj).done(function() {
				inputSelectUtil.fillData(id, array);
			});
		} else {
	    	var ipt = $(id);
	    	var ul = $(ipt).parent().children("ul.selectUl");
	    	$(ul).html("");
	    	$(".selectUl").hide();
		}
	},
	analyseExp : function(exp, obj) {
		var result = {};
		var arr = exp.split('{');
		var html = "", nameVal = "";
		for(var i = 0; i < arr.length; i++) {
			if(arr[i].indexOf('}') > -1) {
				var attrName = arr[i].split('}')[0];
				if(arr[i].split('}')[0].indexOf('#') > -1) {
					attrName = attrName.replace('#', '');
					nameVal = obj[attrName];
				}
				var tail = arr[i].split('}')[1];
				html += obj[attrName] + tail;
			}
		}
		if(!nameVal || nameVal == "") {
			nameVal = html;
		}
		result['html'] = html;
		result['nameVal'] = nameVal;
		return result;
	},
	clean : function(id) {
    	$(id).val("");
    	var ul = $(id).parent().children("ul.selectUl");
    	$(ul).html("");
    	var idVal = $(id).parent().children("input.idVal");
    	$(idVal).val("");
	},
    //增加下拉框监听
    listenUl : function() {
    	//下拉框上下移动、回车监听
    	$('.inputSelect').each(function() {
    		var parent = $(this).parent();
    		if($(this).attr('inited') == 'true') {
    			return true;
    		}else {
    	    	$(this).on('keydown', function(e) {
    	    		var _this = this;
    	    		var ul = $(_this).parent().children(".selectUl");
    	    		if($(ul).css('display') != "none") {
    	    			var hoveredLi = $(ul).find('.hovered');
    	    			if(e.keyCode == 40) {//down
    	    				if(hoveredLi.length > 0) {
    	    					var bro = $(hoveredLi).next();
    	    					while(bro && $(bro).css('display')=='none') {
    	    						bro = $(bro).next();
    	    					}					
    	    					if(bro) {
    	    						$(bro).addClass("hovered");
    	    					}
    	    					$(hoveredLi).addClass("nothovered").removeClass("hovered");
    	    				}else {
    	    					var li = $(ul).find("li").get(0);
    	    					$(li).removeClass("nothovered").addClass("hovered");
    	    				}
    	    			}else if(e.keyCode == 38) {//up
    	    				if(hoveredLi.length > 0) {
    	    					var bro = $(hoveredLi).prev();
    	    					while(bro && $(bro).css('display')=='none') {
    	    						bro = $(bro).prev();
    	    					}
    	    					if(bro) {
    	    						$(bro).addClass("hovered");
    	    					}
    	    					$(hoveredLi).addClass("nothovered").removeClass("hovered");
    	    				}else {
    	    					var li = $(ul).children(":last");
    	    					$(li).removeClass("nothovered").addClass("hovered");
    	    				}
    	    			}else if(e.keyCode == 13) {//enter
    	    				if($(hoveredLi).attr("nameVal")) {
    	    					var callback = $(_this).attr("liClick");
    	    					if(callback) {
    	    						var obj = $(hoveredLi).attr("obj");
    	    						eval(callback+"('"+$(hoveredLi).attr("idVal")+"','"+$(hoveredLi).attr("nameVal")+"',\'"+obj+"\',\"#"+$(_this).attr('id')+"\")");
    	    					}
    	    					$(_this).val($(hoveredLi).attr("nameVal"));
    	    					$(_this).parent().children(".idVal").val($(hoveredLi).attr("idVal"));
    	    					$(".selectUl").hide();
    	    				}
    	    			}
    	    		}
    	    	});

    	    	//下拉框输入监听
    	        $(this).on('input',inputSelectUtil.selectChange);
    	        
    	        //下拉框失去焦点监听
    	        $(this).on('blur',function(e){
    	        	var _this = this;
    	        	var callBack = $(this).attr("blur");
    	    		var ul = $(_this).parent().children(".selectUl");
    	    		if($(ul).css("display") != "none") {
    	    			if(!$(ul).is(":hover")) {
    	    				$(ul).hide();
    	    			}
    	    		}
    	        	if(callBack) {
	        			eval(callBack+"(\"#"+$(_this).attr('id')+"\")");
    	        	}
    	    	});
    	        $(this).attr('inited', true);
    		}
    	});
    },
	selectChange : function(e){
		var _this = this;
    	var inputCallBack = $(this).attr("input");
		var ul = $(_this).parent().children(".selectUl");
    	if(inputCallBack) {
    		eval(inputCallBack+"(\""+$(_this).attr('id')+"\")");
    	}
    	$(_this).parent().children("input.idVal").val("");
		if($(this).attr('ajax') == 'true') {//异步请求数据
			inputSelectUtil.aotuQuery("#"+$(this).attr('id'));
		} else {//过滤数据
			var ipt = $.trim($(_this).val());
			var lis = $(ul).children("li");
			if(ipt) {
				lis.each(function() {
					if($(this).html().indexOf(ipt) == -1) {
						$(this).hide();
					}else {
						$(this).show();
					}
				});
			}else { 
				lis.each(function() {
					$(this).show();
				});
			}
			$("li.hovered").removeClass("nothovered").addClass("hovered");
		}
    	$(ul).show();
	}
};
