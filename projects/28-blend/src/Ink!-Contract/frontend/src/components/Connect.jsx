import connectImg from "./images/connect.png";
import ConnectBtn from "./ConnectBtn";

const Connect = () => {
    return (
        <div
            className="h-screen flex flex-col"
            style={{
                backgroundImage: `url(${connectImg})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
            }}
        >
            <nav className="bg-black py-3 text-sm font-light text-white w-full flex justify-center">
                <p>A project developed in the 2023 Winter Polkadot Hackathon</p>
            </nav>
            <div className="ml-44 mb-20 max-w-[570px] flex flex-col gap-6 h-full justify-center">
                <p className="text-[#E2E2E2] text-2xl">Hey, Welcome to Blend</p>
                <p className="text-[3.87rem] text-white leading-[1.29] font-light mb-2">
                    Connect yourself to the Astar Network.
                </p>
                <ConnectBtn />
            </div>
        </div>
    );
};

export default Connect;
