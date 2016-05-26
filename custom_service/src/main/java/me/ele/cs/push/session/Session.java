package me.ele.cs.push.session;

import io.netty.channel.Channel;

/**
 * Created by iser on 16/5/24.
 */
public class Session {
    private String userName;
    private Channel channel;

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Channel getChannel() {
        return channel;
    }

    public void setChannel(Channel channel) {
        this.channel = channel;
    }
}
