package me.ele.cs.push.server;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.Channel;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelHandler;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.group.ChannelGroup;
import io.netty.channel.group.DefaultChannelGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.util.concurrent.ImmediateEventExecutor;
import me.ele.cs.push.handler.MessageServerInitializer;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.net.InetSocketAddress;

/**
 * Created by iser on 16/5/16.
 */
@Component("pushServer")
public class PushServer {

    private final ChannelGroup group = new DefaultChannelGroup(ImmediateEventExecutor.INSTANCE);

    private final EventLoopGroup workerGroup = new NioEventLoopGroup();

    private Channel channel;

    @PostConstruct
    public void init()  {
        new Thread() {
            public void run() {

                ChannelFuture f = startServer(new InetSocketAddress(2048));
                System.out.println("server start................");
                Runtime.getRuntime().addShutdownHook(new Thread(){
                    @Override
                    public void run() {
                        destroyServer();
                    }
                });
                f.channel().closeFuture().syncUninterruptibly();
            }
        }.start();

    }


    public ChannelFuture startServer(InetSocketAddress address){
        ServerBootstrap boot = new ServerBootstrap();
        boot.group(workerGroup).channel(NioServerSocketChannel.class).childHandler(createInitializer(group));

        ChannelFuture f = boot.bind(address).syncUninterruptibly();
        channel = f.channel();
        return f;
    }

    protected ChannelHandler createInitializer(ChannelGroup group2) {
        return new MessageServerInitializer(group2);
    }

    public void destroyServer() {
        if (channel != null)
            channel.close();
        group.close();
        workerGroup.shutdownGracefully();
    }
}

