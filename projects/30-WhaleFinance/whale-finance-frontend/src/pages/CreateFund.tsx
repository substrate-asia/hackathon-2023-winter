import { Button } from "@/components/ui/button"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Calendar as CalendarIcon } from "lucide-react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
// import {
//     Select,
//     SelectContent,
//     SelectGroup,
//     SelectItem,
//     SelectLabel,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import HeroSection from "@/components/HeroSection"
import { toast } from "@/components/ui/use-toast"
import React, { useState } from "react"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useNavigate } from "react-router-dom"
import { ethers } from 'ethers';
import { WhaleFinanceAbi } from '../contracts/WhaleFinance';
import { WhaleFinanceAddress } from '../utils/addresses';
import { allowedTokens } from "../utils/addresses";
import { PopoverClose } from "@radix-ui/react-popover"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"


export default function CreateFund({ account, signer }: { account: string | null; signer: any;}) {

    const navigator = useNavigate();

    const [loading, setLoading] = useState<boolean>(false);

    const [openInvestment, setOpenInvestment] = React.useState<Date>();
    const [closeInvestment, setCloseInvestment] = React.useState<Date>();
    const [maturationTime, setMaturationtime] = React.useState<Date>();

    const [name, setName] = React.useState('');
    const [ticker, setTicker] = React.useState('');
    const [admFee, setAdmFee] = React.useState(0.5);
    const [perfFee, setPerfFee] = React.useState(10);
    
    // const [openInvestment, setOpenInvestment] = React.useState("");
    // const [closeInvestment, setCloseInvestment] = React.useState("");
    // const [maturationTime, setMaturationtime] = React.useState("");

    const [tokens, setTokens] = React.useState<string[]>([]);

    // function handleDateTimestamp(date: string) {
    //     const dateObj = new Date(date);
    //     const timestamp = dateObj.getTime()/1000;
    //     return timestamp;
    // }

    function handleDateTimestamp(date: Date | undefined) {
        const safeDate = date || new Date();
        const timestamp = safeDate.getTime().toString();
        return timestamp;
    }

    const handleCheckboxChange = (tokenName: string, checked: boolean) => {
        setTokens(prevTokens => {
            const updatedTokens = new Set(prevTokens);
            const tokenValue = allowedTokens[tokenName];
    
            if (checked) {
                updatedTokens.add(tokenValue);
            } else {
                updatedTokens.delete(tokenValue);
            }
    
            return Array.from(updatedTokens);
        });
    };

    async function handleSubmit() {
        if (!openInvestment || !(openInvestment instanceof Date) || 
            !closeInvestment || !(closeInvestment instanceof Date) || 
            !maturationTime || !(maturationTime instanceof Date)) {
            alert("Please fill all the fields");
            return;
        }
        if(!signer){
            alert("Please connect your wallet");
            return;
        }
        if(tokens.length === 0){
            alert("Please add at least one token");
            return;
        }
        setLoading(true);

        const openInvestmentTimestamp = handleDateTimestamp(openInvestment);
        const closeInvestmentTimestamp = handleDateTimestamp(closeInvestment);
        const maturationTimeTimestamp = handleDateTimestamp(maturationTime);

        const admFeeBps = admFee * 100;
        const perfFeeBps = perfFee * 100;

        try{
            const whaleFinanceContract = new ethers.Contract(WhaleFinanceAddress, WhaleFinanceAbi, signer);
            const txNewFund = await whaleFinanceContract.createFund(
                name,
                ticker, 
                account, 
                tokens, 
                admFeeBps, 
                perfFeeBps,
                openInvestmentTimestamp,
                closeInvestmentTimestamp,
                maturationTimeTimestamp
            );

            await txNewFund.wait();
            console.log(txNewFund);
            navigator('/success');

        } catch(err){
            console.log(err);
            alert("Something went wrong! Try again");
            

        }finally{
            setLoading(false);
        }   
    }

    function onSave() {
        toast({
          title: "You saved",
          description: "Fund data information",
        })
        console.log(name);
        console.log(ticker);
        console.log(admFee);
        console.log(perfFee);
    }

    const onSubmit = async () => {
        await handleSubmit();
        toast({
          title: "You submitted",
          description: "your Fund Creation",
        })
        console.log(openInvestment);
        console.log(closeInvestment);
        console.log(maturationTime);
        console.log(tokens);
    }

    return (
        <div className='w-[100vw] h-[100vh] overflow-y-auto'>
            <div className="p-12">
                <HeroSection title="Create Fund"/>
                <Tabs defaultValue="fund_data" className="w-full">
                    <TabsList className="mb-8 grid-cols-2">
                        <TabsTrigger className="px-6" value="fund_data">Fund Data</TabsTrigger>
                        <TabsTrigger className="px-6" value="fund_regulation">Fund Regulation</TabsTrigger>
                    </TabsList>
                    <TabsContent value="fund_data">
                        <Card>
                        <CardHeader>
                            <CardTitle>Fund Data</CardTitle>
                            <CardDescription>
                            Make changes to your fund information here. Click save when you're done.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="space-y-1">
                                    <Label>Name</Label>
                                    <Input 
                                        id="name" 
                                        type="text" 
                                        placeholder="ex. Falcon Fund" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                    </div>
                                    <div className="space-y-1">
                                    <Label>Ticker</Label>
                                    <Input 
                                        id="ticker" 
                                        type="text" 
                                        placeholder="ex. FLCN"
                                        value={ticker}
                                        onChange={(e) => setTicker(e.target.value)}
                                    />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="space-y-1">
                                    <Label>Administration Fee</Label>
                                    <Input 
                                        id="admfee" 
                                        type="number" 
                                        placeholder="ex. 1%" 
                                        value={admFee}
                                        onChange={(e) => setAdmFee(parseFloat(e.target.value))}
                                    />
                                    </div>
                                    <div className="space-y-1">
                                    <Label>Performace Fee</Label>
                                    <Input 
                                        id="perfee" 
                                        type="number" 
                                        placeholder="ex. 10%" 
                                        value={perfFee}
                                        onChange={(e) => setPerfFee(parseFloat(e.target.value))}
                                    />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            {loading ?
                            <Button disabled>
                                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </Button>
                            :
                            <Button onClick={onSave}>Save Changes</Button>
                            }
                        </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="fund_regulation">
                        <Card>
                        <CardHeader>
                            <CardTitle>Fund Regulation</CardTitle>
                            <CardDescription>
                            Change your fund regulation here. After sending, you will create your fund.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="grid grid-cols-4 gap-4">
                                <div className="col-span-2 space-y-2">
                                    <div className="space-y-1">
                                    <Label>Start time for investments</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !openInvestment && "text-muted-foreground"
                                            )}
                                            >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {openInvestment ? format(openInvestment, "PPP") : <span>Pick a time to open investments</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <PopoverClose>
                                                <Calendar
                                                mode="single"
                                                selected={openInvestment}
                                                onSelect={setOpenInvestment}
                                                initialFocus
                                                />
                                            </PopoverClose> 
                                        </PopoverContent>
                                    </Popover>
                                    </div>
                                    <div className="space-y-1">
                                    <Label>End time for investments</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !closeInvestment && "text-muted-foreground"
                                            )}
                                            >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {closeInvestment ? format(closeInvestment, "PPP") : <span>Pick a time to close investments</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <PopoverClose>
                                                <Calendar
                                                mode="single"
                                                selected={closeInvestment}
                                                onSelect={setCloseInvestment}
                                                initialFocus
                                                />
                                            </PopoverClose> 
                                        </PopoverContent>
                                    </Popover>
                                    </div>
                                    <div className="space-y-1">
                                    <Label>Maturation Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !maturationTime && "text-muted-foreground"
                                            )}
                                            >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {maturationTime ? format(maturationTime, "PPP") : <span>Pick a maturation date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <PopoverClose>
                                                <Calendar
                                                mode="single"
                                                selected={maturationTime}
                                                onSelect={setMaturationtime}
                                                initialFocus
                                                />
                                            </PopoverClose>
                                        </PopoverContent>
                                    </Popover>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="space-y-1">
                                        <Label>Accepted Tokens</Label>
                                        <div className="flex items-center space-x-2">
                                            <ScrollArea className="h-[18vh] w-full rounded-md border">
                                            <div className="p-4 space-y-4">
                                                {Object.keys(allowedTokens).map((tokenName: string, idx: number) => {
                                                    return(
                                                    <div key={idx} className="flex items-center space-x-4">                                                
                                                        <Checkbox 
                                                            onCheckedChange={(checked) => {
                                                                const isChecked = typeof checked === 'boolean' && checked;
                                                                handleCheckboxChange(tokenName, isChecked)
                                                            }}
                                                        />
                                                        <label
                                                            htmlFor="token"
                                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                        >
                                                            {tokenName}
                                                        </label>
                                                    </div>
                                                    );
                                                })}
                                            </div>
                                            </ScrollArea>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="space-y-2">
                                    <div className="space-y-1">
                                        <Label>Choosen Dex</Label>
                                        <Select>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a Dex" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                <SelectLabel>Dex</SelectLabel>
                                                <SelectItem value="apple">Apple</SelectItem>
                                                <SelectItem value="banana">Banana</SelectItem>
                                                <SelectItem value="blueberry">Blueberry</SelectItem>
                                                <SelectItem value="grapes">Grapes</SelectItem>
                                                <SelectItem value="pineapple">Pineapple</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div> */}
                            </div>
                        </CardContent>
                        <CardFooter>
                            {loading ?
                            <Button disabled>
                                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </Button>
                            :
                            <Button onClick={onSubmit}>Submit Fund</Button>
                            }
                        </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
                <div className="w-full bg-red-600"></div>
            </div>
        </div>
    )
}