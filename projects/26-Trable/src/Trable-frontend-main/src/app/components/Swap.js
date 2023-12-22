"use client";
import Image from "next/image";
export default function Swap(){
    return (<><div className="max-w-sm mx-auto my-10 bg-white rounded-lg shadow-md overflow-hidden">
    <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2 text-gray-700">兑换</div>
        <div className="flex justify-between items-center mb-4">
            <div className="text-gray-700 text-sm">你付钱</div>
            <div className="flex items-center">
            <Image src="/polkadot.png" className="block appearance-none mx-2  bg-white" alt="usdc logo" width={24} height={24}/>
                <select id="currency-select"
                            className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                            <option>Polka DOT</option>
                        </select>
            </div>
        </div>
        <input type="number"
            className="mb-4 w-full p-2 text-gray-900 border rounded focus:outline-none focus:border-blue-500"
            placeholder="0"/>
        <div className="flex justify-center items-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-down"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
        </div>
        <div className="flex justify-between items-center mb-4"><div className="text-gray-700 text-sm mb-4">你收到</div>
        <div className="flex items-center">
                        <Image src="/usdc.png" className="block appearance-none mx-2  bg-white" alt="usdc logo" width={24} height={24}/>
                        <select id="currency-select"
                            className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                            <option>USDC</option>
                        </select>
            </div></div>
        
        <input type="number"
            className="mb-4 w-full p-2 text-gray-900 border rounded focus:outline-none focus:border-blue-500"
            placeholder="0"/>
    
    </div>
    <div className="px-6 pt-4 pb-2">
    <button
            className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600 focus:outline-none mb-4">确认交易</button>
    </div>
</div></>)
}