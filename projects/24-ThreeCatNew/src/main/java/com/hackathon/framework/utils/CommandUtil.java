package com.hackathon.framework.utils;

import java.io.File;
import java.io.IOException;


/**
 * 命令行工具类
 */
public class CommandUtil {

    /**
     * 开进程执行命令行
     * @param command 命令行
     * @param outputPath 导出路径
     * @param errorPath 错误路径
     */
    private void runCommand(String command,String outputPath,String errorPath) {
        ProcessBuilder processBuilder = new ProcessBuilder(command);
        // 重定向输出到xxx文件
        processBuilder.redirectOutput(ProcessBuilder.Redirect.to(new File(outputPath)));
        // 重定向错误到xxx文件
        processBuilder.redirectError(ProcessBuilder.Redirect.to(new File(errorPath)));
        try {
            processBuilder.start();
        } catch (IOException ex) {
            System.out.println("Error running command: " + ex.getMessage());
        }
    }
}
