package me.ele.cs.push.codec;

import com.google.protobuf.ExtensionRegistry;
import com.google.protobuf.ExtensionRegistryLite;
import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.MessageToMessageDecoder;
import me.ele.cs.push.util.MessageObjectRegister;

import java.util.List;

/**
 * Created by iser on 16/5/24.
 */
public class MessageProtobufDecoderFactory extends MessageToMessageDecoder<ByteBuf> {

    private static final int HEADER_LENGTH = 8;
    private final ExtensionRegistryLite extensionRegistry;


    /**
     * Creates a new instance.
     */
    public MessageProtobufDecoderFactory() {
        this(null);
    }

    public MessageProtobufDecoderFactory(ExtensionRegistry extensionRegistry) {
        this((ExtensionRegistryLite) extensionRegistry);
    }

    public MessageProtobufDecoderFactory(ExtensionRegistryLite extensionRegistry) {
        this.extensionRegistry = extensionRegistry;
    }

    @Override
    protected void decode(ChannelHandlerContext ctx, ByteBuf msg, List<Object> out)
            throws Exception {
        final byte[] header = new byte[HEADER_LENGTH];
        final byte[] array;
        final int offset;
        final int length = msg.readableBytes();


        if (msg.hasArray()) {
            array = msg.array();
            offset = msg.arrayOffset() + msg.readerIndex();
        } else {
            array = new byte[length];
            msg.getBytes(msg.readerIndex(), array, 0, length);
            offset = 0;
        }
        System.arraycopy(array, 0, header, 0, HEADER_LENGTH);

        if (extensionRegistry == null) {
                out.add(MessageObjectRegister.getMessageLite(new String(header)).getParserForType().parseFrom(array, offset + HEADER_LENGTH, length - HEADER_LENGTH));
        } else {
                out.add(MessageObjectRegister.getMessageLite(new String(header)).getParserForType().parseFrom(
                        array, offset + HEADER_LENGTH, length - HEADER_LENGTH, extensionRegistry));
        }

        out.forEach(messageLite -> {
            MessageObjectRegister.getHandler(new String(header)).handle(ctx, messageLite);
        });


    }
}
