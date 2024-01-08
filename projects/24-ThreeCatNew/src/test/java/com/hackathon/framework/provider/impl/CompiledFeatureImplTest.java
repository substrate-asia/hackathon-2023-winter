package com.hackathon.framework.provider.impl;

import com.hackathon.framework.utils.Result;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

class CompiledFeatureImplTest {
    CompiledFeatureImpl compiledFeatureImpl = new CompiledFeatureImpl();

    @Test
    void testCompiledFeatureCheck() {
        Result result = compiledFeatureImpl.compiledFeatureCheck("compiledPath");
        Assertions.assertEquals(new Result(0L, null, null), result);
    }
}