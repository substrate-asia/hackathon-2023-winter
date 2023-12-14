package com.hackathon.framework.provider;

import com.hackathon.framework.utils.Result;

import java.io.FileNotFoundException;
import java.lang.reflect.InvocationTargetException;

/**
 * 生成工程
 */
public interface GenerateEngine {

    /**
     * 生成工程读取策略配置
     * @param yamlPath yaml路径 Yaml文件在工程目录resources下面
     * @param generateType yaml节点名称
     * @return
     * @throws FileNotFoundException
     * @throws InvocationTargetException
     * @throws IllegalAccessException
     */
    Result getStrategy(String yamlPath, String generateType) throws FileNotFoundException, InvocationTargetException, IllegalAccessException;

    /**
     * 生成前检查生成环境是否缺失
     * 包含检查合同目录，编写脚本部署目录等，对应compile的环境
     * 防御性判断是否执行后面
     * @param compile Yaml generateEngine.compile节点决定
     * @return
     */
    Result preCheckGenerationEnv(String compile);

    /**
     * 初始化生成目录
     * @param generateDstDirectory 最终生成的目录位置
     */
    Result initDirectory(String generateDstDirectory);

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
