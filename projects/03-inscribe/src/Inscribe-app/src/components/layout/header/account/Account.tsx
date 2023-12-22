import { useState, useEffect, useCallback } from "react";
import { useAccount } from "@gear-js/react-hooks";
import { useNavigate } from "react-router-dom";
import { AccountsModal } from "./accounts-modal";
import { Wallet } from "./wallet";
import "./styles.css";

function Account() {
  const { account, accounts } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedButton, setSelectedButton] = useState("home"); // 追踪被点击的按钮
  const navigate = useNavigate(); // 获取导航函数

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const goToHome = useCallback(
    (button: string) => {
      setSelectedButton(button); // 更新被点击的按钮
      if (button === "home") {
        navigate("/");
      } else if (button === "deploy") {
        navigate("/deploy");
      } else if (button === "Mint") {
        navigate("/Mint");
      } else if (button === "Burn") {
        navigate("/Burn");
      } else if (button === "QueryInscrible") {
        navigate("/QueryInscrible");
      } else if (button === "QueryInscribleByActorId") {
        navigate("/QueryInscribleByActorId");
      } else if (button === "QueryInscribleById") {
        navigate("/QueryInscribleById");
      }
    },
    [navigate]
  );

  useEffect(() => {
    goToHome(selectedButton); // 设置默认选中按钮
  }, [goToHome, selectedButton]);

  return (
    <>
      {account ? (
        <Wallet balance={account.balance} address={account.address} name={account.meta.name} onClick={openModal} />
      ) : (
        <div>
          <button type="button" onClick={() => goToHome("home")} className={selectedButton === "home" ? "home-button active" : "home-button"}>
            home
          </button>
          <button type="button" onClick={() => goToHome("deploy")} className={selectedButton === "deploy" ? "home-button active" : "home-button"}>
            Deploy
          </button>
          <button type="button" onClick={() => goToHome("Mint")} className={selectedButton === "Mint" ? "home-button active" : "home-button"}>
            Mint
          </button>
          <button type="button" onClick={() => goToHome("Burn")} className={selectedButton === "Burn" ? "home-button active" : "home-button"}>
            Burn
          </button>
          <button
            type="button"
            onClick={() => goToHome("QueryInscrible")}
            className={selectedButton === "QueryInscrible" ? "home-button active" : "home-button"}
          >
            QueryInscrible
          </button>

          {/* 头部右侧链接钱包 */}
          <button type="button" onClick={openModal} className="wallet-button">
            Connect Your Wallet
          </button>
        </div>
      )}
      {isModalOpen && <AccountsModal accounts={accounts} close={closeModal} />}
    </>
  );
}

export { Account };
