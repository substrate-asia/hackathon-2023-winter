package com.hackathon.framework.utils;

import com.hackathon.framework.bean.StrategyBean;
import org.yaml.snakeyaml.Yaml;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.lang.reflect.InvocationTargetException;
import java.net.URL;

import org.apache.commons.beanutils.BeanUtils;

import java.util.Map;

/**
 * 策略配置文件
 */
public class StrategyConfigUtil {

    /**
     * 读取策略，yaml数据转Bean对象
     * Bean进行环境检测
     * @param generateType 生成类型
     * @return
     * @throws FileNotFoundException
     */
    public static StrategyBean getStrategy(String generateType) throws FileNotFoundException, InvocationTargetException, IllegalAccessException {
        FileInputStream fileInputStream = new FileInputStream(loadResource("base.yaml"));
        Yaml yaml = new Yaml();
        Map<String, Object> data = yaml.load(fileInputStream);
        Map<String, Object> ret = (Map<String, Object>) data.get(generateType);
        StrategyBean envBean = new StrategyBean();
        BeanUtils.populate(envBean, ret);
        return envBean;
    }


    /**
     * 加载资源
     * @param fileName 文件名称
     * @return
     */
    public static String loadResource(String fileName){
        URL resource = ClassLoader.getSystemResource(fileName);
        return resource == null ? "" : resource.getPath();
    }

    public static void main(String[] args) throws FileNotFoundException, InvocationTargetException, IllegalAccessException {
        String path = StrategyConfigUtil.loadResource("jest.config.js");
        System.out.println(path);
        // 读取指定节点
        StrategyBean strategy = StrategyConfigUtil.getStrategy("generateEngine");
        System.out.println(strategy);
        // 读取UI界面逻辑节点
        strategy = StrategyConfigUtil.getStrategy("guiCommand");
        Map<String,String> uiMap = strategy.getComboBox();
        System.out.println(uiMap);
    }
}
