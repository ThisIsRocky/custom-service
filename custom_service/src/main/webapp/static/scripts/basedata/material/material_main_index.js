$isUnitGroupInit=false;
$(function () {
    $.authenticate(function() {
        $.initTabs("#page_tabs");
    });
    $('#unit_group_tab_title').click(function(){
        if(!$isUnitGroupInit){
            initUnitGroupGrig();
            $isUnitGroupInit=true;
        }
    });
});