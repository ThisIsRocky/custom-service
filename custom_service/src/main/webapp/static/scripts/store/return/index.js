var materialFacade={
	// 根据编码，回调填充菜名
    fill : function(id, code, jsonStr, nodeId){
        var json = eval("("+jsonStr+")");
        $(nodeId).attr('idval',json.id);
        $(nodeId).attr('nameval',json.name);
        $(nodeId).attr('codeval',json.code);
        $('#unitName').html(json.transportUnit);
        $('#standardName').html(json.standardName);
        // $(nodeId).parent().parent().parent().find("#food_name").val(json.name);
    },
    check : function(nodeId) {
        if (!$(nodeId).val() || $(nodeId).val()=='') {
            $(nodeId).removeAttr('nameval');
            $(nodeId).removeAttr('idval');
        }
        else if ($(nodeId).attr('nameval') != $(nodeId).val()) {
            $(nodeId).val($(nodeId).attr('nameval'));
        }
    }
}
var storeReturnItem={
	acting : false,
	addItem : function(){
        var id = $('#materialName').attr('idval');
        var code = $('#materialName').attr('codeval');
        var name = $('#materialName').val();
        var unitName = $('#unitName').html();
        var standardName = $('#standardName').html();
        var quantity = $('#quantity').val();
        var productionDate = $('#productionDate').val();
        if (id == null || id == '' || quantity == null || quantity == '' || productionDate == null || productionDate == '') {
            $.alertError('信息不完整');
            return;
        }
        id = id +"_"+ productionDate;
        if ($("#table-data-list").jqGrid('getRowData',id).code != null) {
            $('#quantity_' + id).val(parseInt($('#quantity_' + id).val()) + parseInt(quantity));
        }
        else {
            var dataRow = {    
                id:id,
                code:code,
                name:name,
                unitName:unitName,
                standardName:standardName,
                quantity:quantity,
                productionDate:productionDate
        };
        //将新添加的行插入到第一列  
        $("#table-data-list").jqGrid("addRowData", id, dataRow, "last");
    }
    $('#materialName').val('');
    $('#materialName').removeAttr('idval');
    $('#materialName').removeAttr('nameval');
    $('#materialName').removeAttr('codeval');
    $('#unitName').html('');
    $('#standardName').html('');
    $('#quantity').val('');
    },
    removeItem : function(id){
        $("#table-data-list").jqGrid('delRowData',id);
	},
    submitItem : function() {
    	if(storeReturnItem.acting) {
    		return false;
    	}else {
    		storeReturnItem.acting = true;
    	}
    	$("#submitItemBtn").attr("disabled", "disabled");
        var ids = $("#table-data-list").jqGrid('getDataIDs');
        if (ids == null || ids.length == 0) {
            $.alertError("请至少选择一种物料");
    		storeReturnItem.acting = false;
            return;
        }
        var reasonType = $('#reason_type').val();
        var reasonDesc;
        if (reasonType == '10') {
            reasonDesc = $('#reason_desc').val();
        }
        else {
            reasonDesc = $('#reason_type option:selected').text();
        }
        if (!reasonDesc || reasonDesc.length == 0) {
        	$.alertError("请填写提报详情");
    		storeReturnItem.acting = false;
        	return;
        }
        var data="&reasonType="+reasonType;
        data+="&reasonDesc="+reasonDesc;
        var i = 0;
        var isN = true;
        $(ids).each(function() {
        	var id = this.split("_")[0];
        	var productionDate = this.split("_")[1];
            var quantity = $('#quantity_' + this).val();
            if (!quantity || quantity=="" || isNaN(quantity)) {
                $.alertError("请填写物料数量");
                isN = false;
        		storeReturnItem.acting = false;
                return false;
            }
            data+="&storeReturnItemList["+i+"].materialId="+id;
            data+="&storeReturnItemList["+i+"].productionDateStr="+productionDate;
            data+="&storeReturnItemList["+i+"].quantity="+quantity;
            i++;
        });
        if (!isN) {
    		storeReturnItem.acting = false;
            return;
        }
        var j = 1;
        $('.img_show').each(function(){
            var url = $(this).attr('src');
            if (url!=null && url != '') {
                data+="&imgUrl"+j+"="+url;
                j++;
            }
        });
        $.post('/store/return/add', data, function(data) {
            if (data.code == "071000") {
                $.alertError("没有该门店权限");
            }
            else if (data.code == "071001") {
                $.alertError("未知错误");
            }
            else {
                $.alertSuccess("提报成功");
                $('#table-data-list').jqGrid('clearGridData',false);
                $('#reason_desc').val('');
                $('.remove').click();
            }
    		storeReturnItem.acting = false;
        }, 'json');

    },
    
    confirmReturn : function(storeReturnId) {
        
        // 盘点后库存变化提醒
        $.get('/common/getStoreInfo?id=' + $("#storeId").val() + '&nd=' + Math.random(), function(data){
            if(data.isInventory == 1) {
                parent.$.dialog({
                    title: '盘点后库存变动提醒',
                    content: '系统检测到当前门店已盘点过了，确认退货操作将会影响已提交盘点的物料，<br/>完成本操作后请进行复盘',
                    ok: function(){
                        submit();
                    },
                    lock: true,
                    icon: 'alert.gif',
                    okVal: '知道了',
                    cancel: function(){
                    }
                });
            } else {
                submit();
            }
        });
        
        function submit(){
            var data = "storeReturnId=" + storeReturnId;
            $.post('/store/return/confirm', data, function(data) {
                if (data.code == "000000") {
                    $.alertSuccess("确认退货成功");
                    storeReturn.query();
                }
                else {
                    $.alertError(data.message);
                }
            }, 'json');
        }
    },
     // 上传菜品图片
    fileInput : function(panel) {
        $('input[type=file]', panel).ace_file_input({
            no_file:'No File ...',
            btn_choose:'Choose',
            btn_change:'Change',
            droppable:false,
            before_change: function(files, dropped) {
                var _this = $(this);
                var file = files[0];
                var type = $.trim(file.type);
                if (type != 'image/jpeg' && type != 'image/png') {
                    $.dialog.alert('仅可上传jpg、png格式的图片。');
                    _this.parents('.img_panel').find('.img_show').removeAttr('src');
                    _this.parents('.img_panel').find('.img_big').removeAttr('src');
                    return false;
                }
                if (file.size > 819200) {
                    $.dialog.alert('图片大小请不要超过800k');
                    _this.parents('.img_panel').find('.img_show').removeAttr('src');
                    _this.parents('.img_panel').find('.img_big').removeAttr('src');
                    return false;
                }
                
                return true;
            },
            btn_change : function() {
                var _this = $(this);
                var fd = new FormData();
                fd.append('file', _this.parent().find('input[type="file"]').data('ace_input_files')[0]);
                $.ajax({
                    url : '/store/return/uploadImg',
                    type : 'post',
                    processData : false,// important
                    contentType : false,// important
                    dataType : 'json',// depending on your server
                    data : fd,
                    success : function(result) {
                        if (result.url) {
                        _this.parents('.img_panel').find('.img_show').attr('src', getSafePath(result.url));
                        _this.parents('.img_panel').find('.img_big').attr('src', getSafePath(result.url));
                        }
                    },
                    error : function(data){
                        alert(data.responseText);
                    }
                })
            },
            no_icon : 'ace-icon fa fa-cloud-upload',
            droppable : true,
            thumbnail : 'small'
        })
    },
    detailsGrid:null,
    // 加载数据详情
    initTable : function() {
        var grid_selector = "#table-data-list";
            // 首次加载
              storeReturnItem.detailsGrid = $(grid_selector).jqGrid({
                datatype : 'json',
                colNames : ['物料编号', '物料名称', '数量', '生产日期', '物流单位' ,'规格' ,'操作'],
                // prmNames : {page:'curPage',rows:'pageSize', sort: 'sidx',order: 'sort'},
                colModel : [
                            
                {
                    name : 'code',
                    index : 'code',
                    width : 150
                }, {
                    name : 'name',
                    index : 'name',
                    width : 150,
                }, {
                    name : 'quantity',
                    width : 150,
                    formatter : function(cellvalue,
                             options, rowObject) {
                        return '<input  style="text-align:right" id="quantity_'
                         + rowObject.id
                         + '" oninput="if(!/^[1-9]+[0-9]*]*$/.test($(this).val())){this.value=this.value.substring(0,value.length-1);}" onpaste="return false;" maxlength="8" width="50" value="'
                         + cellvalue + '">';
                     }
                }, {
                    name : 'productionDate',
                    index : 'productionDate',
                    width : 150,
                }, {
                    name : 'unitName',
                    index : 'unitName',
                    width : 150,
                }, {
                    name : 'standardName',
                    index : 'standardName',
                    width : 150,
                },{
                     name : '',
                     width : 150,
                     align : 'center',
                     formatter : function(cellvalue,options, rowObject) {
                         return '<button class="btn btn-minier btn-white btn-warning btn-bold" onclick="storeReturnItem.removeItem(\'' + rowObject.id
                         + '\');"><i class="ace-icon fa fa-trash-o bigger-120 orange"></i>删除</button>';
                     }
                 }
                ],
                // pager : pager_selector,
                // pagerpos : 'left',
                viewrecords : true,
                autoHeight : true,
                sortable: true,
                loadComplete : function(xhr) {
                }
            });
        // 自适应宽度
        // resizeGrid('#data-list', grid_selector, 326);
        $("#scroll_data_parent_div").find(".ui-jqgrid-bdiv").css({ "overflow-x" : "hidden" });
    }


}
var storeReturn = {
    detailsGrid:null,
    // 加载数据详情
    query : function() {
        var startDate = $('#startDateHid').val();
        var endDate = $('#endDateHid').val();
        var status = $('#status').val();
        var params = "?startTime=" + startDate + "&endTime=" + endDate + "&status="+status;
        var grid_selector = "#storereturn-history-data-list";
        var pager_selector = "#storereturn-history-data-list-pager";
        if(storeReturn.detailsGrid) {
            // 根据搜索条件，重新加载
            $(grid_selector).jqGrid('setGridParam',{
                url : "/store/return/list"+params,
                page:1
            }).trigger("reloadGrid");
        } else {
            // 首次加载
              storeReturn.detailsGrid = $(grid_selector).jqGrid({
                url : "/store/return/list"+params,
                datatype : 'json',
                mtype : 'POST',
                jsonReader : {
                    root: "data",
                    page: "curPage",
                    total: "totalPage",
                    records: "totalRows"
                },
                prmNames : {page:'curPage',rows:'pageSize', sort: 'sidx',order: 'sort'},
                cmTemplate: {sortable:true},
                colNames : ['退货单号', '提报时间', '提报人', '提报原因', '退货单状态','审核人' , '操作'],
                //  prmNames : {page:'curPage',rows:'pageSize', sort: 'sidx',order: 'sort'},
                colModel : [
                {
                    name : 'id',
                    index : 'id',
                    align : 'center',
                    width : 80
                }, {
                    align:'center',
                    width : 120,
                    formatter : function(cellvalue, options, rowObject) {
                        return $.dateFormat(rowObject.createTime,'yyyy-MM-dd');
                    }
                }, {
                    name : 'createBy',
                    index : 'createBy',
                    align : 'center',
                    width : 120,
                }, {
                    name : 'reasonDesc',
                    index : 'reasonDesc',
                    width : 250,
                }, {
                    name : '',
                    width : 100,
                    align : 'center',
                    formatter : function(cellvalue,options, rowObject) {
                       if (rowObject.status == 9)return "待审核[仅可在ERP2.0审核]";
                       if (rowObject.status == 10)return "待审核[仅可在ERP2.0以下版本审核]";
                       if (rowObject.status == 19)return "审核通过[需在ERP2.0确认退货]";
                       if (rowObject.status == 20)return "审核通过";
                       if (rowObject.status == 30)return "审核不通过";
                       if (rowObject.status == 40)return "已发货";
                       if (rowObject.status == 50)return "仓库已收货";
                    }
                    
                }, {
                    name : 'modifyBy',
                    width : 100,
                    align : 'center',
                    formatter : function(cellvalue,options, rowObject) {
                       return (rowObject.status == 19 || rowObject.status == 20 || rowObject.status == 30)? (cellvalue?cellvalue:'') : '';
                    }
               }, {
                     name : '',
                     width : 200,
                     align : 'center',
                     formatter : function(cellvalue,options, rowObject) {
                         var retVal = '';
                         if (rowObject.status==19) {
                        	 retVal += '<button class="btn btn-minier btn-white btn-primary btn-bold" onclick="storeReturnItem.confirmReturn('+rowObject.id+');">确认退货</button>';
                         }
                         retVal +='<button class="btn btn-minier btn-white btn-primary btn-bold" onclick="$.showCommonEditDialog(\'/store/return/details?id='+rowObject.id+'\',\'退货单明细\',800,500);">查看明细</button>'
                         + ' <button class="btn btn-minier btn-white btn-primary btn-bold" onclick="storeReturn.exportItemDetails('
                         + rowObject.id
                         + ');"><i class="ace-icon fa fa-list"></i>导出</button>';
                         return retVal;
                     }
                 }
                ],
                rowNum : 30,
                rowList : [ 10, 30, 50 ],
                pager : pager_selector,
                pagerpos : 'left',
                viewrecords : true,
                height:350,
                autoHeight : true,
                sortable: true,
                loadComplete : function(xhr) {
                    var table = this;
                    setTimeout(function() {
                        updatePagerIcons(table);
                    }, 0);
                }
            });
        }
    },
    exportItemDetails : function(id) {
        var url = '/store/return/exportDetails?id=' + id;
        if($('#downloadIfm').attr('src')) {
            $('#downloadIfm').attr('');
        }
        $('#downloadIfm').attr('src', url);
    }
}

    $(function() {
            storeReturnItem.fileInput($(".img_panel"));	
            $('.img_panel').find('.remove').attr('onclick','removeImg(this);');
    });
    function removeImg(e) {
        $(e).closest('label').next().find('img').removeAttr('src');
    }
    function zoomOut(obj) {
        var img = new Image();
        img.src = $(obj).attr('src');
        var bigLine = img.width > img.height ? img.width : img.height;
        var width = img.width/(bigLine/400);
        var height = img.height/(bigLine/400);
        $(obj).parent().find('.img_big').css({'width' : width, 'height' : height});
    }