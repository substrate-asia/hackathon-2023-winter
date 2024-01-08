package com.hackathon.framework.provider.impl;

import com.hackathon.framework.provider.GenTestOperate;
import com.hackathon.framework.utils.FileUtil;
import com.hackathon.framework.utils.Result;
import com.hackathon.framework.utils.SshUtil;
import com.hackathon.framework.utils.StrategyConfigUtil;
import com.jcraft.jsch.JSchException;

import java.io.*;


public class GenTestOperateImpl implements GenTestOperate {

    public SshUtil sshUtil = new SshUtil();

    /**
     * 读取adi文件
     * cat contract_test_solc/output/EtherStore_sol_EtherStore.abi
     * @param path
     * @return 从服务器上面啦下来abi文件 然后 result.getBytes()传入到
     */
    @Override
    public Result getAbiFileForServer(String path) throws JSchException, IOException, InterruptedException {
        long startTime = System.nanoTime();
        String result = "";
        if(sshUtil.session!=null){
            result = sshUtil.executeCmd("cat "+path);
            if(!result.isEmpty()){
                return new Result(startTime,"",result);
            }
            return new Result(startTime,"读取"+path+"失败。",null);
        }
        return new Result(startTime,"服务器链接异常",null);
    }

    /**
     * 保存abi文件到本地
     * @param data 接收getAbiFileForServer()返回的数据
     * @param localFile 本地文件
     * @return
     */
    public Result saveAbiFileForLocal(byte[] data, File localFile){
        long startTime = System.nanoTime();
        String errorMessage = "";
        try (FileOutputStream fos = new FileOutputStream(localFile);
             ByteArrayInputStream bis = new ByteArrayInputStream(data)) {
             FileUtil.copy(bis, fos);
        } catch (IOException e) {
            errorMessage = e.getMessage();
        }
        // 用法如果errorMessage不为""则代表失败
        return new Result(startTime,errorMessage,null);
    }

    /**
     * 准备jestConfig
     * @param dstPath 生成位置
     * @return
     * @throws IOException
     */
    @Override
    public Result generateJestConfig(String dstPath)throws IOException {
        long startTime = System.nanoTime();
        String srcPath = StrategyConfigUtil.loadResource("jest.config.js");
        File srcFile = new File(srcPath);
        if(srcFile.exists()){
            Boolean existsTag = FileUtil.copyFile(srcFile,new File(dstPath));
            String errorMessage = existsTag?"":"生成预设的jest.config.js文件到目标失败";
            return new Result(startTime,errorMessage,null);
        }
        return new Result(startTime,"要保存的文件"+srcPath+"不存在",null);
    }
}
