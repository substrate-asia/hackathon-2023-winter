package com.hackathon.framework.utils;

import com.hackathon.framework.config.ProductionConfig;
import com.jcraft.jsch.*;

import java.io.*;
import java.net.URL;
import java.util.Properties;
import java.util.Vector;

public class SshUtil {
    private final String username;
    private final String password;
    // ssh有一个session实例
    public Session session = null;

    private final String host;

    public SshUtil(){
        this.username = ProductionConfig.getUserName();
        this.password = ProductionConfig.getPassWord();
        this.host = ProductionConfig.networkAddress();
        connectServer();
    }

    /**
     * 链接服务器
     * @return
     */
    public void connectServer() {
        int port = 22;
        // 创建JSch对象
        JSch jSch = new JSch();
        boolean reulst = false;
        String errorMessage = "";

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
    }

    /**
     * 执行命令行
     * @param cmd
     * @return
     * @throws JSchException
     * @throws IOException
     * @throws InterruptedException
     */
    public String executeCmd(String cmd) throws JSchException, IOException, InterruptedException {
        // session建立连接后，执行shell命令
        ChannelExec channelExec = (ChannelExec) session.openChannel("exec");
        channelExec.setCommand(cmd);
        channelExec.connect();
        // 获取执行结果的输入流
        StringBuilder output = new StringBuilder();
        byte[] buffer = new byte[1024];
        while (channelExec.getExitStatus() == -1) {
            while (channelExec.getInputStream().available() > 0) {
                int bytesRead = channelExec.getInputStream().read(buffer);
                output.append(new String(buffer, 0, bytesRead));
            }
            Thread.sleep(100);
        }
        channelExec.disconnect();
        return output.toString();
    }


    /**
     * 获取服务器当前路径下的文件和文件夹
     * @return
     * @throws JSchException
     * @throws SftpException
     */
    public String getFolder() throws JSchException, SftpException{
        Channel channel = session.openChannel("sftp");
        channel.connect();
        ChannelSftp sftpChannel = (ChannelSftp) channel;
        // 获取当前路径下的文件及文件夹
        Vector<ChannelSftp.LsEntry> entries = sftpChannel.ls("./");
        // 遍历文件和文件夹
        return entries.toString();
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