package com.hackathon.framework.bean;

/**
 * sol关联配置定义
 */
public class SolBean {

    private String abiName;
    private String solName;
    private String contractName;
    private FunctionBean functionBean;

    public String getSolName() {
        return solName;
    }

    public void setSolName(String solName) {
        this.solName = solName;
    }

    public FunctionBean getFunctionBean() {
        return functionBean;
    }

    public void setFunctionBean(FunctionBean functionBean) {
        this.functionBean = functionBean;
    }

    public String getAbiName() {
        return abiName;
    }

    public void setAbiName(String abiName) {
        this.abiName = abiName;
    }

    public String getContractName() {
        return contractName;
    }

    public void setContractName(String contractName) {
        this.contractName = contractName;
    }
}