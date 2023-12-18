package com.hackathon.framework.utils;

import com.jcraft.jsch.ChannelExec;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.Session;

import java.io.*;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

public class SShUtil {
    private String username;
    private String password;
    // ssh有一个session实例
    private Session session = null;

    private String host;

    private String cmd;

    public SShUtil(String username, String password, String host, String cmd) {
        this.username = username;
        this.password = password;
        this.host = host;
    }

    public SShUtil() throws IOException{
        Properties props = new Properties();
        // 读取resources下的config.properties文件
        URL resource = ClassLoader.getSystemResource("config.properties");
        String path = resource == null ? "" : resource.getPath();
        InputStream is = new FileInputStream(path);
        props.load(is);
        this.username = props.getProperty("ssh.username");
        this.password = props.getProperty("ssh.password");
        this.host = props.getProperty("ssh.host");
        this.cmd = props.getProperty("ssh.cmd");
    }

    /**
     * 链接服务器
     * @return
     */
    public Result connectServer() {
        long startTime = System.nanoTime();
        int port = 22;
        // 创建JSch对象
        JSch jSch = new JSch();
        boolean reulst = false;
        String errorMessage = "";
        ChannelExec channelExec = null;
        InputStream inputStream = null;
        List<String> resultLines = new ArrayList<>();
        String resultAbi = null;

        try {
            // 根据主机账号、ip、端口获取一个Session对象
            session = jSch.getSession(this.username, this.host, port);
            // 存放主机密码
            session.setPassword(this.password);
            Properties config = new Properties();
            // 去掉首次连接确认
            config.put("StrictHostKeyChecking", "no");
            session.setConfig(config);
            // 超时连接时间为5秒
            session.setTimeout(5000);
            // 进行连接
            session.connect();

            // session建立连接后，执行shell命令
            channelExec = (ChannelExec) session.openChannel("exec");
            channelExec.setCommand(cmd);
            channelExec.connect();
            // 获取执行结果的输入流
            inputStream = channelExec.getInputStream();
            BufferedReader in = new BufferedReader(new InputStreamReader(inputStream));
            while((resultAbi = in.readLine()) != null) {
                resultLines.add(resultAbi);
            }

            // 获取连接结果
            reulst = session.isConnected();
            if (!reulst) {
                // 链接失败关闭
                session = null;
            }
        } catch (Exception e) {
            errorMessage = e.getMessage();
            System.out.println(errorMessage);
        }
//        String resultMessage = reulst ? "链接服务器成功" : "链接服务器失败";
        return new Result(startTime, errorMessage, resultLines);
    }

    /**
     * 全部用完后关闭服务器，提供给其他人调用
     * @param session
     */
    public void closeServer(Session session) {
        if (session != null && session.isConnected()) {
            session.disconnect();
        }
    }

    public static void main(String[] args) throws IOException {
        Properties props = new Properties();
        // 在读取resources下面的配置一个config.properties的文件
        URL resource = ClassLoader.getSystemResource("config.properties");
        String path = resource == null ? "" : resource.getPath();
        InputStream is = new FileInputStream(path);
        props.load(is);
        String username = props.getProperty("ssh.username");
        String password = props.getProperty("ssh.password");
        String host = props.getProperty("ssh.host");
        System.out.println(username+","+password+","+host);
    }
}