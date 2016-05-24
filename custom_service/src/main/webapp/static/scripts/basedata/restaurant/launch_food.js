/** 菜品上传 **/
var resLaunchFacade = {
    // 根据编码，回调填充菜名
    fillFood : function(id, name, obj){
        var _obj = eval('('+obj+')');
        $("#res_launch_food_code").val(_obj.code);
        $("#res_launch_food_code_val").val(_obj.id);
        $("#res_launch_food_name").val(_obj.name);
        $("#res_launch_food_napos_name").val(_obj.name);
        // 刷新left树
        resLaunchFacade.refreshLeftTree(null, null, _obj.id);
    },
    // 根据编码，回调清空菜名
    cleanFood : function(){
        //$("#res_launch_food_code").val(_obj.code);
        $("#res_launch_food_code_val").val("");
        $("#res_launch_food_name").val("");
        $("#res_launch_food_napos_name").val("");
        // 刷新left树
        resLaunchFacade.refreshLeftTree(null, null, null);
    },
    // 上传菜品图片
    aceFileInput : function(panel) {
        $('input[type=file]', panel).ace_file_input({
            no_file:'No File ...',
            btn_choose:'Choose',
            btn_change:'Change',
            droppable:false,
            before_change: function(files, dropped) {
                var file = files[0];
                var type = $.trim(file.type);
                if (type != 'image/jpeg' && type != 'image/png') {
                    $.dialog.alert('仅可上传jpg、png格式的图片。');
                    $('#res_launch_img_show').attr('src', '');
                    $('#res_launch_img_hash_val').val('');
                    return false;
                }
                if (file.size > 204800) {
                    $.dialog.alert('图片大小请不要超过200K');
                    $('#res_launch_img_show').attr('src', '');
                    $('#res_launch_img_hash_val').val('');
                    return false;
                }
                
                return true;
            },
            btn_change : function() {
                var _this = $(this);
                var fd = new FormData();
                fd.append('file', _this.parent().find('input[type="file"]').data('ace_input_files')[0]);
                $.ajax({
                    url : '/restaurant/uploadImg',
                    type : 'post',
                    processData : false,// important
                    contentType : false,// important
                    dataType : 'json',// depending on your server
                    data : fd,
                    success : function(result) {
                        $('#res_launch_img_show').attr('src', result.imageUrl);
                        $('#res_launch_img_hash_val').val(result.imageHash);
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
    // 刷新left树
    refreshLeftTree : function(parentId, brandId, foodId){
        var _parentId = parentId,
            _brandId = brandId || $("#res_launch_brand_id").val(),
            _foodId = foodId || $("#res_launch_food_code_val").val();
        tree.refresh(_parentId, _brandId, _foodId);
    },
    // 获取left树，餐厅ID list
    getLeftTreeValue : function () {
        return tree.getSelectedRestaurantIdArray();
    },
    // 上传 form check
    launchFoodCheck : function () {
        var id = $("#res_launch_food_code_val"),
            name = $("#res_launch_food_name"),
            naposName = $("#res_launch_food_napos_name"),
            brandId = $("#res_launch_brand_id"),
            isHot = $("#res_launch_food_is_hot"),
            isNew = $("#res_launch_food_is_new"),
            isMatch = $("#res_launch_food_is_match"),
            isFeatured = $("#res_launch_food_is_featured"),
            price = $("#res_launch_food_price"),
            packageFee = $("#res_launch_food_package_fee"),
            type = $("#res_launch_food_type"),
            remark = $("#res_launch_food_remark"),
            maxStock = $("#res_launch_food_max_stock"),
            stock = $("#res_launch_food_stock"),
            imgHash = $("#res_launch_img_hash_val"),
            restaurantIdList = resLaunchFacade.getLeftTreeValue();
        var checkResult = true;
        // null check
        if ($.trim(id.val()) == '') {
            $("#res_launch_food_code").css("borderColor", "red");
            checkResult = false;
        } else {
            $("#res_launch_food_code").css("borderColor", "");
        }
        if ($.trim(name.val()) == '') {
            name.css("borderColor", "red");
            checkResult = false;
        } else {
            name.css("borderColor", "");
        }
        if ($.trim(naposName.val()) == '') {
        	naposName.css("borderColor", "red");
            checkResult = false;
        } else {
            name.css("borderColor", "");
        }
        if ($.trim(brandId.val()) == '') {
            brandId.css("borderColor", "red");
            checkResult = false;
        } else {
            brandId.css("borderColor", "");
        }
        if ($.trim(isHot.val()) == '') {
            isHot.css("borderColor", "red");
            checkResult = false;
        } else {
            isHot.css("borderColor", "");
        }
        if ($.trim(isNew.val()) == '') {
            isNew.css("borderColor", "red");
            checkResult = false;
        } else {
            isNew.css("borderColor", "");
        }
        if ($.trim(isMatch.val()) == '') {
            isMatch.css("borderColor", "red");
            checkResult = false;
        } else {
            isMatch.css("borderColor", "");
        }
        if ($.trim(isFeatured.val()) == '') {
            isFeatured.css("borderColor", "red");
            checkResult = false;
        } else {
            isFeatured.css("borderColor", "");
        }
        if ($.trim(price.val()) == '') {
            price.css("borderColor", "red");
            checkResult = false;
        } else {
            price.css("borderColor", "");
        }
        if ($.trim(packageFee.val()) == '') {
            packageFee.css("borderColor", "red");
            checkResult = false;
        } else {
            packageFee.css("borderColor", "");
        }
        if ($.trim(type.val()) == '') {
            type.css("borderColor", "red");
            checkResult = false;
        } else {
            type.css("borderColor", "");
        }
        if ($.trim(remark.val()) == '') {
            remark.css("borderColor", "red");
            checkResult = false;
        } else {
            remark.css("borderColor", "");
        }
        if ($.trim(maxStock.val()) == '') {
            maxStock.css("borderColor", "red");
            checkResult = false;
        } else {
            maxStock.css("borderColor", "");
        }
        if ($.trim(stock.val()) == '') {
            stock.css("borderColor", "red");
            checkResult = false;
        } else {
            stock.css("borderColor", "");
        }
        if ($.trim(imgHash.val()) == '') {
            $("#res_launch_food_img_hash").parent().find(".ace-file-container").css("border", "1px solid red");
            // 考虑上传图片成功，却未拿到hash的情况
            if (checkResult && $.trim($("#res_launch_food_img_hash").val()) != '') {
                $.dialog({
                    lock: true,
                    content: '菜品图片上传未能成功，请先重新上传图片。',
                    width: 200,
                    height: 100,
                    ok: function() {
                        return true;
                    }
                });
                return false;
            }
            checkResult = false;
        } else {
            $("#res_launch_food_img_hash").parent().find(".ace-file-container").css("border", "");
        }
        if (!(restaurantIdList && restaurantIdList.length > 0)) {
            $("#storeDepartmentTree").css("border", "1px solid red");
            checkResult = false;
        } else {
            $("#storeDepartmentTree").css("border", "");
        }
        if (!checkResult) {
            $.dialog({
                lock: true,
                content: '请确保上传菜品信息维护完整。',
                width: 200,
                height: 100,
                ok: function() {
                    return true;
                }
            });
            return false;
        }
        // valid check
        // 售价、打包费，只能输入数字 
        var decimalReg = /^\d{1,8}(\.\d{0,2})?$/;
        if (!decimalReg.test($.trim(price.val()))) {
            price.css("borderColor", "red");
            parent.$.dialog.alert('请输入正确的金额');
            return false;
        } else {
            price.css("borderColor", "");
        }
        if (!decimalReg.test($.trim(packageFee.val()))) {
            packageFee.css("borderColor", "red");
            parent.$.dialog.alert('请输入正确的金额');
            return false;
        } else {
            packageFee.css("borderColor", "");
        }
        if ($.trim(packageFee.val())>10) {
            packageFee.css("borderColor", "red");
            parent.$.dialog.alert('打包费不能大于10元');
            return false;
        } else {
            packageFee.css("borderColor", "");
        }
        
        // 库存，最大库存只能输入整数
        var numReg = new RegExp('^[0-9]{0,8}$');
        if (!numReg.test($.trim(maxStock.val()))) {
            maxStock.css("borderColor", "red");
            checkResult = false;
        } else {
            maxStock.css("borderColor", "");
        }
        if (!numReg.test($.trim(stock.val()))) {
            stock.css("borderColor", "red");
            checkResult = false;
        } else {
            stock.css("borderColor", "");
        }
        if (!checkResult) {
            parent.$.dialog.alert('请输入整数');
            return false;
        }
        // logic check
        if (parseInt($.trim(stock.val())) > parseInt($.trim(maxStock.val()))) {
            stock.css("borderColor", "red");
            maxStock.css("borderColor", "red");
            $.dialog({
                lock: true,
                content: '当前库存不可超过最大库存，请修正库存信息。',
                width: 200,
                height: 100,
                ok: function() {
                    return true;
                }
            });
            checkResult = false;
        } else {
            stock.css("borderColor", "");
            maxStock.css("borderColor", "");
        }
        return checkResult;
    },
    // 上传 构建param
    launchFoodParamBuild : function() {
        var id = $("#res_launch_food_code_val").val(),
            name = $("#res_launch_food_name").val(),
            naposName = $("#res_launch_food_napos_name").val(),
            brandId = $("#res_launch_brand_id").val(),
            isHot = $("#res_launch_food_is_hot").val(),
            isNew = $("#res_launch_food_is_new").val(),
            isMatch = $("#res_launch_food_is_match").val(),
            isFeatured = $("#res_launch_food_is_featured").val(),
            price = $("#res_launch_food_price").val(),
            packageFee = $("#res_launch_food_package_fee").val(),
            type = $("#res_launch_food_type").val(),
            remark = $("#res_launch_food_remark").val(),
            maxStock = $("#res_launch_food_max_stock").val(),
            stock = $("#res_launch_food_stock").val(),
            imgHash = $("#res_launch_img_hash_val").val(),
            restaurantIdList = resLaunchFacade.getLeftTreeValue();
        return {
            id : id,
            name : name,
            naposName : naposName,
            brandId : brandId,
            isHot : isHot,
            isNew : isNew,
            isMatch : isMatch,
            isFeatured : isFeatured,
            price : price,
            packageFee : packageFee,
            type : type,
            remark : remark,
            maxStock : maxStock,
            stock : stock,
            imgHash : imgHash,
            restaurantIdList : restaurantIdList.toString()
        };
    },
    // 上传提交
    launchFoodSubmit : function() {
        // 避免重复提交
        if ($(this).hasClass("disabled")) {
            return;
        }
        // form check
        if (!resLaunchFacade.launchFoodCheck()) {
            return;
        }

        $.ajax({
            type: 'post',
            url: '/restaurant/launchFood',
            data: resLaunchFacade.launchFoodParamBuild(),
            dataType: "json",
            success: function (data) {
                resLaunchFacade.buildLaunchFoodMsg(data);
            },
            error: function (msg) {
                if (msg.code == '408') {
                    $.dialog.alert("上传过程可能持续时间稍长，请稍后到\"基础信息管理-网店设置-菜品管理\"中查看上传结果。");
                } else {
                    $.dialog.alert("操作失败");
                }
            },
            beforeSend: function () {
                $("#res_launch_submit_btn").addClass("disabled");
            },
            complete: function () {
                $("#res_launch_submit_btn").removeClass("disabled");
            }
        });
    },
    // 上传响应
    buildLaunchFoodMsg : function(data) {
        if (data.code == '000000') {
            // 上架成功
            $.dialog({
                lock: true,
                content: '菜品上架成功。',
                width: 200,
                height: 100,
                ok: function () {
                    return true;
                }
            });
            // 刷新form
            resLaunchFacade.resetFormAfterLaunch();
        } else {
            $.dialog({
                lock: true,
                content: data.message,
                width: 200,
                height: 100,
                ok: function () {
                    return true;
                }
            });
        }
    },
    resetFormAfterLaunch: function() {
        $("#launchFoodForm")[0].reset();
        $("#res_launch_food_type").empty();
        $("#res_launch_img_hash_val").val('');
        $("#res_launch_img_show").attr("src", '');
        setTimeout(function(){
            $("#storeDepartmentTree").empty();
            tree.init();
        }, 1000);
    },
    // 品牌-菜品联动，加载菜品
    loadFoodCategories : function(brandId) {
        $.ajax({
            url: "/foodCategory/findByBrandId?brandId=" + brandId,
            type: "get",
            dataType: "json",
            success: function (data) {
                var _fc = $("#res_launch_food_type"), _option;
                _fc.empty();
                for (var i = 0; i < data.length; i++) {
                    _option = $('<option value="'+data[i].name+'">'+data[i].name+'</option>');
                    _fc.append(_option);
                }
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    }
}

$(function () {
    //初始化可输入下拉框
    inputSelectUtil.init();
    // 文件上传初始化
    resLaunchFacade.aceFileInput($("#res_launch_img_panel"));
    // 更换品牌，刷新left树
    $("#res_launch_brand_id").change(function(){
        resLaunchFacade.refreshLeftTree(null, $(this).val(), null);
    });
    // 菜品上传submit
    $("#res_launch_submit_btn").click(function(){
        resLaunchFacade.launchFoodSubmit();
    });
    // 品牌-菜品联动
    $("#res_launch_brand_id").change(function(){
        var _this = $(this),
            _brandId = _this.val();
        if (!_brandId) {
            return;
        }
        resLaunchFacade.loadFoodCategories(_brandId);
    });
});


