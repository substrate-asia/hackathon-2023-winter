package com.hackathon.framework.utils.web3;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

class HashUtilTest {

    @Test
    void testMd5() throws Exception {
        String result = HashUtil.md5(new byte[]{(byte) 0});
        Assertions.assertEquals("replaceMeWithExpectedResult", result);
    }

    @Test
    void testSha1() throws Exception {
        String result = HashUtil.sha1(new byte[]{(byte) 0});
        Assertions.assertEquals("replaceMeWithExpectedResult", result);
    }

    @Test
    void testSha256() throws Exception {
        String result = HashUtil.sha256(new byte[]{(byte) 0});
        Assertions.assertEquals("replaceMeWithExpectedResult", result);
    }

    @Test
    void testSha512() throws Exception {
        String result = HashUtil.sha512(new byte[]{(byte) 0});
        Assertions.assertEquals("replaceMeWithExpectedResult", result);
    }

    @Test
    void testRipemd160() {
        String result = HashUtil.ripemd160(new byte[]{(byte) 0});
        Assertions.assertEquals("replaceMeWithExpectedResult", result);
    }

    @Test
    void testMessageDigestUtil() throws Exception {
        String result = HashUtil.messageDigestUtil("typeStr", new byte[]{(byte) 0});
        Assertions.assertEquals("replaceMeWithExpectedResult", result);
    }

    @Test
    void testByte2HexStr() {
        String result = HashUtil.byte2HexStr(new byte[]{(byte) 0});
        Assertions.assertEquals("replaceMeWithExpectedResult", result);
    }

    @Test
    void testHexStr2HexBytes() {
        byte[] result = HashUtil.hexStr2HexBytes("hexStr");
        Assertions.assertArrayEquals(new byte[]{(byte) 0}, result);
    }

    @Test
    void testUnitBytes() {
        byte result = HashUtil.unitBytes((byte) 0, (byte) 0);
        Assertions.assertEquals((byte) 0, result);
    }

    @Test
    void testMain() throws Exception {
        HashUtil.main(new String[]{"args"});
    }
}