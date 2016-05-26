package me.ele.cs.push.manager;


import me.ele.cs.push.protobuf.IMMessage;
import me.ele.cs.push.session.SessionManager;
import org.springframework.stereotype.Component;

/**
 * Created by iser on 16/5/26.
 */
@Component
public class PushManager {
    public void pushToAll(IMMessage.PushMessage pushMessage) {
        SessionManager.processAll(pushMessage);
    }

    public void push(String userName, IMMessage.PushMessage pushMessage) {
        SessionManager.process(userName, pushMessage);
    }
}
