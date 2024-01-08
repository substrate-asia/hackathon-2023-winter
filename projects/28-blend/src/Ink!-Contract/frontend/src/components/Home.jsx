import { FaArrowRight } from "react-icons/fa";
import { images } from "./images";
import React from "react";

const Home = () => {
  return (
    <div className="bg-white text-[#343434] h-full flex flex-col h-screen  items-center">
      <nav className="bg-black py-3 text-sm font-light text-white w-full flex justify-center">
        <p>A project developed in the 2023 Winter Polkadot Hackathon</p>
      </nav>
      <div className="px-32 py-14 flex flex-col gap-6">
        <h1 className="text-5xl xl:text-7xl font-semibold">BLEND</h1>
        <p className="xl:text-[1.35rem] max-w-[1025px]">
          is a digital identity creation engine which onboard Web3.0 users on
          Astar into the metaverse or virtual space via deep learning 3D
          character reconstruction technology. Our specially designed PASSPORT
          protocol will be facilitating the use of NFT technology with ink!
          smart contract language and InterPlanetary File System (IPFS).
        </p>
        <a href="/connect" className="flex items-center gap-2">
          <div className="bg-[#343434] w-8 h-8 rounded-full flex justify-center items-center">
            <FaArrowRight className="text-white" />
          </div>
          <p className="underline xl:text-lg my-2">Create your PASSPORT</p>
        </a>
        <div className="grid grid-cols-6 w-fit gap-1">
          {images.map((img) => (
            <img src={img} alt="" key={img} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
