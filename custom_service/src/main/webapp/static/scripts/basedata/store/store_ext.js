var rdashAlpha=/_([a-z]|[0-9])/ig;
function fcamelCase( all, letter ) {  
    return ( letter + "" ).toUpperCase();  
}  
function camelCase(string){  
    return string.replace(rdashAlpha, fcamelCase);  
}

function checkAndRefreshDownloadArea(inputName, downloadAreaName, url, name) {
    if (url && url != '') {
        var downloadArea = $('[name="'+downloadAreaName+'"]');
        var inputArea = $('[name="'+inputName+'"]').parent().parent();
        if ($(downloadArea).length > 0) {
            $(downloadArea).attr('href', '/common/fussDownload?hash='+url + '&fileName=' + name);
            if (name) {
            	$(downloadArea).html(name);
            }
            else {
            	$(downloadArea).html('下载');
            }
        }
        else {
            $(inputArea).after('<a  name="'+downloadAreaName+'" target="_blank" style="margin-left:10px;"  href="/common/fussDownload?hash='+url+'&fileName='+name+'">'+name+'</a>');
        }
    }
}
function postFile(element, e, url) {
		if (!confirm("确认要归档？")) {
	        e.stopPropagation();
	    	return;
	    }
        var storeId = $(element).attr('storeId');
        var version = $(element).attr('version');
        $.ajax({
                    type: 'post',
                    url: url,
                    data: {
                        storeId: storeId,
                        version:version
                    },
                    dataType: "json",
                    success: function (data) {
                        if (data) {
                            if (data.code == '000000') {
                                alert('归档成功');
                            }
                            else {
                                alert(data.message);
                            }
                            window.location.reload();
                        }
                    },
                    error: function (msg) {
                        
                    }
                });
        e.stopPropagation();
}

var logIndex = 1;
function loadLog(storeId,url) {
    $('#loadLogBtn').addClass('disabled');
        $.ajax({
                    type: 'get',
                    url: url,
                    data: {
                        storeId: storeId,
                        curPage:logIndex++,
                        pageSize:20,
                    },
                    dataType: "json",
                    success: function (data) {
                        if (data) {
                            var content = "";
                            $(data.data).each(function() {
                                if (this.type == 2) {
                                    $('#log_list').find('.scroll-content').append("<small>"+$.dateFormat(this.createTime, 'yyyy-MM-dd hh:mm:ss') + " " + this.createName + " 进行了归档处理" + "</small><div class='hr hr8'></div>");
                                }
                                else {
                                    var name = camelCase(this.propName);
                                    if ($("[name="+name+"][type=radio]").length > 0) {
                                        var preValue = parseInt(this.preValue);
                                        if (isNaN(preValue) || preValue <= 0) {
                                            this.preValue = '未设置';
                                        }
                                        else {
                                            this.preValue = $("[name="+name+"][type=radio][value="+preValue+"]").next().html();
                                        }

                                        var postValue = parseInt(this.postValue);
                                        if (isNaN(postValue) || postValue <= 0) {
                                            this.postValue = '未设置';
                                        }
                                        else {
                                            this.postValue = $("[name="+name+"][type=radio][value="+postValue+"]").next().html();
                                        }
                                    }
                                    else if (name.indexOf('Url') > 0) {
                                        this.preValue = genA(this.preValue);
                                        this.postValue = genA(this.postValue);
                                    }
                                    if (this.preValue != this.postValue) {
                                    $('#log_list').find('.scroll-content').append("<small>"+$.dateFormat(this.createTime, 'yyyy-MM-dd hh:mm:ss') + " " + this.createName + " 将 " + this.propComments + " 从 '" + this.preValue + "' 修改为 '" + this.postValue + "'"+"</small><div class='hr hr8'></div>");
                                    }
                                }
                            });
                            if (data.pgNumber >= data.totalPage) {
                                return;
                            }
                        }
                        $('#loadLogBtn').removeClass('disabled');
                    },
                    error: function (msg) {
                    }
                });
}
function genA(hash) {
    var content = "";
    $(hash.split(",")).each(function() {
        if (this && this != '') {
            content += "<a target='_blank'  href='/common/fussDownload?hash="+this+"'>" + this + "</a> ";
        }
        else {
            content += "";
        }
    });
    return content;
}

function log(msg) {
    bootbox.dialog({
                    message: msg,
                    buttons:
                    {
                      "ok" :
                      {
                        "label" : "确定",
                        "className" : "btn-sm btn-primary",
                        "callback": function() {
                        }
                      }
                    }
                  });
}
function showDialog(url) {
    parent.$.dialog({
        id : 'logList',
        lock: true,
        title : "归档日志",
        content : "url:"+url,
        width: 1200,
        height: 600,
        drag: true,
        resize: true
        });
}

function checkFormDataIsEmpty(formId) {
    var formDataIsEmpty = true;
    $("#"+formId).find('.form-control').each(function() {
        if ($(this).hasClass('date-range')) {
            if ($(this).parent().find('[name=startDate]') && $(this).parent().find('[name=startDate]').val() != '') {
                formDataIsEmpty = false;
                return false;
            }
            if ($(this).parent().find('[name=endDate]') && $(this).parent().find('[name=endDate]').val() != '') {
                formDataIsEmpty = false;
                return false;
            }
        }
        else {
            if ($(this).val() && $(this).val() != '') {
                formDataIsEmpty = false;
                return false;
            }
        }
    });
    $("#"+formId).find('.ace:checked').each(function() {
        var val = $(this).val();
        if (val && val != '') {
            formDataIsEmpty = false;
            return false;
        }
    });
    if (formDataIsEmpty) {
        log("请填写数据后保存");
    }
    return formDataIsEmpty;
}