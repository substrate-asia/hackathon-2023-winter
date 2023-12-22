package com.hackathon.framework.utils.web3;

import org.bouncycastle.crypto.digests.RIPEMD160Digest;

import java.security.MessageDigest;

/**
 * 处理消息摘要
 */
public class HashUtil {

    /**
     * 编写MD5的摘要方法
     * @param data
     * @return
     * @throws Exception
     */
    public static String md5(byte[] data) throws Exception {
        return messageDigestUtil("MD5", data);
    }

    /**
     * 编写sha1的摘要方法
     * @param data
     * @return
     * @throws Exception
     */
    public static String sha1(byte[] data) throws Exception {
        return messageDigestUtil("SHA1", data);
    }

    /**
     * 编写sha256的摘要方法
     * @param data
     * @return
     * @throws Exception
     */
    public static String sha256(byte[] data) throws Exception {
        return messageDigestUtil("SHA-256", data);
    }

    /**
     * 编写sha512的摘要方法
     * @param data
     * @return
     * @throws Exception
     */
    public static String sha512(byte[] data) throws Exception {
        return messageDigestUtil("SHA-512", data);
    }

    /**
     * 编写ripemd160 Hash消息摘要
     * @param data
     * @return
     */
    public static String ripemd160(byte[] data) {
        RIPEMD160Digest ripemd160Digest = new RIPEMD160Digest();
        ripemd160Digest.update(data,0,data.length);
        byte[] newBytes = new byte[ripemd160Digest.getDigestSize()];
        ripemd160Digest.doFinal(newBytes, 0);
        return byte2HexStr(newBytes);
    }


    /**
     * 返回摘要后的信息的函数
     * @param typeStr
     * @param data
     * @return
     * @throws Exception
     */
    public static String messageDigestUtil(String typeStr, byte[] data) throws Exception {
        //调用Hash函数MessageDigest（实现方法为单例）
        MessageDigest messageDigest = MessageDigest.getInstance(typeStr);
        //执行摘要方法
        byte[] newbytes = messageDigest.digest(data);
        return byte2HexStr(newbytes);
    }

    /**
     * 将字节数组转换为16进制字符串的工具
     * @param bytes
     * @return
     */
    public static String byte2HexStr(byte[] bytes) {
        StringBuffer stringBuffer = new StringBuffer()  ;
        for (byte b: bytes) {
            stringBuffer.append(Integer.toString((b & 0xff) + 0x100, 16).substring(1));
        }
        return  stringBuffer.toString();
    }

    /**
     * 获取16字符串，返回16进制的字节数组
     * @param hexStr
     * @return
     */
    public static byte[] hexStr2HexBytes(String hexStr) {
        if(null == hexStr ||0 == hexStr.length()) {
            return null;
        }
        hexStr = (hexStr.length() == 1) ? "0" + hexStr :hexStr;
        byte[] arr = new byte[hexStr.length()/2];
        byte[] tmp = hexStr.getBytes();
        for (int i = 0; i < tmp.length / 2; i ++) {
            arr[i] = unitBytes(tmp[i * 2], tmp[i * 2 + 1]);
        }
        return arr;
    }

    /**
     * uint转Bytes
     * @param src0
     * @param src1
     * @return
     */
    public static byte unitBytes(byte src0, byte src1) {
        byte _b0 = Byte.decode("0x" + new String(new byte[] {src0})).byteValue();
        _b0 = (byte)(_b0 << 4);
        byte _b1 = Byte.decode("0x" + new String(new byte[] {src1})).byteValue();
        return (byte)(_b0 ^ _b1);
    }

    public static void main(String[] args) throws Exception {
        String data = "21a111";
        System.out.println("========以下是输入普通字符串返回16进制字符串的摘要=======");
        System.out.println(md5(data.getBytes()));
        System.out.println(sha1(data.getBytes()));
        System.out.println(sha256(data.getBytes()));
        System.out.println(sha512(data.getBytes()));
        System.out.println(ripemd160(data.getBytes()));
        System.out.println("========以下是输入16进制字节数组返回16进制的摘要=======");
        byte[] hexByte = hexStr2HexBytes(data);
        System.out.println(md5(hexByte));
        System.out.println(sha1(hexByte));
        System.out.println(sha256(hexByte));
        System.out.println(sha512(hexByte));
        System.out.println(ripemd160(hexByte));
    }
}
