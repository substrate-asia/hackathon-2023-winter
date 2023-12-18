package com.hackathon.framework.bean;

import java.util.List;
import java.util.Map;

/**
 * 读取yaml里面的策略
 */
public class StrategyBean {

    public String getContractAddress() {
        return contractAddress;
    }

    public void setContractAddress(String contractAddress) {
        this.contractAddress = contractAddress;
    }

    public String getContractType() {
        return contractType;
    }

    public void setContractType(String contractType) {
        this.contractType = contractType;
    }

    private String contractAddress;

    /**
     * 编译方式 会关联一个映射
     */
    private String compile;

    /**
     * 编译名称
     */
    private String contractType;

    /**
     * 生成目录的目录
     */
    private List<String> directory;

    /**
     * SDK名称用于关联接口请求方式
     */
    private String sdkName;

    /**
     * 客户端界面的选择框
     */
    private Map<String,String> comboBox;

    /**
     * 报告保存路径
     */
    private String reportSavePath;

    public String getReportSavePath() {
        return reportSavePath;
    }

    public void setReportSavePath(String reportSavePath) {
        this.reportSavePath = reportSavePath;
    }

    public List<String> getDirectory() {
        return directory;
    }

    public void setDirectory(List<String> directory) {
        this.directory = directory;
    }

    public String getCompile() {
        return compile;
    }

    public void setCompile(String compile) {
        this.compile = compile;
    }

    public String getSdkName() {
        return sdkName;
    }

    public void setSdkName(String sdkName) {
        this.sdkName = sdkName;
    }

    public String getAssertionPath() {
        return assertionPath;
    }

    public void setAssertionPath(String assertionPath) {
        this.assertionPath = assertionPath;
    }

    public Boolean getEnableCoverageTarget() {
        return enableCoverageTarget;
    }

    public void setEnableCoverageTarget(Boolean enableCoverageTarget) {
        this.enableCoverageTarget = enableCoverageTarget;
    }

    public Float getCoverageThreshold() {
        return coverageThreshold;
    }

    public void setCoverageThreshold(Float coverageThreshold) {
        this.coverageThreshold = coverageThreshold;
    }

    public Float getCoreFileThreshold() {
        return coreFileThreshold;
    }

    public void setCoreFileThreshold(Float coreFileThreshold) {
        this.coreFileThreshold = coreFileThreshold;
    }

    public String getCISelector() {
        return CISelector;
    }

    public void setCISelector(String CISelector) {
        this.CISelector = CISelector;
    }

    public Map<String, Object> getScanStages() {
        return scanStages;
    }

    public void setScanStages(Map<String, Object> scanStages) {
        this.scanStages = scanStages;
    }

    public List<String> getScanWeight() {
        return scanWeight;
    }

    public void setScanWeight(List<String> scanWeight) {
        this.scanWeight = scanWeight;
    }

    public String getReportMode() {
        return reportMode;
    }

    public void setReportMode(String reportMode) {
        this.reportMode = reportMode;
    }

    private String assertionPath;

    private Boolean enableCoverageTarget;

    private Float coverageThreshold;

    private Float coreFileThreshold;

    private String CISelector;

    private Map<String,Object> scanStages;

    private List<String> scanWeight;

    private String reportMode;

    public StrategyBean(){

    }

    public Map<String, String> getComboBox() {
        return comboBox;
    }

    public void setComboBox(Map<String, String> comboBox) {
        this.comboBox = comboBox;
    }
}
