package me.ele.cs.push.session;

import com.google.protobuf.MessageLite;
import io.netty.buffer.Unpooled;
import io.netty.channel.Channel;
import io.netty.handler.codec.http.websocketx.BinaryWebSocketFrame;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by iser on 16/5/24.
 */
public class SessionManager {

    private static final Map<String, Session> sessionMap = new HashMap<>();

    public static void processAll(MessageLite messageLite) {
        sessionMap.values().forEach(session -> {
            session.getChannel().writeAndFlush(new BinaryWebSocketFrame(Unpooled.copiedBuffer(messageLite.toByteArray())));
        });
    }

    public static void process(String userName, MessageLite messageLite) {
        sessionMap.get(userName).getChannel().writeAndFlush(new BinaryWebSocketFrame(Unpooled.copiedBuffer(messageLite.toByteArray())));
    }

    public static void addSession(String userName, Channel channel) {
        Session session = new Session();
        session.setUserName(userName);
        session.setChannel(channel);
        sessionMap.put(userName, session);
    }
}
