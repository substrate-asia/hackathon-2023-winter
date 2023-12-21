package com.hackathon.framework.utils;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.io.IOException;

class StaticDetectionTest {
    StaticDetection staticDetection = new StaticDetection();

    @Test
    void testCheckGroovySyntax() throws IOException {
        Result result = staticDetection.checkGroovySyntax("groovyPath");
        Assertions.assertEquals(new Result(0L, "hasError", "result"), result);
    }
}
