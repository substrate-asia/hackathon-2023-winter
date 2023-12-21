import React, { useEffect, useState } from "react";
import { Input, Select, Button, Modal, Spin } from "antd";
import classes from "./style.module.less";
import { createWalletClient, custom, createPublicClient } from "viem";
import { useWaitForTransaction, useNetwork } from "wagmi";
import VaultFactory from "../../ABI/VaultFactory.json";
import { defineChain } from 'viem';
import ErrorModal from "../../components/ErrorModal/ErrorModal";
import { useAccount } from "wagmi";

let walletClient: any;
const rule = /^[a-zA-Z0-9]{3,50}$/;
const CreateVaultPage = () => {
  const options = [
    { value: JSON.parse(localStorage.getItem("DAIToken") as any).address, label: "DAI" },
  ];
  const [createObj, setCreateObj] = useState({
    name: "",
    symbol: "",
    asset: JSON.parse(localStorage.getItem("DAIToken") as any).address,
  });
  const createContractAddress = JSON.parse(localStorage.getItem("VaultFactoryAddress") as any).address
  const [hash, setHash] = useState("" as any);
  const { data, isError, isLoading, isSuccess } = useWaitForTransaction({
    hash: hash,
  });
  const { address } = useAccount()
  const [createModal, setCreateModal] = useState(false);
  const [createTradeStaus, setCreateTradeStaus] = useState(true);
  const [errorModal, setErrorModal] = useState(false);
  const [errrorMessage, setErrorMessage] = useState({} as any);
  const [chainId, setChainId] = useState(0);
  const [nameStatus, setNameStatus] = useState(true);
  const [symbolStatus, setSymbolStatus] = useState(true);
  const [chainInfo, setChainInfo] = useState({} as any)
  const [modalOkLoading, setModalOkLoading] = useState(false)
  const init = async () => {
    const data = JSON.parse(localStorage.getItem("chainInfo") as any);
    let chain = defineChain({
      facuetsUrl: data.chainConf.faucetUrl,
      id: data.chainConf.chainId,
      name: data.chainConf.networkName,
      network: data.chainConf.networkName,
      nativeCurrency: {
        name: data.chainConf.currencySymbol,
        symbol: data.chainConf.currencySymbol,
        decimals: 18,
      },
      rpcUrls: {
        default: {
          http: [data.chainConf.rpcUrl],
          webSocket: [],
        },
        public: {
          http: [data.chainConf.rpcUrl],
          webSocket: [],
        },
      },
      blockExplorers: {
        default: {
          name: data.chainConf.blockExplorer,
          url: data.chainConf.blockExplorer,
        },
      },
    });
    setChainInfo(chain)
    walletClient = createWalletClient({
      chain: chain,
      transport: custom(window.ethereum as any),
    });
    localStorage.setItem("address", JSON.stringify([address]));
  };
  const { chain, chains } = useNetwork();
  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (chain) {
      setChainId(chain.id);
    } else {
      setChainId(0);
    }
  }, [chain]);

  const createNewVault = async () => {
    setModalOkLoading(true)
    console.log(createObj.asset);
    try {
      const hash = await walletClient.writeContract({
        address: createContractAddress,
        abi: VaultFactory,
        functionName: "createNewVault",
        args: [createObj.name, createObj.symbol, createObj.asset, 100],
        account: address,
      });
      setHash(hash);
      setCreateTradeStaus(false);
      setModalOkLoading(false)
    } catch (e) {
      console.log(e);
      setErrorModal(true);
      setModalOkLoading(false)
      setErrorMessage(JSON.parse(JSON.stringify(e)));
    }
  };
  useEffect(() => {
    if (isSuccess) {
      setCreateTradeStaus(false);
    }
  }, [isSuccess]);
  return (
    <>
      <ErrorModal
        setErrorModal={setErrorModal}
        errorModal={errorModal}
        errrorMessage={errrorMessage}
      />
      {chainId === chainInfo.id ? (
        <div className={classes.createCreateVaultBox}>
          <div className={classes.createCreateInfoBox}>
            <div className={classes.createItem}>
              <div className={classes.title}>Name</div>
              <Input
                onChange={(e) => {
                  setCreateObj({ ...createObj, name: e.target.value });
                }}
                status={!nameStatus ? "error" : ""}
                onBlur={(e) => {
                  if (!e.target.value) return;
                  setNameStatus(rule.test(e.target.value));
                }}
              />
              {!nameStatus && (
                <div
                  style={{
                    color: "#dc4446",
                  }}
                >
                  Name does not meet the requirements (3-50 characters).
                </div>
              )}
            </div>
            <div className={classes.createItem}>
              <div className={classes.title}>Symbol</div>
              <Input
                onChange={(e) => {
                  setCreateObj({ ...createObj, symbol: e.target.value });
                }}
                status={!symbolStatus ? "error" : ""}
                onBlur={(e) => {
                  if (!e.target.value) return;
                  setSymbolStatus(rule.test(e.target.value));
                }}
              />
              {!symbolStatus && (
                <div
                  style={{
                    color: "#dc4446",
                  }}
                >
                  Symbol does not meet the requirements (3-50 characters).
                </div>
              )}
            </div>
            <div className={classes.createItem}>
              <div className={classes.title}>Denomination Asset</div>
              <Select
                defaultValue={JSON.parse(localStorage.getItem("DAIToken") as any).address}
                options={options}
                onChange={(v) => {
                  setCreateObj({ ...createObj, asset: v });
                }}
              />
            </div>
            <div className={classes.createBtn}>
              <Button
                disabled={
                  createObj.name === "" ||
                  createObj.symbol === "" ||
                  !nameStatus ||
                  !symbolStatus
                }
                onClick={() => {
                  setCreateModal(true);
                }}
              >
                Create
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className={classes.noLoginBox}>
          Please connect to wallet and switch to the {JSON.parse(localStorage.getItem("chainInfo") as any).chainConf.networkName}
        </div>
      )}
      {/*Modal*/}
      <div>
        <Modal
          open={createModal}
          onOk={() => {
            setHash("");
            if (isSuccess) {
              setCreateTradeStaus(true);
              setCreateModal(false);
              return;
            }
            createNewVault();
          }}
          confirmLoading={modalOkLoading}
          onCancel={() => {
            setHash("");
            setCreateTradeStaus(true);
            setCreateModal(false);
            setModalOkLoading(false)
          }}
          maskClosable={false}
          cancelButtonProps={{
            style: {
              display: isLoading ? "none" : "",
            },
          }}
          okButtonProps={{
            style: {
              display: isLoading ? "none" : "",
            },
          }}
          closeIcon={false}
          centered
        >
          {createTradeStaus && (
            <div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}
              >
                Create Active Fund
              </div>
              <div>
                Create a new active fund named {createObj.name} with symbol{" "}
                {createObj.symbol} and denomination asset DAI.
              </div>
            </div>
          )}
          {isLoading && (
            <div className={classes.createFundSpinContainer}>
              <Spin />
              <div className={classes.spinLoadingText}>
                Creating an active fund...
              </div>
            </div>
          )}
          {isSuccess && (
            <>
              <div className={classes.createModalText}>
                Successfully created an active fund! You can find it in "Invest
                in Fund".
              </div>
            </>
          )}
        </Modal>
      </div>
    </>
  );
};
export default CreateVaultPage;
