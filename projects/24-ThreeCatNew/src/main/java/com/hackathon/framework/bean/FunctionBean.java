package com.hackathon.framework.bean;

import com.alibaba.fastjson.annotation.JSONField;

import java.util.List;

public class FunctionBean {
    @JSONField(name = "inputs")
    private List<InputParameter> inputs;
    @JSONField(name = "name")
    private String name;
    @JSONField(name = "outputs")
    private List<OutputParameter> outputs;
    @JSONField(name = "stateMutability")
    private String stateMutability;
    @JSONField(name = "type")
    private String type;

    // Getter and Setter methods


    public void setInputs(List<InputParameter> inputs) {
        this.inputs = inputs;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setOutputs(List<OutputParameter> outputs) {
        this.outputs = outputs;
    }

    public void setStateMutability(String stateMutability) {
        this.stateMutability = stateMutability;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<InputParameter> getInputs() {
        return inputs;
    }

    public String getName() {
        return name;
    }

    public List<OutputParameter> getOutputs() {
        return outputs;
    }

    public String getStateMutability() {
        return stateMutability;
    }

    public String getType() {
        return type;
    }

    public static class InputParameter {
        @JSONField(name = "internalType")
        private String internalType;
        @JSONField(name = "name")
        private String name;
        @JSONField(name = "type")
        private String type;

        // Getter and Setter methods

        public void setInternalType(String internalType) {
            this.internalType = internalType;
        }

        public void setName(String name) {
            this.name = name;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getInternalType() {
            return internalType;
        }

        public String getName() {
            return name;
        }

        public String getType() {
            return type;
        }
    }

    public static class OutputParameter {
        @JSONField(name = "internalType")
        private String internalType;
        @JSONField(name = "name")
        private String name;
        @JSONField(name = "type")
        private String type;

        // Getter and Setter methods

        public String getInternalType() {
            return internalType;
        }

        public String getName() {
            return name;
        }

        public String getType() {
            return type;
        }

        public void setInternalType(String internalType) {
            this.internalType = internalType;
        }

        public void setName(String name) {
            this.name = name;
        }

        public void setType(String type) {
            this.type = type;
        }
    }
}