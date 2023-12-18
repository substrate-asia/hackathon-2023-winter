package com.hackathon.framework.utils;

public class Result {

    /**
     * 执行时间
     */
    public long executionTime;

    /**
     * 错误的信息(可以是业务和程序出错，必须包含业务自己定义的)
     */
    public String hasError;

    /**
     * 回传(作为验证是否往下执行)和记录到最终报告的结果
     */
    public Object result;

    public long getExecutionTime() {
        return executionTime;
    }

    public void setExecutionTime(long executionTime) {
        this.executionTime = executionTime;
    }

    public String getHasError() {
        return hasError;
    }

    public void setHasError(String hasError) {
        this.hasError = hasError;
    }

    public Object getResult() {
        return result;
    }

    @Override
    public String toString() {
        return "Result{" +
                "executionTime=" + executionTime +
                ", hasError='" + hasError + '\'' +
                ", result=" + result +
                '}';
    }
    public void setResult(Object result) {
        this.result = result;
    }
    public Result(long startTime, String hasError, Object resultAbi) {
        this.executionTime = (System.nanoTime()- startTime) / 1_000_000;
        this.hasError = hasError;
        this.result = resultAbi;
    }
}
