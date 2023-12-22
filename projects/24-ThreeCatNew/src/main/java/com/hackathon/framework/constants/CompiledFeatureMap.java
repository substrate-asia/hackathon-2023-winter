package com.hackathon.framework.constants;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 编译后文件特征映射
 */
public class CompiledFeatureMap {

    public static Map<String, List<String>>compiledNamesMap = new HashMap<>();

    static {
        compiledNamesMap.put("abi", Arrays.asList("input","output","name"));
    }

}
