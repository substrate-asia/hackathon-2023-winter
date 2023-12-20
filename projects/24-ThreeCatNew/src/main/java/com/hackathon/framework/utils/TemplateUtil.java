package com.hackathon.framework.utils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONException;
import com.hackathon.framework.bean.FunctionBean;
import com.hackathon.framework.bean.SolBean;
import com.hackathon.framework.bean.StrategyBean;
import freemarker.template.*;
import freemarker.template.Configuration;
import freemarker.template.Template;

import java.io.*;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.io.FileWriter;
import java.io.StringWriter;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.hackathon.framework.bean.FunctionBean.AbiItem;


/**
 * 自动化模板生成工具类
 */
public class TemplateUtil {

    private final static Map<String, List<String>> assertionMap = new HashMap<>();

    static {
        assertionMap.put("jest", Arrays.asList("js","function","return"));
    }
    
    /**
     * 读取abi文件以及sol文件生成对应的SolBean对象
     *
     * @param abiPath      abi文件地址
     * @param abiPath      solPath文件址
     * @param saveFilePath js文件存储地址
     * @return Result
     * @throws IOException
     */

    public static Result toTestTemplate(String abiPath, String solPath, String saveFilePath) throws IOException {

        long startTime = System.nanoTime();
        //错误信息内容
        StringBuilder errText = new StringBuilder();
        //文件信息内容
        String fileStr = "";

        //判断文件夹中是否存在文件
        List<String> filelist = FileUtil.getAllFile(abiPath, false);
        for (String filep : filelist) {
            SolBean solBean = new SolBean();
            File f = new File(filep);
            //标记abi名称
            solBean.setAbiName(f.getName());
            //开始读取文件，进行读取文件内容
            fileStr = FileUtil.readFileToString(f);
            errText.append(jsonCheckToClass(fileStr, solBean, solPath)).append("|");
            System.out.println(JSON.toJSONString(solBean));
            saveTestFile(solBean, saveFilePath);
        }

        return new Result(startTime, errText.toString(), "");
    }


    /**
     * 通过SolBean对象生成对应的测试脚本
     *
     * @param solBean      脚本对象
     * @param saveFilePath js文件存储地址
     */
    public static Result saveTestFile(SolBean solBean, String saveFilePath) {
        // 创建 FreeMarker 配置
        long startTime = System.nanoTime();
        String errorMessage = "";
        Configuration configuration = new Configuration(Configuration.VERSION_2_3_31);
        //指定模板存放路径
        String filepath = "";
        configuration.setClassForTemplateLoading(TemplateUtil.class, "/templates/");
        try {
            // 指定FreeMarker模板
            StrategyBean strategy = StrategyConfigUtil.getStrategy("generateEngine");
            Template template = configuration.getTemplate(strategy.getAssertionName() + ".ftl");
            // 准备数据模型 框架第二期版本抽象
            Map<String, Object> dataModel = new HashMap<String, Object>();
            dataModel.put("solBean", solBean);
            dataModel.put("testname", solBean.getAbiName().replace(".json", "") + "Test");
            StringWriter out = new StringWriter();
            template.process(dataModel, out);
            System.out.println(out.getBuffer().toString());
            // 输出到文件
            String generatedCode = out.toString();
            filepath = saveFilePath + solBean.getAbiName() + "." + assertionMap.get(strategy.getAssertionName()).get(0);
            FileWriter fileWriter = new FileWriter(filepath);
            fileWriter.write(generatedCode);
            out.close();
            fileWriter.close();
            if (!FileUtil.existsFile(filepath)) {
                errorMessage = "生成文件失败";
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new Result(startTime, errorMessage, filepath);
    }

    /**
     * 验证abi文件合法性，如果文件可解析，进行测试对象解析
     *
     * @param solBean 脚本对象
     * @param fileStr 文件内容
     * @param solPath sol文件地址
     * @return Result
     */
    public static String jsonCheckToClass(String fileStr, SolBean solBean, String solPath) throws IOException {
        String errText = "";
        if (isJsonContent(fileStr)) {
            //进行内容解析生成测试文件
            getTestObject(fileStr, solBean, solPath);
        } else {
            errText = "请求数据格式无法解读，请检查数据内容。";
        }
        return errText;
    }


    //根据符合格式的json数据，生成对应的测试文件对象
    public static String getTestObject(String jsonString, SolBean solBean, String solPath) throws IOException {

        String errText = "";

        try {
            // 使用 Fastjson 解析 合约请求描述文件，json字符串
//            List<FunctionBean> functionInfoList = JSON.parseArray(jsonString, FunctionBean.class);
            FunctionBean functionBean = JSON.parseObject(jsonString, FunctionBean.class);
//            System.out.println(functionBean.getContractName());
//            System.out.println(functionBean.getAbi().size());

//            从sol文件中获取所有function 对象
            Map<String, Integer> keyValueMap = extractFunctionLines(solPath);

            //循环与sol文件中的方法进和匹配，如果文件中的方法，没有inputs和outputs 就以sol文件为准
            //如果
            for (AbiItem abiItems : functionBean.getAbi()) {
                if (abiItems.getType().equals("function")) {
                    String findstr = findMapKey(keyValueMap, abiItems.getName());
                    System.out.println(abiItems.getName());
                    System.out.println("判断abi中的function是否在sol文件中" + findstr);
//                    在sol文件中找到对应的方法
                    if (findstr.length() > 0) {
                        //key所对应的类型
                        Integer keytype = keyValueMap.get(findstr);
                        //如果是public定义，就以abi为准
                        if (keytype == 2) {
                            abiItems.setMeg("TODO:public定义的方法，请自行补充");
                        }//如果是function定义，判断sol的参数，以sol为主
                        else if (keytype == 1) {
                            System.out.println("这些是方法：" + findstr);
                            System.out.println("这些是方法中返回值：" + abiItems.getOutputs().size());
                            if (abiItems.getOutputs().size() > 0) {
                                //如果输出的值name为null那么就随机生一个定义
                                if (abiItems.getOutputs().get(0).getName().length() == 0) {
                                    //获取abi中retrun的值
                                    String outstr = getOutputs(findstr);
                                    //如果 存在空格，说明是有参数的，无空格说明只是有返回类型,需要定义一个返回参数
                                    if (containsSpace(outstr)) {
//                                        System.out.println("=============未字义的值==============="+abiItems.getOutputs().get(0).getName());
                                        //将参数值定义
                                        abiItems.getOutputs().get(0).setName(outstr.substring(outstr.indexOf(" "), outstr.length()));

                                    } else {
//                                        System.out.println("=============有返回值，但只有类型===============");
                                        abiItems.getOutputs().get(0).setName("usrOutputV" + abiItems.getOutputs().get(0).getType());
                                    }
//                                    System.out.println("=============字义的值==============="+abiItems.getOutputs().get(0).getName());
                                }
                            }
//                            System.out.println("这些是方法中入参："+abiItems.getInputs().size());
                            //使用正则表达式提取参数信息
                            String[] extractedParameters = getInputs(findstr);
                            System.out.println("这些是sol方法中入参：" + extractedParameters.length);
                            //进行入参abi和sol文件对比验证
                            if (abiItems.getInputs().size() < extractedParameters.length) {

                                String inputv = "";
                                // 输出提取的参数
                                for (String parameter : extractedParameters) {
                                    inputv = inputv + parameter;
                                }
                                // abi中无参数，但sol有参数，生成TODO给用户提示
                                abiItems.setMeg("TODO: 代码中入参提示，如果需要请自行补充" + inputv);
                            }
                        }
                    }
                }
            }
            //将值放入到上下文中
            solBean.setFunctionBean(functionBean);
        } catch (Exception e) {
            e.printStackTrace();
            errText = e.getClass().getName();
        }
        return errText;

    }

    //将所有带有function的行，存入map
    //1表示，function方法 2表示，隐式的public 方法
    private static Map<String, Integer> extractFunctionLines(String filePath) throws IOException {
        BufferedReader reader = new BufferedReader(new FileReader(filePath));
        String line;

        // 创建一个HashMap实例
        Map<String, Integer> keyValueMap = new HashMap<>();
        while ((line = reader.readLine()) != null) {
            // 使用 contains 方法检查行中是否包含关键字 "function"
            if (line.contains("function")) {
                // 处理包含关键字 "function" 的行，这里只是简单地打印到控制台
                //提取符合 "function xxx()" 或者 "function xxx( xxx)" 规律的字符串
                String pattern = "function\\s+\\w+\\([^)]*\\)\\s*\\{|function\\s+\\w+\\(";
                Pattern regex = Pattern.compile(pattern);
                Matcher matcher = regex.matcher(line);
                if (matcher.find()) {
                    keyValueMap.put(line, 1);
                }

            }
            if (line.contains("public")) {
                keyValueMap.put(line, 2);
            }

        }
        reader.close();
        return keyValueMap;
    }

    /**
     * 检查Map关键字
     * @param keyValueMap
     * @param findstr
     * @return
     */
    private static String findMapKey(Map<String, Integer> keyValueMap, String findstr) {
        String str = "";
        for (Map.Entry<String, Integer> entry : keyValueMap.entrySet()) {
            //做一个空格处理，用于区别一下参数类型
            if (entry.getKey().contains(" " + findstr + ";") || entry.getKey().contains(" " + findstr + "(")) {
                str = entry.getKey();
            }

        }
        return str;
    }

    /**
     * 用于验证是否为json格式
     * @param content
     * @return
     */
    private static boolean isJsonContent(String content) {
        try {
            JSON.parse(content);
            return true;
        } catch (JSONException e) {
            return false;
        }
    }


    // 使用正则表达式提取入参信息
    private static String[] getInputs(String inputString) {
        if (inputString.indexOf("returns") > 0) {
            inputString = inputString.substring(0, inputString.indexOf("returns"));
        }
        String regex = "\\(([^)]+)\\)";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(inputString);

        if (matcher.find()) {
            String parameters = matcher.group(1);
            return parameters.split(",");
        }
        return new String[0];
    }

    // 使用正则表达式提取 返回值
    private static String getOutputs(String inputString) {
        String regex = "returns\\s*\\(([^)]+)\\)";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(inputString);

        if (matcher.find()) {
            return matcher.group(1);
        }
        return "";
    }

    // 使用正则表达式匹配任何空白字符，包括空格、制表符和换行符
    private static boolean containsSpace(String str) {
        Pattern pattern = Pattern.compile("\\s");
        Matcher matcher = pattern.matcher(str);
        // 返回是否找到匹配
        return matcher.find();
    }

    public static void main(String[] args) throws IOException, TemplateException {
//        String jsonString = "[{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"x\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"y\",\"type\":\"uint256\"}],\"name\":\"add\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"pure\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"myString\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"}]";
//        String currentProjectPath = System.getProperty("user.dir");
//        String testDirectory = currentProjectPath + "/src/test/java/";
//        String o = "e:/longce/";
        String abiPath = "D:\\hackathon-2023-winter\\projects\\27-NeMA\\src\\otc\\build\\contracts";
        String currentProjectPath = System.getProperty("user.dir");
        String saveFilePath = currentProjectPath + "/src/main/resources/templates/";
        String solPath = "D:\\hackathon-2023-winter\\projects\\27-NeMA\\src\\otc\\contracts\\Lottery.sol\\";
        toTestTemplate(abiPath, solPath, saveFilePath);
    }


}
