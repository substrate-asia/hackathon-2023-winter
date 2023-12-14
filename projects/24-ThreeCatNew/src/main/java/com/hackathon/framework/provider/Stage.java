package com.hackathon.framework.provider;

/**
 * 步骤的接口
 */
public interface Stage<I, O> {
    O process(I input);
}
