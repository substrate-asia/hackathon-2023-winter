package com.hackathon.framework.provider;

import com.hackathon.framework.utils.Result;
import com.jcraft.jsch.JSchException;

import java.io.File;
import java.io.IOException;

public interface GenTestOperate {

    /**
     * 包含ssh链接 cat命令获取本地abiFile
     * @param path cat后面的路径
     * @return 把cat读出来的字符串回传到本地
     * @throws JSchException
     * @throws IOException
     * @throws InterruptedException
     */
    Result getAbiFileForServer(String path) throws JSchException, IOException, InterruptedException;

    /**
     * 下载本地abi文件到本地
     * @param data getAbiFileForServer的返回 String.getBytes()传入
     * @param localFile 本地文件
     * @return 统一断言
     */
    Result saveAbiFileForLocal(byte[] data, File localFile);

    /**
     * JestConfig文件生成
     * @param dstPath 生成位置
     * @return 统一断言
     */
    Result generateJestConfig(String dstPath)throws IOException;

}
