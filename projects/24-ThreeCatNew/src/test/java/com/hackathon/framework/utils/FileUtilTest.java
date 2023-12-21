package com.hackathon.framework.utils;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

class FileUtilTest {

    @Test
    void testSyncFile() {
        Boolean result = FileUtil.syncFile("sourcePath", "dstPath");
        Assertions.assertEquals(Boolean.TRUE, result);
    }

    @Test
    void testExistsDir() {
        boolean result = FileUtil.existsDir("filePath");
        Assertions.assertEquals(true, result);
    }

    @Test
    void testExistsFile() {
        boolean result = FileUtil.existsFile("filePath");
        Assertions.assertEquals(true, result);
    }

    @Test
    void testJoinFiles() {
        String result = FileUtil.joinFiles("fileName");
        Assertions.assertEquals("replaceMeWithExpectedResult", result);
    }

    @Test
    void testGetAllFile() {
        List<String> result = FileUtil.getAllFile("directoryPath", true);
        Assertions.assertEquals(Arrays.<String>asList("String"), result);
    }

    @Test
    void testDeleteDir() {
        FileUtil.deleteDir("dirPath");
    }

    @Test
    void testDeleteFilesByName() {
        FileUtil.deleteFilesByName("fileSuffix");
    }

    @Test
    void testReadFileToString() throws IOException {
        String result = FileUtil.readFileToString(new File(getClass().getResource("/com/hackathon/framework/utils/PleaseReplaceMeWithTestFile.txt").getFile()));
        Assertions.assertEquals("replaceMeWithExpectedResult", result);
    }

    @Test
    void testFileToZipBase64() {
        String result = FileUtil.fileToZipBase64(Arrays.<File>asList(new File(getClass().getResource("/com/hackathon/framework/utils/PleaseReplaceMeWithTestFile.txt").getFile())));
        Assertions.assertEquals("replaceMeWithExpectedResult", result);
    }

    @Test
    void testZipBase64ToFile() {
        FileUtil.zipBase64ToFile("base64", "path");
    }

    @Test
    void testDeleteFile() {
        boolean result = FileUtil.deleteFile("filePath");
        Assertions.assertEquals(true, result);
    }

    @Test
    void testCopy() throws IOException {
        long result = FileUtil.copy(null, null);
        Assertions.assertEquals(0L, result);
    }

    @Test
    void testCopyFile() throws IOException {
        Boolean result = FileUtil.copyFile(new File(getClass().getResource("/com/hackathon/framework/utils/PleaseReplaceMeWithTestFile.txt").getFile()), new File(getClass().getResource("/com/hackathon/framework/utils/PleaseReplaceMeWithTestFile.txt").getFile()));
        Assertions.assertEquals(Boolean.TRUE, result);
    }

    @Test
    void testDeleteFiles() {
        boolean result = FileUtil.deleteFiles("path");
        Assertions.assertEquals(true, result);
    }

    @Test
    void testReadFile() {
        String result = FileUtil.readFile("filePath");
        Assertions.assertEquals("replaceMeWithExpectedResult", result);
    }

    @Test
    void testMain() {
        FileUtil.main(new String[]{"args"});
    }
}

//Generated with love by TestMe :) Please report issues and submit feature requests at: http://weirddev.com/forum#!/testme