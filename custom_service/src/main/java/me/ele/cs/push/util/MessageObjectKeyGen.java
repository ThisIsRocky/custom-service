package me.ele.cs.push.util;

import java.security.MessageDigest;

/**
 * Created by iser on 16/5/26.
 */
public class MessageObjectKeyGen {
    public static String keygen(String packageName) {
        char hexDigits[]={'0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'};
        try {
            byte[] btInput = packageName.getBytes();
            MessageDigest mdInst = MessageDigest.getInstance("MD5");
            mdInst.update(btInput);
            byte[] md = mdInst.digest();
            int j = md.length;
            char str[] = new char[j * 2];
            int k = 0;
            for (int i = 0; i < j; i++) {
                byte byte0 = md[i];
                str[k++] = hexDigits[byte0 >>> 4 & 0xf];
                str[k++] = hexDigits[byte0 & 0xf];
            }
            return new String(str).substring(0,8);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

}
