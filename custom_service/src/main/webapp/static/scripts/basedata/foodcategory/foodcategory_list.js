/* 菜品分类 */
var foodCategory = {
    // 提交save
    saveFc : function () {
        // 避免重复提交
        if ($("#submitBtn").hasClass('disabled')) {
            return;
        }
        // form check
        var _checked = true,
            _checkThis,
            _fcIpts = $("input[name=foodCategoryNames]");
        _fcIpts.each(function(){
            _checkThis = $(this);
            if ($.trim(_checkThis.val()) == '') {
                _checkThis.css("borderColor", "red");
                _checked = false;
            } else {
                _checkThis.css("borderColor", "");
            }
        });
        if(!_checked) {
            return false;
        }
        // submit
        $.ajax({
            url: "/foodCategory/add",
            type: "POST",
            data: $("#foodCategoryForm").serialize(),
            success: function (data) {
                if (data == '000000') {
                    alert("保存成功");
                    location.reload();
                } else {
                    if (data == '024305') {
                        alert('该品牌下已存在此分类');
                    }
                }
            },
            error: function (data) {
                alert(data.responseText);
            },
            before : function() {
                $("#submitBtn").addClass("disabled");
            },
            complete : function() {
                $("#submitBtn").removeClass("disabled");
            }
        });
    },
    // 取消save
    cancelSave : function (_this) {
        dialog.close();
    },
    // 删除分类
    deleteFc : function (fcId, type, _this) {
        if (type == 0) {
            // html delete
            $(_this).parents("tr").remove();
        } else if (!type || type == 1) {
            // logic delete
            if(confirm('确认删除吗？')) {
                $.ajax({
                    url: "/foodCategory/delete?id=" + fcId,
                    type: "GET",
                    success: function (data) {
                        if (data == '000000') {
                            $(_this).parents("tr").remove();
                        } else {
                            alert(data);
                        }
                    },
                    error: function (data) {
                        alert(data.responseText);
                    }
                });
            }
        }
    },
    // 增加记录行
    addRow : function () {
        var _tbody = $("#fcTb"),
            _newTR = $('<tr name="appendFcTR">' +
                '<td><input name="foodCategoryNames" class="form-control" maxlength="50" /></td>' +
                '<td><a href="javascript:void(0);" onclick="foodCategory.deleteFc(null, 0, this);">删除</a></td>' +
                '</tr>');
        _tbody.append(_newTR);
        $.authenticate();
    }
};

$(function () {
    //
});