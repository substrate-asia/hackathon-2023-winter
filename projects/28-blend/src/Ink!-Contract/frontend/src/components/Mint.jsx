import Navbar from "./Navbar";
import mintImg from "./images/mint.jpg";
import mintBigImg from "./images/mintBig.jpg";
import { useEffect, useState } from "react";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import useSubwallet from "../hooks/subWallet";
import usePolkadotApi from "../hooks/polkadotApi";
import {
  handleDownload,
  clearIndexedDB,
  getObjFromIndexedDB,
  beautifyAddress,
} from "../utils/functions";
import Loader from "./Loader";
import { ToastContainer, toast } from "react-toastify";
import { BN, BN_ONE } from "@polkadot/util";
import { useNavigate } from "react-router-dom";
import { useCallSubscription, useContract, useTx, useWallet } from "useink";
import { useTxNotifications } from "useink/notifications";
import { pickDecoded } from "useink/utils";
import metadata from "../../assets/erc721.json";

const MAX_CALL_WEIGHT = new BN(5_000_000_000_000).isub(BN_ONE);
const PROOFSIZE = new BN(1_000_000);

const Mint = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const imageReducer = useSelector((state) => state.imageReducer);
  const [obj, setObj] = useState(imageReducer.objFile);
  const [isMinted, setIsMinted] = useState(imageReducer.minted);
  const [isPaid, setIsPaid] = useState(imageReducer.isPaid);
  const [ipfsURI, setIpfsURI] = useState(imageReducer.ipfsURI);
  const [name, setName] = useState(imageReducer.name);
  const [localStorageChecked, setLocalStorageChecked] = useState(false);
  const { state, handleConnect, injector } = useSubwallet();
  const { contract, api, pair } = usePolkadotApi();
  const [isUriSet, setIsUriSet] = useState(false);


  useEffect(() => {
    if (typeof window !== undefined && window.localStorage) {
      if (!isPaid) {
        setIsPaid(localStorage.getItem("paid"));
      }
      if (!isMinted) {
        setIsMinted(localStorage.getItem("minted"));
      }
      const callback = (objData) => {
        setObj(objData);
      };
      if (!obj) {
        getObjFromIndexedDB("image", callback);
      }
      if (!ipfsURI) {
        setIpfsURI(localStorage.getItem("ipfs"));
      }
      if (!name) {
        setName(localStorage.getItem("name"));
      }
      setLocalStorageChecked(true);
    }
  }, []);

  useEffect(() => {
    if (!isPaid && localStorageChecked) {
      toast.error("You need to complete the payment. Redirecting to /payment.");
      navigate("/payment");
    }
    if (!ipfsURI && localStorageChecked) {
      toast.error("IPFS URI not available. Redirecting to /name.");
      navigate("/name");
    }
  }, [isPaid, obj, localStorageChecked, ipfsURI]);

  const handleUriSet = async () => {
    setIsLoading(true);

    const getGasMaxLimit = () => {
      return api.registry.createType(
        "WeightV2",
        api.consts.system.blockWeights["maxBlock"]
      );
    };

    console.log("gas limit max", getGasMaxLimit().toHuman());

    try {
      const res = await contract.query["payableMint::setBaseUri"](
        state.data.defaultAccount.address,
        {
          gasLimit: api?.registry.createType("WeightV2", {
            refTime: MAX_CALL_WEIGHT,
            proofSize: PROOFSIZE,
          }),
          storageDepositLimit: 0,
          value: 0,
        },
        ipfsURI
      );

      const { output, result, gasRequired, storageDeposit } = res;
      console.log("mintNext query result", result.toString());
      console.log("mint gasRequired", gasRequired.toString());
      console.log("storageDeposit", storageDeposit.toString());

      const mintResult = await contract.tx["payableMint::setBaseUri"](
        {
          gasLimit: api?.registry.createType("WeightV2", gasRequired),
          storageDepositLimit: 0,
          value: 0,
        },
        ipfsURI
      ).signAndSend(
        state.data.defaultAccount.address,
        {
          signer: injector.signer,
        },
        (result) => {
          if (result.status.isInBlock) {
            console.log("in a block");
            setIsLoading(false);
            setIsUriSet(true);
          } else if (result.status.isFinalized) {
            console.log("finalized");
          }
        }
      );
      console.log(mintResult);
    } catch (error) {
      toast.error("An error occurred in setting token URI.");
      console.log(error);
    }
  };

  const handleMint = async () => {
    setIsLoading(true);

    const getGasMaxLimit = () => {
      return api.registry.createType(
        "WeightV2",
        api.consts.system.blockWeights["maxBlock"]
      );
    };

    console.log("gas limit max", getGasMaxLimit().toHuman());

    try {
      const res = await contract.query["payableMint::mintNext"](
        state.data.defaultAccount.address,
        {
          gasLimit: api?.registry.createType("WeightV2", {
            refTime: MAX_CALL_WEIGHT,
            proofSize: PROOFSIZE,
          }),
          storageDepositLimit: 0,
          value: 1000 * 1e12,
        }
      );

      const { output, result, gasRequired, storageDeposit } = res;
      console.log("mintNext query result", result.toString());
      console.log("mint gasRequired", gasRequired.toString());
      console.log("storageDeposit", storageDeposit.toString());

      const mintResult = await contract.tx["payableMint::mintNext"]({
        gasLimit: api?.registry.createType("WeightV2", gasRequired),
        storageDepositLimit: 0,
        value: 1000 * 1e12,
      }).signAndSend(
        state.data.defaultAccount.address,
        {
          signer: injector.signer,
        },
        (result) => {
          if (result.status.isInBlock) {
            console.log("in a block");
            console.log(
              "Transaction Hash:",
              result.status.asInBlock.toString()
            );
            console.log("Token ID:", result.events[0]);
            setIsLoading(false);
            setIsMinted(true);
          } else if (result.status.isFinalized) {
            console.log("finalized");
          }
        }
      );
      console.log(mintResult.toString());
    } catch (error) {
      toast.error("An error occurred during minting.");
      console.log(error);
    }
  };

  const handleRedirect = () => {
    navigate("/");
  };

  if (!localStorageChecked || !api) {
    return <Loader />;
  }

  return (
    <>
      <ToastContainer />
      <div
        className={`bg-white w-full ${
          isLoading ? "h-screen" : "h-full"
        } text-black`}
      >
        <Navbar />
        <div className="flex w-full py-16 gap-8 flex-col items-center">
          <p
            className={`${
              isLoading ? "text-3xl" : "text-4xl"
            } text-center max-w-[935px] leading-[1.5] font-light ${
              isMinted && "text-[#457827]"
            }`}
          >
            {isLoading
              ? isUriSet
                ? "PASSPORT minting in progress..."
                : "Seting Token URI..."
              : isMinted
              ? "PASSPORT minted successfully!"
              : `${state.data.defaultAccount.address}s Digital Identity PASSPORT`}
          </p>
          {!isLoading && (
            <>
              <div className="flex gap-8 items-center">
                <Image src={isMinted ? mintBigImg : mintImg} alt="mint" />
                <div className="flex flex-col gap-2">
                  {isMinted ? (
                    <>
                      <p className="text-[1.3rem] font-light">{name}</p>
                      <p className="text-[#888888] text-sm">by 0x0d4...01ab9</p>
                      <p className="text-[#888888] text-sm">
                        Created on 6/12/2023 1:55AM
                      </p>
                      <p className="text-sm">
                        Token ID: <span className="underline">#0001</span>
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-[#888888] mb-2">
                        Below are the 3D files to render your identity:
                      </p>
                      <div className="flex items-center justify-between px-8 py-3 border rounded-lg">
                        <p className="text-[#888888]">Face Mesh Object File</p>
                        {obj && (
                          <button onClick={() => handleDownload(obj)}>
                            <IoCloudDownloadOutline className="text-[#58B91D] text-lg" />
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
              {!state.data ? (
                <button
                  onClick={handleConnect}
                  className="flex items-center bg-black text-white gap-10 border px-8 py-3 rounded hover:bg-gray-800 transition-all  cursor-pointer"
                >
                  Connect to Mint
                </button>
              ) : isUriSet ? (
                <button
                  onClick={isMinted ? handleRedirect : handleMint}
                  className="flex items-center bg-black text-white gap-10 border px-8 py-3 rounded hover:bg-gray-800 transition-all  cursor-pointer"
                >
                  {isMinted
                    ? "Redirect to Home Page"
                    : " Mint into ERC-721 Token"}
                </button>
              ) : (
                <button
                  onClick={handleUriSet}
                  className="flex items-center bg-black text-white gap-10 border px-8 py-3 rounded hover:bg-gray-800 transition-all  cursor-pointer"
                >
                  Set Token URI
                </button>
              )}
            </>
          )}
          {!isMinted && (
            <p className="text-[#888888] max-w-[532px] text-center text-sm">
              {isLoading
                ? `Note: Please do not close the application while the PASSPORT NFT is being minted as it will affect the import.meta. Please make sure you complete all the wallet interaction.
                           Redirect will occur upon completion.`
                : `This DAPP is a demo to showcase the Blend toolkit. If you
                    continue to mint your identity PASSPORT, you agree to make
                    your identity 3D rendering files to be publicly accessible.
                    If you just wanted to view the result, simply download the
                    above files and use a viewer.`}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Mint;
