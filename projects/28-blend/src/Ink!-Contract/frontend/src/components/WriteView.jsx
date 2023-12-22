import React, { useState } from "react";
import { useTx, useWallet, useCallSubscription, useAllWallets } from "useink";
import { useTxNotifications } from "useink/notifications";
import {
    isPendingSignature,
    shouldDisable,
    isFinalized,
    isInBlock,
    pickDecoded,
    isErrored,
} from "useink/utils";
import { ToastContainer, toast } from "react-toastify";
import Navbar from "./Navbar.jsx";
import mintImg from "./images/mint.jpg";
import mintBigImg from "./images/mintBig.jpg";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import {
    handleDownload,
    getObjFromIndexedDB,
    beautifyAddress,
    getCurrentTimeFormatted,
} from "../utils/functions";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

export const WriteView = ({ erc721 }) => {
    const { account, connect } = useWallet();
    const wallets = useAllWallets();
    const imageReducer = useSelector((state) => state.imageReducer);
    const navigate = useNavigate();
    const [obj, setObj] = useState(imageReducer.objFile);
    const [isMinted, setIsMinted] = useState(imageReducer.minted);
    const [isPaid, setIsPaid] = useState(imageReducer.isPaid);
    const [ipfsURI, setIpfsURI] = useState(imageReducer.ipfsURI);
    const [name, setName] = useState(imageReducer.name);
    const [localStorageChecked, setLocalStorageChecked] = useState(false);
    const [clicked, setClicked] = useState(false);
    const [time, setTime] = useState();
    const [txHash, setTxHash] = useState();
    const [baseUriSet, setBaseUriSet] = useState(false);

    // const balanceOf = useCallSubscription(erc721, "getTokenId", []);
    const balanceOf = useCallSubscription(erc721, "psp34::totalSupply", []);
    const [tokenId, setTokenId] = useState(pickDecoded(balanceOf?.result));

    // const approve = useTx(erc721, "approve");
    // useTxNotifications(approve);

    const [mintTokenId, setMintTokenId] = useState(1);
    // const mint = useTx(erc721, "mint");
    const mint = useTx(erc721, "payableMintImpl::mintNext");
    useTxNotifications(mint);

    const setTokenUri = useTx(erc721, "payableMintImpl::setBaseUri");
    useTxNotifications(setTokenUri);

    useEffect(() => {
        const func = async () => {
            if (isInBlock(setTokenUri)) {
                const res = await mint.signAndSend([], { defaultCaller: true });
                console.log("response", res);
                setTime(getCurrentTimeFormatted());
            }
        };
        func();
    }, [isInBlock(setTokenUri)]);

    useEffect(() => {
        setTxHash(
            `https://shibuya.subscan.io/extrinsic/${mint.result?.txHash?.toHex()}`
        );
    }, [mint]);

    useEffect(() => {
        if (!isInBlock(mint)) {
            setClicked(false);
        }
    }, [isInBlock(mint)]);

    useEffect(() => {
        setTokenId(pickDecoded(balanceOf?.result));
    }, [erc721]);

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
            toast.error(
                "You need to complete the payment. Redirecting to /payment."
            );
            navigate("/payment");
        }
        if (!ipfsURI && localStorageChecked) {
            toast.error("IPFS URI not available. Redirecting to /name.");
            navigate("/name");
        }
    }, [isPaid, obj, localStorageChecked, ipfsURI]);

    const handleRedirect = () => {
        localStorage.clear();
        indexedDB.deleteDatabase("MyDatabase");
        navigate("/");
    };

    const handleMint = async () => {
        console.log(ipfsURI);
        setClicked(true);
        // const res = await mint.signAndSend([], { defaultCaller: true });
        // console.log("response", res);
        // setClicked(true);
        // setTime(getCurrentTimeFormatted());
        await setTokenUri.signAndSend([ipfsURI], { defaultCaller: true });
    };

    if (isErrored(mint)) {
        return (
            <>
                <Navbar />
                <div className="bg-white w-full h-screen text-black flex flex-col items-center gap-12 py-14">
                    <h1 className="text-xl text-black">
                        Some error occured, try reloading!
                    </h1>
                </div>
            </>
        );
    }

    if (!account) {
        console.log(wallets[1].extensionName);
        return (
            <>
                <Navbar />
                <div className="bg-white w-full h-screen text-black flex flex-col items-center gap-12 py-14">
                    <div className="flex gap-8 items-center">
                        <img
                            src={isFinalized(mint) ? mintBigImg : mintImg}
                            alt="mint"
                        />
                        <p className="text-[#888888] mb-2">
                            Below are the 3D files to render your identity:
                        </p>
                        <div className="flex items-center justify-between px-8 py-3 border rounded-lg">
                            <p className="text-[#888888]">
                                Face Mesh Object File
                            </p>
                            {obj && (
                                <button onClick={() => handleDownload(obj)}>
                                    <IoCloudDownloadOutline className="text-[#58B91D] text-lg" />
                                </button>
                            )}
                        </div>
                    </div>
                    <button
                        className="flex items-center bg-black text-white gap-10 border px-8 py-3 rounded hover:bg-gray-800 transition-all  cursor-pointer"
                        onClick={() => connect(wallets[1].extensionName)}
                    >
                        Connect to mint
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <ToastContainer />
            <Navbar />
            <div className="bg-white w-full h-screen text-black flex flex-col items-center gap-12 py-14">
                {/* Existing UI Code */}
                {clicked && !isInBlock(setTokenUri) && !isFinalized(setTokenUri) ? (
                    <p
                        className={`${
                            isPendingSignature(mint) ? "text-3xl" : "text-4xl"
                        } text-center max-w-[935px] leading-[1.5] font-light ${
                            isFinalized(mint) && "text-[#457827]"
                        }`}
                    >
                        Setting token URI...
                    </p>
                ) : (
                    <p
                        className={`${
                            isPendingSignature(mint) ? "text-3xl" : "text-4xl"
                        } text-center max-w-[935px] leading-[1.5] font-light ${
                            isFinalized(mint) && "text-[#457827]"
                        }`}
                    >
                        {isPendingSignature(mint) ||
                        isInBlock(mint) ||
                        (clicked && !isFinalized(mint))
                            ? "PASSPORT minting in progress..."
                            : `${beautifyAddress(
                                  account?.address
                              )}s Digital Identity PASSPORT`}
                    </p>
                )}
                {!isPendingSignature(mint) && !isInBlock(mint) && !clicked && (
                    <>
                        <div className="flex gap-8 items-center">
                            <img
                                src={isFinalized(mint) ? mintBigImg : mintImg}
                                alt="mint"
                            />
                            <div className="flex flex-col gap-2">
                                {isFinalized(mint) ? (
                                    <>
                                        <p className="text-[1.3rem] font-light">
                                            {name}
                                        </p>
                                        <p className="text-[#888888] text-sm">
                                            by{" "}
                                            {beautifyAddress(account?.address)}
                                        </p>
                                        <p className="text-[#888888] text-sm">
                                            Created on
                                            {time || "6/12/2023 1:55AM"}
                                        </p>
                                        <p className="text-sm">
                                            {tokenId && (
                                                <a
                                                    href={txHash}
                                                    target="_blank"
                                                >
                                                    Token ID:{" "}
                                                    <span className="underline">
                                                        {tokenId}
                                                    </span>
                                                </a>
                                            )}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-[#888888] mb-2">
                                            Below are the 3D files to render
                                            your identity:
                                        </p>
                                        <div className="flex items-center justify-between px-8 py-3 border rounded-lg">
                                            <p className="text-[#888888]">
                                                Face Mesh Object File
                                            </p>
                                            {obj && (
                                                <button
                                                    onClick={() =>
                                                        handleDownload(obj)
                                                    }
                                                >
                                                    <IoCloudDownloadOutline className="text-[#58B91D] text-lg" />
                                                </button>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        <button
                            disabled={
                                shouldDisable(mint) ||
                                !mintTokenId ||
                                isInBlock(mint) ||
                                clicked
                            }
                            onClick={
                                isFinalized(mint) ? handleRedirect : handleMint
                            }
                            className="disabled:bg-gray-600 flex items-center bg-black text-white gap-10 border px-8 py-3 rounded hover:bg-gray-800 transition-all  cursor-pointer"
                        >
                            {isFinalized(mint)
                                ? "Redirect to Home Page"
                                : " Mint into ERC-721 Token"}
                        </button>
                    </>
                )}
                {!isFinalized(mint) && (
                    <p className="text-[#888888] max-w-[532px] text-center text-sm">
                        {isPendingSignature(mint)
                            ? `Note: Please do not close the application while the PASSPORT NFT is being minted as it will affect the import.meta. Please make sure you complete all the wallet interaction.
                           Redirect will occur upon completion.`
                            : `This DAPP is a demo to showcase the Blend toolkit. If you
                    continue to mint your identity PASSPORT, you agree to make
                    your identity 3D rendering files to be publicly accessible.
                    If you just wanted to view the result, simply download the
                    above files and use a viewer.`}
                    </p>
                )}

                {/* Add the new UI elements for minting */}
                {/* <div className="mt-6">
          <label className="font-semibold uppercase text-xs">Token ID</label>
          <input
            type="number"
            value={mintTokenId}
            min={1}
            max={10}
            onChange={(e) => setMintTokenId(Number(e.target.value))}
            placeholder="Enter a token ID to mint..."
            disabled={shouldDisable(mint)}
          />
          <button
            className="w-full mt-3 bg-yellow-300 p-3"
            disabled={shouldDisable(mint) || !mintTokenId}
            onClick={handleMint}
          >
            {isPendingSignature(mint)
              ? "Sign transaction"
              : shouldDisable(mint)
              ? "Minting..."
              : "Mint"}
          </button>
        </div> */}
            </div>
        </>
    );
};
