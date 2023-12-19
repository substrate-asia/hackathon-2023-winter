package com.hackathon.framework.provider;

import com.hackathon.framework.utils.Result;
import com.jcraft.jsch.JSchException;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.List;

/**
 * 生成工程
 */
public interface GenerateEngine {

    /**
     * 生成工程读取策略配置
     * @param generateType yaml节点名称
     * @return
     * @throws FileNotFoundException
     * @throws InvocationTargetException
     * @throws IllegalAccessException
     */
    Result getStrategy(String generateType) throws FileNotFoundException, InvocationTargetException, IllegalAccessException;

    /**
     * 生成前检查生成环境是否缺失
     * 包含检查合同目录，编写脚本部署目录等，对应compile的环境
     * 防御性判断是否执行后面
     * @param compile Yaml generateEngine.compile节点决定
     * @return
     */
    Result preCheckGenerationEnv(String compile) throws JSchException, IOException, InterruptedException;

    /**
     * 在服务器上面进行链接
     * @return
     * @throws IOException
     * @throws InvocationTargetException
     * @throws IllegalAccessException
     * @throws JSchException
     * @throws InterruptedException
     */
    Result initDirectoryForServer() throws IOException, InvocationTargetException, IllegalAccessException, JSchException, InterruptedException;

    /**
     * 初始化生成目录
     * @param generateDstDirectory 最终生成的目录位置
     */
    Result initDirectoryForLocal(String generateDstDirectory, List<String> strategyList);

    /**
     * 载入合约
     */
    Result loadContract();

    /**
     * 编译合约
     */
    Result compilationContract();

    /**
     * 生成后检查生成目录是否正确(最后一个接口)
     * 防御性判断是否执行后面
     * @return Result
     */
    Result afterCheckGenerationDirectory();
}
