package me.ele.cs.push.util;

import com.google.protobuf.MessageLite;
import me.ele.cs.push.handler.MessageHandler;

/**
 * Created by iser on 16/5/27.
 */
public class MessageEntry{
    private String key;
    private MessageLite messageLite;
    private MessageHandler messageHandler;
    MessageEntry(String key, MessageLite messageLite, MessageHandler messageHandler) {
        this.key = key;
        this.messageLite = messageLite;
        this.messageHandler = messageHandler;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public MessageLite getMessageLite() {
        return messageLite;
    }

    public void setMessageLite(MessageLite messageLite) {
        this.messageLite = messageLite;
    }

    public MessageHandler getMessageHandler() {
        return messageHandler;
    }

    public void setMessageHandler(MessageHandler messageHandler) {
        this.messageHandler = messageHandler;
    }
}