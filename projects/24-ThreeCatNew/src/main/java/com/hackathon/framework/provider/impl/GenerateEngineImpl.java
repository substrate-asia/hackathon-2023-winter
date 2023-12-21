package com.hackathon.framework.provider.impl;

import com.hackathon.framework.bean.StrategyBean;
import com.hackathon.framework.provider.GenerateEngine;
import com.hackathon.framework.utils.FileUtil;
import com.hackathon.framework.utils.Result;
import com.hackathon.framework.utils.SshUtil;
import com.hackathon.framework.utils.StrategyConfigUtil;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.SftpException;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class GenerateEngineImpl implements GenerateEngine {

    private StrategyBean strategyBean;

    public SshUtil sshUtil = new SshUtil();

    private String projectPath = "";

    @Override
    public Result getStrategy(String generateType) throws FileNotFoundException, InvocationTargetException, IllegalAccessException {
        long startTime = System.nanoTime();
        strategyBean = StrategyConfigUtil.getStrategy(generateType);
        return new Result(startTime, "", strategyBean);
    }

    /**
     * 前置检查环境
     * fix:2023-12-20 参数错误和逻辑错误已经修改
     *
     * @return
     * @throws JSchException
     * @throws IOException
     * @throws InterruptedException
     */
    @Override
    public Result preCheckGenerationEnv() throws JSchException, IOException, InterruptedException {
        long startTime = System.nanoTime();
        // 代码逻辑待补

        // 检测环境命令
        String solcVersion = "solcjs --version";
        String truffleVersion = "truffle --version";
        String errText = "";
        String soclcVersionResult = sshUtil.executeCmd(solcVersion);
        if (!soclcVersionResult.contains("not found")) {
            errText += "solcjs is not installed";
        }
        // 这里判断的是truffleVersion读取，这里错误已经修改
        String truffleVersionResult = sshUtil.executeCmd(truffleVersion);
        if (!truffleVersionResult.contains("not found")) {
            errText += "truffle is not installed";
        }
        return new Result(startTime, errText, "successfully");
    }

    /**
     * 初始化目录在服务器上面
     *
     * @return
     * @throws IOException
     * @throws InvocationTargetException
     * @throws IllegalAccessException
     * @throws JSchException
     * @throws InterruptedException
     */
    public Result initDirectoryForServer() throws JSchException, SftpException, IOException, InvocationTargetException, IllegalAccessException, InterruptedException {
        long startTime = System.nanoTime();
        // 创建工程名称
        strategyBean = StrategyConfigUtil.getStrategy("generateEngine");
        String mkdirCommand = "mkdir " + strategyBean.getEnginePath();
        sshUtil.executeCmd(mkdirCommand);
        // 进入目录执行init
        sshUtil.executeCmd("cd " + strategyBean.getEnginePath());
        Result envResult = this.preCheckGenerationEnv();
        String errorMessage = "";
        // 判断是否错误可以往下走这么写，hasError要返回参数啊!
        if (envResult.getHasError().isEmpty()) {
            String compileName = strategyBean.getCompile();
            sshUtil.executeCmd(compileName + " init");
            List<String> compileList = strategyBean.getDirectory();
            // 获取当前路径下的文件和文件夹
            String initPathList = sshUtil.getFolder();
            //这里result应该传输null也行，只要验证truffle init的文件
            for (String element : compileList) {
                if (!initPathList.contains(element)) {
                    errorMessage = "Failed to initialize the truffle directory";
                    return new Result(startTime, errorMessage, null);
                }
            }
        }
        // 这里如果hasError是空字符串代表成功
        return new Result(startTime, envResult.getHasError(), null);
    }


    /**
     * 初始化文件夹
     *
     * @param generateDstDirectory 最终生成的目录位置
     * @param strategyList
     * @return
     */
    @Override
    public Result initDirectoryForLocal(String generateDstDirectory, List<String> strategyList) {
        // TODO 包含ssh在服务器上面创建目录
        long startTime = System.nanoTime();
        String errText = "";
        String successText = "";
        try {
            Path rootPath = Paths.get(generateDstDirectory);
            if (!Files.exists(rootPath)) {
                Files.createDirectories(rootPath);
            }
            for (String dir : strategyList) {
                Path path = rootPath.resolve(dir);
                Files.createDirectories(path);
            }
            successText = "Successfully initialized project at " + rootPath;
            System.out.println(successText);
        } catch (Exception e) {
            errText = "Error initializing project: " + e.getMessage();
            System.err.println(errText);
        }
        return new Result(startTime, errText, successText);
    }

    /**
     * 加载合约
     *
     * @return
     * @throws JSchException
     * @throws IOException
     * @throws InterruptedException
     * @throws InvocationTargetException
     * @throws IllegalAccessException
     */
    @Override
    public Result loadContract() throws JSchException, IOException, InterruptedException, InvocationTargetException, IllegalAccessException {
        long startTime = System.nanoTime();
        // 代码逻辑待补
        // mv操作应是在truffle初始化的目录下进行
        strategyBean = StrategyConfigUtil.getStrategy("generateEngine");
        String mvContractCommand = "mv /root/Hackathon-2023-winter/contract/* " + strategyBean.getEnginePath() + "/contracts/";
        String errorMessage = sshUtil.executeCmd(mvContractCommand);
        return new Result(startTime, errorMessage, "");
    }

    /**
     * 获取合约ABI和合约
     *
     * @return
     * @throws IOException
     * @throws InvocationTargetException
     * @throws IllegalAccessException
     * @throws JSchException
     * @throws InterruptedException
     */
    @Override
    public Result compilationContract(String contractOne, String contractTwo) throws IOException, InvocationTargetException, IllegalAccessException, JSchException, InterruptedException {
        long startTime = System.nanoTime();
        strategyBean = StrategyConfigUtil.getStrategy("generateEngine");
        String errorMessage = "";
        Map<String, String> resultMap = new HashMap<>(65535,0.9f);
        // 存储类变量
        projectPath = strategyBean.getEnginePath();
        try {
            // 拷贝模板truffle-config.js
            String cpTemplateConfigurationFile = "cp -f /root/truffle-config.js " + projectPath + "/truffle-config.js";
            sshUtil.executeCmd(cpTemplateConfigurationFile);
            // 没有返回，有返回也是去验证cp -f是否成功
            String cdPathCommand = "cd " + projectPath;
            sshUtil.executeCmd(cdPathCommand);
            // 编译合约
            String compileContractCommand = "truffle compile";
            sshUtil.executeCmd(compileContractCommand);
        }catch (Exception e){
            errorMessage += e;
        }
        Result result = afterCheckGenerationDirectory(contractOne,contractTwo);
        if(result.getHasError().isEmpty()){
            List<String>contractFileList = (List<String>) result.getResult();
            // 查看合约
            String catContractEtherStoreCommand = "cat " + contractFileList.get(0);
            String contract = sshUtil.executeCmd(catContractEtherStoreCommand);
            resultMap.put(contractOne + ".sol", contract);
            String catContractAttackCommand = "cat " + contractFileList.get(1);
            contract = sshUtil.executeCmd(catContractAttackCommand);
            resultMap.put(contractTwo + ".sol", contract);
            // 查看合约abi
            String catContractEtherStoreAbiCommand = "cat " + contractFileList.get(2);
            String abi = sshUtil.executeCmd(catContractEtherStoreAbiCommand);
            resultMap.put(contractOne + ".json", abi);
            String catContractAttackAbiCommand = "cat " + contractFileList.get(4);
            abi = sshUtil.executeCmd(catContractAttackAbiCommand);
            resultMap.put(contractTwo + ".json", abi);
            if (errorMessage.isEmpty()) {
                return new Result(startTime, errorMessage, resultMap);
            }
        }
        return new Result(startTime, errorMessage, "");
    }

    @Override
    public Result afterCheckGenerationDirectory(String contractOne, String contractTwo) {
        long startTime = System.nanoTime();
        String errorMessage = "";
        // 编译后检查
        String solPathOne = projectPath + File.separator+ "contracts/" + contractOne + ".sol";
        if(!FileUtil.existsFile(solPathOne)){
            errorMessage = solPathOne+"文件不存在。";
        }
        String solPathTwo = projectPath + File.separator+ "contracts/" + contractTwo + ".sol";
        if(!FileUtil.existsFile(solPathTwo)){
            errorMessage = solPathTwo+"文件不存在。";
        }
        String abiJsonOne = projectPath + "/build/contracts/" + contractOne + ".json";
        if(!FileUtil.existsFile(abiJsonOne)){
            errorMessage = abiJsonOne+"文件不存在。";
        }
        String abiJsonTwo = projectPath + "/build/contracts/" + contractTwo + ".json";
        if(!FileUtil.existsFile(abiJsonTwo)){
            errorMessage = abiJsonTwo+"文件不存在。";
        }
        // 代码逻辑待补
        return new Result(startTime, errorMessage, Arrays.asList(solPathOne,solPathTwo,abiJsonOne,abiJsonTwo));
    }
}
