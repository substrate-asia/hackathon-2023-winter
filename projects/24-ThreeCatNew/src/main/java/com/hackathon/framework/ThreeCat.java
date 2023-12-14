package com.hackathon.framework;

import com.hackathon.framework.provider.GenerateEngine;
import com.hackathon.framework.provider.impl.GenerateEngineImpl;

/**
 * 同名的启动器
 */
public class ThreeCat {

    public static void main(String[] args) {
        if (args.length == 2) {
            System.err.println("Usage: java ThreeCat init <directory>");
        }
        String command = args[0];
        String parameter1 = args[1];
        String parameter2 = args[2];
        if ("init".equals(command)) {
            // TODO 生成目录已经实现
            final GenerateEngine generateEngine = new GenerateEngineImpl();
            generateEngine.initDirectory(parameter1);
        }else if ("compile".equals(command) &&("--coverage".equals(parameter1))){
            // 生成覆盖率，面对的是合约的文件，需要使用到parameter2

        }else if ("genTest".equals(command)){
            // TODO 生成单测测试用例，需要添加断言

        }
        else {
            System.err.println("Unknown command: " + command);
            System.exit(1);
        }

    }
}