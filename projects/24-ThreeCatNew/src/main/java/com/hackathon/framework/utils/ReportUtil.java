package com.hackathon.framework.utils;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


public class ReportUtil {

    public static List<Result>resultList = new ArrayList<>();

    public static void recordResult(Result result){
        resultList.add(result);
    }

    public static void clearReport(){
        resultList.clear();
    }

    /**
     * 根据步骤特征匹配出测试用例名称
     * @param index 索引位置
     * @param result 其他方法回传给我的
     * @return
     */
    public static String featureMatchForCaseTitle(Integer index,Object result){
        // TODO 传完流程一起补
        return "";
    }

    /**
     * 生成测试报告
     * @param reportMode 测试模式
     * @param reportPath 从base.yaml里面读取出来的
     */
    public static Boolean generateReportHtml(String reportMode,String reportPath){
        // TODO 样式后续美化，开始构建HTML内容
        if(reportPath.isEmpty()){
            // 非一个地区使用要用非时区的
            LocalDateTime now = LocalDateTime.now();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HHmmss");
            String formattedNow = now.format(formatter);
            reportPath = formattedNow+"."+reportMode;
        }
        StringBuilder reportContent = new StringBuilder();
        if(reportMode.equals("html")){
            reportContent.append("<html><body>");
            reportContent.append("<table border='1'>");
            reportContent.append("<tr><th>Case Name</th><th>Execution Time</th><th>Error</th><th>Result</th></tr>");
            for (int i = 0; i < resultList.size(); i++) {
                Result result = resultList.get(i);
                // 根据特征和条件判断匹配出用例名称
                String caseTitle = featureMatchForCaseTitle(i,result.getResult());
                reportContent.append("<tr>");
                reportContent.append("<td>").append(caseTitle).append("</td>");
                reportContent.append("<td>").append(result.getExecutionTime()).append("</td>");
                reportContent.append("<td>").append(result.getHasError()).append("</td>");
                reportContent.append("<td>").append(result.getResult()).append("</td>");
                reportContent.append("</tr>");
            }
            reportContent.append("</table>");
            reportContent.append("</body></html>");
            try (FileWriter writer = new FileWriter(reportPath)) {
                writer.write(reportContent.toString());
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else if (reportMode.equals("json")) {
//            ObjectMapper objectMapper = new ObjectMapper();
//            try {
//                objectMapper.writeValue(new File(reportPath), results);
//            } catch (IOException e) {
//                e.printStackTrace();
//            }
        }
        return FileUtil.existsFile(reportPath);
    }

    /**
     * 执行测试用例文件
     * @param srcJavaPath 目标路径
     * @param reportPath 报告路径
     * @return
     */
    public static Result runCaseFiles(String srcJavaPath,String reportPath) {
        long startTime = System.nanoTime();
        File dir = new File(srcJavaPath);
        File[] files = dir.listFiles((d, name) -> name.endsWith(".java"));
        if (files != null) {
            for (File file : files) {
                try {
                    // 编译Java文件
                    ProcessBuilder compileBuilder = new ProcessBuilder("javac", file.getAbsolutePath());
                    Process compileProcess = compileBuilder.start();
                    // 这里可能需要改成waitFor(30,时间单位为秒)
                    int compileExitCode = compileProcess.waitFor();
                    if (compileExitCode == 0) {
                        // Get the class name
                        String className = file.getName().replace(".java", "");
                        // Run the Java file
                        ProcessBuilder runBuilder = new ProcessBuilder("java", "-cp", srcJavaPath, className);
                        Process runProcess = runBuilder.start();
                        int runExitCode = runProcess.waitFor();
                        System.out.println("Exit code for " + className + ": " + runExitCode);
                    } else {
                        // 有一个失败就返回
                        return new Result(startTime,"Compilation failed for " + file.getName(),"");
                    }
                } catch (IOException | InterruptedException e) {
                    e.printStackTrace();
                }
            }
            return new Result(startTime,"",reportPath);
        }
        return new Result(startTime,srcJavaPath+"目录下面检索.java文件失败","");
    }
}
