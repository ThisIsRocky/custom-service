var pushClient = {
    Message : null,
    messageObjMap : {},
    socket : null,
    init : function() {
        if (typeof dcodeIO === 'undefined' || !dcodeIO.ProtoBuf) {
            return;
        }
        // Initialize ProtoBuf.js
        var ProtoBuf = dcodeIO.ProtoBuf;
        var builder = ProtoBuf.loadProtoFile("/static/pb/IM.Message.proto");
        pushClient.Message = builder.build("IM.Message");
        pushClient.messageObjMap[ProtoBufTool.keygen(pushClient.Message.LoginRequest)] = pushClient.Message.LoginRequest;
        pushClient.messageObjMap[ProtoBufTool.keygen(pushClient.Message.LoginResponse)] = pushClient.Message.LoginResponse;
        pushClient.messageObjMap[ProtoBufTool.keygen(pushClient.Message.PushMessage)] = pushClient.Message.PushMessage;

        pushClient.socket = new WebSocket("ws://localhost:2048/ws");
        pushClient.socket.binaryType = "arraybuffer"; // We are talking binary


        pushClient.socket.onopen = function() {
            pushClient.login("sample1","xxxxxx");
        };
        pushClient.socket.onclose = function() {
            alert("Disconnected");
        };

        pushClient.socket.onmessage = function(evt) {
            try {
                // Decode the Message
                var data = evt.data;
                var header = data.slice(0, 8);
                var content = data.slice(8);
                var messageObjKey = String.fromCharCode.apply(null, new Uint8Array(header));
                var _Message = pushClient.messageObjMap[messageObjKey];
                var msg = _Message.decode(content);
                alert(msg);
            } catch (err) {
                alert(err);
            }
        };
    },

    login : function (userName, password) {
    if (pushClient.socket.readyState == WebSocket.OPEN) {
        var msg = new pushClient.Message.LoginRequest();
        msg.setUserName(userName);
        msg.setPassword(password);
        var header = ProtoBufTool.keygen(pushClient.Message.LoginRequest);
        var headerAB = new ArrayBuffer(header.length);
        var v2 = new Uint8Array(headerAB,0,header.length);
        for (var i = 0; i<header.length;i++) {
            v2[i] = header.charCodeAt(i);
        }
        var total = new Uint8Array(headerAB.byteLength + msg.toArrayBuffer().byteLength);
        total.set(new Uint8Array(headerAB), 0);
        total.set(new Uint8Array(msg.toArrayBuffer()), headerAB.byteLength);
        pushClient.socket.send(total.buffer);
    } else {
        //handle not connected
    }
}
}