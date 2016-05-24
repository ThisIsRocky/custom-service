var storeProfits = {
    summaryGrid:null,
    detailsGrid:null,
    commonColNames : [
        '总营业收入', '占比', '营销费用', '占比', '总产品成本', '占比', '损耗', '占比', '差异', '占比','配送服务费', '占比','订单配送费', '占比', '水费', '占比', '电费', '占比', '薪资', '占比', '营运用品', '占比', '租金', '占比', '其它固定费用', '占比', '净利润', '占比'
    ],
    commonColModel: [
        {
            name : 'operatingIncome',
            index : 'operatingIncome',
            align : 'center',
            width : 80
        }, {
            name : 'operatingIncomeRatioStr',
            //index : 'operatingIncome',
            align : 'center',
            width : 50
        }, {
            name : 'marketingExpenses',
            index : 'marketingExpenses',
            align : 'center',
            width : 80
        },{
            name : 'marketingExpensesRatioStr',
            //index : 'operatingIncome',
            align : 'center',
            width : 50
        },{
            name : 'costOfGoods',
            index : 'costOfGoods',
            align : 'center',
            width : 80
        }, {
            name : 'costOfGoodsRatioStr',
            //index : 'operatingIncome',
            align : 'center',
            width : 50,
        }, {
            name : 'consumptionAmount',
            index : 'consumptionAmount',
            align : 'center',
            width : 80
        },{
            name : 'consumptionAmountRatioStr',
            //index : 'operatingIncome',
            align : 'center',
            width : 50
        }, {
            name : 'diffFee',
            index : 'diffFee',
            align : 'center',
            width : 80
        }, {
            name : 'diffFeeRatioStr',
            //index : 'operatingIncome',
            align : 'center',
            width : 50
        }, {
            name : 'deliverServiceFee',
            index : 'deliverServiceFee',
            align : 'center',
            width : 80
        }, {
            name : 'deliverServiceFeeRatioStr',
            align : 'center',
            width : 50
        }, {
            name : 'deliverFee',
            index : 'deliverFee',
            align : 'center',
            width : 80
        }, {
            name : 'deliverFeeRatioStr',
            align : 'center',
            width : 50
        }, {
            name : 'waterFee',
            index : 'waterFee',
            align : 'center',
            width : 80,
            formatter : function(cellvalue, options, rowObject) {
                if (rowObject.onVocation == 1) {
                	return "休假";
                }
                else {
                	return cellvalue;
                }
            }
        }, {
            name : 'waterFeeRatioStr',
            //index : 'operatingIncome',
            align : 'center',
            width : 50,
            formatter : function(cellvalue, options, rowObject) {
                if (rowObject.onVocation == 1) {
                	return "休假";
                }
                else {
                	return cellvalue;
                }
            }
        }, {
            name : 'powerFee',
            index : 'powerFee',
            align : 'center',
            width : 80,
            formatter : function(cellvalue, options, rowObject) {
                if (rowObject.onVocation == 1) {
                	return "休假";
                }
                else {
                	return cellvalue;
                }
            }
        }, {
            name : 'powerFeeRatioStr',
            //index : 'operatingIncome',
            align : 'center',
            width : 50,
            formatter : function(cellvalue, options, rowObject) {
                if (rowObject.onVocation == 1) {
                	return "休假";
                }
                else {
                	return cellvalue;
                }
            }
        }, {
            name : 'salary',
            index : 'salary',
            align : 'center',
            width : 80,
            formatter : function(cellvalue, options, rowObject) {
                if (rowObject.onVocation == 1) {
                	return "休假";
                }
                else {
                	return cellvalue;
                }
            }
        }, {
            name : 'salaryRatioStr',
            //index : 'operatingIncome',
            align : 'center',
            width : 50,
            formatter : function(cellvalue, options, rowObject) {
                if (rowObject.onVocation == 1) {
                	return "休假";
                }
                else {
                	return cellvalue;
                }
            }
        },{
            name : 'operatingSuppliesAmount',
            index : 'operatingSuppliesAmount',
            align : 'center',
            width : 80
        }, {
            name : 'operatingSuppliesAmountRatioStr',
            //index : 'operatingIncome',
            align : 'center',
            width : 50
        },{
            name : 'rental',
            index : 'rental',
            align : 'center',
            width : 80
        }, {
            name : 'rentalRatioStr',
            //index : 'operatingIncome',
            align : 'center',
            width : 50
        },{
            name : 'otherFixedCosts',
            index : 'otherFixedCosts',
            align : 'center',
            width : 80
        }, {
            name : 'otherFixedCostsRatioStr',
            //index : 'operatingIncome',
            align : 'center',
            width : 50
        }, {
            name : 'profits',
            index : 'profits',
            align : 'center',
            width : 80
        }, {
            name : 'profitsRatioStr',
            //index : 'operatingIncome',
            align : 'center',
            width : 50
        }
    ],
    // 加载数据详情
    query : function() {
        var summary_grid_selector = "#store-profits-summary-list";
        if (!storeProfits.summaryGrid) {
            storeProfits.summaryGrid = $(summary_grid_selector).jqGrid({
                datatype : 'json',
                colNames : storeProfits.commonColNames,
                jsonReader : {
                    root: "summary"
                },
                cmTemplate: { sortable: false },
                colModel : storeProfits.commonColModel,
                shrinkToFit:false,
                forceFit:true,
                height : 'auto',
                viewrecords : true,
                autoHeight : true
            });
        }
        var params = $("form").serialize();
        var grid_selector = "#store-profits-data-list";
        var pager_selector = "#store-profits-data-list-pager";
        if(storeProfits.detailsGrid) {
            // 根据搜索条件，重新加载
            $(grid_selector).jqGrid('setGridParam',{
                url : "/report/storeProfits/list?"+params,
                page:1
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            var colNames = ['城市', '门店编码', '门店id','门店'];
            colNames.push.apply(colNames, storeProfits.commonColNames);
            colNames.push.apply(colNames, ['薪资文件']);
            var colModel = [
            {
              name : 'cityName',
              index : 'cityName',
              align:'center',
              width : 80
            },{
              name : 'storeCode',
              index : 'storeCode',
              align:'center',
              width : 80
            },{
              name : 'storeId',
              index : 'storeId',
              hidedlg:true,
              hidden:true,
              key : true
            },{
              name : 'storeName',
              index : 'storeName',
              align:'center',
              width : 100
            }];
            colModel.push.apply(colModel, storeProfits.commonColModel);
            colModel.push.apply(colModel, [{
                name : '',
                width : 100,
                align : 'center',
                formatter : function(cellvalue,options, rowObject) {
                    return  '<button class="btn btn-minier btn-white btn-primary btn-bold" onclick="storeProfits.showDetails('+rowObject.storeId+');">详情</button>';
                }
            }]);
              storeProfits.detailsGrid = $(grid_selector).jqGrid({
                url : "/report/storeProfits/list?"+params,
                datatype : 'json',
                mtype : 'GET',
                jsonReader : {
                    root: "list.data",
                    page: "list.curPage",
                    total: "list.totalPage",
                    records: "list.totalRows",
                    userdata: "summary"
                },
                prmNames : {page:'curPage',rows:'pageSize', sort: 'sidx',order: 'sort'},
                cmTemplate: { sortable: false },
                colNames : colNames,
                // prmNames : {page:'curPage',rows:'pageSize', sort: 'sidx',order: 'sort'},
                colModel : colModel,
                rowNum : 30,
                rowList : [ 10, 30, 50 ],
                pager : pager_selector,
                pagerpos : 'left',
                viewrecords : true,
                height:350,
                autoHeight : true,
                shrinkToFit:false,
                forceFit:true,
                loadComplete : function() {
                    var summary = $(grid_selector).jqGrid('getGridParam', 'userData');
                    storeProfits.summaryGrid.jqGrid("delRowData", "summary");
                    storeProfits.summaryGrid.jqGrid("addRowData", "summary", summary, "last");
                    // 自适应宽度
                    var parent_column = $(grid_selector).closest('[class*="col-"]');
                    $(grid_selector).jqGrid('setGridWidth', parent_column.width());
                    storeProfits.summaryGrid.jqGrid('setGridWidth', parent_column.width());
                    updatePagerIcons(this);
                }
            });
        }
        // 自适应宽度
        //var parent_column = $(grid_selector).closest('[class*="col-"]');
        //$(grid_selector).jqGrid('setGridWidth', parent_column.width() );
        // resizeGrid('#data-list', grid_selector, 326);
    },
    showDetails : function(storeId) {
        debugger;
        var rowData = $("#store-profits-data-list").jqGrid('getRowData',storeId);
        var storeId = rowData.storeId;
        var storeName = rowData.storeName;
        var operatingIncome = rowData.operatingIncome;
        var marketingExpenses = rowData.marketingExpenses;
        var costOfGoods = rowData.costOfGoods;
        var consumptionAmount = rowData.consumptionAmount;
        var diffFee = rowData.diffFee;
        var waterFee = rowData.waterFee;
        var powerFee = rowData.powerFee;
        var operatingSuppliesAmount = rowData.operatingSuppliesAmount;
        var rental = rowData.rental;
        var otherFixedCosts = rowData.otherFixedCosts;
        var salary = rowData.salary;
        var profits = rowData.profits;
        var salaryFileUrl = '';
        var onVocation = rowData.onVocation;
        var deliverFee = rowData.deliverFee;
        var deliverServiceFee = rowData.deliverServiceFee;
        var downloadA = '';
        if (salaryFileUrl != '') {
            downloadA = "<a style='cursor:pointer;' onclick=\"storeProfits.exportDetails('"+salaryFileUrl+"');\">薪资文件下载</a>";
        }
        bootbox.dialog({
            message: "<span>门店:"+storeName+"</span>"
                    +downloadA + "</span>"
                    +"<table id='details' class='table  table-bordered table-hover'><tr><th>科目</th><th>金额</th><th>占比</th></tr></table>",
            buttons:
            {
              "cancel" :
              {
                "label" : "确定",
                "className" : "btn-sm btn-primary"
              }
            }
          });
        $('#details').append(storeProfits.genRow('总营业收入', operatingIncome, operatingIncome));
        $('#details').append(storeProfits.genRow('营销费用', marketingExpenses, operatingIncome));
        $('#details').append(storeProfits.genRow('总产品成本', costOfGoods, operatingIncome));
        $('#details').append(storeProfits.genRow('损耗', consumptionAmount, operatingIncome));
        $('#details').append(storeProfits.genRow('差异', diffFee, operatingIncome));
        $('#details').append(storeProfits.genRow('配送服务费', deliverServiceFee, operatingIncome));
        $('#details').append(storeProfits.genRow('订单配送费', deliverFee, operatingIncome));
        if (powerFee == '休假') {
        	$('#details').append('<tr><td>电费</td><td>休假</td><td>休假</td></tr>');
        }
        else {
        	$('#details').append(storeProfits.genRow('电费', powerFee, operatingIncome));
        }
        if (powerFee == '休假') {
        	$('#details').append('<tr><td>水费</td><td>休假</td><td>休假</td></tr>');
        }
        else {
            $('#details').append(storeProfits.genRow('水费', waterFee, operatingIncome));
        }
        if (powerFee == '休假') {
        	$('#details').append('<tr><td>薪资</td><td>休假</td><td>休假</td></tr>');
        }
        else {
            $('#details').append(storeProfits.genRow('薪资', salary, operatingIncome));
        }

        $('#details').append(storeProfits.genRow('营运用品', operatingSuppliesAmount, operatingIncome));
        $('#details').append(storeProfits.genRow('租金', rental, operatingIncome));
        $('#details').append(storeProfits.genRow('其它固定费用', otherFixedCosts, operatingIncome));
        $('#details').append(storeProfits.genRow('净利润', profits, operatingIncome));
    },

    ratioFormatter : function(rowObject, valueName, totalName)
    {
        var value = rowObject[valueName];
        var total = rowObject[totalName];
        return storeProfits.calRatio(value, total) + '%';
    },

    genRow : function(name, value, total){
        var ratio = storeProfits.calRatio(value, total);
        return '<tr><td>'+name+'</td><td>'+value+'</td><td>'+ratio+'%</td></tr>';
    },

    calRatio : function(value, total) {
        return (total == 0 ? 0.00 : (value/total*100).toFixed(2))
    },
    exportDetails : function(salaryFileUrl) {
        if($('#downloadIfm').attr('src')) {
            $('#downloadIfm').attr('');
        }
        $('#downloadIfm').attr('src', "/common/fussDownload?url=" + salaryFileUrl);
    },
    export : function() {
        debugger;
        var startDate = $('#startDateHid').val();
        var endDate = $('#endDateHid').val();
        if (!startDate || !endDate) {
            $.dialog.alert('请确保填写日期');
            return false;
        }
        var startDateObj = parseDateFromYYYYMMDD(startDate);
        var endDateObj = parseDateFromYYYYMMDD(endDate);
        if (dateDiffInDays(startDateObj, endDateObj) > 31) {
            $.dialog.alert('日期间隔仅可为31天内');
            return false;
        }
        var storeType = $('#storeType').val();
        if(!storeType) {
            $.dialog.alert('请确保选取门店类型');
            return false;
        }
        var params = $("form").serialize();
        var url = '/report/storeProfits/export?' + params;
        if($("#downloadIfm").attr('src')) {
            $("#downloadIfm").attr('src', '');
        }
        $("#downloadIfm").attr('src', url);
    }
};