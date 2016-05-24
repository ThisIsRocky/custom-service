var deliveryRule = {
    dateGrid: null,
    getQueryString : function(area) {
        return queryString;
    },
    loadRuleList : function(area) {
        var _this = this;
        var grid_selector = "#table-data-list";
        var pager_selector = "#table-data-list-pager";
        var status = $('#status').val();
        var url = '/store/deliveryRule/getRuleList?status='+status;
        if (_this.dateGrid) {
            // 根据搜索条件，重新加载
            $(grid_selector).jqGrid('setGridParam', {
                url : url,
                page : 1,
                forceFit : true,
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.dateGrid = $(grid_selector).jqGrid({
                url : url,
                datatype : 'json',
                jsonReader : {
                    root : "data",
                    page : "curPage",
                    total : "totalPage",
                    records : "totalRows"
                },
                prmNames : {
                    page : 'curPage',
                    rows : 'pageSize',
                    sort : 'sidx',
                    order : 'sort'
                },
                colNames : [ '规则编码', '规则名称', '供货方类型', '提前预定', '每次预定配送','状态', '操作' ],
                cmTemplate: {sortable:true},
                colModel : [ {
                    name : 'id',
                    align : 'center',
                    width : 40
                }, {
                    name : 'ruleName',
                    width : 160
                }, {
                    name : 'providerType',
                    align : 'center',
                    width : 80,
                    formatter : function(value) {
                        return value == 1 ? '仓库' : '供应商';
                    }
                }, {
                    name : 'beforeTimeUnit',
                    width : 80,
                    align : 'center',
                    formatter : function(value, options, rowObject) {
                        return rowObject.beforeTime + (value == 1 ? '天' : '周');
                    }
                }, {
                    name : 'deliverNumUnit',
                    width : 80,
                    align : 'center',
                    formatter : function(value, options, rowObject) {
                        return rowObject.deliverNum + (value == 1 ? '天' : '周');
                    }
                }, {
                    name : 'status',
                    width : 80,
                    align : 'center',
                    formatter : function(value) {
                        return value == 0?'启用':'禁用';
                    }
                }, {
                    name : '',
                    sortable : false,
                    width : 200,
                    align : 'left',
                    formatter : function(cellvalue, options, rowObject) {
                        var retVal = ' <button class="btn btn-minier btn-white btn-default btn-bold zs-auth" permission="/store/deliveryRule/edit" onclick="deliveryRule.showRule('+rowObject.id+')"><i class="ace-icon fa fa-pencil-square-o blue"></i>修改</button>';
                        retVal += ' <button class="btn btn-minier btn-white btn-default btn-bold zs-auth" permission="/store/deliveryRule/delete" onclick="deliveryRule.deleteRule('+rowObject.id+')"><i class="ace-icon fa fa-times red2"></i>删除</button>';
                        
                        if(rowObject.status==0 && rowObject.providerType==1) {
                            retVal += ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="deliveryRule.updateRuleStatus(1, '+rowObject.id+')"><i class="ace-icon fa fa-list"></i>禁用</button>';
                        } else if(rowObject.status==1 && rowObject.providerType==1) {
                            retVal += ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="deliveryRule.updateRuleStatus(0, '+rowObject.id+')"><i class="ace-icon fa fa-list"></i>启用</button>';
                        }
                        
                        retVal += ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="deliveryRule.showRuleStore('+rowObject.id+')"><i class="ace-icon fa fa-list"></i>适用门店</button>';
                        if(rowObject.providerType==1) {
                            retVal += ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="deliveryRule.showRuleProvider(1, '+rowObject.id+')"><i class="ace-icon fa fa-list"></i>适用仓库</button>';
                        } else {
                            retVal += ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="deliveryRule.showRuleProvider(2, '+rowObject.id+')"><i class="ace-icon fa fa-list"></i>适用供应商</button>';
                        }
                        return retVal;
                    }
                }],
                rowNum : 10,
                rowList : [ 10, 20, 30 ],
                pager : pager_selector,
                height : 300,
                autoHeight : true,
                viewrecords : true,
                loadComplete : function() {
                    var table = this;
                    setTimeout(function() {
                        updatePagerIcons(table);
                        $.removeScrollX($('#data-list-undelivered'));
                    }, 0);
                    $.authenticate();
                }
            });
        }
        // 自适应宽度
        $.resizeGrid(grid_selector);
    },
    addRule: function(){
        var providerType = $('#ruleProviderType').val();
        var url = '/store/deliveryRule/edit?providerType=' + providerType;
        $.showCommonEditDialog(url ,'新建规则' ,800,400);
    },
    showRule: function(id){
        var url = '/store/deliveryRule/edit?id=' + id;
        $.showCommonEditDialog(url ,'修改规则' ,800,400);
    },
    deleteRule: function(id) {
        parent.$.dialog.confirm('确定要删除吗？删除后，相关门店可能无法订货', function(){
            var url = '/store/deliveryRule/delete?id=' + id;
            $.post(url, function(){
                deliveryRule.loadRuleList();
            });
        })
    },
    showRuleProvider: function(providerType, ruleId) {
        var url = '/store/deliveryRule/showRuleProvider?id=' + ruleId + '&providerType=' + providerType + '&nd='+Math.random();
        $.showCommonEditDialog(url ,'适用供货方' ,800,400);
    },
    showRuleStore: function(ruleId) {
        var url = '/store/deliveryRule/showRuleStore?id=' + ruleId;
        $.showCommonEditDialog(url ,'适用门店' ,1000,400);
    },
    updateRuleStatus : function (flag,value) {
        var msg = flag==1?"禁用":'启用';
        $.dialog({
            lock: true,
            content : '确认'+msg+'吗？',
            width: 200,
            height: 100,
            drag: false,
            resize: false,
            icon: 'alert.gif',
            ok:
                function () {
                    $.ajax({
                        type : "post",
                        url : '/store/deliveryRule/updateRuleStatus',
                        data : {
                            "id" : value,
                            "status" : flag
                        },
                        success : function(data) {
                            if(data.code ==1){
                                alert("修改成功");
                                deliveryRule.loadRuleList();
                                return true;
                            }else if(data.code ==0){
                                alert(data.msg);
                                return true;
                            }else{
                                alert("修改失败");
                                return true;
                            }
                        },
                        error : function(msg) {
                            alert("系统异常，删除失败");
                        }
                    })
            }

            ,
            cancel: true
        })}
}
$(function() {
    // 加载规则列表
    deliveryRule.loadRuleList();
    
    $('#status').change(function(){
        deliveryRule.loadRuleList();
    })
});