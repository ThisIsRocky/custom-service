(function($) {
	$.extend({
		loadStoreByCityId : function(id, name) {
			inputSelectUtil.clean("#storeId");
			inputSelectUtil.load("#storeId", {'cityId' : id});
		},
        loadRestaurantByStoreId : function(id, name) {
            inputSelectUtil.clean("#restaurantId");
            inputSelectUtil.load("#restaurantId", {'storeId' : id});
        },
        loadStoreListByCityList : function() {
            var storeSelect = $("#storeIdList");
            storeSelect.empty();
            var cityIdList = $("#cityIdList").val();
            if (!cityIdList) {
                MultiSelectUtil.rebuildMultiselect(storeSelect);
                return;
            }
            var param = {cityIdList: cityIdList};
            var storeType = $('#storeType').val();
            if (storeType) {
                param["storeType"] = storeType;
            }
            $.get("/common/findListByCity", $.param(param, true), function (data) {
                MultiSelectUtil.initData(storeSelect, data);
                MultiSelectUtil.rebuildMultiselect(storeSelect);
            }, 'json');
        }
    });
})(jQuery);