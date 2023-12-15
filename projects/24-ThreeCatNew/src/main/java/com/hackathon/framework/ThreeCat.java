package com.hackathon.framework;
import com.hackathon.framework.bean.StrategyBean;
import com.hackathon.framework.provider.GenerateEngine;
import com.hackathon.framework.provider.impl.GenerateEngineImpl;
import com.hackathon.framework.utils.Result;
import com.hackathon.framework.utils.StrategyConfigUtil;

import javax.swing.*;
import javax.swing.event.DocumentEvent;
import javax.swing.event.DocumentListener;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.io.FileNotFoundException;
import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import java.util.Map;

public class ThreeCat extends JFrame {

    private static Map<String,String>commandMap = new HashMap<>();

    private static String command;

    private static StrategyBean strategy;

    private static Integer successCount =0;


    /**
     * 初始化选择框界面
     * @return
     * @throws FileNotFoundException
     * @throws InvocationTargetException
     * @throws IllegalAccessException
     */
    private String[] initComboBox() throws FileNotFoundException, InvocationTargetException, IllegalAccessException {
        strategy = StrategyConfigUtil.getStrategy("guiCommand");
        commandMap = strategy.getComboBox();
        setTitle("三只猫智能合约测试");
        setSize(400, 200);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        String[] s1 = commandMap.keySet().toArray(new String[0]);
        String[] s2 = new String[s1.length+1];
        s2[0] = "";
        if (s1.length - 1 >= 0) {
            System.arraycopy(s1, 0, s2, 1, s2.length - 1);
        }
        return s2;
    }

    public ThreeCat() throws FileNotFoundException, InvocationTargetException, IllegalAccessException {
        // 通过Yaml配置
        String[] s2 = this.initComboBox();
        JLabel errologs = new JLabel("");
        JComboBox<String> commandComboBox = new JComboBox<>(s2);
        JTextField commandTextField = new JTextField();
        commandTextField.setColumns(30);
        commandComboBox.addItemListener(new ItemListener() {
            @Override
            public void itemStateChanged(ItemEvent e) {
                if (e.getStateChange() == ItemEvent.SELECTED) {
                    String selected = (String)commandComboBox.getSelectedItem();
                    // 替换字符串模板
                    commandTextField.setText(commandMap.get(selected));
                }
            }
        });
        commandTextField.getDocument().addDocumentListener(new DocumentListener() {
            @Override
            public void insertUpdate(DocumentEvent e) {
                onChange();
            }
            @Override
            public void removeUpdate(DocumentEvent e) {
                onChange();
            }
            @Override
            public void changedUpdate(DocumentEvent e) {
                onChange();
            }
            private void onChange() {
                command = commandTextField.getText();
            }
        });

        JButton runButton = new JButton("action");
        runButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                GenerateEngine generateEngine = new GenerateEngineImpl();
                System.out.println(command);
                if (command.contains("init")) {
                    String parameter = command.replace("init","").trim();
                    System.out.println(parameter);
                    try {
                        strategy = StrategyConfigUtil.getStrategy("generateEngine");
                    } catch (FileNotFoundException | InvocationTargetException | IllegalAccessException ex) {
                        throw new RuntimeException(ex);
                    }
                    // command里面就代表了详细情况。
                    Result initDirResult = generateEngine.initDirectory(parameter,strategy.getDirectory());
                    if(initDirResult.getHasError().isEmpty()){
                        successCount +=1;
                    }
                }else if (command.contains("compile --coverage")){
                    // 生成覆盖率，参数需要指定
                }else if (command.contains("genTest")){
                    // 生成单测测试用例，需要添加断言
                }else{
                    errologs.setText("Unknown command: " + command);
                }
            }
        });
        // 主面板，使用垂直BoxLayout布局 后续美化
        JPanel mainPanel = new JPanel();
        mainPanel.setLayout(new BoxLayout(mainPanel, BoxLayout.Y_AXIS));
        mainPanel.add(new JLabel("按顺序流程选择一个方式:"));
        mainPanel.add(commandComboBox);
        mainPanel.add(new JLabel("完善下面的命令行<替换里面的参数>:"));
        mainPanel.add(commandTextField);
        mainPanel.add(new JLabel("命令行执行:"));
        mainPanel.add(runButton);
        add(mainPanel);
    }



    public static void main(String[] args) throws FileNotFoundException, InvocationTargetException, IllegalAccessException {
        // swing启动器
        SwingUtilities.invokeLater(new Runnable() {
            public void run() {
                try {
                    new ThreeCat().setVisible(true);
                } catch (FileNotFoundException | InvocationTargetException | IllegalAccessException e) {
                    throw new RuntimeException(e);
                }
            }
        });
    }
}
