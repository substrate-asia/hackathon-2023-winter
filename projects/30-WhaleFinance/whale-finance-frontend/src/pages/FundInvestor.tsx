import {
    Card,
    CardContent,
    CardDescription,
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
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
// import axios from 'axios';
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Label } from "@radix-ui/react-label";
import { ReloadIcon } from "@radix-ui/react-icons"
import FundHeroSection from "@/components/FundHeroSection";
import { WhaleFinanceAddress, WhaleTokenAddress, scanUrl } from '../utils/addresses';
import { QuotaTokenAbi } from '../contracts/QuotaToken';
import { WhaleFinanceAbi } from '../contracts/WhaleFinance';
import { ethers } from "ethers"
import { MultiChainTokenAbi } from "@/contracts/MultichainToken"
import { useTheme } from "@/components/theme-provider"
import { getChartColors } from "@/utils/chartUtils"
import { ChartTestComponent } from "@/components/ChartTest"
import { Coins, DollarSign, TrendingUp, Wallet } from "lucide-react"

type FundData = {
    id: number;
    name: string;
    description: string;
    avatar: string;
};

const initialData = [
    { time: '2018-12-22', value: 32.51 },
    { time: '2018-12-23', value: 31.11 },
    { time: '2018-12-24', value: 27.02 },
    { time: '2018-12-25', value: 27.32 },
    { time: '2018-12-26', value: 25.17 },
    { time: '2018-12-27', value: 28.89 },
    { time: '2018-12-28', value: 25.46 },
    { time: '2018-12-29', value: 23.92 },
    { time: '2018-12-30', value: 22.68 },
    { time: '2018-12-31', value: 22.67 },
]; 

export default function FundInvestor({ account, provider, signer }: { account: string | null; provider: any; signer: any;}) {

    const params = useParams();
    const fundId = params.id || '';

    const navigator = useNavigate();

    const [fund, setFund] = useState<FundData | null>(null);
    const [invest, setInvest] = useState(0);
    const [whaleTokenBalance, setWhaleTokenBalance] = useState(0);
    const [fundName, setFundName] = useState("Fund");
    const [fundManager, setFundManager] = useState("0x0");

    const [investMsg, setInvestMsg] = useState("Invest");

    const [loading, setLoading] = useState<boolean>(false);

    async function getWhaleTokenBalance(){
        try{
            if(account == "" || !ethers.utils.isAddress(account as string)){
                return;
            }
            const whaleTokenContract = new ethers.Contract(WhaleTokenAddress,MultiChainTokenAbi, signer);
            const balanceToken = await whaleTokenContract.functions.balanceOf(account);
            
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

    useEffect(() => {
        getFundManager();
    }, [signer]);

    useEffect(() => {
        getWhaleTokenBalance();
    }, [signer]);

    async function makeInvestment(){
        try{
            if(invest <= 0 || invest > whaleTokenBalance){
                toast({
                    title: "Unable to invest",
                    description: "Please enter a valid amount to invest"
                })
                
                return;
            }

            const whaleFinanceContract = new ethers.Contract(WhaleFinanceAddress, WhaleFinanceAbi, signer);

            const whaleTokenContract = new ethers.Contract(WhaleTokenAddress, QuotaTokenAbi, signer);
            
            setLoading(true);
            const txApprove = await whaleTokenContract.functions.approve(WhaleFinanceAddress, ethers.utils.parseEther(String(invest)));

            console.log(txApprove)
            await txApprove.wait();

            setLoading(false);

            setInvestMsg("Invest");
            setLoading(true);
            console.log(fundId)
            const txInvest = await whaleFinanceContract.functions.invest(ethers.utils.parseEther(String(invest)), fundId);
            console.log(fundId)

            setLoading(true);
            await txInvest.wait();
            setLoading(false);

            toast({
                title: "You invested",
                description: "using Whale Finance",
              })

        }catch(err){
            console.log(err);
        } finally{
            setLoading(false);
            setInvest(0);
            setInvestMsg("Approve WHALE")
        }
    }
    
    useEffect(() => {
        
    },[signer]);

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

    function formatToUSD(number: number) {
        const formattedNumber = new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(number); // Convert to millions
      
        return `${formattedNumber}`;
    }

    const { theme } = useTheme();

    const [chartColors, setChartColors] = useState(() => getChartColors());

    useEffect(() => {
        setTimeout(() => {
            setChartColors(getChartColors());
        }, 1); // Adjust delay
    }, [theme]);


    const allocation = [
        {
          token: "TOKEN1",
          weight: "10%",
          totalAmount: "$250,000.00",
          price: "$10",
        },
        {
          token: "TOKEN2",
          weight: "20%",
          totalAmount: "$150,000.00",
          price: "$20",
        },
        {
          token: "TOKEN3",
          weight: "30%",
          totalAmount: "$350,000.00",
          price: "$25",
        },
        {
          token: "TOKEN4",
          weight: "40%",
          totalAmount: "$450,000.00",
          price: "$15",
        },
    ]

    return (
        <div className='w-[100vw] h-[100vh] overflow-y-auto'>
            <FundHeroSection name={fundName} description={"Description"}  color="primary" manager={fundManager}/>
            <div className="px-12 pb-12">
                <Tabs defaultValue="invest" className="w-full">
                    <TabsList className="mb-8 grid-cols-2">
                        <TabsTrigger className="px-6" value="invest">Overview</TabsTrigger>
                        <TabsTrigger className="px-6" value="fund_information">Portfolio Info</TabsTrigger>
                    </TabsList>
                    <TabsContent className="space-y-4" value="invest">
                        <Card>
                            <CardHeader>
                                <CardTitle>Invest</CardTitle>
                                <CardDescription>You can choose the amount of WHALE to invest in this fund</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex space-x-4">
                                    <div className="flex-1 space-y-1">
                                        <Label className="text-sm ml-2">Amount of WHALE</Label>
                                        <div className="flex flex-row space-x-1">
                                            <Input 
                                                id="invest" 
                                                type="number" 
                                                placeholder="ex. 129"
                                                value={invest}
                                                onChange={(e) => setInvest(parseFloat(e.target.value))} 
                                            />
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Button
                                                        onClick={() => setInvest(whaleTokenBalance)}
                                                        className="underline text-primary px-2" variant="outline">Max</Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                    <p>Invest all your money in the wallet</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </div>
                                    <div className="flex-1 flex flex-col items-start space-y-1 bg-primarylighter rounded px-4 py-2">
                                        <Label className="text-sm">WHALE Balance in your wallet</Label>
                                        <div className="flex flex-col items-center justify-center">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger className="text-2xl font-bold">
                                                    <div>
                                                    {formatToUSD(whaleTokenBalance)}
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                <p>Check in your wallet</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        </div>
                                    </div>
                                </div>
                                {loading ?
                                <Button disabled>
                                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </Button>
                                :
                                <Button onClick={makeInvestment}>{investMsg}</Button>
                                }
                                {/* <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        {loading ?
                                        <Button disabled>
                                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                            Please wait
                                        </Button>
                                        :
                                        <Button onClick={makeInvestment}>{investMsg}</Button>
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
                                            Invest
                                        </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog> */}
                            </CardContent>
                        </Card>
                        <div className="grid grid-cols-1 gap-4 justify-center my-6 md:grid-cols-5 lg:grid-cols-5">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Price</CardTitle>
                                </CardHeader>
                                <CardContent className="text-xl flex flex-row space-x-2">
                                    <Wallet />
                                    <p>{formatToUSD(10)}</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Assets Under Management (TVL)</CardTitle>
                                </CardHeader>
                                <CardContent className="text-xl flex flex-row space-x-2">
                                    <Coins />
                                    <p>{formatToUSD(100000000)}</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Fund Performance (APY)</CardTitle>
                                </CardHeader>
                                <CardContent className="text-xl flex flex-row space-x-2">
                                    <TrendingUp />
                                    <p>+25%</p>
                                </CardContent>
                            </Card>
                            <Card className="border-[1px] border-primary">
                                <CardHeader>
                                    <CardTitle>My Value Deposited</CardTitle>
                                </CardHeader>
                                <CardContent className="text-xl flex flex-row space-x-2">
                                    <Coins />
                                    <p>{formatToUSD(0)}</p>
                                </CardContent>
                            </Card>
                            <Card className="border-[1px] border-primary">
                                <CardHeader>
                                    <CardTitle>My Total Return</CardTitle>
                                </CardHeader>
                                <CardContent className="text-xl flex flex-row space-x-2">
                                    <TrendingUp />
                                    <p>0%</p>
                                </CardContent>
                            </Card>
                        </div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Performance</CardTitle>
                                <CardDescription>Price</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartTestComponent data={initialData} colors={chartColors}></ChartTestComponent>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent className="space-y-4" value="fund_information">
                        {/* <Card>
                            <CardHeader>
                                <CardTitle>Fund Regulation</CardTitle>
                            </CardHeader>
                            <CardContent>
                                data about the fund here
                            </CardContent>
                        </Card> */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Tokens Allocation</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                        <TableHead className="">Asset</TableHead>
                                        <TableHead className="text-right">Allocation</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {allocation.map((token) => (
                                        <TableRow key={token.token}>
                                            <TableCell className="">{token.token}</TableCell>
                                            <TableCell className="text-right">{token.weight}</TableCell>
                                            <TableCell className="text-right">{token.price}</TableCell>
                                            <TableCell className="text-right">{token.totalAmount}</TableCell>
                                        </TableRow>
                                        ))}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                        <TableCell colSpan={4} className="text-right">$1,200,000.00</TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}