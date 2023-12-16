<#-- 定义一个空列表 -->
<#assign paramslist = []>
<#assign functionlist = []>


<#-- 在后续方法中添加值 -->
<#macro addValueToList value>
    <#assign paramslist = paramslist + [value]>
</#macro>

<#macro addFunctionToList value>
    <#assign functionlist = functionlist + [value]>
</#macro>



public class ${classname} {
<#list functionInfoList as functionInfo>
    <#assign params = "">
    <#assign outparam = "">
    <#assign paramsname ="">
    <#list functionInfo.inputs as input>
        <#assign paramsname = paramsname+input.name+",">
        <#if input.type == "uint256">
            <#assign params = params + "Integer  "+ input.name+",">
        <#-- 使用宏添加值到列表 -->
            <@addValueToList "Integer "+input.name+"= 1000000;"/>
        <#elseif input.type == "string">
            <#assign params = params + "String  "+ input.name+",">
        <#-- 使用宏添加值到列表 -->
            <@addValueToList "String "+input.name+"= 'testString';"/>
        </#if>
    </#list>
    <#list functionInfo.outputs as output>
        <#if output.type == "uint256">
            <#assign outparam = "Integer" >
        <#elseif output.type == "string">
            <#assign outparam = "String">
        </#if>
    </#list>
    <@addFunctionToList classname+"."+functionInfo.name+"Test("+paramsname?remove_ending(",")+");"/>

    public static ${outparam! "void"} ${functionInfo.name}Test(${params?remove_ending(",")}) {
    //请求${functionInfo.name}方法
    <#if outparam?has_content>
        <#if outparam = "Integer">
            return new ${outparam}(10) ;
        <#elseif outparam = "String">
            return new ${outparam}() ;
        </#if>
    </#if>
    }
</#list>

   public static void main(String[] args){
    <#-- 遍历列表 -->
    <#list paramslist as item>
        ${item}
    </#list>

    <#list functionlist as functionitem>
        ${functionitem}
    </#list>
    }
}
