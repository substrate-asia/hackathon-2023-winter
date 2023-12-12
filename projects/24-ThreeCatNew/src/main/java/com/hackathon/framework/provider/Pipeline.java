package com.hackathon.framework.provider;

import com.hackathon.framework.provider.impl.PipelineImpl;


/**
 * 用于处理Pipeline模板的抽象，输入input
 * @param <I>
 * @param <O>
 */
public interface Pipeline<I, O> {

    /**
     * 添加步骤
     * @param stage 步骤抽象
     * @return
     * @param <X>
     */
    <X> PipelineImpl<I, X> addStage(Stage<O, X> stage);

    /**
     * 执行步骤
     * @param input 执行步骤输入参数
     * @return
     */
    O execute(I input);

}
