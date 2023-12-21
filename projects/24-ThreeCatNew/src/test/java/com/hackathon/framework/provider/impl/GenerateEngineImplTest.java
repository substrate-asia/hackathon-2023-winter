package com.hackathon.framework.provider.impl;

import com.hackathon.framework.bean.StrategyBean;
import com.hackathon.framework.utils.Result;
import com.hackathon.framework.utils.SshUtil;
import com.jcraft.jsch.JSchException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.Arrays;

import static org.mockito.Mockito.*;

class GenerateEngineImplTest {
    @Mock
    StrategyBean strategyBean;
    @Mock
    SshUtil sshUtil;
    @InjectMocks
    GenerateEngineImpl generateEngineImpl;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    void testGetStrategy() throws FileNotFoundException, InvocationTargetException, IllegalAccessException {
        Result result = generateEngineImpl.getStrategy("generateType");
        Assertions.assertEquals(new Result(0L, "hasError", "result"), result);
    }

    @Test
    void testPreCheckGenerationEnv() throws JSchException, IOException, InterruptedException {
        when(sshUtil.executeCmd(anyString())).thenReturn("executeCmdResponse");

        Result result = generateEngineImpl.preCheckGenerationEnv();
        Assertions.assertEquals(new Result(0L, "hasError", "result"), result);
    }

    @Test
    void testInitDirectoryForServer() throws JSchException, IOException, InterruptedException, InvocationTargetException, IllegalAccessException {
        when(strategyBean.getEnginePath()).thenReturn("getEnginePathResponse");
        when(strategyBean.getDirectory()).thenReturn(Arrays.<String>asList("String"));
        when(strategyBean.getCompile()).thenReturn("getCompileResponse");
        when(sshUtil.executeCmd(anyString())).thenReturn("executeCmdResponse");

        Result result = generateEngineImpl.initDirectoryForServer();
        Assertions.assertEquals(new Result(0L, "hasError", "result"), result);
    }

    @Test
    void testInitDirectoryForLocal() {
        Result result = generateEngineImpl.initDirectoryForLocal("generateDstDirectory", Arrays.<String>asList("String"));
        Assertions.assertEquals(new Result(0L, "hasError", "result"), result);
    }

    @Test
    void testLoadContract() {
        Result result = generateEngineImpl.loadContract();
        Assertions.assertEquals(new Result(0L, "hasError", "result"), result);
    }

    @Test
    void testCompilationContract() {
        Result result = generateEngineImpl.compilationContract();
        Assertions.assertEquals(new Result(0L, "hasError", "result"), result);
    }

    @Test
    void testAfterCheckGenerationDirectory() {
        Result result = generateEngineImpl.afterCheckGenerationDirectory();
        Assertions.assertEquals(new Result(0L, "hasError", "result"), result);
    }
}