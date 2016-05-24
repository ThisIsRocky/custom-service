// 上传薪资文件
var aceFileInput = function(panel) {
    $('input[type=file]', panel).ace_file_input({
        no_file:'未选择 ...',
        btn_choose:'选择',
        btn_change:'更换',
        droppable:false,
        before_change: function(files, dropped) {
            var file = files[0];
            var name = $.trim(file.name);
            if (!name.endsWith(".xls") && !name.endsWith(".xlsx")) {
                $.dialog.alert('仅可上传xls, xlsx格式的文件');
                return false;
            }
            if (file.size > 1024 * 1024) {
                $.dialog.alert('文件大小请不要超过1M');
                return false;
            }
            return true;
        },
        no_icon : 'ace-icon fa fa-cloud-upload',
        droppable : true,
        thumbnail : 'small'
    })
};

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

$(function () {
    formValidate();
    $.authenticate(function() {
        $.initTabs("#page_tabs");
    });

    //
    if($("#isVacation").val() == 1) {
        $("#coverAll").show();
    }


    aceFileInput("#salaryFileUploadPanel");

    $("#dailyExpenseSubmitBtn").click(function() {
        if (!validat()) {
            var file = $("#salaryFile").val();
            if (!file) {
                $(".ace-file-container").addClass("tooltipinputerr");
            }
            return;
        }

        $(".ace-file-container").removeClass("tooltipinputerr");
        $("#dailyExpenseSubmitBtn").addClass("disabled");

        $("#dailyExpenseForm").ajaxSubmit({
            type: "POST",
            url: "/store/dailyExpense/save",
            success : function (data) {
                $("#dailyExpenseSubmitBtn").removeClass("disabled");
                if (data.code === "000000") {
                    $.dialog({title: '提示', content: "提报成功", icon: 'success.gif', ok: '确定'});
                } else {
                    var ok = data.code === "0301008" ? function() {location.reload();} : '确定';
                    $.dialog({title: '错误', content: data.message, icon: 'error.gif', ok: ok});
                }
            },
            error : function (data) {
                $("#dailyExpenseSubmitBtn").removeClass("disabled");
                $.dialog({title: '错误', content: "提报失败，系统错误", icon: 'error.gif', ok: '确定'});
            }
        });
    });

    $("#vacationStartBtn").click(function() {
        var isVacation = $('#isVacation').val();

        $("#dailyExpenseForm").ajaxSubmit({
            type: "POST",
            url: "/store/dailyExpense/vacation",
            success : function (data) {
                //
                window.location.reload();
            },
            error : function (data) {

            }
        });
    });
});

/** ----净利润详情 --*/
var storeProfits = {
    detailsGrid:null,
    // 加载数据详情
    query : function() {
        var startDate = $('#startDateHid').val();
        var endDate = $('#endDateHid').val();
        var params = "?startTime=" + startDate + "&endTime=" + endDate;
        var grid_selector = "#store-profits-data-list";
        var pager_selector = "#store-profits-data-list-pager";
        if(storeProfits.detailsGrid) {
            // 根据搜索条件，重新加载
            $(grid_selector).jqGrid('setGridParam',{
                url : "/store/dailyExpense/profitList"+params,
                page:1
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            storeProfits.detailsGrid = $(grid_selector).jqGrid({
                url : "/store/dailyExpense/profitList"+params,
                datatype : 'json',
                mtype : 'POST',
                jsonReader : {
                    root: "data",
                    page: "curPage",
                    total: "totalPage",
                    records: "totalRows"
                },
                prmNames : {page:'curPage',rows:'pageSize', sort: 'sidx',order: 'sort'},
                cmTemplate: {sortable:true},
                colNames : ['提报日期', '总营业收入', '营运费用', '水费', '电费', '薪资', '净利润'],
                // prmNames : {page:'curPage',rows:'pageSize', sort: 'sidx',order: 'sort'},
                colModel : [
                    {
                        name : 'statisticalTime',
                        index : 'statisticalTime',
                        align:'center',
                        width : 200,
                        formatter : function(cellvalue, options, rowObject) {
                            return $.dateFormat(rowObject.statisticalTime,'yyyy-MM-dd');
                        }
                    },{
                        name : 'operatingIncome',
                        index : 'operatingIncome',
                        align : 'center',
                        width : 200
                    }, {
                        name : 'operatingSuppliesAmount',
                        index : 'operatingSuppliesAmount',
                        align : 'center',
                        width : 200
                    }, {
                        name : 'waterFee',
                        index : 'waterFee',
                        align : 'center',
                        width : 200
                    }, {
                        name : 'powerFee',
                        index : 'powerFee',
                        align : 'center',
                        width : 200
                    }, {
                        name : 'salary',
                        index : 'salary',
                        align : 'center',
                        width : 200
                    }, {
                        name : 'profits',
                        index : 'profits',
                        align : 'center',
                        width : 200
                    }
                ],
                rowNum : 30,
                rowList : [ 10, 30, 50 ],
                pager : pager_selector,
                pagerpos : 'left',
                viewrecords : true,
                height:350,
                autoHeight : true,
                sortable: true,
                loadComplete : function(xhr) {
                	var  table = this;
                    setTimeout(function() {
                        updatePagerIcons(table);
                        $.authenticate();
                    }, 0);
                }
            });
        }
        // 自适应宽度
        var parent_column = $(grid_selector).closest('[class*="col-"]');
        $(grid_selector).jqGrid( 'setGridWidth', parent_column.width() );
        // resizeGrid('#data-list', grid_selector, 326);
    }
};

$(function () {
    $.initDatePicker('#dateRange');
});
var parent_column = $('#store-profits-data-list').closest('[class*="col-"]');
$(window).on('resize.jqGrid', function () {
    // 自适应宽度
    $('#store-profits-data-list').jqGrid('setGridWidth', parent_column.width());
});