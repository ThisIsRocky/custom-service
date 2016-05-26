package me.ele.cs.push.util;

import com.google.protobuf.MessageLite;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.http.websocketx.BinaryWebSocketFrame;
import me.ele.cs.push.handler.MessageHandler;
import me.ele.cs.push.protobuf.IMEnum;
import me.ele.cs.push.protobuf.IMMessage;
import me.ele.cs.push.session.SessionManager;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by iser on 16/5/26.
 */
public class MessageObjectRegister {
    public static final Map<String, MessageLite> messageLiteMap;
    public static final Map<String, MessageHandler> handlerMap;


    static {
        messageLiteMap = new HashMap<>();
        handlerMap = new HashMap<>();
        register("IM.Message.PushMessage", IMMessage.PushMessage.getDefaultInstance(), new MessageHandler<IMMessage.PushMessage>() {
            @Override
            public void handle(ChannelHandlerContext ctx, IMMessage.PushMessage o) {

           }


        });

        register("IM.Message.LoginRequest", IMMessage.LoginRequest.getDefaultInstance(), new MessageHandler<IMMessage.LoginRequest>(){
            @Override
            public void handle(ChannelHandlerContext ctx, IMMessage.LoginRequest loginRequest) {
                IMMessage.LoginResponse loginResponse = login(loginRequest.getUserName(), loginRequest.getPassword());
                if (loginResponse.getStatus() == IMEnum.LoginStatus.SUCESS) {
                    SessionManager.addSession(loginRequest.getUserName(), ctx.channel());
                }
                ctx.writeAndFlush(new BinaryWebSocketFrame(Unpooled.copiedBuffer(MessageObjectKeyGen.keygen("IM.Message.LoginResponse").getBytes(),loginResponse.toByteArray())));
            }
            private IMMessage.LoginResponse login(String userName, String password) {
                return IMMessage.LoginResponse.newBuilder().setStatus(IMEnum.LoginStatus.SUCESS).build();
            }
        });
        register("IM.Message.LoginResponse", IMMessage.LoginResponse.getDefaultInstance(), new MessageHandler() {
            @Override
            public void handle(ChannelHandlerContext ctx, Object o) {

            }
        });

    }

    public static MessageLite getMessageLite(String key) {
        return messageLiteMap.get(key);
    }

    public static MessageHandler getHandler(String key) {
        return handlerMap.get(key);
    }

    private static void register(String packageName, MessageLite messageLite, MessageHandler messageHandler) {
        String messageObjectKey = MessageObjectKeyGen.keygen(packageName);
        messageLiteMap.put(messageObjectKey, messageLite);
        handlerMap.put(messageObjectKey, messageHandler);
    }



}
