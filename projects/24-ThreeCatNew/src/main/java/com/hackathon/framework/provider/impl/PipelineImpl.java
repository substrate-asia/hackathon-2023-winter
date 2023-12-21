package com.hackathon.framework.provider.impl;

import com.hackathon.framework.provider.Pipeline;
import com.hackathon.framework.provider.Stage;

import java.util.ArrayList;
import java.util.List;

/**
 * 用于处理Pipeline模板的抽象实现类，输入input
 * @param <I>
 * @param <O>
 */
public class PipelineImpl<I, O> implements Pipeline<I,O> {

    private final List<Stage<?, ?>> stages = new ArrayList<>();

    /**
     * 添加步骤
     * @param stage 步骤抽象
     * @return
     * @param <X>
     */
    public <X> PipelineImpl<I, X> addStage(Stage<O, X> stage) {
        stages.add(stage);
        return (PipelineImpl<I, X>) this;
    }

    /**
     * 执行步骤
     * @param input 执行步骤输入参数
     * @return
     */
    public O execute(I input) {
        Object output = input;
        for (Stage<?, ?> stage : stages) {
            output = ((Stage<Object, Object>) stage).process(output);
        }
        return (O) output;
    }
}
