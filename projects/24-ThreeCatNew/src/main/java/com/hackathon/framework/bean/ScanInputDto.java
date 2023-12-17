package com.hackathon.framework.bean;

public class ScanInputDto {

    /**
     * appId
     */
    private String appid;

    public String getAppid() {
        return appid;
    }

    public void setAppid(String appid) {
        this.appid = appid;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    /**
     * 合约资源
     */
    private String source;

}
