var localSort = {
	col : null,
	index : null,
	order : null,
	id : null,
    defaultId : null,
    defaultOrder : null,
	cacheToSort : [],
	isOpen : false,
    setDefaultOrder : function(grid, idCol) {
        localSort.defaultId = idCol;
        localSort.defaultOrder = [];
        var allRows = $(grid).jqGrid('getGridParam', 'data');
        for (var i = 0; i < allRows.length; i++) {
            localSort.defaultOrder.push(allRows[i][idCol]);
        }
    },
    restoreSort : function(grid, callback) {
        if (localSort.defaultId && localSort.defaultOrder) {
            var ordered = [];
            var rowMap = {};
            var allRows = $(grid).jqGrid('getGridParam', 'data');
            for (var i = 0; i < allRows.length; i++) {
                var row = allRows[i];
                rowMap[row[localSort.defaultId]] = row;
            }
            for (var i = 0; i < localSort.defaultOrder.length; i++) {
                var id = localSort.defaultOrder[i];
                ordered.push(rowMap[id]);
            }
            $(grid).jqGrid('clearGridData');
            for (var i = 0; i < ordered.length; i++) {
                $(grid).jqGrid("addRowData", i, ordered[i] , "last");
            }
        }
        localSort.clean();
        if(callback) {
            callback();
        }
    },
	// 排序动作
	sort : function(grid, callback) {
		if (localSort.col && localSort.cacheToSort.length > 0) {
			var order = localSort.cacheToSort.sort(function(a, b) {
				var aVal, bval;
				if(isNaN(a[localSort.col]) || isNaN(b[localSort.col])) {
					aVal = a[localSort.col];
					bVal = b[localSort.col];
				} else {
					aVal = parseFloat(a[localSort.col]);
					bVal = parseFloat(b[localSort.col]);
				}
				if (localSort.order == 'desc') {
					
					if (aVal > bVal)
						return -1;
					if (aVal < bVal)
						return 1;
					return 0;
				} else if (localSort.order == 'asc') {
					if (aVal < bVal)
						return -1;
					if (aVal > bVal)
						return 1;
					return 0;
				}
			});
			var re_records = $(grid).getGridParam('records');//获取返回的记录数  
			var re_page = $(grid).getGridParam('page');//获取返回的当前页  
			var re_rowNum = $(grid).getGridParam('rowNum');//获取每页数  
			var re_total = $(grid).getGridParam('lastpage');//获取总页数
			var oldIds = $(grid).jqGrid('getDataIDs');
			for (var i = 0; i < oldIds.length; i++) {
				$(grid).delRowData(oldIds[i]);
//				$(grid).addRowData(order[i][localSort.id], order[i], "last");
		        $(grid).jqGrid("addRowData", i, order[i] , "last");
			}
			oldIds = $(grid).jqGrid('getDataIDs');
			$(grid).jqGrid('setGridParam', {
				'records' : re_records,
				'page' : re_page,
				'rowNum' : re_rowNum,
				'lastpage' : re_total,
			});
		}
		localSort.clean();
		if(callback) {
			callback();
		}
	},
	setParam : function(grid, id, col, index, order) {
		localSort.id = id;
    	localSort.col = col;
    	localSort.index = index;
    	localSort.order = order;
		grid = grid.replace('#', '');
		grid = "#gbox_" + grid;
		$(grid).find('.ui-th-column').each(function() {
			if($(this).attr('aria-selected') == 'true') {
				var id = $(this).attr('id');
				$("#"+id).find('.s-ico').css('display', 'inline');
				return false;
			}
		});
	},
	clean : function() {
    	localSort.col = null;
    	localSort.index = null;
    	localSort.order = null;
    	localSort.id = null;
    	localSort.close();
	},
	open : function() {
		localSort.isOpen = true;
	},
	close : function() {
		localSort.isOpen = false;
	},
	addRow : function(row) {
		if(localSort.isOpen == true) {
			localSort.cacheToSort.push(row);
		}
	},
	reset : function(grid) {
		grid = grid.replace('#', '');
		grid = "#gbox_" + grid;
		$(grid).find('.ui-th-column').each(function() {
			if($(this).attr('aria-selected') == 'true') {
				var id = $(this).attr('id');
				$("#"+id).attr('aria-selected', 'false');
				$("#"+id).find('.s-ico').css('display', 'none');
				return false;
			}
		});
		localSort.cacheToSort = [];
		localSort.clean();
	},
	updateSortval : function(grid, idCol, rowId, col, data) {
		$(localSort.cacheToSort).each(function() {
			if(this[idCol] == rowId) {
				this[col] = data;
				return false;
			}
		});
	}
}