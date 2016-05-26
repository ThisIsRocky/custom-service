package me.ele.cs.push.handler;

import io.netty.channel.ChannelHandlerContext;

/**
 * Created by iser on 16/5/26.
 */
public interface MessageHandler<T> {

    void handle(ChannelHandlerContext ctx,T t);
}
