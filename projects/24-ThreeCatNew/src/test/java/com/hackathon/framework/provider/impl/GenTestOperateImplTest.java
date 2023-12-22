package com.hackathon.framework.provider.impl;

import com.hackathon.framework.utils.Result;
import com.hackathon.framework.utils.SshUtil;
import com.jcraft.jsch.JSchException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.io.File;
import java.io.IOException;

import static org.mockito.Mockito.*;

class GenTestOperateImplTest {
    @Mock
    SshUtil sshUtil;
    @InjectMocks
    GenTestOperateImpl genTestOperateImpl;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    void testGetAbiFileForServer() throws JSchException, IOException, InterruptedException {
        // 输入替换的参数
        when(sshUtil.executeCmd(anyString())).thenReturn("executeCmdResponse");

        Result result = genTestOperateImpl.getAbiFileForServer("path");
        Assertions.assertEquals(new Result(0L, "hasError", "result"), result);
    }

    @Test
    void testSaveAbiFileForLocal() {
        // 输入替换的参数
        Result result = genTestOperateImpl.saveAbiFileForLocal(new byte[]{(byte) 0}, new File(getClass()
                .getResource("/com/hackathon/framework/provider/impl/PleaseReplaceMeWithTestFile.txt").getFile()));
        Assertions.assertEquals(new Result(0L, "hasError", null), result);
    }

    @Test
    void testGenerateJestConfig() throws IOException {
        // 输入替换的参数到dstPath
        Result result = genTestOperateImpl.generateJestConfig("dstPath");
        Assertions.assertEquals(new Result(0L, "hasError", null), result);
    }
}