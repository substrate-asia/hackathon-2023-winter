package com.hackathon.framework.provider.impl;

import com.hackathon.framework.bean.StrategyBean;
import com.hackathon.framework.provider.GenerateEngine;
import com.hackathon.framework.utils.Result;
import com.hackathon.framework.utils.StrategyConfigUtil;

import java.io.FileNotFoundException;
import java.lang.reflect.InvocationTargetException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

public class GenerateEngineImpl implements GenerateEngine {

    private StrategyBean strategyBean;

    @Override
    public Result getStrategy(String yamlPath, String generateType) throws FileNotFoundException, InvocationTargetException, IllegalAccessException {
        long startTime = System.nanoTime();
        URL resource = ClassLoader.getSystemResource("base.yaml");
        String path = resource == null ? "" : resource.getPath();
        strategyBean = StrategyConfigUtil.getStrategy(path, "generateEngine");
        return new Result(startTime,"",strategyBean);
    }

    @Override
    public Result preCheckGenerationEnv(String compile) {
        long startTime = System.nanoTime();
        // 代码逻辑待补
        return new Result(startTime,"","");
    }

    @Override
    public Result initDirectory(String generateDstDirectory) {
        long startTime = System.nanoTime();
        String errText = "";
        String successText = "";
        List<String> directory = strategyBean.getDirectory();
        try {
            Path rootPath = Paths.get(generateDstDirectory);
            if (!Files.exists(rootPath)) {
                Files.createDirectories(rootPath);
            }
            for(String dir:directory){
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
