function showDialog(id, url, title, width, height, cancelBtnTxt, onCancel, data, isMax) {
    window.dialog = new $.dialog({
        id: id,
        content: "url:" + url,
        title: title,
        width: width || 400,
        height: height || 400,
        cancelVal: cancelBtnTxt || "关闭",
        cancel: onCancel,
        titleIcon: false,
        //lockScroll:false,
        //fixed:true,
        fixed: true,
        drag: true,
        lock: true,
        args: data,
        max: (((typeof(isMax) != "undefined") == true && isMax == true) || typeof(isMax) == "undefined") ? true : false
    });
};

function edit(url, title, width, height, closeFun) {
    if (closeFun == false) {
        closeFun = null;
    }
    showDialog("edit", url, title, width, height, "关闭", closeFun, null);
}