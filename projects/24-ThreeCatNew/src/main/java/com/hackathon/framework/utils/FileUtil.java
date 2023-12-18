package com.hackathon.framework.utils;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

public class FileUtil {

    /**
     * 链接上服务后，在服务器内部进行同步文件(所有不需要密钥)
     *
     * @param sourcePath 源文件
     * @param dstPath    目标文件
     * @return
     */
    public static Boolean syncFile(String sourcePath, String dstPath) {
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
     *
     * @param filePath 文件路径，要用绝对路径
     * @return
     */
    public static boolean existsDir(String filePath) {
        File file = new File(filePath);
        return file.isDirectory();
    }

    /**
     * 是否存在文件
     *
     * @param filePath 文件路径，要用绝对路径
     * @return
     */
    public static boolean existsFile(String filePath) {
        File file = new File(filePath);
        return file.isFile();
    }

    /**
     * 拼接路径 用于文件夹和文件
     *
     * @param fileName 不定长参数，支持传入多层的 "test","TestLoader.java"
     * @return
     */
    public static String joinFiles(String... fileName) {
        return Arrays.stream(fileName).map(s -> s + File.separator).collect(Collectors.joining());
    }

    /**
     * @param directoryPath  文件
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
     *
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
                for (File value : files) {
                    deleteDir(value.getAbsolutePath());
                }
                file.delete();
            }
        }
    }

    /**
     * 删除当前文件夹下面指定后缀的文件
     *
     * @param fileSuffix 文件后缀
     */
    public static void deleteFilesByName(String fileSuffix) {
        Path dir = Paths.get(".");  // 获取当前目录
        try (Stream<Path> stream = Files.list(dir)) {
            stream
                    .filter(path -> path.toString().endsWith("." + fileSuffix))  // 只保留json文件
                    .forEach(path -> {
                        try {
                            Files.delete(path);  // 删除文件
                            System.out.println("Deleted: " + path);
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    });
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * 读取文件，返回文件中的内容
     *
     * @param file 文件
     * @return 文件内容
     */
    public static String readFileToString(File file) throws IOException {
        byte[] bytes = Files.readAllBytes(file.toPath());
        return new String(bytes, StandardCharsets.UTF_8);
    }

    /**
     * 文件压缩并Base64加密
     *
     * @param srcFiles
     * @return
     */
    public static String fileToZipBase64(List<File> srcFiles) {
        String toZipBase64 = "";
        ZipOutputStream zos = null;
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try {
            zos = new ZipOutputStream(baos);
            for (File srcFile : srcFiles) {
                byte[] buf = new byte[1024];
                zos.putNextEntry(new ZipEntry(srcFile.getName()));
                int len;
                FileInputStream in = new FileInputStream(srcFile);
                while ((len = in.read(buf)) != -1) {
                    zos.write(buf, 0, len);
                }
                zos.closeEntry();
                in.close();
            }
        } catch (IOException e) {
            System.err.printf("fileToZipBase64 IOException:[" + e.getMessage() + "]");
        } finally {
            close(zos);
        }
        byte[] refereeFileBase64Bytes = Base64.getEncoder().encode(baos.toByteArray());
        toZipBase64 = new String(refereeFileBase64Bytes, StandardCharsets.UTF_8);
        return toZipBase64;
    }

    /**
     * zip Base64 解密 解压缩.
     *
     * @param base64 base64加密字符
     * @param path   解压文件夹路径
     */
    public static void zipBase64ToFile(String base64, String path) {
        ByteArrayInputStream bais = null;
        ZipInputStream zis = null;
        try {
            File file = new File(path);
            if (!file.exists() && !file.isDirectory()) {
                file.mkdirs();
            }
            byte[] byteBase64 = Base64.getDecoder().decode(base64);
            bais = new ByteArrayInputStream(byteBase64);
            zis = new ZipInputStream(bais);
            ZipEntry entry = zis.getNextEntry();
            File fout = null;
            while (entry != null) {
                if (entry.isDirectory()) {
                    File subdirectory = new File(path + File.separator + entry.getName());
                    if (!subdirectory.exists() && !subdirectory.isDirectory()) {
                        subdirectory.mkdirs();
                    }
                } else {
                    String outPath = (path + entry.getName()).replaceAll("\\*", "/");
                    fout = new File(cleanString(outPath));
                    BufferedOutputStream bos = null;
                    try {
                        bos = new BufferedOutputStream(Files.newOutputStream(fout.toPath()));
                        int offo = -1;
                        byte[] buffer = new byte[1024];
                        while ((offo = zis.read(buffer)) != -1) {
                            bos.write(buffer, 0, offo);
                        }
                    } catch (IOException e) {
                        System.err.printf("base64ToFile IOException:[" + e.getMessage() + "]");
                    } finally {
                        close(bos);
                    }
                }
                entry = zis.getNextEntry();
            }
        } catch (IOException e) {
            System.err.printf("base64ToFile IOException:[" + e.getMessage() + "]");
        } finally {
            close(zis);
            close(bais);
        }
    }

    private static String cleanString(String str) {
        if (str == null) {
            return null;
        }
        StringBuilder cleanString = new StringBuilder();
        for (int i = 0; i < str.length(); ++i) {
            cleanString.append(cleanChar(str.charAt(i)));
        }
        return cleanString.toString();
    }

    /**
     * 删除单个文件
     *
     * @param filePath filePath
     * @return
     */
    public static boolean deleteFile(String filePath) {
        boolean flag = false;
        File file = new File(filePath);
        if (file.isFile() && file.exists()) {
            file.delete();
            flag = true;
        }
        return flag;
    }


    /**
     * delete Files.
     *
     * @param path path
     * @return
     */
    public static boolean deleteFiles(String path) {
        if (!path.endsWith(File.separator)) {
            path = path + File.separator;
        }
        File dirFile = new File(path);
        if (!dirFile.exists() || !dirFile.isDirectory()) {
            return false;
        }
        boolean flag = true;
        File[] files = dirFile.listFiles();
        if (files == null) {
            return false;
        }
        for (File file : files) {
            if (file.isFile()) {
                flag = deleteFile(file.getAbsolutePath());
                if (!flag) {
                    break;
                }
            } else {
                flag = deleteFiles(file.getAbsolutePath());
                if (!flag) {
                    break;
                }
            }
        }
        return flag;
    }


    /**
     * 清理char
     * @param value
     * @return
     */
    private static char cleanChar(char value) {
        // 0 - 9
        for (int i = 48; i < 58; ++i) {
            if (value == i) {
                return (char) i;
            }
        }
        // 'A' - 'Z'
        for (int i = 65; i < 91; ++i) {
            if (value == i) {
                return (char) i;
            }
        }
        // 'a' - 'z'
        for (int i = 97; i < 123; ++i) {
            if (value == i) {
                return (char) i;
            }
        }
        // other valid characters
        switch (value) {
            case '\\':
                return '\\';
            case '/':
                return '/';
            case ':':
                return ':';
            case '.':
                return '.';
            case '-':
                return '-';
            case '_':
                return '_';
            default:
                return ' ';
        }
    }

    /**
     * close Closeable.
     *
     * @param closeable object
     */
    private static void close(Closeable closeable) {
        if (closeable != null) {
            try {
                closeable.close();
            } catch (IOException e) {
                System.out.printf("closeable IOException:[%s]%n", e.getMessage());
            }
        }
    }


    /**
     * read InputStream.
     *
     * @param inputStream
     * @return
     * @throws IOException
     */
    private static String readInputStream(final InputStream inputStream) throws IOException {
        StringBuilder sb = new StringBuilder();
        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
        String line = null;
        // 逐行读取
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
        inputStream.close();
        return sb.toString();
    }

    /**
     * read File.
     *
     * @param filePath filePath
     * @return
     */
    public static String readFile(String filePath) {
        System.out.println("readFile dir:"+filePath);
        File file = new File(filePath);
        if (!file.exists()) {
            return null;
        }
        String result = null;
        try {
            result = readInputStream(new FileInputStream(file));
        } catch (IOException e) {
            System.err.println(e.getMessage());
        }
        return result;
    }


    public static void main(String[] args) {
        System.out.println(FileUtil.joinFiles("test", "TestLoader.java"));
    }

}
