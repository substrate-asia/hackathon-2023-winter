package com.hackathon.framework.config;

import com.hackathon.framework.bean.StrategyBean;
import com.hackathon.framework.utils.StrategyConfigUtil;

import java.io.FileNotFoundException;
import java.lang.reflect.InvocationTargetException;

/**
 * 创建生产配置
 */
public class ProductionConfig {

    public static final String BASE_COMMAND = "slither --json %s %s";
    public static final String STR_CONTRACTS = "contracts";
    public static final String STR_CHECK_RESULT = "checkResult.json";

    /**
     * 账号
     * @return
     */
    public static String getUserName() {
        return "root";
    }

    /**
     * 密码
     * @return
     */
    public static String getPassWord() {
        return "!hai@#$Xing%^*1)";
    }

    /**
     * 百度云外网地址
     * @return
     */
    public static String networkAddress() {
        return "120.48.150.143";
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
