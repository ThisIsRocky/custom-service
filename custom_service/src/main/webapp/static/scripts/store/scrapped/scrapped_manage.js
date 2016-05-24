$(function () {
    $('#page_tabs').tabs();
    //$.initDatePicker('#dateRange');

    lan_local.format = 'YYYY-MM-DD';
    $('#beginDate').daterangepicker({
        'singleDatePicker' : true,
        'autoUpdateInput':false,
        'locale' : lan_local
    }).on('apply.daterangepicker', function(ev, picker){
        $(this).val(picker.startDate.format(lan_local.format));
    });

    $('#endDate').daterangepicker({
        'singleDatePicker' : true,
        'autoUpdateInput':false,
        'locale' : lan_local
    }).on('apply.daterangepicker', function(ev, picker){
        $(this).val(picker.startDate.format(lan_local.format));
    });

    $('#approveBeginDate').daterangepicker({
        'singleDatePicker' : true,
        'autoUpdateInput':false,
        'locale' : lan_local
    }).on('apply.daterangepicker', function(ev, picker){
        $(this).val(picker.startDate.format(lan_local.format));
    });

    $('#approveEndDate').daterangepicker({
        'singleDatePicker' : true,
        'autoUpdateInput':false,
        'locale' : lan_local
    }).on('apply.daterangepicker', function(ev, picker){
        $(this).val(picker.startDate.format(lan_local.format));
    });

    $('#beginDate').val("");
    $('#endDate').val("");

});

function tab2(){
    $( "#page_tabs" ).tabs( "option", "active", 1 );

    scrappedHistory.query();
}

function tab3(){
    $( "#page_tabs" ).tabs( "option", "active", 2 );

    scrappedToApprove.query();
}

function reasonTypeSelect(){
    var reasonType = $('#reasonType').val();
    if(reasonType == 0){
        $('#remarkDiv').css("display","");
    }else{
        $('#remarkDiv').css("display","none");
    }

}

var scrappedAdd = {
	acting : false,
    grid_selector : "#table-data-list",
    detailsGrid: null, // 数据详情
    tempSelectedMat : null,
    tempSelectedFood : null,
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
                    url : '/store/scrapped/uploadImg',
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
                });
            },
            no_icon : 'ace-icon fa fa-cloud-upload',
            droppable : true,
            thumbnail : 'small'
        })
    },
    // 加载数据详情
    query : function() {
        $('#data-list').show();
        var _this = this;
        // 首次加载
        _this.detailsGrid = $(scrappedAdd.grid_selector).jqGrid({
            postData : {'id' : $("#deliveryId").val()},
            datatype : 'json',
            colNames : [ '物料编号', '物料名称', '数量', '单位','规格', '操作'],
            jsonReader : {
                root: "data"
            },
            cmTemplate: {sortable:true},
            colModel : [ {
                name : 'materialCode',
                align : 'center',
                width : 100,
                key: true
            },  {
                name : 'materialName',
                width : 140,
                align : 'center',
            }, {
                name : 'receiveQuantity',
                width : 60,
                align : 'center',
                formatter : function(cellvalue, options, rowObject) {
                    return '<input class="receiveQuantity" style="text-align:right" materialId="'+rowObject.id+'" width="50" value="'+cellvalue+'">';
                }
            }, {
                name : 'minUnit',
                align : 'center',
                width : 100
            }, {
                name : 'standardName',
                align : 'center',
                width : 100
            }, {
                name : '',
                width : 50,
                align : 'center',
                formatter : function(cellvalue, options, rowObject) {
                    return '<button class="btn btn-minier btn-white btn-warning btn-bold" onclick="scrappedAdd.deleteItem('+options.rowId+');"><i class="ace-icon fa fa-trash-o bigger-120 orange"></i>删除</button>';
                }
            }],
            pagerpos : 'left',
            height : 'auto',
            viewrecords : true,
            autoHeight : true,
            loadComplete : function() {
                var table = this;
                setTimeout(function() {
                    $.removeScrollX('#data-list');
                }, 0);
            }
        });
        // 自适应宽度
        $.resizeGrid(scrappedAdd.grid_selector);
    },
    showMaterialTab : function() {
        $("#addMaterialTab").show();
        $("#addFoodTab").hide();
    },
    showFoodTab : function() {
        $("#addMaterialTab").hide();
        $("#addFoodTab").show();
    },
    confirmReceive : function () {
    	if(scrappedAdd.acting) {
    		return false;
    	}else {
    		scrappedAdd.acting = true;
    	}
        var itemIds = [];
        var receiveQuantity = [];
        var materialIds = [];
        var items = $(".receiveQuantity");
        if(!items || items.length == 0) {
            parent.$.dialog.alert('请先添加收到的物料');
    		scrappedAdd.acting = false;
            return false;
        }
        for(var i = 0; i < items.length; i++) {
            if(!$(items[i]).val() || $.trim($(items[i]).val()) == '' || isNaN($(items[i]).val())) {
                $(items[i]).css('border-color', 'red');
                $(items[i]).focus();
                parent.$.dialog.alert('第'+(i+1) + '行数量错误');
        		scrappedAdd.acting = false;
                return false;
            }else if(parseInt($(items[i]).val()) != $(items[i]).val() || $(items[i]).val() <= 0) {
                $(items[i]).css('border-color', 'red');
                $(items[i]).focus();
                parent.$.dialog.alert('第'+(i+1) + '行数量请填写大于0的整数');
        		scrappedAdd.acting = false;
                return false;
            }else {
                $(items[i]).css('border-color', '');
                materialIds.push($(items[i]).attr("materialId"));
                receiveQuantity.push($(items[i]).val());
            }
        }
        //判断如果是选的其他，详细原因必须写
        var reasonType = $('#reasonType').val();
        var remark = $("#remark").val();
        if(reasonType == 0 && (remark == null || remark == '')){
            parent.$.dialog.alert('请填写具体提报原因');
    		scrappedAdd.acting = false;
            return false;
        }
        // 报废图片必须上传
        var imgNum = $('.img_show').filter(function(index) {
            return $(this).attr('src') ;
        }).size();
        if(imgNum < 1) {
            parent.$.dialog.alert('请上传报废凭证');
            scrappedAdd.acting = false;
            return false;
        }

        var paramObj = {
            'reasonType'  : reasonType,
            'remark'  : remark,
            'materialIds' : materialIds,
            'receiveQuantity' : receiveQuantity
        };

        $('.img_show').each(function(i){
            var url = $(this).attr('src');
            if (url!=null && url != '') {
                paramObj["imgUrl"+ (i + 1)] = url;
            }
        });
        $.post('/store/scrapped/checkStoreScrappedToAdd',
            paramObj,
            function(needApprove) {
                if(needApprove == 'false') {
                    var confirmResult = confirm("确认后将立即扣减相关物料库存，是否确认报废？");
                    if (confirmResult == false) {
                        scrappedAdd.acting = false;
                        return;
                    }
                }
                
                // 盘点后库存变化提醒
                $.get('/common/getStoreInfo?id=' + $("#storeId").val() + '&nd=' + Math.random(), function(data){
                    if(data.isInventory == 1) {
                        parent.$.dialog({
                            title: '盘点后库存变动提醒',
                            content: '系统检测到当前门店已盘点过了，确认报废操作将会影响已提交盘点的物料，<br/>完成本操作后请进行复盘',
                            ok: function(){
                                submit();
                            },
                            lock: true,
                            icon: 'alert.gif',
                            okVal: '知道了',
                            cancel: function(){
                                scrappedAdd.acting = false;
                            }
                        });
                    } else {
                        submit();
                    }
                });
                
                function submit() {
                    $.post('/store/scrapped/addStoreScrapped',paramObj,function(data) {
                        if(data.success) {
                            alert(needApprove == 'false' ? "报废完成" : "提报成功, 待审核");
                            $('#reasonType').val(1);
                            $("#remark").val("");
                            window.location.reload();
                        }else {
                            alert("操作失败：" + data.msg);
                        }
                        scrappedAdd.acting = false;
                    }, 'json');
                }
                
            }, 'text').fail(function() {
                scrappedAdd.acting = false;
            });
    },
    fillMaterial : function(id, name, jsonStr) {
        var obj = eval('(' + jsonStr + ')');
        scrappedAdd.tempSelectedMat = obj;
        $("#unitName").html(obj.minUnit);
        $("#standardName").html(obj.standardName);

    },
    cleanMaterial : function() {
        scrappedAdd.tempSelectedMat = null;
        $("#unitName").html("");
        $("#standardName").html("");
    },
    addItem : function() {
        if(!scrappedAdd.tempSelectedMat) {
            alert("请选择物料");
            return false;
        }
        var rq = $("#receiveQuantity").val();
        if(!isInteger(rq) || rq <= 0) {
            alert("数量请填写大于零的整数");
            return false;
        }
        //判断是否添加过
        var codes = $("#table-data-list").jqGrid("getCol", 'materialCode');
        for(var i = 0; i < codes.length; i++){
            if(scrappedAdd.tempSelectedMat.code == codes[i]) {
                alert("此物料已添加，请选择其他物料");
                return false;
            }
        };
        scrappedAdd.addSingleMaterial(scrappedAdd.tempSelectedMat, rq);
        scrappedAdd.tempSelectedMat = null;
        $("#unitName").html("");
        $("#standardName").html("");
        $("#receiveQuantity").val("");
        inputSelectUtil.clean("#inputMaterialName");
        $.resizeGrid(scrappedAdd.grid_selector);
    },
    deleteItem : function(rowId) {
        if(!rowId){
            alert("请选择要删除的行");
            return;
        }else{
            var data = $("#table-data-list").jqGrid("getRowData", rowId);
            $("#table-data-list").jqGrid("delRowData", rowId);
        }
        $.resizeGrid(scrappedAdd.grid_selector);
    },
    fillNaposFood : function(id, name, jsonStr) {
        var obj = eval('(' + jsonStr + ')');
        scrappedAdd.tempSelectedFood = obj;
    },
    cleanFood : function() {
        scrappedAdd.tempSelectedFood = null;
    },
    addFood : function() {
        if(!scrappedAdd.tempSelectedFood) {
            alert("请选择Napos菜品");
            return false;
        }
        var rq = $("#foodQuantity").val();
        if(!isInteger(rq) || rq < 0) {
            alert("数量请填写大于零的整数");
            return false;
        }
        var bomList = scrappedAdd.tempSelectedFood.foodBomList;
        for(var i = 0; i < bomList.length; i++) {
            var material = {};
            material.id = bomList[i].materialId;
            material.code = bomList[i].materialCode;
            material.name = bomList[i].materialName;
            material.standardName = bomList[i].standardName;
            material.minUnit = bomList[i].unitName;
            scrappedAdd.addSingleMaterial(material, rq ? bomList[i].quantity * rq : rq);
        }
        scrappedAdd.tempSelectedFood = null;
        $("#foodQuantity").val("");
        $.resizeGrid(scrappedAdd.grid_selector);
    },
    addSingleMaterial : function(material, rq) {
        // 在已添加的物料上累计
        var quantityInput = $(".receiveQuantity[materialId=" + material.id + "]");
        if (quantityInput.length > 0) {
            if (rq) {
                var currentRq = quantityInput.val() || 0;
                quantityInput.val(parseInt(currentRq) + rq);
            }
        } else {
            // 增加新物料
            var dataRow = {
                id: material.id,
                materialCode: material.code,
                materialName: material.name,
                receiveQuantity: rq,
                standardName: material.standardName,
                minUnit: material.minUnit
            };
            $("#table-data-list").jqGrid("addRowData", material.id, dataRow, "last");
        }
    }
};

$(function() {
    scrappedAdd.query();

    scrappedAdd.fileInput($(".img_panel"));
    $('.img_panel').find('.remove').attr('onclick','removeImg(this);');

    $("#confirmReceive").click(scrappedAdd.confirmReceive);
    inputSelectUtil.init().load("#inputNaposFoodName");
    inputSelectUtil.load("#cityName");
    $("#searchhistoryBtn").click(scrappedHistory.query);
    $("#searchToApproveBtn").click(scrappedToApprove.query);


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

/***************history****************/
var scrappedHistory = {
    detailsGrid: null, // 数据详情
    query : function() {

        var queryString = "";
        var beginDate = $('#beginDate').val();
        var endDate = $('#endDate').val();
        var nowDate = new Date();

        if(beginDate) {
            if(Date.parse(beginDate)-Date.parse(nowDate)>0 ){
                parent.$.dialog.alert('开始日期不能大于今天');
                return false;
            }

            queryString += '&createBeginTime=' + beginDate;
        }
        if(endDate) {
            if(Date.parse(endDate)-Date.parse(nowDate)>0 ){
                parent.$.dialog.alert('结束日期不能大于今天');
                return false;
            }

            if(beginDate){
                var beginDate1 =  Date.parse(beginDate);
                var beginDay = parseInt(beginDate1/(1000 * 60 * 60 * 24));
                var endDate1 =  Date.parse(endDate);
                var endDay = parseInt(endDate1/(1000 * 60 * 60 * 24));
                if((endDay-beginDay)>59){
                    parent.$.dialog.alert('查询区间不能大于60天');
                    return false;
                }

            }

            queryString += '&createEndTime=' + endDate;
        }

        var status = $('#historyStatus').val();
        if (status) {
            queryString += '&status=' + status;
        }
        $('#hisory_list').show();
        // 加载详情
        scrappedHistory.loadhistoryDetails(queryString);

    },
    // 加载数据详情
    loadhistoryDetails : function(params) {
        var _this = this;
        var grid_selector = "#history_table_list";
        var pager_selector = "#history_table_list_pager";
        var url = '/store/scrapped/queryScrappedHistory?' + params;
        if(_this.detailsGrid) {
            // 根据搜索条件，重新加载
            $(grid_selector).jqGrid('setGridParam',{
                url : url,
                page:1
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : url,
                datatype : 'json',
                colNames : [ '提报单号', '提报时间', '报废原因','单据状态','操作'],
                cmTemplate: {sortable:true},
                jsonReader : {
                    root: "data",
                    page: "curPage",
                    total: "totalPage",
                    records: "totalRows"
                },
                prmNames : {page:'curPage',rows:'pageSize', sort: 'sidx',order: 'sort'},
                colModel : [ {
                    name : 'code',
                    width : 100
                },  {
                    name : 'createTime',
                    formatter : function(cellvalue, options, rowObject) {
                        return $.dateFormat(cellvalue, 'yyyy-MM-dd hh:mm:ss');;
                    },
                    width : 100
                },{
                    name : 'reasonTypeName',
                    width : 100
                },{
                    name : 'statusName',
                    width : 100
                },{
                    name : '',
                    width : 70,
                    align : 'center',
                    formatter : function(cellvalue, options, rowObject) {
                        var retVal ='';
                        if (rowObject.status == 50) {
                            retVal +='<a class="btn btn-minier btn-white btn-warning btn-bold zs-auth"  permission="/store/scrapped/addStoreScrapped" href="javascript:void(0);" onclick=confirmScrapped('+rowObject.id+');><i class="ace-icon fa fa-search orange"></i>确认报废</a>';
                        }
                        retVal +='<a class="btn btn-minier btn-white btn-warning btn-bold zs-auth"  permission="/store/scrapped/lookHistoryDetail" href="javascript:void(0);" onclick=lookHistoryDetail('+rowObject.id+');><i class="ace-icon fa fa-search orange"></i>查询明细</a>';
                        retVal +='&nbsp'+ '<a class="btn btn-minier btn-white btn-info btn-bold zs-auth" permission="/store/scrapped/exportList" href="javascript:void(0);" onclick=exportHistoryDetail('+rowObject.id+');><i class="ace-icon fa fa-download bigger-120 green"></i>导出</a>';
                        if (rowObject["cancellable"] == true) {
                            retVal +='&nbsp'+ '<a class="btn btn-minier btn-white btn-info btn-bold zs-auth" permission="/store/scrapped/cancelScrapped" href="javascript:void(0);" onclick=cancelScrapped('+rowObject.id+');><i class="ace-icon fa fa-download bigger-120 green"></i>删除</a>';
                        }
                        return retVal;
                    }
                }],
                rowNum : 30,
                rowList : [ 30, 20, 50 ],
                pager : pager_selector,
                pagerpos : 'left',
                height : 300,
                viewrecords : true,
                autoHeight : true,
                loadComplete : function() {
                    var table = this;
                    setTimeout(function() {
                        updatePagerIcons(table);
                        $.authenticate();
                    }, 0);
                }
            });
        }
        // 自适应宽度
        $.resizeGrid(grid_selector);
    }

};

function confirmScrapped(id) {
    var r = confirm("确认后将立即扣减相关物料库存，是否确认报废？");
    if (r == false) {
        return;
    }
    
    // 盘点后库存变化提醒
    $.get('/common/getStoreInfo?id=' + $("#storeId").val() + '&nd=' + Math.random(), function(data){
        if(data.isInventory == 1) {
            parent.$.dialog({
                title: '盘点后库存变动提醒',
                content: '系统检测到当前门店已盘点过了，确认报废操作将会影响已提交盘点的物料，<br/>完成本操作后请进行复盘',
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
        $.ajax({
            url : '/store/scrapped/confirmScrapped',
            type : 'post',
            dataType : 'json',
            data : {id: id},
            success : function(data) {
                if (data.success) {
                    scrappedHistory.query();
                    $.dialog({title: '提示', content: "确认报废成功", icon: 'success.gif',lock:true ,ok: '确定'});
                } else {
                    $.dialog({title: '提示', content: '操作失败', icon: 'error.gif', ok: '确定'});
                }
            },
            error : function(data){
                alert(data.responseText);
            }
        });
    }
}

function cancelScrapped(id) {
    var r = confirm("报废申请一旦删除不可恢复，请确认是否删除？");
    if (r == false) {
        return;
    }
    $.ajax({
        url : '/store/scrapped/cancelScrapped',
        type : 'post',
        dataType : 'json',
        data : {id: id},
        success : function(data) {
            if (data.success) {
                scrappedHistory.query();
                $.dialog({title: '提示', content: "删除成功", icon: 'success.gif',lock:true ,ok: '确定'});
            } else {
                $.dialog({title: '提示', content: '操作失败', icon: 'error.gif', ok: '确定'});
            }
        },
        error : function(data){
            alert(data.responseText);
        }
    });
}

function lookHistoryDetail(id){
    $.dialog({
        id : 'lookHistoryDetail',
        lock: true,
        title : "报废单详情",
        content : 'url:/store/scrapped/lookHistoryDetail?id='+id,
        width: 1000,
        height: 480,
        drag: true,
        resize: true,
        icon: 'alert.gif'
    });
}

function exportHistoryDetail(id){
    window.location.href='/store/scrapped/exportList?id='+id;
}

/***************history****************/
var scrappedToApprove = {
    detailsGrid: null, // 数据详情
    query : function() {
        var beginDate = $('#approveBeginDate').val();
        var endDate = $('#approveEndDate').val();
        var nowDate = new Date();

        if(beginDate) {
            if(Date.parse(beginDate)-Date.parse(nowDate)>0 ){
                parent.$.dialog.alert('开始日期不能大于今天');
                return false;
            }
        }
        if(endDate) {
            if(Date.parse(endDate)-Date.parse(nowDate)>0 ){
                parent.$.dialog.alert('结束日期不能大于今天');
                return false;
            }

            if(beginDate){
                var beginDate1 =  Date.parse(beginDate);
                var beginDay = parseInt(beginDate1/(1000 * 60 * 60 * 24));
                var endDate1 =  Date.parse(endDate);
                var endDay = parseInt(endDate1/(1000 * 60 * 60 * 24));
                if((endDay-beginDay)>59){
                    parent.$.dialog.alert('查询区间不能大于60天');
                    return false;
                }

            }
        }

        var queryString = $("#toApproveForm").serialize();
        $('#to_approve_list').show();
        // 加载详情
        scrappedToApprove.loadToApproveDetails(queryString);

    },
    // 加载数据详情
    loadToApproveDetails : function(params) {
        var _this = this;
        var grid_selector = "#to_approve_table_list";
        var pager_selector = "#to_approve_table_list_pager";
        var url = '/store/scrapped/toApproveList?' + params;
        if(_this.detailsGrid) {
            // 根据搜索条件，重新加载
            $(grid_selector).jqGrid('setGridParam',{
                url : url,
                page:1
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : url,
                datatype : 'json',
                colNames : [ '提报时间', '报废单号', '提报人', '门店编码', '门店名称', '门店类型', '所在城市', '状态', '状态', '报废原因','操作'],
                cmTemplate: {sortable:true},
                jsonReader : {
                    root: "data",
                    page: "curPage",
                    total: "totalPage",
                    records: "totalRows"
                },
                prmNames : {page:'curPage',rows:'pageSize', sort: 'sidx',order: 'sort'},
                colModel : [{
                    name : 'createTime',
                    formatter : function(cellvalue, options, rowObject) {
                        return $.dateFormat(cellvalue, 'yyyy-MM-dd hh:mm:ss');;
                    },
                    width : 140
                },   {
                    name : 'code',
                    width : 100
                }, {
                    name : 'createBy',
                    width : 100
                },{
                    name : 'storeCode',
                    width : 60
                },{
                    name : 'storeName',
                    width : 120
                }, {
                    name : 'storeTypeName',
                    width : 60
                }, {
                    name : 'cityName',
                    width : 60
                },{
                    name : 'status',
                    hidden : true
                },{
                    name : 'statusName',
                    width : 100
                },{
                    name : 'reasonTypeName',
                    width : 100
                },{
                    name : '',
                    width : 120,
                    align : 'center',
                    formatter : function(cellvalue, options, rowObject) {
                        var retVal = '';
                        if (rowObject.status == 10 || rowObject.status == 30) {
                            retVal += '<a class="btn btn-minier btn-white btn-warning btn-bold" href="javascript:void(0);" onclick=scrappedToApprove.toApprove(' + rowObject.id + ');><i class="ace-icon fa fa-search orange"></i>审核</a>';
                        } else {
                            retVal += '<a class="btn btn-minier btn-white btn-warning btn-bold zs-auth"  permission="/store/scrapped/lookHistoryDetail" href="javascript:void(0);" onclick=lookHistoryDetail('+rowObject.id+');><i class="ace-icon fa fa-search orange"></i>查询明细</a>';
                        }
                        retVal +='&nbsp'+ '<a class="btn btn-minier btn-white btn-info btn-bold zs-auth" permission="/store/scrapped/exportList" href="javascript:void(0);" onclick=exportHistoryDetail('+rowObject.id+');><i class="ace-icon fa fa-download bigger-120 green"></i>导出</a>';
                        return retVal;
                    }
                }],
                rowNum : 30,
                rowList : [ 30, 20, 50 ],
                pager : pager_selector,
                pagerpos : 'left',
                height : 300,
                viewrecords : true,
                autoHeight : true,
                loadComplete : function() {
                    var table = this;
                    setTimeout(function() {
                        updatePagerIcons(table);
                        $.authenticate();
                    }, 0);
                }
            });
        }
        // 自适应宽度
        $.resizeGrid(grid_selector);
    },

    toApprove : function(scrappedId) {
        $.dialog({
            id : 'toApprove',
            lock: true,
            title : "报废单审核",
            content : 'url:/store/scrapped/toApprove?id='+scrappedId,
            width: 1000,
            height: 480,
            drag: true,
            resize: true,
            icon: 'alert.gif'
        });
    }

};
