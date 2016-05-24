var restaurantFacade = {
    detailsGrid:null,
    update : function(e) {
        var id = $(e).attr('res-id');
        $('#brand_name_'+id).removeAttr('disabled');
        $('#store_name_'+id).removeAttr('disabled');
        $(e).removeClass('btn-update').addClass('btn-save');
    },
    save : function(e) {
        // $('#'+id).attr("readonly","readonly");
        var id = $(e).attr('res-id');
        var brand=$('#brand_name_'+id);
        var store=$('#store_name_'+id);
        var brandId=$(brand).attr('idVal')*1;
        var storeId=$(store).attr('idVal')*1;
        if (!brandId || !brand.val()) {
            brandId = 0;
        }
        if (!storeId || !store.val()) {
            storeId = 0;
        }
        $.ajax({
            type: 'post',
            url: '/restaurant/update',
            data: {
                brandId:brandId,
                storeId:storeId,
                id:id
            },
            dataType: "json",
            success: function (data) {
                var returnCode = data.result.code;
                if (returnCode == '000000') {
                    $.gritter.add({
                        title: '',
                        text: '修改成功',
                        sticky: false,
                        time: '2000',
                        class_name: 'gritter-success'
                    });
                    $(brand).attr("disabled",true);
                    $(store).attr("disabled",true);
                    restaurantFacade.reload();
                } else {
                    $.gritter.add({
                        title: '',
                        text: '修改失败：' + data.result.message,
                        sticky: false,
                        time: '3000',
                        class_name: 'gritter-error'
                    });
                }
            },
            error: function (msg) {
                if(msg.status == 500){
                    alert(" 数据加载失败,请联系管理员！");
                }
                if(msg.status == 200){
                    alert("系统异常,请联系管理员！")
                }
            }
        });
    },
    enable: function(restaurantId, action) {
        
        $.dialog.confirm('确定要' + (action?'启用':'禁用') + '吗？', function(){
            var url = '/restaurant/enable';
            $.post(url, {restaurantId:restaurantId, action:action}, function(result){
                if(result.code == '000000') {
                    if(action) {
                        // 启用
                        $.dialog.alert('启用成功，对应的napos餐厅<br/>1.营业状态改为[营业中]<br/>2订单模式改为[开放平台]');
                    } else {
                        $.dialog.alert('禁用成功，对应的napos餐厅<br/>1.营业状态已改为[暂停营业]<br/>2订单模式改为[支持网络订餐]');
                    }
                    
                    $.dialog.alert(result.message);
                    restaurantFacade.reload();
                } else {
                    $.dialog.alert(result.message);
                }
            });
        })
    },
    getQueryString: function(){
        // 构建 queryString
        var queryString="";
        var id = $('#restaurantId').attr('idVal');
        var name = $('#restaurantName').val();
        var cityId = $('#restaurantCityId').attr('idVal');
        var storeId = $('#restaurantStoreId').attr('idVal');
        var isStoreMatched = $('#restaurantStoreMatched').val();
        var storeType = $('#storeType').val();
        var isValid = $('#isValid').val();
        if(id) {
            queryString = queryString + '&elemeRestaurantId=' + id;
        }
        if(name) {
            queryString = queryString + '&name=' + name;
        }
        if(cityId) {
            queryString = queryString + '&cityId=' + cityId;
        }
        if(storeId) {
            queryString = queryString + '&storeId=' + storeId;
        }
        if (isStoreMatched && isStoreMatched >= 0) {
            queryString = queryString + '&isStoreMatched=' + isStoreMatched;
        }
        if(storeType) {
            queryString += '&storeType=' + storeType;
        }
        if(isValid != '') {
            queryString += '&isValid=' + isValid;
        }
        //if (queryString == "") {
        //    $(this).hintError("至少需要有一个查询条件",3000);
        //    return;
        //}
        queryString = "?nd=" + Math.random()+queryString;
        return queryString
    },
    query : function() {
        // 加载详情
        restaurantFacade.loadDetails(restaurantFacade.getQueryString());
    },
    reload: function(){
        var _this = this;
        var grid_selector = "#restaurant_table_data_list";
        var pager_selector = "#restaurant_table_data_list_pager";
        var url = '/restaurant/list';
        // 根据搜索条件，重新加载
        $(grid_selector).jqGrid('setGridParam',{
            url : url+_this.getQueryString()
        }).trigger("reloadGrid");
    },
    // 加载数据详情
    loadDetails : function(params) {
        var _this = this;
        var grid_selector = "#restaurant_table_data_list";
        var pager_selector = "#restaurant_table_data_list_pager";
        var url = '/restaurant/list';
        if(_this.detailsGrid) {
            // 根据搜索条件，重新加载
            $(grid_selector).jqGrid('setGridParam',{
                url : url+params,
                page:1
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : url+params,
                datatype : 'json',
                mtype : 'POST',
                colNames : [ 'Walle餐厅ID', '餐厅名称', '营业时间', '品牌', '餐厅地址', '是否启用', '门店编码', '对应门店', '操作列'],
                jsonReader : {
                    root: "data",
                    page: "curPage",
                    total: "totalPage",
                    records: "totalRows"
                },
                prmNames : {page:'curPage',rows:'pageSize'},
                cmTemplate: {sortable:true},
                colModel : [ {
                    name : 'elemeRestaurantId',
                    width : 100,
                    key : true
                },  {
                    name : 'name',
                    width : 120
                },  {
                    name : '',
                    width : 100,
                    formatter : function(cellvalue, options, rowObject) {
                        var retVal = "";
                        if (rowObject.naposRestaurant && rowObject.naposRestaurant.servingTime) {
                            $(rowObject.naposRestaurant.servingTime).each(function() {
                                retVal=retVal+this+'<br>';
                            });
                        }
                        return retVal;
                    }
                },  {
                    name : '',
                    width : 100,
                    align : 'center',
                    formatter : function(cellvalue, options, rowObject) {
                        var brandName = (rowObject.brandId == null || rowObject.brandId == 0) ? "无" : rowObject.brandName;
                        var retVal = '<input id="brand_name_'+rowObject.id+'" nameVal="'+brandName+'"  idVal="'+rowObject.brandId+'" class="form-control inputSelect" style="width:170px;" value="'+brandName+'" disabled '
                                    +'keyId="id" keyName="name" ajax="true" url="/brand/hintList" paramName="name" liClick="brandOption.fill" input="brandOption.clean" blur="brandOption.check" selectMargin="0px" name="name" style="width:170px;" autocomplete="off" isNull="false" checkType="empty"'
                                    +'>';
                        return retVal;
                    }
                },  {
                    name : 'naposRestaurant.address',
                    width : 160
                },{
                    name : 'isValid',
                    width : 80,
                    align : 'center',
                    formatter : function(cellvalue, options, rowObject) {
                        return cellvalue=='1'?'是':'否';
                    }
                },{
                    name : 'storeCode',
                    align : 'center',
                    width : 100
                },{
                    name : '',
                    width : 120,
                    formatter : function(cellvalue, options, rowObject) {
                        var storeName = (rowObject.storeId == null || rowObject.storeId == 0) ? "无" : rowObject.storeName;
                        var retVal = '<input id="store_name_'+rowObject.id+'"  nameVal="'+storeName+'" idVal="'+rowObject.storeId+'" class="form-control inputSelect" style="width:170px;" value="'+storeName+'" disabled '
                                    +'keyId="id" keyName="storeName" ajax="true" url="/store/hintList" paramName="storeName" liClick="storeOption.fill" input="storeOption.clean" blur="storeOption.check" selectMargin="0px" name="storeName" style="width:170px;" autocomplete="off" isNull="false" checkType="empty"'
                                    +'>';
                        return retVal;
                    }
                },   {
                    name : '',
                    sortable : false,
                    width : 180,
                    align : 'center',
                    formatter : function(cellvalue, options, rowObject) {
                        var retVal = ' <button class="btn btn-minier btn-white btn-default btn-bold btn-update zs-auth" permission="/restaurant/update" href="javascript:void(0);" res-id='+rowObject.id+'><i class="ace-icon fa fa-pencil-square-o blue"></i></button>';
                        retVal += ' <button class="btn btn-minier btn-white btn-default btn-bold zs-auth" permission="/restaurant/toFoodList" href="javascript:void(0);" onclick=toFoodList('+rowObject.restaurantOid+',\''+rowObject.storeCode+'\');>菜品管理</button>';
                        var enabledStr, enabled;
                        if(rowObject.isValid && rowObject.isValid==1) {
                            enabledStr = '禁用';
                            enabled = false;
                        } else {
                            enabledStr = '启用';
                            enabled = true;
                        }
                        retVal += ' <button class="btn btn-minier btn-white btn-default btn-bold zs-auth" permission="/restaurant/enable" href="javascript:void(0);" onclick=restaurantFacade.enable('+rowObject.id+','+enabled+');>'+ enabledStr +'</button>';
                        
                        return retVal;
                    }
                }],
                rowNum : 10,
                rowList : [ 10, 20, 50 ],
                pager : pager_selector,
                pagerpos : 'left',
                height : 350,
                viewrecords : true,
                autoHeight : true,
                loadComplete : function(xhr) {
                    var table = this;
                    var totalPage = xhr.totalPage;
                    if (totalPage <= 1) {
                        //$(pager_selector).hide();
                    }
                    else {
                        $(pager_selector).show();
                    }
                    setTimeout(function() {
                        updatePagerIcons(table);
                        $.removeScrollX('#data-list');
                        //初始化下拉菜单
                        inputSelectUtil.init();
                    }, 0);
                    $.authenticate();
                }
            });
        }
        // 自适应宽度
        $.resizeGrid(grid_selector);
    },
    showCommonDeleteDialog : function (brandId, brandName) {
        $.dialog({
            lock: true,
            content : '确认删除品牌"'+brandName+'"吗？',
            width: 200,
            height: 100,
            drag: false,
            resize: false,
            icon: 'alert.gif',
            ok: function () {
                $.get('/brand/delete', {'id':brandId}, function(data) {
                    // TODO after delete
                    alert('删除结果' + data);
                }, 'json');
                $("#brand_table_data_list").trigger("reloadGrid");
                return true;
            },
            cancel: true
        });
    }
}

function toFoodList(id, storeCode){
    $.dialog({
        id : 'toFoodList',
        lock: true,
        title : "菜品管理",
        content : 'url:/restaurant/toFoodList?restaurantOid='+id + '&storeCode='+storeCode,
        width: 800,
        height: 600,
        drag: true,
        resize: true,
        icon: 'alert.gif'
    });
}

$(function () {
    $('#page_tabs').tabs();
    $("#restaurant_searchBtn").click(restaurantFacade.query);
    //初始化可输入下拉框
    inputSelectUtil.init().load("#restaurantCityId");
    
    setTimeout(function(){
        $("#restaurant_searchBtn").click();
    },100);
    
});
$(document).on('click', '.btn-update', function(event) {

    restaurantFacade.update(this);
    /* Act on the event */
});
$(document).on('click', '.btn-save', function(event) {
    var _this = this;
    setTimeout(function(){
        // 延时操作，防止自动选择框置空后，未能赋值为空
        restaurantFacade.save(_this);
    },100);
    /* Act on the event */
});
$(document).on('click', '#restaurant_fetchBtn', function(event) {
    var walleId = $('#walleId').val();
    var _this = this;
    if (!walleId || walleId == '') {
        $(_this).hintError("Walle餐厅ID不能为空",3000);
        return;
    }
    $.ajax({
            type: 'post',
            url: '/restaurant/fetchNaposRestaurant',
            data: {
                walleId:walleId
            },
            dataType: "json",
            success: function (data) {
                if (data == 'SUCCESS') {
                    $(_this).hintOk("获取成功");
                }
                else if (data == 'BASEDATA_RESTAURANT_FETCH_WALLE_UPDATE_SUCCESS') {
                    $(_this).hintOk("获取成功，已有餐厅更新同步餐厅信息");
                }
                else if (data == 'BASEDATA_RESTAURANT_FETCH_WALLE_ADD_SUCCESS') {
                    $(_this).hintOk("获取成功，新增餐厅信息");
                }
                else if (data == 'BASEDATA_RESTAURANT_FETCH_WALLE_ERR'){
                    $(_this).hintError("Walle餐厅获取失败",3000);
                }
                else if (data == 'BASEDATA_RESTAURANT_FETCH_RESTAURANT_ERR'){
                    $(_this).hintError("Napos餐厅获取失败",3000);
                }
            },
            error: function (msg) {
                if(msg.status == 500){
                    alert(" 数据加载失败,请联系管理员！");
                }
                if(msg.status == 200){
                    location.href = "/ajax_noPermission";
                }
            }
        });
    /* Act on the event */
});
