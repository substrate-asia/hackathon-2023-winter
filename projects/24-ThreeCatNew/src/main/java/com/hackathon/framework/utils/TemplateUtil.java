package com.hackathon.framework.utils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONException;
import com.hackathon.framework.bean.FunctionBean;
//import freemarker.template.*;
//import freemarker.template.Configuration;
//import freemarker.template.Template;
import java.io.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.io.FileWriter;
import java.io.StringWriter;

public class TemplateUtil {

    public static Result toTestTemplate(Object obj,String className,String saveFilePath) throws IOException {
        long startTime = System.nanoTime();
        //错误信息内容
        String errText = "";
        //文件信息内容
        String fileStr = "";

        //判断执行对象
        if (obj instanceof String) {

            //是否为一个文件夹判断
            if(FileUtil.existsFile((String)obj)){
                //是文件，进行读取文件内容
                fileStr = FileUtil.readFileToString(new File((String)obj));

                System.out.println(fileStr);
                if (isJsonContent(fileStr)) {
                    //进行内容解析生成测试文件
                    saveTestFile(fileStr,className,saveFilePath);
                } else {
                    errText = "请求数据格式无法解读，请检查数据内容。";
                }
            }else if (FileUtil.existsDir((String)obj)){

                //判断文件夹中是否存在文件
                List<String> filelist = FileUtil.getAllFile((String)obj,false);
                for (String filep: filelist) {
                    //开始读取文件，进行读取文件内容
                    fileStr = FileUtil.readFileToString(((File) obj));
                    errText = errText + jsonCheckToClass(fileStr, className, saveFilePath)+"|";
                }
            }else if(isJsonContent((String)obj)){
                //如果是json串格式那么就进行验证生成
                System.out.println("到这里开始读取");
                errText = jsonCheckToClass((String)obj, className, saveFilePath);
            }

        }  else if (obj instanceof File) {

            //是文件，进行读取文件内容
            fileStr = FileUtil.readFileToString(((File) obj));
            errText = jsonCheckToClass(fileStr, className, saveFilePath);


        } else {
            errText = "请求数据不符合规定，请检查数据内容。";
        }

        return new Result(startTime,errText,"");
    }

    public static String jsonCheckToClass(String fileStr,String className,String saveFilePath) throws IOException {
        String errText ="";
        if (isJsonContent(fileStr)) {
            //进行内容解析生成测试文件
            saveTestFile(fileStr,className,saveFilePath);

        } else {
            errText = "请求数据格式无法解读，请检查数据内容。";
        }
        return errText;
    }


    //根据符合格式的json数据，生成对应的测试文件
    public static String saveTestFile(String jsonString,String className,String saveFilePath) throws IOException {

        System.out.println(jsonString);
        String errText = "";
        // 创建 FreeMarker 配置
        Configuration configuration = new Configuration(Configuration.VERSION_2_3_31);
        //指定模板存放路径
        configuration.setClassForTemplateLoading(TemplateUtil.class, "/templates/");

        try {
            // 使用 Fastjson 解析 合约请求描述文件，json字符串
            List<FunctionBean> functionInfoList = JSON.parseArray(jsonString, FunctionBean.class);

            // 指定FreeMarker模板
            Template template = configuration.getTemplate("test_template.ftl");
            // 准备数据模型
            Map<String, Object> dataModel = new HashMap<String, Object>();
            dataModel.put("functionInfoList", functionInfoList);
            dataModel.put("classname", className);

            StringWriter out = new StringWriter();
            template.process(dataModel, out);

            System.out.println(out.getBuffer().toString());

            // 输出到文件
            String generatedCode = out.toString();
            String filepath =  saveFilePath+className+".java";

            FileWriter fileWriter = new FileWriter(filepath);
            fileWriter.write(generatedCode);
            out.close();
            fileWriter.close();

            if(!FileUtil.existsFile(filepath)){
                errText = "生成文件失败";
            }

        }catch (Exception e) {
            e.printStackTrace();
            errText = e.getClass().getName();
        }

        return errText;

    }


    //用于验证是否为json格式
    private static boolean isJsonContent(String content) {
        try {
            JSON.parse(content);
            return true;
        } catch (JSONException e) {
            return false;
        }
    }

    public static void main(String[] args) throws IOException, TemplateException {
//        String jsonString = "[{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"x\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"y\",\"type\":\"uint256\"}],\"name\":\"add\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"pure\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"myString\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"}]";
//        String currentProjectPath = System.getProperty("user.dir");
//        String testDirectory = currentProjectPath + "/src/test/java/";
//        String o = "e:/longce/";
        String jsonString = "e:/longce/xushizhao.txt";
        String testDirectory = "e:/longce/";
        toTestTemplate(jsonString,"MyTestClass",testDirectory);

    }




}
