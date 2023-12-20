package com.hackathon.framework.process;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutionException;

import static org.mockito.Mockito.*;

class PipelineProcessTest {
    @Mock
    List<PipelineProcess.PipelineResult> pipelineResults;
    @Mock
    ConcurrentHashMap<String, List<String>> taskMap;
    @Mock
    ConcurrentHashMap<String, CompletableFuture<PipelineProcess.PipelineResult>> stageResults;
    @InjectMocks
    PipelineProcess pipelineProcess;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    void testGetPipelineResultList() throws ExecutionException, InterruptedException {
        pipelineProcess.getPipelineResultList(CompletableFuture.completedFuture(null));
    }

    @Test
    void testExecuteTask() {
        pipelineProcess.executeTask("stageId", null);
    }

    @Test
    void testGetPipelineResult() throws ExecutionException, InterruptedException {
        pipelineProcess.getPipelineResult("taskId");
    }

    @Test
    void testTaskDemo() {
        PipelineProcess.PipelineResult result = pipelineProcess.taskDemo();
        Assertions.assertEquals(null, result);
    }

    @Test
    void testUserTaskDemo() {
        pipelineProcess.userTaskDemo("stageId");
    }

    @Test
    void testMain() throws ExecutionException, InterruptedException {
        PipelineProcess.main(new String[]{"args"});
    }
}