import React, { useEffect, useState } from 'react';
import ImgAvar from "../assets/whale_avatar2.png";
import blockies from 'ethereum-blockies-base64';
import AvatarDefault from "../assets/whale_avatar1.png";
import { Link2 } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"

// need to fix the image address

type FundData = {
    id: number;
    name: string;
    description: string;
    avatar: string;
};

type HeroSectionProps = {
    name?: string;
    description?: string;
    color?: string;
    manager?: string;
};

const FundHeroSection: React.FC<HeroSectionProps> = ({ name, description, color, manager }) => {

    const managerAddress = '0x0';

    const handleLink = () => {
        const etherscanUrl = `https://etherscan.io/address/${managerAddress}`;
        window.open(etherscanUrl, '_blank');
    };

    const getAccountAvatar = async () => {
        try {
          if (managerAddress) {
            return blockies(managerAddress);
          } else {
            return '../assets/whale_avatar1.png';
          }
        } catch (error) {
          return '../assets/whale_avatar1.png';
        }
    };

    useEffect(() => {
        getAccountAvatar().then(setAvatar);
    }, []);

    
    const safeColor = color || 'secondary';

    const [avatar, setAvatar] = useState('');
    

    return (
        <div className={`w-full pt-12 px-12 h-30 pb-10 mb-8 text-foreground shadow-xl flex flex-row items-center bg-${safeColor}`}>
            <img src={ImgAvar} alt={name} className="w-[60px] h-auto rounded-full"/>
            <div className='ml-8 space-y-2'>
                <div className="text-3xl font-bold">{name}</div>
                <div className="text-sm">{description}</div>
            </div>
            <div className='flex-1 flex justify-end px-2'>
                <p className='flex flex-col justify-center mx-8 italic'>Managed by:</p>
                <div className='px-4 py-2 rounded bg-secondary opacity-90 flex items-center space-x-4'>
                    <img src={avatar} alt="" className="w-[25px] h-auto rounded-full"/>
                    <p>{manager}</p>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Link2 size="25" className='hover:cursor-pointer p-1' onClick={handleLink}/>
                            </TooltipTrigger>
                            <TooltipContent>
                            <p>View on Etherscan</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
        </div>
    );
};

export default FundHeroSection;