package com.hackathon.framework.process;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutionException;
import java.util.function.Supplier;

public class PipelineProcess {

    private String taskId;

    /**
     * 流水线结果
     */
    private List<PipelineResult>pipelineResults = new ArrayList<>();

    private final ConcurrentHashMap<String, List<String>>taskMap = new ConcurrentHashMap<>();

    private final ConcurrentHashMap<String, CompletableFuture<PipelineResult>> stageResults = new ConcurrentHashMap<>();


    public List<PipelineResult> getPipelineResults() {
        return pipelineResults;
    }

    public PipelineProcess(String taskId){
        this.taskId = taskId;
        this.taskMap.put(taskId,new ArrayList<>());
    }

    static class PipelineResult {
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
            return "TaskResult{" +
                    "executionTime=" + executionTime +
                    ", hasError='" + hasError + '\'' +
                    ", result=" + result +
                    '}';
        }

        public void setResult(Object result) {
            this.result = result;
        }

        public PipelineResult(long executionTime, String hasError, Object result) {
            this.executionTime = executionTime;
            this.hasError = hasError;
            this.result = result;
        }
    }


    public void getPipelineResultList(CompletableFuture<PipelineResult> future) throws ExecutionException, InterruptedException {
        pipelineResults.add(future.get());
    }

    /**
     * 执行任务 任务里面分为多个stageId
     * @param stageId stageId
     * @param task 抽象的任务
     */
    public void executeTask(String stageId, Supplier<PipelineResult> task) {
        CompletableFuture<PipelineResult> future = CompletableFuture.supplyAsync(task);
        stageResults.put(stageId, future);
        taskMap.get(this.taskId).add(stageId);
    }

    /**
     * 获取测试数据结果
     * @param taskId 用taskId去本地查询stageId
     * @return
     * @throws ExecutionException
     * @throws InterruptedException
     */
    public void getPipelineResult(String taskId) throws ExecutionException, InterruptedException {
        List<String>stageIdList = taskMap.get(taskId);
        for(String stageId:stageIdList){
            CompletableFuture<PipelineResult> future = stageResults.get(stageId);
            if (future != null) {
                this.getPipelineResultList(future);
            }else {
                Thread.sleep(500);
            }
        }
    }

    /**
     * Demo使用
     */
    public PipelineResult taskDemo() {
        // 执行的时间
        long executionTime = System.currentTimeMillis();
        // 错误日志
        String errorLog = "检查到异常";
        // 节点回调的信息
        Object result = "data=1";
        return new PipelineResult(executionTime, errorLog, result);
    }

    /**
     * Demo使用
     * @param stageId
     */
    public void userTaskDemo(String stageId){
        this.executeTask(stageId,this::taskDemo);
    }


    public static void main(String[] args) throws ExecutionException, InterruptedException {
        PipelineProcess process = new PipelineProcess("001");
        process.userTaskDemo("stage1");
        process.userTaskDemo("stage2");
        process.userTaskDemo("stage3");
        process.getPipelineResult("001");
        process.getPipelineResults().forEach(System.out::println);
    }

}
