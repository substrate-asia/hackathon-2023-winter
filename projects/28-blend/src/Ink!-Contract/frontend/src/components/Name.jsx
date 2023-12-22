import Navbar from "./Navbar";
import { FaArrowRightLong } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setIpfsURI,
  setName as setReduxName,
} from "../redux/slices/imageSlice";
import {storeTokenUriMetadata} from "../utils/pinata";
import Loader from "./Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function getObjFromIndexedDB(objFileName, callback) {
  const dbPromise = indexedDB.open("MyDatabase", 1);

  dbPromise.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction(["objFiles"], "readonly");
    const store = transaction.objectStore("objFiles");
    const request = store.get(objFileName);

    request.onsuccess = function (event) {
      const result = event.target.result;
      if (result) {
        console.log("File retrieved successfully.");
        callback(result.data);
      } else {
        console.error("File not found.");
      }
    };

    request.onerror = function (error) {
      console.error("Error retrieving file:", error);
    };
  };
}

const Name = () => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const imageReducer = useSelector((state) => state.imageReducer);
  const [obj, setObj] = useState(imageReducer.objFile);
  const [isPaid, setIsPaid] = useState(imageReducer.isPaid);
  const [localStorageChecked, setLocalStorageChecked] = useState(false);

  useEffect(() => {
    if (typeof window !== undefined && window.localStorage) {
      if (!isPaid) {
        setIsPaid(localStorage.getItem("paid"));
      }

      const callback = (objData) => {
        setObj(objData);
      };

      if (!obj) {
        getObjFromIndexedDB("image", callback);
      }

      setLocalStorageChecked(true);
    }
  }, []);

  useEffect(() => {
    if (!isPaid && localStorageChecked) {
      toast.error("You need to complete the payment. Redirecting to /payment.");
      navigate("/payment");
    }
  });

  const handleClick = async () => {
    setLoading(true);
    dispatch(setReduxName(name));
    await handlePinataUri();
    navigate("/mint");
  };

  const handleNameInput = (e) => {
    setName(e.target.value);
  };

  const handlePinataUri = async () => {
    const metadata = {
      name,
      obj,
    };
    const metadataUploadResponse = await storeTokenUriMetadata(metadata);
    console.log(
      `https://gateway.pinata.cloud/ipfs/${metadataUploadResponse.IpfsHash}`
    );
    dispatch(
      setIpfsURI(
        `https://gateway.pinata.cloud/ipfs/${metadataUploadResponse.IpfsHash}`
      )
    );
  };

  if (!localStorageChecked) {
    return <Loader />;
  }

  return (
    <>
      <ToastContainer />
      <div className="bg-white w-full h-screen text-black">
        <Navbar />
        <div className="flex w-full py-24 gap-8 flex-col items-center">
          <p className="text-3xl text-center max-w-[935px] leading-[1.5] font-light">
            {loading
              ? "3D face reconstruction in progress..."
              : "Provide a name for your digital identity PASSPORT"}
          </p>

          {loading ? (
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-16 h-16 text-gray-200 animate-spin dark:text-white fill-black"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            <div className="flex items-center px-8 py-3 border rounded-lg">
              <input
                type="text"
                placeholder="Example: James Michael"
                className="focus:border-none focus:outline-none"
                onChange={handleNameInput}
              />
              <button onClick={handleClick} disabled={name === ""}>
                <FaArrowRightLong />
              </button>
            </div>
          )}

          <p className="text-[#888888] max-w-[532px] text-center text-sm">
            {loading
              ? `Note: Please do not close the application while the face mesh is generating as it will affect the result.
                            Redirect will occur upon completion.`
              : `Note: The name provided above will be the name of your NFT
                    digital identity PASSPORT. Hence, once it is minted, the
                    name for the PASSPORT can’t be change. You can choose to put
                    your real name or a nickname, but please note that this will
                    be public to everyone`}
          </p>
        </div>
      </div>
    </>
  );
};

export default Name;
