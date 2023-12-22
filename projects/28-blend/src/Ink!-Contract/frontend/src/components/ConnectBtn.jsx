import { FaArrowRightLong } from "react-icons/fa6";
import useSubwallet from "../hooks/subWallet";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Connect = () => {
    const { state, handleConnect, handleDisconnect } = useSubwallet();
    const navigate = useNavigate();

    function beatifyAddress(address) {
        return `${address.slice(0, 3)}...${address.slice(-3)}`;
    }

    if (state.error) {
        toast.error(`Error with connect: ${state.error.message}`);
        return (
            <span className="text-red-500 font-bold tracking-tight">
                Error with connect: {state.error.message}
            </span>
        );
    }

    return state.data ? (
        <>
            <ToastContainer /> Hello,{" "}
            {beatifyAddress(state.data.defaultAccount.address)}!
        </>
    ) : (
        <button
            disabled={state.loading}
            className={`border-white text-white border w-fit px-5 py-3 flex gap-4 items-center hover:bg-white hover:text-black transition-all`}
            onClick={() => {
                handleConnect();
                toast.success("Connected to Subwallet successfully!");
                navigate("/upload");
            }}
        >
            <p className="text-xl">Connect to Subwallet</p>
            <FaArrowRightLong />
        </button>
    );
};

export default Connect;
