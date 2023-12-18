package com.hackathon.framework.utils.web3;

import com.hackathon.framework.bean.ScanInputDto;
import com.hackathon.framework.utils.FileUtil;
import com.hackathon.framework.utils.Result;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;
import com.hackathon.framework.config.ProductionConfig;
import org.web3j.tx.Contract;
import org.web3j.tx.ManagedTransaction;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;

/**
 * web3操作
 */
public class Web3JOperate {

    private Credentials credentials;

    private final Web3j web3j;

    /**
     * Web3j初始化
     */
    public Web3JOperate(){
        web3j = Web3j.build(new HttpService(ProductionConfig.networkAddress()));
    }

    /**
     * 获取凭据
     * @throws IOException
     * @throws InvocationTargetException
     * @throws IllegalAccessException
     */
    public void getCredentials() throws IOException, InvocationTargetException, IllegalAccessException {
        credentials =Credentials.create(ProductionConfig.contractAddress());
    }

    /**
     * Solidity合约
     * @return
     * @throws FileNotFoundException
     * @throws InvocationTargetException
     * @throws IllegalAccessException
     */
    public SolidityReputation loadSolidityReputation() throws FileNotFoundException, InvocationTargetException, IllegalAccessException {
        return SolidityReputation.load(ProductionConfig.contractAddress(), web3j, credentials,
                ManagedTransaction.GAS_PRICE, Contract.GAS_LIMIT);
    }

    public Result scan(ScanInputDto inputDto){
        long startTime = System.nanoTime();
        String path = new File(ProductionConfig.STR_CONTRACTS).getAbsolutePath() + File.separator + inputDto.getAppid();
        // clear folder
        FileUtil.deleteFiles(path);
        // unzip
        FileUtil.zipBase64ToFile(inputDto.getSource(), path);
        // check sol files
        String solPath = path + File.separator + ProductionConfig.STR_CONTRACTS;
        File solFileList = new File(solPath);
        File[] solFiles = solFileList.listFiles();
        if (solFiles == null || solFiles.length == 0) {
            System.out.println("没有sol文件.");
        }
        String resultPath = path + File.separator + ProductionConfig.STR_CHECK_RESULT;
        String command = String.format(ProductionConfig.BASE_COMMAND, resultPath, solPath);
        // shell execute command,path
        // get result
        String result = FileUtil.readFile(resultPath);

        // 代码逻辑待补
        return new Result(startTime,"","");
    }


}
