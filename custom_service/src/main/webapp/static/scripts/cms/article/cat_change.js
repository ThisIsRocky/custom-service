function listenCat(container) {
	$(container).find('.catLevel1Id').change(function() {
		fillCatLevel(container, ".catLevel2Id", $(this).val(), 1);
	});
	$(container).find('.catLevel2Id').change(function() {
		fillCatLevel(container, ".categoryId", $(this).val(), 2);
	});
	if($("#id").val() != null) {
		fillCatLevel(container, ".catLevel2Id", $(container).find('.catLevel1Id').val(), 1);
	}
}

function fillCatLevel(container, sel, pid, level) {
	$(container).find('.categoryId').find('.valOpt').remove();
	if(level == 1) {
		$(container).find('.catLevel2Id').find('.valOpt').remove();
	}
	if(pid != null && pid != '') {
		$.post('/cms/article/findCatListByPid', {'id' : pid}, function(data){
			if(data != null && data.length > 0) {
				$(data).each(function() {
					$(container).find(sel).append('<option class="valOpt" value="'+this.id+'">'+this.name+'</option>');
				});
				if($("#id").val() != null) {
					$(container).find(sel).val($(container).find(sel).attr('catVal'));
					if(level == 1) {
						fillCatLevel(container, ".categoryId", $(container).find('.catLevel2Id').attr('catVal'), 2);
					}
				}
			}
		}, 'json');
	}
}