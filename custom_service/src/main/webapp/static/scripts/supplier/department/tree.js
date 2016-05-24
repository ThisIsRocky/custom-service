treeUIControll={
    enableInputText:function(){
        $('#departmentName').removeAttr('readonly');
    },
    disableInputText:function(){
        $('#departmentName').attr('readonly','readonly');
    },
    enableUpdateBtn:function(){
        $('#updateBtn').show();
    },
    disableUpdateBtn:function(){
        $('#updateBtn').hide();
    },
    enableAddBtn:function(){
        $('#addBtn').show();
    },
    disableAddBtn:function(){
         $('#addBtn').hide();
    },
    enableDeleteBtn:function(){
        $('#deleteBtn').show();
    },
    disableDeleteBtn:function(){
         $('#deleteBtn').hide();
    },
    enableAddUserRow:function(){
        $('#addUserRow').show();
    },
    disableAddUserRow:function(){
        $('#addUserRow').hide();
    },
    toAddMode:function(){
        $('#addUndoBtn').show();
        $('#addSaveBtn').show();
        $('#addBtn').hide();
    },
    exitAddMode:function(){
        $('#addUndoBtn').hide();
        $('#addSaveBtn').hide();
        $('#addBtn').show();
        tree.checkAccess();
    }
}

var tree={
	    /*zTree初始化配置 参见ztree API*/

    checkAccess : function() {
        var treeNode = tree.getSelected();
        if (treeNode && treeNode.id == 3) {
            treeUIControll.disableAddUserRow();
        }
        else {
            treeUIControll.enableAddUserRow();
        }
        if (treeNode == null) {
            treeUIControll.disableInputText();
            treeUIControll.disableUpdateBtn();
            treeUIControll.disableAddBtn();
            treeUIControll.disableDeleteBtn();
        }
        else if (!treeNode.hasPermission) {
            treeUIControll.disableInputText();
            treeUIControll.disableUpdateBtn();
            treeUIControll.disableAddBtn();
            treeUIControll.disableDeleteBtn();
        }
        else if (treeNode.level == 0) {
            treeUIControll.disableInputText();
            treeUIControll.disableUpdateBtn();
            treeUIControll.enableAddBtn();
            treeUIControll.disableDeleteBtn();
        }
        else if (treeNode.level == 1) {
            treeUIControll.enableInputText();
            treeUIControll.enableUpdateBtn();
            treeUIControll.enableAddBtn();
            treeUIControll.enableDeleteBtn();
        }
        else if (treeNode.level == 2) {
            treeUIControll.enableInputText();
            treeUIControll.enableUpdateBtn();
            treeUIControll.disableAddBtn();
            treeUIControll.enableDeleteBtn();
        }
        else if (treeNode.level == 3) {
            treeUIControll.disableInputText();
            treeUIControll.disableUpdateBtn();
            treeUIControll.disableAddBtn();
            treeUIControll.disableDeleteBtn();
        }
    },

    checkAndInitAddBtn:function(){
        if (tree.checkUnsaved()) {
            treeUIControll.toAddMode();
        }
        else {
            treeUIControll.exitAddMode();
        }
    },
    getSelected : function(){
        var nodes = tree.treeObj.getSelectedNodes();
        if (nodes && nodes.length>0) {
            return nodes[0];
        }
        return null;
    },
    toAdd : function() {
        var parentNode = tree.getSelected();
        if (tree.checkUnsaved()) {
            $.alertError('请先编辑保存先前添加的层级');
            return false;
        }
        if (!parentNode) {
            $.alertError('请先选定某一节点再添加层级');
            return false;
        }
        if (parentNode.level >= 2) {
            $.alertError('当前节点不允许添加下一层级');
            return false;
        }
    	var newNode = {name:"",pseudo:true,isParent:true};
        newNode = tree.treeObj.addNodes(parentNode, newNode);
        tree.treeObj.cancelSelectedNode(tree.getSelected());
        tree.click(null,null,newNode[0]);
        tree.treeObj.editName(newNode[0]);
        return true;
    },
    undoAdd : function() {
        var nodes = tree.treeObj.getNodesByParam('pseudo',true,null);
        $(nodes).each(function() {
            tree.treeObj.removeNode(this);
        });
        $.alertSuccess('撤销新增成功');

    },
    saveAdd : function() {
        var nodes = tree.treeObj.getNodesByParam('pseudo',true,null);
        if (!nodes || nodes.length == 0) {
            return true;
        }
        var _this = nodes[0];
        if (_this.name == null || _this.name == '') {
            $.alertError('有未填写信息，请填写完整。');
            tree.treeObj.editName(_this);
            return false;
        }
        if (_this.name.length > 50) {
            $.alertError('层级名称过长,请重新编辑');
            tree.treeObj.editName(_this);
            return false;
        }
        return tree.postAdd(_this);
    },
    update : function(){
        var treeNode = tree.getSelected();
        var newName = $('#departmentName').val();
        if (!treeNode) {
            $.alertError("请先选择节点");
            return;
        }
        if (!newName || newName == '') {
            $.alertError("有未填写信息，请填写完整");
            return;
        }
        tree.postUpdate(treeNode, newName);
    },
    delete : function(){
        var treeNode = tree.getSelected();
        if (treeNode && treeNode.id) {
            tree.postDelete(treeNode);
        }
    },
    postUpdate:function(treeNode, newName){
        $.ajax({
                type : "post",
                url : "/supplier/department/update",
                data : {
                    "id" : treeNode.id,
                    "name" : newName
                },
                dataType : "json",
                success : function(data) {
                    if (data.result.code == '000001') {
                        $.alertError("参数错误");
                    }
                    else if (data.result.code == '051004') {
                        $.alertError("当前层级不允许修改名称");
                    }
                    else if (data.result.code == '051002') {
                        $.alertError("修改的层级不存在");
                    }
                    else if (data.result.code == '000003') {
                        $.alertError("您没有修改该层级的权限");
                    }
                    else if (data.result.code == '051006') {
                        $.alertError('有未填写信息，请填写完整。');
                    }
                    else if (data.result.code == '051007') {
                        $.alertError('同一个层级下名称重复');
                    }
                    else {
                        treeNode.name=newName;
                        $.alertSuccess('修改成功');
                    }
                    tree.treeObj.updateNode(treeNode,false);
                },
                error : function(msg) {
                }
            });
    },
    postDelete:function(treeNode){
        $.ajax({
                type : "post",
                url : "/supplier/department/delete",
                data : {
                    "id" : treeNode.id
                },
                dataType : "json",
                success : function(data) {
                    if (data.result.code == '000001') {
                        $.alertError("参数错误");
                    }
                    else if (data.result.code == '051002') {
                        $.alertError("删除的层级不存在");
                    }
                    else if (data.result.code == '000003') {
                        $.alertError("您没有删除该层级的权限");
                    }
                    else if (data.result.code == '051005') {
                        $.alertError("当前层级不允许删除");
                    }
                    else if (data.result.code == '051008') {
                        $.alertError('该层级下有人员信息，不能删除。如需删除，请修改其下人员信息到其他层级下。');
                    }
                    else {
                        $.alertSuccess('删除成功');
                        tree.treeObj.removeNode(treeNode);
                    }
                },
                error : function(msg) {
                }
            });
    },
    postAdd:function(treeNode){
        var res = false;
        $.ajax({
                type : "post",
                url : "/supplier/department/add",
                data : {
                    "parentId" : treeNode.parentId,
                    "name":treeNode.name
                },
                dataType : "json",
                async : false,
                success : function(data) {
                    if (data.result.code == '051002') {
                        $.alertError('新增层级的父节点不存在');
                        tree.treeObj.removeNode(treeNode);
                        res = true;
                    }
                    else if (data.result.code == '051003') {
                        $.alertError('当前层级下不允许新增层级');
                        tree.treeObj.removeNode(treeNode);
                        res = true;
                    }
                    else if (data.result.code == '000003') {
                        $.alertError("您没有在该层级下新增层级的权限");
                        tree.treeObj.removeNode(treeNode);
                        res = true;
                    }
                    else if (data.result.code == '051006') {
                        $.alertError('有未填写信息，请填写完整。');
                        tree.treeObj.editName(treeNode);
                        res = false;
                    }
                    else if (data.result.code == '051007') {
                        $.alertError('同一个层级下名称重复');
                        tree.treeObj.editName(treeNode);
                        res = false;
                    }
                    else {
                        $.alertSuccess('新增成功');
                        treeNode.id=data.result.data.id;
                        treeNode.pseudo = false;
                        treeNode.hasPermission = true;
                        tree.treeObj.updateNode(treeNode);
                        tree.prependAddSupplierBtn(null, treeNode);
                        res = true;
                    }
                },
                error : function(msg) {
                    res = true;
                }
            });
            return res;
    },
    checkUnsaved : function() {
        var nodes = tree.treeObj.getNodesByParam('pseudo',true,null);
        if (nodes.length > 0) {
            return true;
        }
        return false;
     },
    click : function(event, treeId, treeNode) {
        if (treeNode.pseudo && treeNode.pseudo == true) {
            tree.treeObj.editName(treeNode);
            return;
        }
        $('#departmentName').val(treeNode.name);
        tree.checkAccess();
        userFacade.query();
        subUserFacade.query(null);

    },
    expand : function(event, treeId, treeNode){
      if (treeNode.level >= 3) {
        return;
      }
      tree.postExpand(treeNode);
  	},
    postExpand : function(treeNode) {
        $.ajax({
            type: 'post',
            url: '/supplier/department/getTreeNodeList',
            data: {
                parentId:treeNode.id,
                parentLevel:treeNode.level
            },
            dataType: "json",
            success: function (data) {
                if(data.resultCode == "000000"){
                    if (treeNode.level == 2) {
                        $(data.resultList).each(function() {
                               this.isParent = false;
                        });
                    }
                    tree.treeObj.removeChildNodes(treeNode);
                    tree.treeObj.addNodes(treeNode, data.resultList);
                }else{
                    $.alertError(data.msg);
                }
            },
            error: function (msg) {
                if(msg.status == 500){
                    $.alertError(" 数据加载失败,请联系管理员！");
                }
                if(msg.status == 200){
                    location.href = "/ajax_noPermission";
                }
            }
        });
    },
    collapse : function(event, treeId, treeNode){
        tree.treeObj.removeChildNodes(treeNode);
        tree.checkAndInitAddBtn();
    },
    prependAddSupplierBtn:function(treeId, treeNode) {
        if (treeNode.level == 2 && treeNode.id != undefined && treeNode.hasPermission) {
            var aId = "#" + treeNode.tId + "_a";
            var aObj = $(aId);
            var editStr = '<a class="fa fa-plus-square-o btn-addSupplier" style="font-family:FontAwesome;" onclick="$.showCommonEditDialog(\'/supplier/department/level/toSupplierList?levelId='+treeNode.id+'\',\'供应商管理\',550,500);"></a>'
            aObj.append(editStr);
        }
    } 

};
setting = {
        treeId:"role_menu",
        data: {
            keep: {
            parent: true
            },
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
                onClick:tree.click,
                onExpand:tree.expand,
                onCollapse:tree.collapse
        },
        view:{
            autoCancelSelected: false,
            selectedMulti: false,
            addDiyDom:tree.prependAddSupplierBtn
        }
    }
function init(rootPermission) {
    var rootNode = [{"id":0, "name":"采购", "isParent":true,"hasPermission":rootPermission}];
    tree.treeObj = $.fn.zTree.init($("#supplierTree"), setting, rootNode);
}
