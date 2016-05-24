//***********************************************************
//根据原有验证框架进行改进
//使用时候需要给要增加验证的标签增加check属性
//当check="1"的时候,允许录入为空,如果输入数据就按reg属性绑定的正则表达进行验证.
//当check="2"的时候,就直接按照reg绑定的正则表达式进行验证.
//***********************************************************
//获得所有需要验证的标签
(function($){
	loadding();
})(jQuery);

(function($) {
    $.fn.tooltip = function(options){
		var getthis = this;
        var opts = $.extend({}, $.fn.tooltip.defaults, options);
		//创建提示框
        $("#tipTable").remove();
    	$('body').append('<table id="tipTable" class="tableTip"><tr><td  class="leftImage"></td> <td class="contenImage" align="left"></td> <td class="rightImage"></td></tr></table>');
		//移动鼠标隐藏刚创建的提示框
        $(document).mouseout(function(){$('#tipTable').hide()});

        this.each(function(){
            if($(this).attr('tip') != '')
            {
                $(this).mouseover(function(){
                	$("td.leftImage_1").removeClass().addClass("leftImage");
					$('#tipTable').css({left:$.getLeft(this)+'px',top:$.getTop(this)+'px'});
					$('.contenImage').html($(this).attr('tip'));
					$('#tipTable').fadeIn("fast");

					/*判断，如果tip超过弹出层高度，则将tip显示在输入框上方
					var h = new Number($("body").css("height").replace("px",""));
					if($.getTop(this) >= (h-36)){//在上方显示的tip
						//移除左边图片的class并加上箭头向下的class
						$("td.leftImage").removeClass().addClass("leftImage_1");
						$('#tipTable').css({left:$.getLeft(this)+'px',top:($.getTop(this) - $(this).height() - 45)+'px'});
						$('.contenImage').html($(this).attr('tip'));
						$('#tipTable').fadeIn("fast");
					}else{
						$("td.leftImage_1").removeClass().addClass("leftImage");
						$('#tipTable').css({left:$.getLeft(this)+'px',top:$.getTop(this)+'px'});
						$('.contenImage').html($(this).attr('tip'));
						$('#tipTable').fadeIn("fast");
					}*/
                },
                function(){
                    $('#tipTable').hide();
                });
            }
            if(typeof $(this).attr('isnull') != undefined && $(this).attr('isnull') != '')
            {
                $(this).focus(function()
				{
                    $(this).removeClass('tooltipinputerr');
                }).blur(function(){
                    if($(this).attr('toupper') == 'true')
                    {
                        this.value = this.value.toUpperCase();
                    }
                    if(typeof $(this).attr('isnull') != undefined && $(this).attr('isnull') != '')
					{
                    	var len = $(this).attr("len");
						if($(this).attr('isnull')=="true")
						{
							if($.trim($(this).attr('value'))=='')
							{
								$(this).removeClass('tooltipinputerr').addClass('tooltipinputok');
							}else
							{

								var thisReg = new RegExp($(this).attr('reg'));
								if(thisReg.test(this.value))
								{
									//如果len存在
									if(len){
										if($(this).val().length > len)
											$(this).removeClass('tooltipinputok').addClass('tooltipinputerr');
										else
											$(this).removeClass('tooltipinputerr').addClass('tooltipinputok');
									}else
										$(this).removeClass('tooltipinputerr').addClass('tooltipinputok');
								}
								else
								{
									$(this).removeClass('tooltipinputok').addClass('tooltipinputerr');
								}


							}
						}
						if($(this).attr('isnull')=="false")
						{
							var thisReg = new RegExp($(this).attr('reg'));
								if(thisReg.test(this.value))
								{
									//如果len存在
									if(len){
										if($(this).val().length > len)
											$(this).removeClass('tooltipinputok').addClass('tooltipinputerr');
										else
											$(this).removeClass('tooltipinputerr').addClass('tooltipinputok');
									}else
										$(this).removeClass('tooltipinputerr').addClass('tooltipinputok');
								}
								else
								{
									$(this).removeClass('tooltipinputok').addClass('tooltipinputerr');
								}
						}
					}

                });
            }
        });

		var submitEvent = function () {
					var isSubmit = true;
					getthis.each(function(){
						var len = $(this).attr("len");
						if($(this).attr('isnull')=="true")
						{
							if($.trim($(this).attr('value'))=='')
							{
								$(this).removeClass('tooltipinputerr').addClass('tooltipinputok');
							}else
							{
								var thisReg = new RegExp($(this).attr('reg'));
								if(thisReg.test(this.value))
								{
									//如果len存在
									if(len){
										if($(this).val().length > len){
											$(this).removeClass('tooltipinputok').addClass('tooltipinputerr');
											isSubmit = false;
										}
										else{
											$(this).removeClass('tooltipinputerr').addClass('tooltipinputok');
										}
									}else
										$(this).removeClass('tooltipinputerr').addClass('tooltipinputok');
								}
								else
								{
									$(this).removeClass('tooltipinputok').addClass('tooltipinputerr');
									isSubmit = false;
								}
							}

						}
						if($(this).attr('isnull')=="false")
						{
							var thisReg = new RegExp($(this).attr('reg'));
								if(thisReg.test(this.value))
								{
									//如果len存在
									if(len){
										if($(this).val().length > len){
											$(this).removeClass('tooltipinputok').addClass('tooltipinputerr');
											isSubmit = false;
										}
										else{
											$(this).removeClass('tooltipinputerr').addClass('tooltipinputok');
										}
									}else
										$(this).removeClass('tooltipinputerr').addClass('tooltipinputok');
								}
								else
								{
									$(this).removeClass('tooltipinputok').addClass('tooltipinputerr');
									isSubmit = false;
								}
						}
					});
					//验证checkbox是否已选
					if(!$.checkSelect()){
						isSubmit = false;
					}
					return isSubmit;
				};

        if(opts.onsubmit)
        {
            $('form').submit(submitEvent);
        }
    };

    $.extend({
    	isPass          : true,
		submitReturnTMS : true,
        getWidth : function(object) {
            return object.offsetWidth;
        },

        getLeft : function(object) {
            var go = object;
            var oParent,oLeft = go.offsetLeft;
            while(go.offsetParent!=null) {
                oParent = go.offsetParent;
                oLeft += oParent.offsetLeft;
                go = oParent;
            }
            return oLeft;
        },

        getTop : function(object) {
            var go = object;
            var oParent,oTop = go.offsetTop;
            while(go.offsetParent!=null) {
                oParent = go.offsetParent;
                oTop += oParent.offsetTop;
                go = oParent;
            }
            return oTop + $(object).height()+ 5;
        },
        checkSelect : function(){
        	var isSubmit = true;
        	var nameStr = "";
        	$("input[type='checkbox']").each(function(a,b){
				var nameTemp = $(b).attr("name");
				var isNullTemp = $(b).attr("isnull");
				var nameTempStr = ";"+nameTemp+";";
				if((";"+nameStr).indexOf(nameTempStr)==-1 && isNullTemp=="false"){
					nameStr += nameTemp+";";
				}
			});
        	if(nameStr != ""){
        		var nameArr = nameStr.substring(0,(nameStr.length-1)).split(";");
        		for(var i = 0;i<nameArr.length;i++){
            		var nameTempStr = nameArr[i];
            		var objs = $("[name='"+nameTempStr+"']");
        			var indexC = 0;
        			for(var j=0;j<objs.length;j++){
    					var obj = objs[j];
    					if(obj.checked){
    						indexC = indexC + 1;
    					}
    				}
    				if(indexC == 0){
    					$(objs[0]).parents("div.content").find("span").html($(objs[0]).attr("tip"));
    					isSubmit = false;
    				}
            	}
        	}
        	return isSubmit;
        },
        onsubmit : true
    });
    $.fn.tooltip.defaults = { onsubmit: true };
})(jQuery);

//***************************************************************************************************************************************************
//利用JQuery功能对标签属性设置表达式
//传入的标签ID组必须为"name1:name2:name3"中间用':'分隔.


//对所有需要整数验证的标签进行设置正则表达式
function setIntegeCheck(validatorString)
{
	var validatorStrings="";
	if(validatorString !=null && validatorString!="")
	{
		validatorStrings=validatorString.split(":");
		for(i=0;i<validatorStrings.length;i++)
		{
			$("#"+validatorStrings[i]).attr("reg","^-?[0-9]\\d*$");
		}
	}
}

//对所有需要金额验证的标签进行设置正则表达式
function setMoneyCheck(validatorString)
{
	var validatorStrings="";
	if(validatorString !=null && validatorString!="")
	{
		validatorStrings=validatorString.split(":");
		for(i=0;i<validatorStrings.length;i++)
		{
			$("#"+validatorStrings[i]).attr("reg","^(-)?(([1-9]{1}\\d*)|([0]{1}))(\\.(\\d){1,2})?$");
		}
	}
}

//对所有需要金额验证的标签进行设置正则表达式
function setUnMoneyCheck(validatorString)
{
	var validatorStrings="";
	if(validatorString !=null && validatorString!="")
	{
		validatorStrings=validatorString.split(":");
		for(i=0;i<validatorStrings.length;i++)
		{
			$("#"+validatorStrings[i]).attr("reg","^\\d+(\\.\\d{1,2})?$");
		}
	}
}

//对所有需要正浮点验证的标签进行设置正则表达式
function setFloatCheck(validatorString)
{
	var validatorStrings="";
	if(validatorString !=null && validatorString!="")
	{
		validatorStrings=validatorString.split(":");
		for(i=0;i<validatorStrings.length;i++)
		{
			$("#"+validatorStrings[i]).attr("reg","^\\d+(\\.\\d*)?$|^0(\\.\\d*)?$");
		}
	}
}

//对所有需要电子邮件验证的标签进行设置正则表达式
function setMailCheck(validatorString)
{
	var validatorStrings="";
	if(validatorString !=null && validatorString!="")
	{
		validatorStrings=validatorString.split(":");
		for(i=0;i<validatorStrings.length;i++)
		{
			$("#"+validatorStrings[i]).attr("reg","^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$");
		}
	}
}

//对所有需要邮编验证的标签进行设置正则表达式
function setZipcodeCheck(validatorString)
{
	var validatorStrings="";
	if(validatorString !=null && validatorString!="")
	{
		validatorStrings=validatorString.split(":");
		for(i=0;i<validatorStrings.length;i++)
		{
			$("#"+validatorStrings[i]).attr("reg","^\\d{6}$");
		}
	}
}

//对所有需要手机验证的标签进行设置正则表达式
function setMobileCheck(validatorString)
{
	var validatorStrings="";
	if(validatorString !=null && validatorString!="")
	{
		validatorStrings=validatorString.split(":");
		for(i=0;i<validatorStrings.length;i++)
		{
			$("#"+validatorStrings[i]).attr("reg","^1[3456789]\\d{9}$");
		}
	}
}

//对所有需要身份证验证的标签进行设置正则表达式
function setIDCheck(validatorString)
{
	var validatorStrings="";
	if(validatorString !=null && validatorString!="")
	{
		validatorStrings=validatorString.split(":");
		for(i=0;i<validatorStrings.length;i++)
		{
			$("#"+validatorStrings[i]).attr("reg","^(\\d{14}|\\d{17})(\\d|[xX])$");
		}
	}
}

//对所有需要登录帐号验证的标签进行设置正则表达式
function setUserIDCheck(validatorString)
{
	var validatorStrings="";
	if(validatorString !=null &&validatorString!="")
	{
		validatorStrings=validatorString.split(":");
		for(i=0;i<validatorStrings.length;i++)
		{
			$("#"+validatorStrings[i]).attr("reg","^\\w+$");
		}
	}
}

//对所有需要非空验证的标签进行设置正则表达式
function setEmptyCheck(validatorString)
{

	var validatorStrings="";
	if(validatorString !=null && validatorString!="")
	{
		validatorStrings=validatorString.split(":");
		for(i=0;i<validatorStrings.length;i++)
		{
			$("#"+validatorStrings[i]).attr("reg",'.*\\S.*');
		}
	}
}

//对所有需要中文验证的标签进行设置正则表达式
function setChineseCheck(validatorString)
{
	var validatorStrings="";
	if(validatorString !=null && validatorString!="")
	{
		validatorStrings=validatorString.split(":");
		for(i=0;i<validatorStrings.length;i++)
		{
			$("#"+validatorStrings[i]).attr("reg","^[\\u4E00-\\u9FA5\\uF900-\\uFA2D]+$");
		}
	}
}

//对所有需要URL验证的标签进行设置正则表达式
function setURLCheck(validatorString)
{
	var validatorStrings="";
	if(validatorString!="")
	{
		validatorStrings=validatorString.split(":");
		for(i=0;i<validatorStrings.length;i++)
		{
			$("#"+validatorStrings[i]).attr("reg","^http[s]?:\\/\\/([\\w-]+\\.)+[\\w-]+([\\w-./?%&=]*)?$");
		}
	}
}

//匹配国内电话号码(0511-4405222 或 021-87888822)
function setTellCheck(validatorString)
{
	var validatorStrings="";
	if(validatorString!="")
	{
		validatorStrings=validatorString.split(":");
		for(i=0;i<validatorStrings.length;i++)
		{
			$("#"+validatorStrings[i]).attr("reg","\\d{3}-\\d{8}|\\d{4}-\\d{7}");
		}
	}
}

//固定电话或手机匹配
function setTellOrPhoneCheck(validatorString)
{
	var validatorStrings="";
	if(validatorString!="")
	{
		validatorStrings=validatorString.split(":");
		for(i=0;i<validatorStrings.length;i++)
		{
			$("#"+validatorStrings[i]).attr("reg","^[0-9|,|-]+$");
		}
	}
}

//校验特殊字符
function setSpecialStr(validatorString)
{
	var validatorStrings="";
	if(validatorString!="")
	{
		validatorStrings=validatorString.split(":");
		for(i=0;i<validatorStrings.length;i++)
		{
			$("#"+validatorStrings[i]).attr("reg","^[^&?='%><;*)(\"]+$");
		}
	}
}

function setNumericalCheck(validatorString)
{
	var validatorStrings="";
	if(validatorString!="")
	{
		validatorStrings=validatorString.split(":");
		for(i=0;i<validatorStrings.length;i++)
		{
			$("#"+validatorStrings[i]).attr("reg","^\\d+$");
		}
	}
}

//***************************************************************************************************************************************************
function loadding(){
	if (document.readyState == "complete") {
		if(loadValidateStart)
			clearTimeout(loadValidateStart);// 执行成功，清除监听
		$('select[tip],select[check],input[tip],input[check],textarea[tip],textarea[check],button[tip]').tooltip();
	} else {
		loadValidateStart = setTimeout("loadding()", 5);
	}
}

//封装form验证
function formValidate(id){
	var formValidateStart;
	if(document.readyState == "complete") {
		if(typeof formValidateStart != undefined)
			clearTimeout(formValidateStart);//执行成功，清除监听
		/*//自动计算高度
		if(dialog && dialog.self){
			if($('select[tip],select[check],input[tip],input[check],textarea[tip],textarea[check]').length <= 3)
				$(dialog.self.dgWin.document).find("body").css("height",$(dialog.self.dgWin.document)[0].body.scrollHeight*1 + 50);
		}*/

		var _index = 0;
		//增加按钮事件
		$('select[tip],select[checkType],input[tip],input[checkType],textarea[tip],textarea[checkType]').each(function(a,b){
			_index ++;
			var checkType = $(b).attr("checkType");
			var id = $(b).attr("id");

			switch(checkType){
				case "chinese":setChineseCheck(id);break;
				case "integer":setIntegeCheck(id);break;
				case "id":setIDCheck(id);break;
				case "userID":setUserIDCheck(id);break;
				case "money":setMoneyCheck(id);break;
				case "float":setFloatCheck(id);break;
				case "mail":setMailCheck(id);break;
				case "poss":setZipcodeCheck(id);break;
				case "phone":setMobileCheck(id);break;
				case "URL":setURLCheck(id);break;
				case "empty":setEmptyCheck(id);$(b).attr("isNull",false);break;
				case "tell":setTellCheck(id);break;
				case "tellOrPhone":setTellOrPhoneCheck(id);break;
				case "unMoney":setUnMoneyCheck(id);break;
				case "specialStr":setSpecialStr(id);break;
				case "numerical":setNumericalCheck(id);break;
			}

			//给必填项加必填div
	    /*	if($(b).attr('isnull') != '' && $(b).attr('isnull')=="false")
			{
	    		if($(this).is("input[type='checkbox']") || $(this).is("input[type='radio']")){
	    			var objName = $(this).attr("name");
	    			var objs = $("[name='"+objName+"']")[0];
	    			if($(this).parents("div.divContent").find("div.span").length==0){
	    				$(this).parent().after("<span style='color:red'> *</span>");
	    			}
	    		}else{
	    			$(this).after("<span style='color:red'> *</span>");
	    		}
			}
	    	if(_index == 1){
				if(id)$("#"+id).focus();
			}*/
		});
	}else{
		formValidateStart = setTimeout("formValidate()", 5);
	}
}

function validat(){
	var isPass = true;
	$('select[tip],select[checkType],input[tip],input[checkType],textarea[tip],textarea[checkType],input[reg]').each(function(a,b){
		var len = $(this).attr("len");
		if($(this).attr('isnull')=="true")
		{
			if($.trim($(this).val())=='')
			{
				$(this).removeClass('tooltipinputerr').addClass('tooltipinputok');
			}else
			{
				var thisReg = new RegExp($(this).attr('reg'));
				if(thisReg.test(this.value))
				{
					//如果len存在
					if(len){
						if($(this).val().length > len){
							$(this).removeClass('tooltipinputok').addClass('tooltipinputerr');
							isPass = false;
						}
						else{
							$(this).removeClass('tooltipinputerr').addClass('tooltipinputok');
						}
					}else
						$(this).removeClass('tooltipinputerr').addClass('tooltipinputok');
				}
				else
				{
					$(this).removeClass('tooltipinputok').addClass('tooltipinputerr');
					isPass = false;
				}
			}

		}
		if($(this).attr('isnull')=="false")
		{
			var thisReg = new RegExp($(this).attr('reg'));
				if(thisReg.test(this.value))
				{
					//如果len存在
					if(len){
						if($(this).val().length > len){
							$(this).removeClass('tooltipinputok').addClass('tooltipinputerr');
							isPass = false;
						}
						else{
							$(this).removeClass('tooltipinputerr').addClass('tooltipinputok');
						}
					}else
						$(this).removeClass('tooltipinputerr').addClass('tooltipinputok');
				}
				else
				{
					$(this).removeClass('tooltipinputok').addClass('tooltipinputerr');
					isPass = false;
				}
		}
	});
	return isPass;
}
