var allothistory = {

    detailsGrid: null, // 数据详情
    query: function () {
        // 构建 queryString
        var queryString = "";
        //开始时间
        var startDay = $('#startDateHid').val();
        //结束时间
        var endDay = $('#endDateHid').val();
        //订单类型
        var orderType = $("#ordertype").val();
        //状态：
        var status = $("#orderStatus").val();
        if (startDay) {
            queryString = 'startDay=' + startDay;
        }
        if (endDay) {
            queryString = queryString + '&endDay=' + endDay;
        }
        if (orderType) {
            queryString = queryString + '&orderType=' + orderType;
        }
        if (status) {
            queryString = queryString + '&status=' + status;
        }

        // 加载详情
        allothistory.loadDate(queryString);
    },
// 加载数据详情
    loadDate: function (params) {
        var _this = this
        $("#page_tabs").tabs("option", "active", 2);

        var grid_selector = "#history_table_data_list";

        var pager_selector = "#history_store_table_data_list_pager";

        var url = '/store/transfer/orderHistory';
        if (_this.detailsGrid) {
            // 根据搜索条件，重新加载
            $(grid_selector).jqGrid('setGridParam', {
                url: url + '?' + params,
                page: 1
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url: url + '?' + params,
                type: 'post',
                datatype: 'json',
                colNames: ['调拨单编号', '类型', '调入/调出门店', '调出申请时间', '状态', '操作'],
                jsonReader: {
                    root: "data",
                    page: "curPage",
                    total: "totalPage",
                    records: "totalRows"
                },
                prmNames: {page: 'curPage', rows: 'pageSize', sort: 'sidx', order: 'sort'},
                cmTemplate: {sortable:true},
                colModel: [
                    {
                        name: 'id',
                        width: 50,
                        align: 'center',

                    },
                    {
                        name: 'orderType',
                        width: 50,
                        align: 'center',
                        formatter: function (orderType) {
                            if (orderType == 1) {
                                return "调出申请"
                            }
                            if (orderType == 2) {
                                return "调入确认"
                            }
                        }
                    },
                    {
                        name: 'toStoreName',
                        width: 200,
                        align: 'center',
                    },
                    {
                        name: 'createTime',
                        formatter: function (cellvalue,
                                             options, rowObject) {
                            return $.dateFormat(cellvalue,
                                'yyyy-MM-dd');
                            ;
                        },
                        align: 'center',
                        width: 50
                    },
                    {
                        name: 'status',
                        width: 50,
                        align: 'center',
                        formatter: function (status) {
                            if (status == 10) {
                                return "已失效"
                            }
                            if (status == 20) {
                                return "已驳回"
                            }
                            if (status == 30) {
                                return "待确认"
                            }
                            if (status == 40) {
                                return "已确认"
                            }
                        }
                    },
                    {
                        name: '',
                        width: 100,
                        align: 'center',
                        formatter: function (cellvalue, options, rowObject) {
                            var returnVal = '<button class="btn btn-minier btn-white btn-default btn-bold zs-auth" permission="/store/transfer/histotryorderDetail" onclick="allothistoryOrderInfo(' + rowObject.id + ');"><i class="ace-icon fa fa-list"></i>查看详情</button>';
                            returnVal += '<button class="btn btn-minier btn-white btn-default btn-bold zs-auth" permission="/store/transfer/exportInfo" onclick="allothistory.downloadReport(' + rowObject.id + ');"><i class="ace-icon fa fa-list"></i>导出</button>';
                            return returnVal
                        }
                    }],
                rowNum: 10,
                rowList: [10, 20, 50],
                pager: pager_selector,
                pagerpos: 'left',
                height: 341,
                viewrecords: true,
                autoHeight: true,
                loadComplete: function () {
                    var table = this;
                    setTimeout(function () {
                        $.removeScrollX('#history-data-list');
                        updatePagerIcons(table);
                    }, 0);
                    $.authenticate();
                }
            });
        }
        // 自适应宽度
        $.resizeGrid(grid_selector);
    },
    downloadReport: function (id) {
        $('#downloadIfm').attr('src', "/store/transfer/exportInfo?id=" + id);
    }
}
function loadAllotHistory() {

    //初始化日历的开始时间
    var startDay = getNowFormatDate(-6);
    //初始化日期的结束时间
    var endday = getNowFormatDate(0);
    $("#dateRange").attr('maxDate', endday);
    //给显示日期赋值
    $("#dateRange").val(startDay + "至" + endday);
    //给隐藏域赋值
    $("#dateRange").parent().find(".startDateHid").val(startDay);
    $("#dateRange").parent().find(".endDateHid").val(endday);

    //初始化日历
    $.initDatePicker('#dateRange');
    //查询
    allothistory.query();
}

function getNowFormatDate(a) {
    var date = new Date();
    date.setDate(date.getDate() + a);
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + '' + month + '' + strDate;
    return currentdate;
}

function queryAllotHistory() {
    allothistory.query();
}
function allothistoryOrderInfo(id) {
    edit("/store/transfer/histotryorderDetail?id=" + id, "历史调拨单详情", 600, 350, false);
}