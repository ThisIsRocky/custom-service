/* Restaurant 网店 */
var tree = {
	currBrandId:null,
	currFoodId:null,
	clearAll: function(){
		if (treeObj == null) {
            return;
        }
        var nodes = treeObj.getNodes();
        $(nodes).each(function(){
			treeObj.setChkDisabled(this, false, null, null);
			treeObj.checkNode(this, false, false, false);	
        });
    },

	refresh: function(parentId, brandId, foodId){
		tree.currBrandId = brandId;
		tree.currFoodId = foodId;
        if (treeObj == null) {
            return;
        }
        if (brandId != null || foodId != null) {
        	tree.clearAll();
        }
        if (brandId != null) {
        	tree.refreshByBrandId(parentId, brandId);
        }
		if (foodId != null) {
			tree.refreshByFoodId(parentId, foodId);
		}
    },
	refreshByBrandId: function(parentId, brandId){
		var needDisabeldNodes = treeObj.getNodesByFilter(function filter(node) {
    		return (node.level == 6 
    				&& node.brandId != brandId 
    				&& (parentId == null || parentId == node.parentId));
		});
		var needenabledNodes = treeObj.getNodesByFilter(function filter(node) {
    		return (node.level == 6 
    			&& node.brandId == brandId 
    			&& (parentId == null || parentId == node.parentId));
		});
        $(needDisabeldNodes).each(function(){
			treeObj.setChkDisabled(this, true, null, null);
        });
        $(needenabledNodes).each(function(){
			treeObj.setChkDisabled(this, false, null, null);    	
        });
	},

	refreshByFoodId: function(parentId, foodId){
		$.ajax({
            type: 'post',
            url: '/food/getFoodRestaurant',
            data: {
                foodId:foodId
            },
            dataType: "json",
            success: function (data) {
                if(data.resultCode == "000000"){
                	if(data.result) {
                		var restaurantIdarray = data.result.restaurantIdList;
                		var needDisabeldNodes = treeObj.getNodesByFilter(function filter(node) {
                			return (node.level == 6 
                					&& !node.chkDisabled 
                					&& restaurantIdarray.indexOf(node.id) != -1 
                					&& (parentId == null || parentId == node.parentId));
                		});
                		$(needDisabeldNodes).each(function(){
                			treeObj.checkNode(this, true, false, false);
                			treeObj.setChkDisabled(this, true, null, null);
                		});
                	}
                }else{
                    alert(data.msg);
                }
            },
            error: function (msg) {
                if(msg.status == 500){
                    alert(" 数据加载失败,请联系管理员！");
                }
                if(msg.status == 200){
                    location.href = "/ajax_noPermission";
                }
            }
        });
	},

    expand: function(event, treeId, treeNode){
      	var hasChildNode = (treeNode.children != null
                                && treeNode.children.length != null
                                &&treeNode.children.length > 0);
	    if (hasChildNode) {
	        return;
	    }
      	if (treeNode.level < 5) {
      		tree.findStoreDepartment(treeNode);
      	}
      	else {
      		tree.findRestaurant(treeNode);
      	}
  	},
    findStoreDepartment: function(treeNode) {
     	$.ajax({
            type: 'post',
            url: '/store/department/getTreeNodeList',
            data: {
                parentId:treeNode.id,
                parentLevel:treeNode.level
            },
            dataType: "json",
            success: function (data) {
                if(data.resultCode == "000000"){
                    var treeObj = $.fn.zTree.getZTreeObj("storeDepartmentTree");
                    treeObj.addNodes(treeNode, data.resultList);
                }else{
                    alert(data.msg);
                }
            },
            error: function (msg) {
                if(msg.status == 500){
                    alert(" 数据加载失败,请联系管理员！");
                }
                if(msg.status == 200){
                    location.href = "/ajax_noPermission";
                }
            }
        });
     },
     findRestaurant: function(treeNode) {
     	$.ajax({
            type: 'post',
            url: '/restaurant/getTreeNodeList',
            data: {
                storeDepartmentId:treeNode.id
            },
            dataType: "json",
            success: function (data) {
                if(data.resultCode == "000000"){
                    var treeObj = $.fn.zTree.getZTreeObj("storeDepartmentTree");
                    treeObj.addNodes(treeNode, data.resultList);
                    tree.refresh(treeNode.id, tree.currBrandId, tree.currFoodId);
                }else{
                    alert(data.msg);
                }
            },
            error: function (msg) {
                if(msg.status == 500){
                    alert(" 数据加载失败,请联系管理员！");
                }
                if(msg.status == 200){
                    location.href = "/ajax_noPermission";
                }
            }
        });
     },
     getSelectedRestaurantIdArray:function(){
     	var restaurantIdarray=[]; 
     	if (treeObj == null) {
            return restaurantIdarray;
        }
        var nodes = treeObj.getCheckedNodes(true);
        $(nodes).each(function(){
        	if (this.level == 6 && !this.chkDisabled) {
        		restaurantIdarray.push(this.id);
        	}
        });
        return restaurantIdarray;
     },
    init : function() {
        var rootNode = [{"id":0, "name":"全选", "isParent":true}];
        treeObj = $.fn.zTree.init($("#storeDepartmentTree"), setting, rootNode);
    },
    load : function() {
        tree.init();
    }

};

    /*zTree初始化配置 参见ztree API*/
    setting = {
        check:{
            enable:true,
            chkStyle:"checkbox"
        },
        data: {
            key: {
                name: "name",
                title: "id"
            },
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "parentId"
            },
            
        },
        callback: {
                onExpand:tree.expand
        },
        view:{
            showIcon:false        
        }
    }

    /**
     * 初始化页面
     */
    var treeObj = null;
    $(function(){
        //tree.init();
    });
