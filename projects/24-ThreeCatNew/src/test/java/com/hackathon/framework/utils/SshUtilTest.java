package com.hackathon.framework.utils;

import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.Session;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.io.IOException;


class SshUtilTest {
    @Mock
    Session session;
    @InjectMocks
    SshUtil sshUtil;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    void testConnectServer() {
        sshUtil.connectServer();
    }

    @Test
    void testExecuteCmd() throws JSchException, IOException, InterruptedException {
        // 替换你要输入的cmd
        String result = sshUtil.executeCmd("cmd");
        Assertions.assertEquals("replaceMeWithExpectedResult", result);
    }

    @Test
    void testCloseServer() {
        sshUtil.closeServer(null);
    }

}
