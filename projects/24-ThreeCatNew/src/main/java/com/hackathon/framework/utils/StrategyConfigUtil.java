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
     * @param yamlPath     yaml文件
     * @param generateType 生成类型
     * @return
     * @throws FileNotFoundException
     */
    public static StrategyBean getStrategy(String yamlPath, String generateType) throws FileNotFoundException, InvocationTargetException, IllegalAccessException {
        FileInputStream fileInputStream = new FileInputStream(yamlPath);
        Yaml yaml = new Yaml();
        Map<String, Object> data = yaml.load(fileInputStream);
        Map<String, Object> ret = (Map<String, Object>) data.get(generateType);
        StrategyBean envBean = new StrategyBean();
        BeanUtils.populate(envBean, ret);
        return envBean;
    }

    public static void main(String[] args) throws FileNotFoundException, InvocationTargetException, IllegalAccessException {
        URL resource = ClassLoader.getSystemResource("base.yaml");
        String path = resource == null ? "" : resource.getPath();
        System.out.println(StrategyConfigUtil.getStrategy(path, "generateEngine"));
    }
}
