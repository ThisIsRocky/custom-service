var inventory = {
    grid_selector : "#table-data-list",
    pager_selector : "#table-data-list-pager",
    url : '/store/inventory/getList',
    exportUrl : '/store/inventory/exportTemplate',
    detailsGrid: null, // 数据详情
    // 加载数据详情
    query : function(params) {
        $('#data-list').show();
        var _this = this;
        // 首次加载
        _this.detailsGrid = $(inventory.grid_selector).jqGrid({
            rowList: [],
            pgbuttons: false,
            pgtext: null,
            viewrecords: false,
            postData : {'templateId' : $("#selectInventoryTemplate").val()},
            url : inventory.url,
            datatype : 'json',
            colNames : ['物料编号', '物料名称' ,'数量','单位', '规格'],
            loadonce : true,
            jsonReader : {  
                root: "data",  
                page: "curPage",  
                total: "totalPage",  
                records: "totalRows"
            },
            toppager:true,
            prmNames : {page:'curPage',rows:'pageSize', sort: 'sidx',order: 'sort'},
            cmTemplate: {sortable:true},
            colModel : [{
                name : 'materialCode',
                align : 'center',
                width : 100
            }, {
                name : 'materialName',
                align : 'center',
                width : 100
            },{
                name : 'inventoryNums',
                width : 60,
                align : 'center',
                formatter : function(cellvalue, options, rowObject) {
                    //^[0-9]*[1-9][0-9]*$
                    localSort.addRow(rowObject);
                	var ipt = '<input title="输入大于等于0的正数" class="inventoryNums"'
                            +' materialId="'+rowObject.materialId
                            +'" materialName="'+rowObject.materialName
                            +'" materialCode="'+rowObject.materialCode
                            +'" unitName="'+rowObject.inventoryUnitName
                            +'" unitId="'+rowObject.inventoryUnitId
                            +'" standardName="'+rowObject.standardName
                            +'" value="'+rowObject.inventoryNums
                            +'" maxlength="10"/> ';
                    return ipt;
                }
            },{
                name : 'inventoryUnitName',
                align : 'center',
                width : 100
            }, {
                name : 'standardName',
                align : 'center',
                width : 100
            }],
            rowNum : 999,
            pagerpos : 'center',
            height : 'auto',
            viewrecords : true,
            rownumbers : true,
            autoHeight : true,
            loadComplete : function() {
                var table = this;
                setTimeout(function() {
                    updatePagerIcons(table);
                }, 0);
                $.authenticate();
                inventory.listenIptChange();
                localSort.setDefaultOrder(inventory.grid_selector, "materialCode");
                localSort.close();
            },
            beforeRequest : function() {
            	if(localSort.col) {
                    localSort.sort(inventory.grid_selector, inventory.listenIptChange);
            		return false;
            	}else {
            		localSort.reset(inventory.grid_selector);
                    localSort.open();
                    return true;
            	}
            },
            onSortCol : function(col, index, order) {
            	localSort.setParam(inventory.grid_selector, "materialCode", col, index, order);
            }
        });
        $(inventory.grid_selector)
            .jqGrid('navGrid', '#table-data-list_toppager', {edit:false,add:false,del:false,search:false, refresh:false})
            .jqGrid('navButtonAdd', '#table-data-list_toppager',{
                caption:"恢复排序",
                buttonicon:"ui-icon ace-icon fa fa-refresh green",
                onClickButton: function(){
                    $("span.s-ico", $(inventory.grid_selector)[0].grid.hDiv).hide(); // hide sort icons
                    localSort.restoreSort(inventory.grid_selector, inventory.listenIptChange);
                },
                position:"last"
            });
     // 自适应宽度
        $.resizeGrid(inventory.grid_selector);
    },
    reload : function() {
        if(inventory.detailsGrid) {
            $('#data-list').show();
            // 根据搜索条件，重新加载
            $(inventory.grid_selector).jqGrid('setGridParam',{
                url : inventory.url,
                postData : {'templateId' : $("#selectInventoryTemplate").val()},
                datatype: 'json',
            }).trigger("reloadGrid");
        }else {
            inventory.query();
        }
    },
    listenIptChange : function() {
        $(".inventoryNums").change(function() {
    		localSort.updateSortval(inventory.grid_selector, 'materialCode', $(this).attr('materialCode'), "inventoryNums", $(this).val());
        });
    },
    showCurrInventoryInfo: function(btn) {
        $(btn).attr('disabled', true);
        var url = '/store/inventory/currentInfo?rd=' + Math.random();
        $.get(url, function(html){
            bootbox.dialog({
                size:'large',
                message: '<div style="max-height:500px;overflow-y: auto;">'+ html +'</div>',
                buttons: {
                    buttonName: {
                        label: '导出',
                        className: "btn-success btn-sm",
                        callback: function(){
                            if($("#downloadIfm2").attr('src')) {
                                $("#downloadIfm2").attr('src', '');
                            }
                            $("#downloadIfm2").attr('src', '/store/inventory/exportCurrentInfo');
                            return false;
                        }
                    },
                    confirm: {
                        label: '关闭',
                        className: "btn-primary btn-sm",
                    }
                }
            });
            $(btn).attr('disabled', false);
        });
    },
    viewRestaurant : function(){
        $.showCommonEditDialog('/store/inventory/viewRestaurant','营业餐厅' ,900,450);
    }
}

function setParameterJson()
{
    var objContainer=$(".inventoryNums");
    var len=objContainer.length;
    var json="[";
    
    var flag =true;
    objContainer.each(function(i){
        var inventoryNums = $(this).val();
        $(objContainer[i]).css('border-color', '');
        if(!/^[0-9]+$/.test(inventoryNums)) {
            $(objContainer[i]).css('border-color', 'red');
            $(objContainer[i]).focus();
            $.dialog.alert('第' + (i + 1) + '行数量错误，必须为大于或等于0整数');
            flag = false;
            return false;
        }else if (parseInt($(objContainer[i]).val()) != $(objContainer[i]).val()) {
            $(objContainer[i]).css('border-color', 'red');
            $(objContainer[i]).focus();
            $.dialog.alert('第' + (i + 1) + '行数量非整数');
            flag = false;
            return false;
        }
        var materialId = $(this).attr('materialId');
        var materialCode = $(this).attr('materialCode');
        var materialName = $(this).attr('materialName');
        var unitName = $(this).attr('unitName');
        var unitId = $(this).attr('unitId');
        var standardName = $(this).attr('standardName');
        if(i<len-1){
            json+="{\"materialId\":\""+materialId
            +"\",\"materialCode\":\""+materialCode
            +"\",\"materialName\":\""+materialName
            +"\",\"unitName\":\""+unitName
            +"\",\"unitId\":\""+unitId
            +"\",\"standardName\":\""+standardName
            +"\",\"inventoryNums\":\""+inventoryNums+"\"},";
        }
        else{
            json+="{\"materialId\":\""+materialId
            +"\",\"materialCode\":\""+materialCode
            +"\",\"materialName\":\""+materialName
            +"\",\"unitName\":\""+unitName
            +"\",\"unitId\":\""+unitId
            +"\",\"standardName\":\""+standardName
            +"\",\"inventoryNums\":\""+inventoryNums+"\"}";
        }
    });
    json+="]";
    
    if(!flag){
        return false;
    }
    return json;
}

$(function() {
    //$('#page_tabs').tabs();
	
    $.authenticate(function() {
        $.initTabs("#page_tabs");
    });
    $.initDatePicker('#dateRange');
    window.onbeforeunload = function () {
    	if($("#data-list").css('display') != 'none') {
    		return "";
    	}
    };
    $('#selectInventoryTemplate').change(function(){
        //$('#data-list').show();
        // 清楚表格数据
        $(inventory.grid_selector).jqGrid('clearGridData'); 
        inventory.reload();
    })
    
    $('#exportTemplateBtn').click(function(){
        var name = $.trim($('#selectInventoryTemplate').val())
        if(name == '' || name ==  null){
            alert("盘点模版不能为空!");
            return;
        }
        $('#downloadIfm').attr('src', inventory.exportUrl+"?id=" +name);
    })
    
     $('#submitBtn').click(function(){
         var btn = $(this);
        var name = $.trim($('#selectInventoryTemplate').val())
        if(name == '' || name ==  null){
            alert("盘点模版不能为空!");
            return;
        }
        
        var json =setParameterJson();
        
        if(!json){
            return;
        }
        $('#parameterJson').val(json);
        
        btn.attr('disabled', true);
        $.post('/store/inventory/saveInventory', 
        {'templateId' : name, 
         'parameterJson'  : $("#parameterJson").val() 
         }, 
        function(data) {
            if(data.success) {
                if(data.data && data.data.length>0){
                    var html = getHtml(data.data);

                	parent.$.dialog({title: '提示',content: '保存成功',icon: 'success.gif', ok : function() {
                        $.dialog({
                            width:600,
                            height:200,
                            id: 'a15',
                            title: '盘点差异',
                            lock: true,
                            content: html,
                            padding: 0
                        });
                    }});
                }else{
                    parent.$.dialog.alert('盘点结果和账面库存一致');
                }
                
                $("#selectInventoryTemplate").val("");
                // $('#inventorySwitch').val(0);
                //$('#queryInventoryDiv').hide();
                $('#data-list').hide();
               
            }else {
                var msg = data.msg;
                if(data.errorMaterial) {
                    $(data.errorMaterial).each(function(i){
                        msg += '<br/>' + this.materialName;
                        if(i > 10) {
                            msg += '<br/>等共' + data.errorMaterial.length + '个物料';
                            return false;
                        }
                    });
                }
                
                parent.$.dialog.alert(msg);
            }
        }, 'json').complete(function() {
            btn.attr('disabled', false);
        });
    });
    // 当日盘点信息
    $('#currentInfoBtn').click(function(){
        inventory.showCurrInventoryInfo(this)
    });
    
});
//物料编号，物料名称，账面库存，盘点数量，盘盈盘亏，单位，规格
function getHtml(data){
   var html = '<div class="panel-body">';
       html +='<table cellpadding="1" cellspacing="1"  class="table table-hover text-center table-bordered">';
       html +='  <tr style="text-align: center">';
       html +='  <th style="text-align:center!important;" >物料编码</th>';
       html +='  <th style="text-align:center!important;" >物料名称</th>';
       html +='  <th style="text-align:center!important;" >账面库存</th>';
       html +='  <th style="text-align:center!important;" >盘点数量</th>';
       html +='  <th style="text-align:center!important;" >盘盈盘亏</th>';
       html +='  <th style="text-align:center!important;" >单位</th>';
       html +='  <th style="text-align:center!important;" >规格</th>';
       html +='</tr>';
       html +=' <tbody id="trContainer">';
   var strTr = "";
   $.each(data,function(n,obj){
       strTr += '<tr style="height:30px!important">';
       strTr += '<td>'+obj.materialCode+'</td>';
       strTr += '<td>'+obj.materialName+'</td>';
       strTr += '<td>'+obj.stockNums+'</td>';
       strTr += '<td>'+obj.inventoryNums+'</td>';
       strTr += '<td>'+(obj.inventoryNums-obj.stockNums)+'</td>';
       strTr += '<td>'+obj.unitName+'</td>';
       strTr += '<td>'+obj.standardName+'</td>';
       strTr += '</tr>';
   })    
   html +=strTr;
   html +="</tbody></table></div>";
   return html ;
}

