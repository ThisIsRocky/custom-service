var deilvieryItemRceived = {
	grid_selector : "#table-data-list",
	pager_selector : "#table-data-list-pager",
	url : '/store/unReceived/getDeliveryItemList',
    detailsGrid: null, // 数据详情
    acting : false,
    // 加载数据详情
    query : function() {
        $('#data-list').show();
        var _this = this;
        // 首次加载
        _this.detailsGrid = $(deilvieryItemRceived.grid_selector).jqGrid({
            url : deilvieryItemRceived.url,
            postData : {'id' : $("#deliveryId").val()},
            datatype : 'json',
            colNames : [ '物料编号', '物料名称' , '订货数量', '配送数量','配送详情', '实收数量', '差异备注', '单位', '规格'],
            cmTemplate: {sortable:true},
            jsonReader : {  
                root: "data",  
                page: "curPage",  
                total: "totalPage",  
                records: "totalRows"
            },
            prmNames : {
                page : 'curPage',
                rows : 'pageSize',
                sort : 'sidx',
                order : 'sort'
            },
            colModel : [ {
                name : 'materialCode',
                width : 80
            },  {
                name : 'materialName',
                width : 130,
            }, {
                name : 'purchaseQuantity',
                width : 60
            }, {
                name : 'deliveryQuantity',
                width : 60,
                formatter : function(cellvalue, options, rowObject) {
                    var str = cellvalue;
                    if(rowObject.deliveryDifferenceReason) {
                        str += ' <i class="ace-icon fa fa-comments-o red2 cursor-pointer" title="发货差异备注：'+ rowObject.deliveryDifferenceReason +'"></i>';
                    }
                    return str;
                }
            }, {
                name : 'deliveryQuantityDetails',
                width : 180,
                formatter : function(cellvalue, options, rowObject) {
                    var ret = "";
                    $(rowObject.storeDeliveryItemBatchList).each(function(){
                   	 ret += $.dateFormat(this.productionDate, "yyyy-MM-dd") + " | " + this.quantity + "<br>";
                    });
                    return ret;
                }
            }, {
                name : 'receiveQuantity',
                width : 60,
                align : 'center',
                formatter : function(cellvalue, options, rowObject) {
                	return '<input class="receiveQuantity" itemId="'+rowObject.id+'" materialId="'+rowObject.materialId+'" width="50">';
                }
            }, {
                name : 'differenceReason',
                width : 240,
                align : 'center',
                formatter : function(cellvalue, options, rowObject) {
                    return '<select onchange="changeDifferenceReason(this)">' +
                        '<option value="">请选择</option>' +
                        '<option value="货物部分损坏，拒收">货物部分损坏，拒收</option>' +
                        '<option value="货物全部损坏，拒收">货物全部损坏，拒收</option>' +
                        '<option value="未知原因少发了">未知原因少发了</option>' +
                        '<option value="货物部分过期，拒收">货物部分过期，拒收</option>' +
                        '<option value="货物全部过期，拒收">货物全部过期，拒收</option>' +
                        '<option value="非订货物料（强配订单不选）">非订货物料（强配订单不选）</option>' +
                        '<option value="">其它</option>' +
                        '</select>'+
                        '<input class="differenceReason" style="display:none;width:100%" materialId="'+rowObject.id+'">';
                }
            },{
                name : 'unitName',
                width : 50
            }, {
                name : 'materialStandard',
                width : 130
            }],
            rowNum : 999,
            pagerpos : 'left',
            height : 'auto',
            viewrecords : true,
            autoHeight : true,
        });
        // 自适应宽度
        $.resizeGrid(deilvieryItemRceived.grid_selector);
    },
};

function changeDifferenceReason(reasonSelect) {
    var reasonInput = $(reasonSelect).siblings(".differenceReason");
    var selectedIndex = reasonSelect.options.selectedIndex;
    var size = reasonSelect.options.length;
    if (selectedIndex > 0) {
        reasonInput.val(reasonSelect.options[selectedIndex].value);
    }
    if (selectedIndex == size - 1) {
        reasonInput.show();
    } else {
        reasonInput.hide();
    }
}

function confirmReceive() {
	$("#confirmReceive").attr("disabled", "disabled");
	if(deilvieryItemRceived.acting) {
		return false;
	}else {
		$("#confirmReceive").attr("disabled","disabled");
		deilvieryItemRceived.acting = true;
	}
	var itemIds = [];
	var receiveQuantity = [];
    var differenceReason = [];
	var materialIds = [];
	var items = $(".receiveQuantity");
	for(var i = 0; i < items.length; i++) {
		if(!$(items[i]).val() || $.trim($(items[i]).val()) == '' || isNaN($(items[i]).val())) {
			$(items[i]).css('border-color', 'red');
			$(items[i]).focus();
			parent.$.dialog.alert('第'+(i+1) + '行数量错误');
			$("#confirmReceive").removeAttr("disabled");
    		deilvieryItemRceived.acting = false;
			return false;
		}else if(parseInt($(items[i]).val()) != $(items[i]).val() || $(items[i]).val() < 0) {
			$(items[i]).css('border-color', 'red');
			$(items[i]).focus();
			parent.$.dialog.alert('第'+(i+1) + '行数量请填写大于0的整数');
			$("#confirmReceive").removeAttr("disabled");
    		deilvieryItemRceived.acting = false;
			return false;
		}
        else {
			$(items[i]).css('border-color', '');
			itemIds.push($(items[i]).attr("itemId"));
			materialIds.push($(items[i]).attr("materialId"));
			receiveQuantity.push($(items[i]).val());
		}
	}
    var differenceReasonItems = $(".differenceReason");
    for (var i = 0; i < differenceReasonItems.length; i++) {
        var materialId = $(differenceReasonItems[i]).attr("materialId");
        var rowData = deilvieryItemRceived.detailsGrid.getRowData(materialId);
        var delivered = rowData["deliveryQuantity"];
        var received = receiveQuantity[i];
        var reason = $(differenceReasonItems[i]).val().trim();
        if (delivered != received) {
            var materialName = rowData["materialName"];
            if (!reason) {
                parent.$.dialog.alert(materialName + ': 物料差异原因未填');
    			$("#confirmReceive").removeAttr("disabled");
        		deilvieryItemRceived.acting = false;
                return false;
            } else if (reason.length > 50) {
                parent.$.dialog.alert(materialName + ': 物料差异原因过长，请不要超过50字');
    			$("#confirmReceive").removeAttr("disabled");
        		deilvieryItemRceived.acting = false;
                return false;
            }
            differenceReason.push(reason);
        } else {
            differenceReason.push("");
        }
    }
    
    // 盘点后库存变化提醒
    $.get('/common/getStoreInfo?id=' + $("#storeId").val() + '&nd=' + Math.random(), function(data){
        if(data.isInventory == 1) {
            parent.$.dialog({
                title: '盘点后库存变动提醒',
                content: '系统检测到当前门店已盘点过了，确认收货操作将会影响已提交盘点的物料，<br/>完成本操作后请进行复盘',
                ok: function(){
                    submit();
                },
                lock: true,
                icon: 'alert.gif',
                okVal: '知道了',
                cancel: function(){
                    deilvieryItemRceived.acting = false;
                    $("#confirmReceive").removeAttr("disabled");
                }
            });
        } else {
            submit();
        }
    });
    
    function submit(){
        $.post('/store/unReceived/receiveFromWarehouse', 
                {'id' : $("#deliveryId").val(), 
                'storeId'  : $("#storeId").val(), 
                'itemIds' : itemIds, 
                'materialIds' : materialIds,
                'receiveQuantity' : receiveQuantity,
                'receiveDifferenceReason' : differenceReason
                }, 
                function(data) {
                    if(data.success) {
                        var msg = data.msg && data.msg != '' ? data.msg : '已确认收货成功';
                        if(parent){
                            parent.$.dialog({lock: true, title: '提示',content: msg,icon: 'success.gif', ok : function() {
                                dialog.close();
                                parent.storeUnrRceived.reload();
                            }});
                        }
                    }else {
                        deilvieryItemRceived.acting = false;
                        $("#confirmReceive").removeAttr("disabled");
                        if(parent) {
                            parent.$.dialog.alert(data.msg);
                        }else {
                            $.dialog.alert(data.msg);
                        }
                    }
                    $("#confirmReceive").removeAttr("disabled");
                }, 'json');
    }
}
$(function() {
	deilvieryItemRceived.query();
	
	$("#confirmReceive").click(confirmReceive);
});