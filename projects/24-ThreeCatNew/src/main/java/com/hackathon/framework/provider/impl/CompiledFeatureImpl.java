package com.hackathon.framework.provider.impl;

import com.hackathon.framework.constants.CompiledFeatureMap;
import com.hackathon.framework.provider.CompiledFeature;
import com.hackathon.framework.utils.Result;

import java.io.File;
import java.util.List;

/**
 * 智能合约的编译后特征检测
 */
public class CompiledFeatureImpl implements CompiledFeature {

    @Override
    public Result compiledFeatureCheck(String compiledPath) {
        // 读取文件后进行判断，如果特征检测失败了，结果返回给Result,等传了JSON库在编写
        File file = new File(compiledPath);
        String fileName = file.getName();
        String fileSuffix = fileName.substring(fileName.lastIndexOf(".") + 1);
        List<String>features =  CompiledFeatureMap.compiledNamesMap.get(fileSuffix);
        return null;
    }
}
