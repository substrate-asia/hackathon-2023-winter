package com.hackathon.framework.bean;

import com.alibaba.fastjson.annotation.JSONField;

import java.util.List;


/**
 * abi解析对象配置定义
 */
public class FunctionBean {

    private String contractName;
    private List<AbiItem> abi;

    public String getContractName() {
        return contractName;
    }

    public void setContractName(String contractName) {
        this.contractName = contractName;
    }

    public List<AbiItem> getAbi() {
        return abi;
    }

    public void setAbi(List<AbiItem> abi) {
        this.abi = abi;
    }

    /**
     * abi对象属性
     */
    public static class AbiItem {
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
        private String meg;

        public String getMeg() {
            return meg;
        }

        public void setMeg(String meg) {
            this.meg = meg;
        }

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

        /**
         * 接口入参对象属性
         */
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

        /**
         * 接口返回参数对象属性
         */
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
}