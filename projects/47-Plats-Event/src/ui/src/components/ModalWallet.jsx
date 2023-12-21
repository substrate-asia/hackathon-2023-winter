import { memo, useEffect } from "react";
import { useWallet, useAllWallets } from "useink";
import { sortWallet } from "../utils/sortWallet";

const ModalWallet = ({ setCurrentAccount, handleModal }) => {
  const { account, connect } = useWallet();
  let wallets = useAllWallets();
  wallets = sortWallet(wallets);

  useEffect(() => {
    if (account?.address) {
      setCurrentAccount(account.address);
    }
  }, [account?.address]);

  if (!account) {
    return (
      <div className="bg-[#00000099] fixed inset-0 z-50 flex items-center justify-center">
        <div className="w-[300px] h-[340px] md:w-[500px] md:h-[500px] bg-[#512B81] rounded-2xl absolute top-[25%] py-2 px-4">
          <div style={{ padding: "0 6px" }}>
            <h1 className="text-white text-[16px] md:text-[28px] font-semibold text-center mt-1 md:mt-4">
              Connect Wallet
            </h1>
            <h2 className="text-white text-[14px] md:text-[20px] font-medium text-center py-2">
              Please install one of these supported wallets.
            </h2>
            <div>
              {wallets.map((w) => (
                <div key={w.title} className="rounded-full bg-[#322653] mt-2 md:mt-4 py-2 px-4">
                  {w.installed ? (
                    <button
                      className="flex items-center bg-transparent outline-none border-none"
                      onClick={() => {
                        connect(w.extensionName);
                      }}
                    >
                      <img className="w-[20px] h-[20px] md:w-[44px] md:h-[44px]" src={w.logo.src} alt={w.logo.alt} />
                      <p className="text-white text-[14px] md:text-[18px] ml-4 mb-0 font-medium">
                        Connnect to {w.title}
                      </p>
                    </button>
                  ) : (
                    <a href={w.installUrl} className="flex items-center opacity-50">
                      <img className="w-[20px] h-[20px] md:w-[44px] md:h-[44px]" src={w.logo.src} alt={w.logo.alt} />
                      <p className="text-white text-[14px] md:text-[18px] ml-4">Install {w.title}</p>
                    </a>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => handleModal(false)}
              className=" rounded-full bg-[#201F37] text-[14px] md:text-[18px] mt-4 md:mt-6 py-1 px-4 md:py-2 md:px-8 relative left-[40%] outline-none border-none text-white"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default memo(ModalWallet);
