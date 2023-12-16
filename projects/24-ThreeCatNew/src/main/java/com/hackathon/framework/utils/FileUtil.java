package com.hackathon.framework.utils;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class FileUtil {

    /**
     * 链接上服务后，在服务器内部进行同步文件(所有不需要密钥)
     * @param sourcePath 源文件
     * @param dstPath 目标文件
     * @return
     */
    public static Boolean syncFile(String sourcePath,String dstPath){
        int exitCode = 0;
        ProcessBuilder processBuilder = new ProcessBuilder("rsync", "-avz", sourcePath, dstPath);
        try {
            Process process = processBuilder.start();
            exitCode = process.waitFor();
            System.out.println("Exit code: " + exitCode);
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
        return exitCode == 0;
    }

    /**
     * 是否存在文件夹
     * @param filePath 文件路径，要用绝对路径
     * @return
     */
    public static boolean existsDir(String filePath){
        File file = new File(filePath);
        return file.isDirectory();
    }

    /**
     * 是否存在文件
     * @param filePath 文件路径，要用绝对路径
     * @return
     */
    public static boolean existsFile(String filePath){
        File file = new File(filePath);
        return file.isFile();
    }

    /**
     * 拼接路径 用于文件夹和文件
     * @param fileName 不定长参数，支持传入多层的 "test","TestLoader.java"
     * @return
     */
    public static String joinFiles(String...fileName){
        return Arrays.stream(fileName).map(s -> s + File.separator).collect(Collectors.joining());
    }

    /**
     *
     * @param directoryPath 文件
     * @param isAddDirectory 追加检索文件目录
     * @return 文件名称数组，有可能为空
     */
    public static List<String> getAllFile(String directoryPath, boolean isAddDirectory) {
        List<String> fileList = new ArrayList<>();
        File baseFile = new File(directoryPath);
        // 如果是文件或者不存在直接返回
        if (baseFile.isFile() || !baseFile.exists()) {
            return fileList;
        }
        File[] files = baseFile.listFiles();
        for (File file : Objects.requireNonNull(files)) {
            if (file.isDirectory()) {
                if (isAddDirectory) {
                    fileList.add(file.getAbsolutePath());
                }
                fileList.addAll(getAllFile(file.getAbsolutePath(), isAddDirectory));
            } else {
                fileList.add(file.getAbsolutePath());
            }
        }
        return fileList;
    }

    /**
     * 删除文件夹以及下面的目录支持递归删除
     * @param dirPath 文件夹目录
     */
    public static void deleteDir(String dirPath) {
        File file = new File(dirPath);
        if (file.isFile()) {
            file.delete();
        } else {
            File[] files = file.listFiles();
            if (files == null) {
                file.delete();
            } else {
                for (int i = 0; i < files.length; i++) {
                    deleteDir(files[i].getAbsolutePath());
                }
                file.delete();
            }
        }
    }

    public static void main(String[] args) {
        System.out.println(FileUtil.joinFiles("test","TestLoader.java"));
    }

}
