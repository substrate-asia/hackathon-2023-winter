import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
// import axios from 'axios';
import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Label } from "@radix-ui/react-label";
import { ReloadIcon } from "@radix-ui/react-icons"
import FundHeroSection from "@/components/FundHeroSection";
import { SwapRouter, WhaleFinanceAddress, WhaleTokenAddress, WhaleTokenAddressMandala, WhaleTokenAddressWhaleChain, allowedTokens } from "../utils/addresses";
import { QuotaTokenAbi } from "../contracts/QuotaToken";
import { WhaleFinanceAbi } from "../contracts/WhaleFinance";
import { SafeAccountAbi } from "../contracts/SafeAccount";
import { Trade } from "@uniswap/sdk";
import { ArrowDownUp, ArrowRightLeft } from 'lucide-react';
import { ethers } from "ethers"
import { networks } from "@/utils/chains"
import { MultiChainTokenAbi } from "@/contracts/MultichainToken"
import { ChainContext } from "@/contexts/ChainContext"
import { switchNetwork } from "@/utils/connectMetamask"
import { ChartTestComponent } from "@/components/ChartTest"

type FundData = {
    id: number;
    name: string;
    description: string;
    avatar: string;
};

export default function FundManager({ account, provider, signer} : { account: string | null; provider: any; signer: any;}) {

    const navigator = useNavigate();

    const context = useContext(ChainContext) as { chain: number; setChain: any; };

    const params = useParams();
    const fundId = params.id || '';
    if(!fundId || fundId === ''){
        navigator('/funds-list');
    }

    const [fund, setFund] = useState<FundData | null>(null);

    const [tokenA, setTokenA] = useState("DOT");
    const [tokenABalance, setTokenABalance] = useState(0);
    const [tokenB, setTokenB] = useState("WBTC");
    const [tokenBBalance, setTokenBBalance] = useState(0);

    const [fundName, setFundName] = useState("Fund");

    const [whaleTokenBalance, setWhaleTokenBalance] = useState(0);
    const [amountBridge, setAmountBridge] = useState(0);

    const [fundManager, setFundManager] = useState("0x0");

    

    const [amountSwap, setAmountSwap] = useState(0);
    const [msgSwap, setMsgSwap] = useState("Approve");
    const [msgBridge, setMsgBridge] = useState("Bridge")

    const [chainA, setchainA] = useState("Whale Chain Testnet");
    const [chainB, setchainB] = useState("Mandala Testnet");

    const [loading, setLoading] = useState<boolean>(false);

    async function getTokenABalance(){
        try{
            const tokenAAddress = allowedTokens[tokenA];
            const tokenAContract = new ethers.Contract(tokenAAddress, QuotaTokenAbi, signer);
            const tokenABalance = await tokenAContract.functions.balanceOf(account);
            
            setTokenABalance(Number(ethers.utils.formatEther(tokenABalance[0]._hex)));

            
        } catch(err){
            console.log(err);
            toast({
                title: "Error",
                description: "Error getting balance"
            })
        }
    }

    async function getTokenBBalance(){
        try{
            const tokenAAddress = allowedTokens[tokenB];
            const tokenAContract = new ethers.Contract(tokenAAddress, QuotaTokenAbi, signer);
            const tokenABalance = await tokenAContract.functions.balanceOf(account);
            
            setTokenBBalance(Number(ethers.utils.formatEther(tokenABalance[0]._hex)));

            
        } catch(err){
            console.log(err);
            toast({
                title: "Error",
                description: "Error getting balance"
            })
        }
    }

    async function getWhaleTokenBalance(){
        try{
            if(account == "" || !ethers.utils.isAddress(account as string)){
                return;
            }
            let tokenAddress = WhaleTokenAddress;
                if(context.chain == 253253){
                tokenAddress = WhaleTokenAddressWhaleChain
            } else if(context.chain == 595){
                tokenAddress = WhaleTokenAddressMandala
            }

            console.log("address", tokenAddress)

            console.log("chain", context.chain)
            const whaleTokenContract = new ethers.Contract(tokenAddress,MultiChainTokenAbi, provider);
            console.log("whaleTokenContract", whaleTokenContract)
            console.log("account", account);
            const balanceToken = await whaleTokenContract.functions.balanceOf(account);

            console.log("balanceToken", balanceToken)
            
            setWhaleTokenBalance(Number(ethers.utils.formatEther(balanceToken[0]._hex)));
            

        } catch(err){
            toast({
                title: "Error getting Whale Balance",
                description: "Connect to Metamask"
            })
            console.log(err)
        } 
    }

    async function getFundManager(){
        try{
            if(account == "" || !ethers.utils.isAddress(account as string)){
                return;
            }
            const whaleFinanceContract = new ethers.Contract(WhaleFinanceAddress,WhaleFinanceAbi, signer);
            const managerAccount = await whaleFinanceContract.functions.ownerOf(fundId);
            
            setFundManager(managerAccount[0]);
            

        } catch(err){
            toast({
                title: "Error getting Whale Balance",
                description: "Connect to Metamask"
            })
            console.log(err)
        }
    }

    async function getFundName(){
        try{
            if(account == "" || !ethers.utils.isAddress(account as string)){
                return;
            }
            const whaleFinanceContract = new ethers.Contract(WhaleFinanceAddress,WhaleFinanceAbi, provider);
            const nameFund = await whaleFinanceContract.functions.fundsNames(fundId);
            setFundName(nameFund[0]);

        } catch(err){
            toast({
                title: "Error fund name",
                description: "Unable to get fund name"
            })
            console.log(err)
        } 
    }

    useEffect(() => {
        getFundName();
    },[account, signer]);

    useEffect(() => {
        getFundManager();
    }, [signer]);

    useEffect(() => {
        getWhaleTokenBalance();
    }, [signer]);

    useEffect(() =>{
        getTokenABalance();
    },[signer]);

    useEffect(() => {
        getTokenBBalance();
    }, [signer])

    useEffect(() => {
        const hedgeFunds: FundData[] = [
            { id: 1, name: "Alpha Capital", description: "Specializes in algorithm-based trading strategies across global equity markets.", avatar: "src/assets/whale_avatar3.png"  },
            { id: 2, name: "Blue Peak Investments", description: "Focuses on long/short equity with a strong emphasis on emerging markets.", avatar: "src/assets/whale_avatar4.png" },
            { id: 3, name: "Crestwood Equity Partners", description: "A multi-strategy fund with a focus on value and event-driven investments.", avatar: "src/assets/whale_avatar5.png" },
            { id: 4, name: "Diamond Edge Capital", description: "Engages in quantitative trading, utilizing advanced analytics in global markets.", avatar: "src/assets/whale_avatar1.png" },
            { id: 5, name: "Echo Ventures", description: "Prioritizes sustainable and socially responsible investments in technology and green energy sectors.", avatar: "src/assets/whale_avatar3.png" },
            { id: 6, name: "Falcon Asset Management", description: "Specializes in high-yield fixed income and distressed assets.", avatar: "src/assets/whale_avatar1.png" },
            { id: 7, name: "Granite Hill Partners", description: "A real estate-focused hedge fund with an emphasis on commercial properties.", avatar: "src/assets/whale_avatar2.png" },
            { id: 8, name: "Horizon Global Strategies", description: "Concentrates on macroeconomic trends to guide investment in international equities and commodities.", avatar: "src/assets/whale_avatar4.png" },
            { id: 9, name: "Ironclad Funds", description: "Utilizes a risk-averse approach to invest in large-cap stocks and government bonds.", avatar: "src/assets/whale_avatar2.png" },
            { id: 10, name: "Jupiter Wealth Management", description: "A boutique hedge fund focusing on wealth preservation and conservative growth strategies.", avatar: "src/assets/whale_avatar5.png" }
        ];

        // Find the fund with the matching ID
        const selectedFund = hedgeFunds.find(f => f.id === parseInt(fundId, 10)) || null;
        setFund(selectedFund);
    }, [fundId]);

    function performeChangeSwap(){
        setTokenA(tokenB);
        setTokenABalance(tokenBBalance);
        setTokenB(tokenA);
        setTokenBBalance(tokenABalance);
    }

    function performeChangeBridge(){
        setchainA(chainB);
        setchainB(chainA);
    }

    async function makeSwap(){
        if(tokenA === tokenB){
            toast({
                title: "Same tokens not allowed",
                description: "Please select different tokens"
            })
            return;
        }

        try{
            setLoading(false);
            const tokenAAddress = allowedTokens[tokenA];
            const tokenBAddress = allowedTokens[tokenB];

            const whaleFinanceContract = new ethers.Contract(WhaleFinanceAddress, WhaleFinanceAbi, signer);
            
            setLoading(true);
            const fundAddress = await whaleFinanceContract.functions.fundsAddresses(fundId);

            
            let path: any[] = [];

            path = [tokenAAddress, tokenBAddress];

            // const routerContract = new ethers.Contract(SwapRouter, ["function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)"], props.signer);

            const deadline = Math.floor(Date.now() / 1000) + 3600;

            const fundContract = new ethers.Contract(fundAddress[0], SafeAccountAbi, signer);


            const txApprove = await fundContract.functions.executeApprove(tokenAAddress, SwapRouter, ethers.utils.parseEther(String(amountSwap)));

            await txApprove.wait();


            const txSwap = await fundContract.functions.executeSwapExactTokensForTokens(
                ethers.utils.parseEther(String(amountSwap)), 0, path, account, deadline);

            await txSwap.wait();

        } catch(err){
            toast({
                title: "Swapping Error",
                description: "Error during swap"
            })
            console.log(err);
        } finally{
            setLoading(false);
        }
    }

    async function makeBridge(){
        if(chainA === chainB){
            toast({
                title: "Same chains not allowed",
                description: "Please select different chains"
            })
            return;
        }
        if(msgBridge == "Bridge"){
            try{
                setLoading(true);
                if(account == "" || !ethers.utils.isAddress(account as string)){
                    return;
                }
                
                let tokenAddress = WhaleTokenAddressWhaleChain;
                if(context.chain == 253253){
                    tokenAddress = WhaleTokenAddressWhaleChain
                } else if(context.chain == 595){
                    tokenAddress = WhaleTokenAddressMandala
                }
                const whaleTokenContract = new ethers.Contract(tokenAddress,MultiChainTokenAbi, signer);

                const txBurn = await whaleTokenContract.functions.debitFromChain(context.chain, ethers.utils.parseEther(String(amountBridge)));
                await txBurn.wait();

                await getWhaleTokenBalance();
                setMsgBridge("Change Chain");


            } catch(err){
                console.log(err);
            } finally{
                setLoading(false);
            }
        } else if (msgBridge == "Change Chain"){
            try{
                setLoading(true);

                const chainId = networks[chainB];
                await switchNetwork(chainId);
                
                setMsgBridge("Redeem Tokens");
            } catch(err){
                console.log(err);
            } finally{
                setLoading(false);
            }
        } else if(msgBridge == "Redeem Tokens"){
            try{
                setLoading(true);
                let tokenAddress = "";
                if(chainB == "Whale Chain Testnet"){
                    tokenAddress = WhaleTokenAddressWhaleChain
                } else if(chainB == "Mandala Testnet"){
                    tokenAddress = WhaleTokenAddressMandala
                }
                const whaleTokenContract = new ethers.Contract(tokenAddress,MultiChainTokenAbi, signer);

                const txMint = await whaleTokenContract.functions.credit(context.chain, account, ethers.utils.parseEther(String(amountBridge)));

                await txMint.wait();

                await getWhaleTokenBalance();

                setMsgBridge("Bridge");
            } catch(err){
                console.log(err);
            } finally{
                setLoading(false);
            }
        }
    }

    return (
        <div className='w-[100vw] h-[100vh] overflow-y-auto'>
            <FundHeroSection name={fundName} description={fund?.description} manager={fundManager}  color="secondary"/>
            <div className="px-12 pb-12">
                <Tabs defaultValue="swap" className="w-full">
                    <TabsList className="mb-8 grid-cols-2">
                        <TabsTrigger className="px-6" value="swap">Swap & Bridge</TabsTrigger>
                        <TabsTrigger className="px-6" value="fund_information">Fund Info</TabsTrigger>
                    </TabsList>
                    <TabsContent className="space-y-4" value="swap">

{/* SWAP CARD */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Swap</CardTitle>
                                <CardDescription>You can choose the tokens and amounts to perform the swap</CardDescription>
                            </CardHeader>
                            <CardContent className="my-6 space-y-4 flex justify-center">
                                <div className="lg:w-[50%] flex flex-col space-y-4">
                                    <Label className="text-sm text-primary indent-2">Choose token to swap:</Label>
                                    <div className="flex-1 flex flex-row space-x-1">
                                        <Input 
                                            id="tokenA" 
                                            type="number" 
                                            placeholder={`Amount of ${tokenA}`}
                                            className="flex-1"
                                            value={amountSwap}
                                            onChange={(e) => setAmountSwap(parseFloat(e.target.value))} 
                                        />
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Button 
                                                    onClick={() => setAmountSwap(tokenABalance)}
                                                    className="underline text-primary px-2" variant="outline">Max</Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                <p>Use everything in the balance</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <Select
                                            value={tokenA}
                                            onValueChange={(value) => setTokenA(value)}
                                        >
                                            <SelectTrigger className="bg-secondary w-[150px]">
                                                <SelectValue placeholder="Select a token" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                <SelectLabel>Tokens</SelectLabel>
                                                {Object.keys(allowedTokens).map((key) => { 
                                                    return (
                                                        <SelectItem
                                                            key={key}
                                                            value={key}
                                                        >
                                                            {key}
                                                        </SelectItem>
                                                    )
                                                })}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="w-full flex justify-end">
                                        <Label className="flex flex-row w-[150px] text-sm indent-3">
                                            Balance:
                                            <p className="text-md font-bold">{Number(tokenABalance).toFixed(3)}</p>
                                        </Label>
                                    </div>
                                    <Button className="self-center rounded-full" onClick={() => performeChangeSwap()}><ArrowDownUp/></Button>
                                    <Label className="text-sm text-primary indent-2">Receive:</Label>
                                    <div className="flex-1 flex flex-row space-x-1">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger
                                                    className="flex-1 text-sm flex flex-row items-center space-x-4 bg-primarylighter border-primarylighter shadow-sm px-4"
                                                >
                                                    <p>{`Amount of ${tokenB} :`}</p>
                                                    <p className="text-md font-bold">{Number(0).toFixed(3)}</p>
                                                </TooltipTrigger>
                                                <TooltipContent side="top">
                                                <p>This is the amount you will receive of the choosen token (in the right) making the swap</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <Select
                                            value={tokenB}
                                            onValueChange={(value) => setTokenB(value)}
                                        >
                                            <SelectTrigger className="bg-secondary w-[150px]">
                                                <SelectValue placeholder="Select a token" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                <SelectLabel>Tokens</SelectLabel>
                                                {Object.keys(allowedTokens).map((key) => { 
                                                    return (
                                                        <SelectItem
                                                            key={key}
                                                            value={key}
                                                        >
                                                            {key}
                                                        </SelectItem>
                                                    )
                                                })}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="w-full flex justify-end">
                                        <Label className="flex flex-row w-[150px] text-sm indent-3">
                                            Balance:
                                            <p className="text-md font-bold">{Number(tokenBBalance).toFixed(3)}</p>
                                        </Label>
                                    </div>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            {loading ?
                                            <Button disabled className="w-[200px] self-center rounded">
                                                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                                Please wait
                                            </Button>
                                            :
                                            <Button className="w-[200px] font-bold self-center rounded">{msgSwap}</Button>
                                            }
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone.
                                            </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction>
                                                <p onClick={makeSwap}>{msgSwap}</p>
                                            </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </CardContent>
                        </Card>

{/* BRIDGE CARD */}

                        <Card>
                            <CardHeader>
                                <CardTitle>Bridge WHALE tokens</CardTitle>
                                <CardDescription>You can choose the chains and the amount to perform the bridge</CardDescription>
                            </CardHeader>
                            <CardContent className="my-6 space-y-4 flex justify-center">
                                <div className="lg:w-[50%] flex flex-col space-y-4">
                                    <div className="flex flex-row space-x-16">
                                        <div className="flex-1 flex flex-col space-y-2">
                                            <Label className="text-sm text-primary indent-2">Origin Chain</Label>
                                            <Select
                                                value={chainA}
                                                onValueChange={(value) => setchainA(value)}
                                            >
                                                <SelectTrigger className="flex-1 bg-secondary">
                                                    <SelectValue placeholder="Select a token" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                    <SelectLabel>Tokens</SelectLabel>
                                                    {Object.keys(networks).map((key) => { 
                                                        return (
                                                            <SelectItem
                                                                key={key}
                                                                value={key}
                                                            >
                                                                {key}
                                                            </SelectItem>
                                                        )
                                                    })}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Button className="self-end rounded-full" onClick={() => performeChangeBridge()}><ArrowRightLeft/></Button>
                                        <div className="flex-1 flex flex-col space-y-2">
                                            <Label className="text-sm text-primary indent-2">Destination Chain:</Label>
                                            <Select
                                                value={chainB}
                                                onValueChange={(value) => setchainB(value)}
                                            >
                                                <SelectTrigger className="flex-1 bg-secondary">
                                                    <SelectValue placeholder="Select a token" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                    <SelectLabel>Tokens</SelectLabel>
                                                    {Object.keys(networks).map((key) => { 
                                                        return (
                                                            <SelectItem
                                                                key={key}
                                                                value={key}
                                                            >
                                                                {key}
                                                            </SelectItem>
                                                        )
                                                    })}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <Label className="text-sm ml-2">Amount</Label>
                                        <div className="flex flex-row space-x-1">
                                            <Input 
                                                id="bridgeAmount" 
                                                type="number" 
                                                placeholder="ex. 129"
                                                value={amountBridge}
                                                onChange={(e) => setAmountBridge(parseFloat(e.target.value))}
                                            />
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Button 
                                                        onClick={() => setAmountBridge(whaleTokenBalance)}
                                                        className="underline text-primary px-2" variant="outline">Max</Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                    <p>Use everything in the balance</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </div>
                                    <div className="w-full flex justify-end">

{/* NEED TO CHANGE THE BALANCE */}

                                        <Label className="flex flex-row w-[150px] text-sm indent-3">
                                            Balance:
                                            <p className="text-md font-bold">{Number(whaleTokenBalance).toFixed(3)}</p>
                                        </Label>
                                    </div>
                                    <div className="flex-1 flex flex-col items-start space-y-1 bg-primarylighter rounded px-4 py-2">
                                        <Label className="text-sm">Destination Account:</Label>
                                        <div className="flex flex-col items-center justify-center text-sm">
                                            <p>{account}</p>
                                        </div>
                                    </div>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            {loading ?
                                            <Button disabled className="w-[200px] self-center rounded">
                                                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                                Please wait
                                            </Button>
                                            :
                                            <Button className="w-[200px] font-bold self-center rounded">{msgBridge}</Button> // button
                                            }
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone.
                                            </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction>
                                                <p onClick={makeBridge}>{msgBridge}</p>
                                            </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent className="space-y-4" value="fund_information">
                        <Card>
                            <CardHeader>
                            </CardHeader>
                            <CardContent>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}