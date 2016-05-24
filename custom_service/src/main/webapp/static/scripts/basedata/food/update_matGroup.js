var $level1CategoryMap = {};
var $level2CategoryMap = {};
function initCat() {
    initCategoryLevel1($('#category_level1_default').val(), $('#category_level2_default').val(), function () {
        var categoryCode = $('#category_code_modify').val();
        if($("#id").val()) {
        	var selVal = $("#material_category_level1_modify").find("option:selected").val();
        	$("#material_category_level1_modify").find("option").each(function(){
        		if(selVal != $(this).val()){
        			$(this).remove();
        		}
        	});
        	selVal = $("#material_category_level2_modify").find("option:selected").val();
        	$("#material_category_level2_modify").find("option").each(function(){
        		if(selVal != $(this).val()){
        			$(this).remove();
        		}
        	});
        }
    });

    $('#material_category_level1_modify').change(function () {
        var code = $level1CategoryMap[$('#material_category_level1_modify').val()];
        $('#category_code_modify').val(code);
        initCategoryLevel2($('#material_category_level1_modify').val());
    });

    $('#material_category_level2_modify').change(function () {
            var code = $level1CategoryMap[$('#material_category_level1_modify').val()].concat($level2CategoryMap[$('#material_category_level2_modify').val()]);
            $('#category_code_modify').val(code);
        }
    );
}
$(function () {
    initCat();
    $('#modify_cancel_btn').click(function () {
        dialog.close();
    });
    $('#modify_submit_btn').click(function () {
    	var params = $("#form").serialize();
        $.post('/matGroup/save?'+params, {}, function(data){
        	if(data.success) {
                dialog.close();
                $.dialog({title: '提示',content: '保存成功',icon: 'success.gif', ok : '确定'});
                parent.matGroupFacade.query();
        	}else {
                parent.$.dialog.alert(data.msg);
        	}
        }, 'json');
    });
    $("#unitBaseNameSel").change(function() {
    	$("#unitBaseName").val($(this).find("option:selected").attr("unitname"));
    });
});

