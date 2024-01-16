import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import {
//   Sheet,
//   SheetClose,
//   SheetContent,
//   SheetDescription,
//   SheetFooter,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import ConnectWalletBtn from "./ConnectWalletBtn";
import NavButton from "./NavButton";
import LogoApp from "../assets/whale_logo_green.png";
import blockies from 'ethereum-blockies-base64';
import { useEffect, useState } from "react";
import AvatarDefault from "../assets/whale_avatar1.png"
import { switchNetwork } from "../utils/connectMetamask";
import { networks } from "@/utils/chains";

export function Header({ isMetamaskInstalled, connectWallet, account, signer }: 
    { isMetamaskInstalled: boolean; connectWallet: any; account: string | null; signer: any;}) {

    const navigator = useNavigate();

    const [avatar, setAvatar] = useState('');

    const [selectedNetwork, setSelectedNetwork] = useState('');
    const [networkIcons, setNetworkIcons] = useState<{ [key: string]: string }>({});

    

    const handleNetworkChange = async (networkName: string) => {
        const chainId = networks[networkName];
        if (chainId) {
          await switchNetwork(chainId);
        setSelectedNetwork(networkName.toString());
        }
    };

    const getAccountAvatar = async () => {
        try {
          if (account) {
            return blockies(account);
          } else {
            return '../assets/whale_avatar1.png';
          }
        } catch (error) {
          return '../assets/whale_avatar1.png';
        }
    };
    
    useEffect(() => {
        getAccountAvatar().then(setAvatar);

        const iconsMock: { [key: string]: string } = {
            'Ethereum': 'src/assets/ETH-icon.png',
            'Polygon': 'src/assets/Polygon-icon.png',
            'BNB Chain': 'src/assets/BNB-icon.png'
        };

        setNetworkIcons(iconsMock);

        console.log(networkIcons['BNB Chain']);
    }, [signer]);


    return (
        <div className='md:w-[12.5vw] lg:w-[12.5vw] md:h-screen lg:h-screen shadow-2xl border-r-[1px] border-secondary'>
            <div className="w-full bg-transparent flex flex-col items-center">
                <img className="w-[120px] py-[3vh] cursor-pointer" src={LogoApp} alt="Whale Finance" onClick={() => navigator('/')}/>
                <Button variant="ghost" className="w-full" onClick={() => navigator('/')}>Home</Button>
                <NavButton to="/funds-list">Funds List</NavButton>
                <NavButton to="/create-fund">Create Fund</NavButton>
                <NavButton to="/manager">Manager Area</NavButton>
                <div className="w-full flex flex-row justify-center mt-[30vh] my-6">
                    <Avatar>
                        <AvatarImage src={avatar} alt="@user" />
                        <AvatarFallback><img src={AvatarDefault} alt="@user" /></AvatarFallback>
                    </Avatar>
                </div>
                <ConnectWalletBtn
                    isMetamaskInstalled={isMetamaskInstalled}
                    connectWallet={connectWallet}
                    account={account}
                    signer={signer}
                />
                <Select
                    disabled={!signer}
                    value={selectedNetwork}
                    onValueChange={(value) => handleNetworkChange(value)}
                >
                    <SelectTrigger className="border-transparent w-[80%] mt-2">
                        <SelectValue className="truncate" placeholder="Select a Network" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                        <SelectLabel>Networks</SelectLabel>
                        {Object.keys(networks).map((key) => { 
                            return (
                                <SelectItem
                                    key={key}
                                    value={key}
                                >
                                    <div className="flex flex-row items-center space-x-2">
                                        <img className="h-4" src={networkIcons[key]} alt=""/>
                                        <p className="">{key}</p>
                                    </div>
                                </SelectItem>
                            )
                        })}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <div className="w-full flex flex-row justify-center mt-12">
                    <ModeToggle/>
                </div>
                {/* <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" className="w-full">Open KYC Manager</Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <SheetHeader>
                        <SheetTitle>Edit profile</SheetTitle>
                        <SheetDescription>
                            Make changes to your profile here. Click save when you're done.
                        </SheetDescription>
                        </SheetHeader>
                        <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                            Name
                            </Label>
                            <Input id="name" value="Pedro Duarte" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                            Username
                            </Label>
                            <Input id="username" value="@peduarte" className="col-span-3" />
                        </div>
                        </div>
                        <SheetFooter>
                        <SheetClose asChild>
                            <Button type="submit">Save changes</Button>
                        </SheetClose>
                        </SheetFooter>
                    </SheetContent>
                </Sheet> */}
            </div>
        </div>
    )
}

