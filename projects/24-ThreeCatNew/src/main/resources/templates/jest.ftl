describe('${testname}', () => {
let ${solBean.functionBean.contractName};
<!-- 获取出所有方法 -->
<#list solBean.functionBean.abi as functionInfo>
<#assign params = "">
<#if functionInfo.name?has_content && functionInfo.type = "function">
    it('${solBean.functionBean.contractName}.${functionInfo.name}Test', async () => {
<#--    const ${solBean.functionBean.contractName} = artifacts.require('${solBean.functionBean.contractName}')-->
        const ${solBean.functionBean.contractName?lower_case} = await ${solBean.functionBean.contractName}.deploy()
    <#list functionInfo.inputs as input>
<#if input.name?has_content>
    <#if input.type == 'bool'>
        let ${input.name} = true
<#--        assert.equal(typeof ${input.name} === 'boolean',"参数应为布尔类型")-->
        expect(${input.name}).toBeBoolean();
    <#elseif input.type == 'address'>
        let ${input.name} = 'teststring'
<#--        assert.equal(typeof ${input.name} === 'string',"参数应为字符串类型")-->
        expect(${input.name}).toBeString();
    <#elseif input.type == 'uint256'>
        let ${input.name} = 10000000000
<#--        console.assert(typeof ${input.name} === 'number', '参数应数值类型');-->
        expect(${input.name}).toBeNumber();
    <#elseif input.type == 'address[]'>
        let ${input.name} = ['test1','test2']
<#--        console.assert(Array.isArray(${input.name}), '参数应为数组类型');-->
        expect(${input.name}).toBeArray();
    </#if>
    <#assign params = params +  input.name+",">
<#else>
    <#if input.type == 'bool'>
        let inputv = true
<#--        assert.equal(typeof inputv === 'boolean',"返回结果应为布尔类型")-->
        expect(inputv).toBeBoolean();
    <#elseif input.type == 'address'>
        let inputv = 'teststring'
<#--        assert.equal(typeof inputv === 'string',"返回结果应为字符串类型")-->
        expect(inputv).toBeString();
    <#elseif input.type == 'uint256'>
        let inputv = 10000000000
<#--        console.assert(typeof inputv === 'number', '返回结果应数值类型');-->
        expect(inputv).toBeNumber();
    <#elseif input.type == 'address[]'>
        let inputv = ['test1','test2']
<#--        console.assert(Array.isArray(inputv), '返回结果应为数组类型');-->
        expect(inputv).toBeArray();
    </#if>
    <#assign params = params +"inputv"+",">
</#if>
    </#list>
<#if functionInfo.outputs?size gt 0>
    <#if functionInfo.outputs[0].name?has_content>
        const ${functionInfo.outputs[0].name} = await  ${solBean.functionBean.contractName?lower_case}.${functionInfo.name}(${params?remove_ending(",")})
        <#if functionInfo.outputs[0].type == 'bool'>
<#--        assert.equal(typeof result === 'boolean',"返回结果应为布尔类型")-->
        expect(${functionInfo.outputs[0].name}).toBeBoolean();
        <#elseif functionInfo.outputs[0].type == 'address'>
<#--        assert.equal(typeof result === 'string'，"返回结果应为字符串类型")-->
        expect(${functionInfo.outputs[0].name}).toBeString();
        <#elseif functionInfo.outputs[0].type == 'uint256'>
<#--        console.assert(typeof result === 'number', '返回结果应数值类型');-->
        expect(${functionInfo.outputs[0].name}).toBeNumber();
        <#elseif functionInfo.outputs[0].type == 'address[]'>
<#--        console.assert(Array.isArray(result), '返回结果应为数组类型');-->
        expect(${functionInfo.outputs[0].name}).toBeArray();
        </#if>
    <#else>
        await  ${solBean.functionBean.contractName?lower_case}.${functionInfo.name}(${params?remove_ending(",")})
    </#if>
<#else >
        await  ${solBean.functionBean.contractName?lower_case}.${functionInfo.name}(${params?remove_ending(",")})
</#if>
  });
    </#if>
</#list>
});