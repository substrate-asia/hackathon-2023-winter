import Navbar from "./Navbar";
import { FaArrowRightLong } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { setObjFile, setPaid } from "../redux/slices/imageSlice";
import { useEffect, useState } from "react";
import useSubwallet from "../hooks/subWallet";
import { useNavigate } from "react-router-dom";
import { uploadImageToS3, sendImageToFlask } from "../utils/functions";
import { toast, ToastContainer } from "react-toastify";
import { decimalToPlanck } from "useink/utils";
import "react-toastify/dist/ReactToastify.css";
import metadata from "../../assets/erc721.json";
import { useContract } from "useink";
import { ApiPromise, WsProvider } from "@polkadot/api";
import Loader from "./Loader";

function saveObjToIndexedDB(objData, objFileName) {
    const dbPromise = indexedDB.open("MyDatabase", 1);

    dbPromise.onupgradeneeded = function (event) {
        const db = event.target.result;
        const store = db.createObjectStore("objFiles", { keyPath: "fileName" });
    };

    // Set up the onsuccess event
    dbPromise.onsuccess = function (event) {
        const db = event.target.result;

        // Perform the transaction inside onsuccess
        const transaction = db.transaction(["objFiles"], "readwrite");
        const store = transaction.objectStore("objFiles");

        store.put({ fileName: objFileName, data: objData });

        transaction.oncomplete = function () {
            console.log("File saved successfully.");
        };

        transaction.onerror = function (error) {
            console.error("Error saving file:", error);
        };
    };
}

const Payment = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const imageReducer = useSelector((state) => state.imageReducer);
    const [imageFile, setImageFile] = useState(imageReducer.img);
    const [localStorageChecked, setLocalStorageChecked] = useState(false);
    const { state, handleConnect, handleDisconnect, injector } = useSubwallet();
    const [isError, setIsError] = useState(false);
    const contractAddress = "XvHZtPHMgx6JJKkqGwwyUsiTNnYr7UwTPjuTionGaLwwcFW";
    const erc721 = useContract(contractAddress || "", metadata);
    const [amount, setAmount] = useState(100000 * 10 ** 10);
    const [api, setApi] = useState();

    const setup = async () => {
        const wsProvider = new WsProvider("wss://shibuya.public.blastapi.io");
        // const wsProvider = new WsProvider();
        const apiPromise = await ApiPromise.create({ provider: wsProvider });

        setApi(apiPromise);
    };

    useEffect(() => {
        setup();
    }, [state]);

    // useEffect(() => {
    //     setAmount(decimalToPlanck(1, erc721?.api));
    //     console.log("amount: ", decimalToPlanck(1, erc721?.api));
    // }, [amount]);

    useEffect(() => {
        if (typeof window !== undefined && window.localStorage) {
            if (localStorage.getItem("image") && !imageFile) {
                const base64 = localStorage.getItem("image");
                const base64Parts = base64.split(",");
                const fileFormat = base64Parts[0].split(";")[1];
                const fileContent = base64Parts[1];
                setImageFile(
                    new File([fileContent], "image", { type: fileFormat })
                );
            }
            setLocalStorageChecked(true);
        }
    }, [imageFile]);

    useEffect(() => {
        if (!imageFile && localStorageChecked) {
            toast.error("No image file to upload. Redire cting to /upload.");
            navigate("/upload");
        }
    }, [imageFile, localStorageChecked]);

    const handleUpload = async () => {
        if (!imageFile) {
            toast.error("No image file to upload.");
            console.error("No image file to upload");
            navigate("/upload");
        }

        const s3Response = await uploadImageToS3(imageFile);

        console.log(s3Response);

        const flaskResponse = await sendImageToFlask(imageFile);

        console.log(flaskResponse);

        if (flaskResponse.s3_url) {
            console.log(flaskResponse.s3_url);
            dispatch(setObjFile(flaskResponse.s3_url));
            saveObjToIndexedDB(flaskResponse.s3_url, "image");
        } else {
            toast.error("S3 URL not available. Redirecting to /payment.");
            console.error("S3 URL not available");
            navigate("/payment");
        }
    };

    const handleClick = async () => {
        // try {
        //     // handleUpload();
        //     await transferFunds(
        //         "WkpuyQGKGixwkKsor36FuaCUtBcYKyBAJJn6avPWJLt8EdL",
        //         amount,
        //         state.data.defaultAccount.address
        //     );
        //     dispatch(setPaid(true));
        //     toast.success("Payment successful. Redirecting to /name.");
        //     navigate("/name");
        // } catch (error) {
        //     toast.error(error.toString());
        //     console.log(error.toString());
        //     setIsError(error);
        // }
        try {
            handleUpload();
            await api.tx.balances
                .transfer(
                    "WkpuyQGKGixwkKsor36FuaCUtBcYKyBAJJn6avPWJLt8EdL",
                    amount
                )
                .signAndSend(
                    state.data.defaultAccount.address,
                    { signer: injector.signer },
                    (status) => {
                        if (status.isInBlock) {
                            console.log(
                                `Completed at block hash #${status.asInBlock.toString()}`
                            );
                        } else {
                            console.log(`Current status: ${status.type}`);
                        }
                    }
                );
            toast.success("Payment successful. Redirecting to /name.");
            dispatch(setPaid(true));
            navigate("/name");
        } catch (error) {
            toast.error("Error transferring funds:", error);
            console.error("Error transferring funds:", error);
        }
    };

    if (isError) {
        return (
            <div>
                {isError.toString() || "Some error occured! try reloading"}
            </div>
        );
    }

    if (!state || !api) {
        <Loader />;
    }

    return (
        <div className="bg-white w-full h-screen text-black">
            <ToastContainer />
            <Navbar />
            <div className="flex w-full py-24 gap-8 flex-col items-center">
                <p className="text-3xl text-center max-w-[935px] leading-[1.5] font-light">
                    Creation of your digital identity PASSPORT requires a
                    one-time cost of 1 SBY due to the heavy computing resources
                    required.
                </p>
                {!state.data ? (
                    <button
                        onClick={() => handleConnect()}
                        className="flex items-center gap-10 border px-8 py-3 rounded-lg hover:bg-[#E2E2E2] transition-all  cursor-pointer"
                    >
                        <p>Pay 1 SBY now</p>
                        <FaArrowRightLong />
                    </button>
                ) : (
                    <button
                        onClick={handleClick}
                        className="flex items-center gap-10 border px-8 py-3 rounded-lg hover:bg-[#E2E2E2] transition-all  cursor-pointer"
                    >
                        <p>Click again and check wallet</p>
                        <FaArrowRightLong />
                    </button>
                )}
                <p className="text-[#888888] max-w-[532px] text-center text-sm">
                    This DAPP is just a demo to showcase the Blend toolkit. The
                    payment of 10 ASTR is a fix amount calculated at the time of
                    development and is use to covered the on-cloud computation
                    resources which is utilizing currently to power this demo
                </p>
            </div>
        </div>
    );
};

export default Payment;
