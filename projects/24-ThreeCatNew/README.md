## 基本资料

项目名称：ThreeCat(三只猫应用链测试框架)

项目立项日期：2023-12-09

## Project Introduction

### Background
An automated tool for testing and debugging using three cats, as well as a testing framework for smart contracts for security auditing.

It can be divided into unit testing, which helps developers and testers generate test cases and inspection conclusions for the entire contract pipeline.

The current unit testing framework has the following issues:
1. Each step needs to be handled by oneself

The three cats have the ability to concatenate steps and generate corresponding framework files using the command line.

The conclusion of a single inspection can be achieved through the framework to ensure whether the single test can be included.

2. Insufficient scalability

Three cats can integrate multiple SDKs and their corresponding language assertion capabilities.

In the unit testing environment, plugins and necessary check items for the inspection phase can be freely added

### Technical Architecture
**Backend**: Using Java as the main language, generating single test templates based on the language of the smart contract Sdk framework.

**Single test**: A unit testing framework for the corresponding language.

### he completion items of this hacker loosening plan
**Command line generation**:
  Command line loading yaml configuration content to generate a test code directory for smart contracts.  
**Contract initialization**:
  Verify after loading the smart contract, select Sdk to compile and generate abi interface files.  
**Unit testing detection function**: Call Sdk to test the abi interface, return result assertions, and generate code coverage  
**Scan function after merging**: Configure allowed scan items, rules, mandatory scan items, and generate final report. 

## Logo

![Logo](./assets/logo.png)


- **Demo**




# 中文项目介绍

## 背景
三只猫用于测试和调试的自动化工具以及用于安全审计的智能合约的测试框架。  
可以分为单元测试，帮助开发人员以及测试人员生成测试用例和整个合约流水线的检查结论。
目前的单元测试框架存在以下问题：  
1. 每个步骤需要自己处理  
   三只猫把步骤具备串联的能力，以及使用命令行可生成对应的框架文件。
   通过框架可以完成一次检查的结论，确保单测是否可以被合入。
2. 扩展性不够  
   三只猫可以集成多个SDK和SDK对应语言的断言能力。  
   在单元测试环境可以自由添加检查环节的插件和必备检查项

## 技术架构

**后端**: 使用Java作为主体的语言，其他根据智能合约Sdk框架的语言生成单测模板。  
**单测**: 对应语言的单元测试框架。 

## 本次黑客松计划完成事项
### 功能1：命令行生成`  
  `命令行载入yaml配置内容生成一份智能合约的测试代码目录`
  - [ ] yaml逻辑 (`待定`)
  - [ ] 命令行载入yaml逻辑 (`threeCat -r <指定sdk>.yaml -o <输出文件夹>`)
  - [ ] 生成测试框架文件夹 (`待定`)

### 功能2：合约初始化`  
  `命令行载入yaml配置内容生成一份智能合约的测试代码目录`
  - [ ] 智能合约载入后验证 (`待定`)
  - [ ] 通过参数载入使用编译工具 (`待定`)
  - [ ] 生成abi文件 (`待定`)
  - [ ] 读取abi生成结构化数据 (`待定`)

### 功能3：单元测试检测
`调用Sdk测试abi接口，返回结果断言，生成代码覆盖率`
  - [ ] SDK和Yaml文件匹配 (`待定`)
  - [ ] 发送数据到Sdk再到abi (`待定`)
  - [ ] 不同语言的模板断言方案 (`待定`)
  - [ ] 载入abi结构化数据到模板(`待定`)
  - [ ] 生成代码覆盖率数据 (`代码级别覆盖率`)

### 功能4：合入后进行扫描功能
`配置准出扫描项，规则，必须扫描项，生成最终报告`
  - [ ] 关联覆盖率准出指标 (`指定文件头代码覆盖率不能低于多少，低于不许合入`) 
  - [ ] 读取配置支持的扫描方案 (`待定`)
  - [ ] 配置支持扫描顺序和通过标准 (`待定`)
  - [ ] 扫描方案权重 (`必须包含哪些`)
  - [ ] 生成报告 (`报告类型可选择`)

  
## 队员信息
队伍名称：三只猫  

| Role                    | Name       | Wechat | Github |
|-------------------------|------------| --- | --- |
| Product Manager/Captain | big cat    | lihaizhang2013 |  |
| Developer               | middle cat | xiaozhao129540 |  |
| Developer               | small cat  | pinganmomod1989 |  |
现在需要招募1-2名链上开发队友，欢迎 pinganmomod1989 联系组队。