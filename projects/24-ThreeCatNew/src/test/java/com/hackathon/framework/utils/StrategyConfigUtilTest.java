package com.hackathon.framework.utils;

import com.hackathon.framework.bean.StrategyBean;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.io.FileNotFoundException;
import java.lang.reflect.InvocationTargetException;

class StrategyConfigUtilTest {

    @Test
    void testGetStrategy() throws FileNotFoundException, InvocationTargetException, IllegalAccessException {
        StrategyBean result = StrategyConfigUtil.getStrategy("generateType");
        Assertions.assertEquals(new StrategyBean(), result);
    }

    @Test
    void testLoadResource() {
        String result = StrategyConfigUtil.loadResource("fileName");
        Assertions.assertEquals("replaceMeWithExpectedResult", result);
    }

    @Test
    void testMain() throws FileNotFoundException, InvocationTargetException, IllegalAccessException {
        StrategyConfigUtil.main(new String[]{"args"});
    }
}
