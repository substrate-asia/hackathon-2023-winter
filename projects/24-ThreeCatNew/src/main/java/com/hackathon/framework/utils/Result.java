package com.hackathon.framework.utils;

public class Result {

    public long executionTime;
    public String hasError;
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
    public Result(long startTime, String hasError, Object result) {
        this.executionTime = (System.nanoTime()- startTime) / 1_000_000;
        this.hasError = hasError;
        this.result = result;
    }
}
