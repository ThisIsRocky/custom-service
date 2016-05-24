var retryFacade = {
      price : function() {
        if(confirm("确认补偿？")){
            $.ajax({
                type : "post",
                url : "/taskRetry/price",
                data : $("#priceForm").serializeArray(),
                success:function(response) {
                    if (response.code == "000000") {
                        $.dialog({title: '提示',content: '提交成功，处理中...',icon: 'success.gif', ok : '确定'});
                    } else {
                        $.dialog.alert(response.message); 
                    }
                },
                error:function(msg){
                    $.dialog.alert(msg);
                }
            });
        }
    },
    invoicing : function() {
        if(confirm("确认补偿？")){
            $.ajax({
                type : "post",
                url : "/taskRetry/invoicing",
                data : $("#invoicingForm").serializeArray(),
                success:function(response) {
                    if (response.code == "000000") {
                        $.dialog({title: '提示',content: '提交成功，处理中...',icon: 'success.gif', ok : '确定'});
                    } else {
                        $.dialog.alert(response.message); 
                    }
                },
                error:function(msg){
                    $.dialog.alert(msg);
                }
            });
        }
    },
    storeProfits : function() {
        if(confirm("确认补偿？")){
            $.ajax({
                type : "post",
                url : "/taskRetry/storeProfits",
                data : $("#storeProfitsForm").serializeArray(),
                success:function(response) {
                	$.dialog.alert(response.message); 
                },
                error:function(msg){
                    $.dialog.alert(msg);
                }
            });
        }
    },
    reportBrand : function() {
        if(confirm("确认补偿？")){
            $.ajax({
                type : "post",
                url : "/taskRetry/reportBrand",
                data : $("#reportBrandForm").serializeArray(),
                success:function(response) {
                    $.dialog.alert(response.message);
                },
                error:function(msg){
                    $.dialog.alert(msg);
                }
            });
        }
    },
};
$(function() {
    $.initTabs("#retry_task_tabs");
    $("#priceBtn").click(retryFacade.price);

    $("#invoicingBtn").click(retryFacade.invoicing);
    $("#storeProfitsBtn").click(retryFacade.storeProfits);
    $("#reportBrandBtn").click(retryFacade.reportBrand);

});
