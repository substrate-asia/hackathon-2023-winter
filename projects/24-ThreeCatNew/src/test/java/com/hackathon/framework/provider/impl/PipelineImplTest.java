package com.hackathon.framework.provider.impl;

import com.hackathon.framework.provider.Stage;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;

import static org.mockito.Mockito.*;

class PipelineImplTest {
    @Mock
    List<Stage<?, ?>> stages;
    @InjectMocks
    PipelineImpl pipelineImpl;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    void testAddStage() {
        PipelineImpl result = pipelineImpl.addStage(null);
        Assertions.assertEquals(new PipelineImpl(), result);
    }

    @Test
    void testExecute() {
        Object result = pipelineImpl.execute("input");
        Assertions.assertEquals("replaceMeWithExpectedResult", result);
    }
}
