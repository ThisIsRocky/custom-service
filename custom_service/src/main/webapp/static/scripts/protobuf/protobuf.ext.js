var ProtoBufTool = {};
ProtoBufTool.getFullPackage = function(clazz) {
    var parent = clazz.$type.parent;
    var fullPackage = clazz.$type.name;
    while (parent && parent.name != '') {
        fullPackage = parent.name + "." + fullPackage;
        parent = parent.parent;
    }
    return fullPackage;
};

ProtoBufTool.keygen = function(clazz) {
    var str = ProtoBufTool.getFullPackage(clazz);
    return md5(str).substr(0,8);
}