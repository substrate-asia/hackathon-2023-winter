package com.hackathon.framework.utils;

import groovy.lang.GroovyShell;
import org.codehaus.groovy.control.CompilationFailedException;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * 静态检查
 */
public class StaticDetection {

    /**
     * Groovy Shell静态检查，用于字符串模板后生成后检查
     * @param groovyPath 读取Groovy文件
     * @return
     */
    public Result checkGroovySyntax(String groovyPath) throws IOException {
        long startTime = System.nanoTime();
        Path path = Paths.get(groovyPath);
        BufferedReader reader = Files.newBufferedReader(path);
        String data = reader.readLine();
        GroovyShell shell = new GroovyShell();
        try {
            shell.parse(data);
        } catch (CompilationFailedException e) {
            e.printStackTrace();
        }
        return new Result(startTime,"Groovy code is incorrect.","Groovy code is correct.");
    }

}
