package com.hackathon.framework.config;

import com.hackathon.framework.bean.StrategyBean;
import com.hackathon.framework.utils.StrategyConfigUtil;

import java.io.FileNotFoundException;
import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import java.util.Map;

/**
 * 创建生产配置
 */
public class ProductionConfig {

    public static final String BASE_COMMAND = "slither --json %s %s";
    public static final String STR_CONTRACTS = "contracts";
    public static final String STR_CHECK_RESULT = "checkResult.json";


    /**
     * 百度云外网地址
     * @return
     */
    public static String networkAddress() {
        return "http://服务器地址";
    }

    /**
     * 存放合约地址
     * @return yaml里面的合约地址
     */
    public static String contractAddress() throws FileNotFoundException, InvocationTargetException, IllegalAccessException {
        StrategyBean strategy = StrategyConfigUtil.getStrategy("generateEngine");
        return strategy.getContractAddress();
    }
}
