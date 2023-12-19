package com.hackathon.framework.provider.impl;

import com.hackathon.framework.bean.StrategyBean;
import com.hackathon.framework.provider.GenerateEngine;
import com.hackathon.framework.utils.Result;
import com.hackathon.framework.utils.SshUtil;
import com.hackathon.framework.utils.StrategyConfigUtil;
import com.jcraft.jsch.JSchException;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

public class GenerateEngineImpl implements GenerateEngine {

    private StrategyBean strategyBean;

    public SshUtil sshUtil = new SshUtil();

    @Override
    public Result getStrategy(String generateType) throws FileNotFoundException, InvocationTargetException, IllegalAccessException {
        long startTime = System.nanoTime();
        strategyBean = StrategyConfigUtil.getStrategy(generateType);
        return new Result(startTime,"",strategyBean);
    }

    @Override
    public Result preCheckGenerationEnv(String compile) throws JSchException, IOException, InterruptedException {
        long startTime = System.nanoTime();
        // 代码逻辑待补

        // 检测环境命令
        String solcVersion = "solcjs --version";
        String truffleVersion = "truffle --version";

        String soclcVersionResult = sshUtil.executeCmd(solcVersion);

        if(!soclcVersionResult.contains("not found")) {
            String  errText = "solcjs is not installed";
            System.err.println(errText);
        }
        if(!truffleVersion.contains("not found")) {
            String  errText = "truffle is not installed";
            System.err.println(errText);
        }

        return new Result(startTime,"","successfully");
    }

    /**
     * 初始化目录在服务器上面
     * @return
     * @throws IOException
     * @throws InvocationTargetException
     * @throws IllegalAccessException
     * @throws JSchException
     * @throws InterruptedException
     */
    public Result initDirectoryForServer() throws IOException, InvocationTargetException, IllegalAccessException, JSchException, InterruptedException {
        long startTime = System.nanoTime();
        // 创建工程名称
        strategyBean = StrategyConfigUtil.getStrategy("generateEngine");
        String mkdirCommand = "mkdir " + strategyBean.getEnginePath();
        sshUtil.executeCmd(mkdirCommand);
        // 进入目录执行init
        sshUtil.executeCmd("cd "+strategyBean.getEnginePath());
        String compileName = strategyBean.getCompile();
        sshUtil.executeCmd(compileName+" init");
        // TODO sshUtil.executeCmd这个处理命令行，用这个验证下init生成的文件是否包含truffle init的文件
        List<String>compileList = strategyBean.getDirectory();
        String errorMessage = "";
        // 这里如果hasError是空字符串代表成功
        return new Result(startTime,"",null);
    }


    /**
     * 初始化文件夹
     * @param generateDstDirectory 最终生成的目录位置
     * @param strategyList
     * @return
     */
    @Override
    public Result initDirectoryForLocal(String generateDstDirectory,List<String>strategyList) {
        // TODO 包含ssh在服务器上面创建目录
        long startTime = System.nanoTime();
        String errText = "";
        String successText = "";
        try {
            Path rootPath = Paths.get(generateDstDirectory);
            if (!Files.exists(rootPath)) {
                Files.createDirectories(rootPath);
            }
            for(String dir:strategyList){
                Path path = rootPath.resolve(dir);
                Files.createDirectories(path);
            }
            successText = "Successfully initialized project at " + rootPath;
            System.out.println(successText);
        } catch (Exception e) {
            errText = "Error initializing project: " + e.getMessage();
            System.err.println(errText);
        }
        return new Result(startTime,errText,successText);
    }

    @Override
    public Result loadContract() {
        long startTime = System.nanoTime();
        // 代码逻辑待补
        return new Result(startTime,"","");
    }

    @Override
    public Result compilationContract() {
        long startTime = System.nanoTime();
        // 代码逻辑待补
        return new Result(startTime,"","");
    }

    @Override
    public Result afterCheckGenerationDirectory() {
        long startTime = System.nanoTime();
        // 代码逻辑待补
        return new Result(startTime,"","");
    }
}
