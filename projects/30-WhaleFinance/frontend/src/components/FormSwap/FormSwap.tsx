import { useEffect, useState } from "react";
import { SwapRouter, WhaleFinanceAddress, allowedTokens } from "../../utils/addresses";
import { ethers } from "ethers";
import { QuotaTokenAbi } from "../../contracts/QuotaToken";
import { WhaleFinanceAbi } from "../../contracts/WhaleFinance";
import { SafeAccountAbi } from "../../contracts/SafeAccount";
import { Trade } from "@uniswap/sdk";

export default function FormSwap(props: any) {

    const [tokenABalance, setTokenABalance] = useState(0);
    const [tokenBBalance, setTokenBBalance] = useState(0);

    const [amount, setAmount] = useState(0);
    // const [loading, setLoading] = useState(false);

    async function getBalances() {
        try{
            const whaleFinanceContract = new ethers.Contract(WhaleFinanceAddress, WhaleFinanceAbi, props.signer);
            const fundAddresses = await whaleFinanceContract.functions.fundsAddresses(props.fundId);

            const tokenAContract = new ethers.Contract(allowedTokens[props.tokenA], QuotaTokenAbi, props.signer);
            const tokenABalance: ethers.BigNumber = await tokenAContract.balanceOf(fundAddresses[0]);

            console.log(parseFloat(tokenABalance._hex))
            
            setTokenABalance(Number(ethers.utils.formatEther(tokenABalance)));

            const tokenBContract = new ethers.Contract(allowedTokens[props.tokenB], QuotaTokenAbi, props.signer);
            const tokenBBalance: ethers.BigNumber = await tokenBContract.balanceOf(fundAddresses[0]);
            setTokenBBalance(Number(ethers.utils.formatEther(tokenBBalance)));

        } catch(err){
            console.log(err);
        }
    }

    async function makeSwap(){
        if(props.tokenA === props.tokenB){
            alert("Please choose different tokens!");
            return;
        }

        if(props.tokenA <= 0){
            alert("Please choose a valid amount!");
            return;
        }

        if(props.tokenA > tokenABalance){
            alert("You don't have enough balance!");
            return;
        }

        // setLoading(true)

        try{
            const tokenAAddress = allowedTokens[props.tokenA];
            const tokenBAddress = allowedTokens[props.tokenB];

            const whaleFinanceContract = new ethers.Contract(WhaleFinanceAddress, WhaleFinanceAbi, props.signer);
            const fundAddress = await whaleFinanceContract.functions.fundsAddresses(props.fundId);

            Trade
            let path: any[] = [];

            path = [tokenAAddress, tokenBAddress];

            // const routerContract = new ethers.Contract(SwapRouter, ["function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)"], props.signer);

            const deadline = Math.floor(Date.now() / 1000) + 3600;
            const rawAmount = ethers.utils.parseEther(String(amount));
            const hexAmount = ethers.BigNumber.from(rawAmount).toHexString();



            const fundContract = new ethers.Contract(fundAddress[0], SafeAccountAbi, props.signer);


            const txApprove = await fundContract.functions.executeApprove(tokenAAddress, SwapRouter, ethers.utils.parseEther(String(amount)));

            await txApprove.wait();

            const txSwap = await fundContract.functions.executeSwapExactTokensForTokens(
                hexAmount, 0, path, props.account, deadline);

            await txSwap.wait();
            
            

        } catch(err){
            console.log(err);
        } finally{
            // setLoading(false);
        }
    }

    useEffect(() => {
        getBalances();
    },[props.signer, props.tokenA, props.tokenB]);


    return (
        <div className='my-4'>
            <div>
                <div className="mb-4 text-secondary-color">
                    <label className="block font-medium italic text-sm text-gray-400 ml-8" htmlFor="invest">
                        Choose your tokens to swap
                    </label>
                    <div className="flex flex-row text-center text-secondary-color italic font-bold mt-4 ml-8">
                        <h3>Balance: {Number(tokenABalance).toFixed(3)} {props.tokenA} </h3>
                    </div>
                    <div className="mx-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                        <div className="flex flex-row border-[2px] border-secondary-color text-center text-xl text-black dark:text-white mt-4 shadow-lg rounded-[15px]">
                            <input
                                type="number"
                                id="invest"
                                name="invest"
                                placeholder={`Qty of ${props.tokenA}`}
                                value={amount}
                                onChange={(e) => setAmount(parseFloat(e.target.value))}
                                className="basis-2/3 bg-transparent text-center lg:text-xl text-black dark:text-white p-2 outline-0 rounded-l-[15px] hover:bg-light-color hover:dark:bg-dark-color transition duration-600 ease-in-out"
                            />
                            <select 
                                className="basis-1/3 bg-transparent text-center lg:text-xl font-bold text-black dark:text-white p-2 outline-0 rounded-r-[15px] hover:bg-light-color hover:dark:bg-dark-color transition duration-1000 ease-in-out"
                                id="tokens"
                                name="tokens"
                                placeholder='Tokens'
                                value={props.tokenA}
                                onChange={(e) => props.setTokenA(e.target.value)}
                            >
                                {Object.keys(allowedTokens).map((key) => { 
                                    return (
                                        <option 
                                            key={key}
                                            value={key}
                                            className="bg-light-color dark:bg-dark-color lg:text-xl text-center text-black dark:text-white p-2 mt-4 rounded-[10px] border-secondary-color border-2 outline-0 shadow-lg transition duration-1000 ease-in-out"
                                        >{key}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="flex flex-row border-[2px] border-secondary-color text-center text-xl text-black dark:text-white mt-4 shadow-lg rounded-[15px]">
                            <div className="basis-2/3 bg-transparent text-center lg:text-xl text-black dark:text-white p-2 outline-0 rounded-l-[15px] ">
                                <h3>Balance:  {Number(tokenBBalance).toFixed(3)} {props.tokenB}</h3>
                            </div>
                            <select 
                                className="basis-1/3 bg-transparent text-center lg:text-xl font-bold text-black dark:text-white p-2 outline-0 rounded-r-[15px] hover:bg-light-color hover:dark:bg-dark-color transition duration-1000 ease-in-out"
                                id="tokens"
                                name="tokens"
                                placeholder='Tokens'
                                value={props.tokenB}
                                onChange={(e) => props.setTokenB(e.target.value)}
                            >
                            {Object.keys(allowedTokens).map((key) => { 
                                    return (
                                        <option 
                                            key={key}
                                            value={key}
                                            className="bg-light-color dark:bg-dark-color lg:text-xl text-center text-black dark:text-white p-2 mt-4 rounded-[10px] border-secondary-color border-2 outline-0 shadow-lg transition duration-1000 ease-in-out"
                                        >{key}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-col items-center">
                <label className="block font-medium italic text-sm text-gray-400 mt-8" htmlFor="invest">
                    Choose the Dex to swap
                </label>
                <select 
                    className="my-4 w-48 border-[2px] bg-transparent border-secondary-color text-center lg:text-xl font-bold text-black dark:text-white p-2 outline-0 rounded hover:bg-light-color hover:dark:bg-dark-color transition duration-1000 ease-in-out"
                    id="tokens"
                    name="tokens"
                    placeholder='Tokens'
                    value={props.tokenA}
                    onChange={(e) => props.setTokenA(e.target.value)}
                >
                    {Object.keys(allowedTokens).map((key) => { 
                        return (
                            <option 
                                key={key}
                                value={key}
                                className="bg-light-color dark:bg-dark-color lg:text-xl text-center text-black dark:text-white p-2 mt-4 rounded-[10px] border-secondary-color border-2 outline-0 shadow-lg transition duration-1000 ease-in-out"
                            >{key}</option>
                        )
                    })}
                </select>
                <button
                className="my-4 bg-secondary-color text-light-color dark:text-dark-color font-bold rounded-full border-2 border-transparent py-2 px-36 shadow-lg uppercase tracking-wider hover:bg-light-color hover:dark:bg-dark-color hover:text-secondary-color hover:dark:text-secondary-color hover:border-secondary-color transition duration-1000 ease-in-out"
                onClick={makeSwap}
                >
                Swap
                </button>
            </div>
        </div>
    );
}