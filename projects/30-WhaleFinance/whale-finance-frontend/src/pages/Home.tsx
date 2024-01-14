import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
// import {
//     Carousel,
//     CarouselContent,
//     CarouselItem,
//     CarouselNext,
//     CarouselPrevious,
// } from "@/components/ui/carousel"
import HeroSection from "@/components/HeroSection";
import ImgBkg from "../assets/whale_ocean2.png";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

const items = [
    {
      title: 'Autonomy and Control',
      description: 'Investors and managers have more control over their assets and investments, without the influence or interference of centralized entities.',
      image: '/path-to-image-autonomy.jpg',
    },
    {
      title: 'Cost-Effectiveness',
      description: 'By eliminating intermediaries, the platform can potentially reduce the costs associated with asset management.',
      image: '/path-to-image-cost.jpg',
    },
    {
      title: 'Transparency',
      description: 'Utilizing a decentralized platform ensures that all transactions and fund performances are recorded on a transparent and immutable ledger.',
      image: '/path-to-image-transparency.jpg',
    },
    {
      title: 'Security',
      description: 'Our main idea behind whale.finance, the use of ERC 6551 secures the way that manager can hold and manage assets from investors.',
      image: '/path-to-image-security.jpg',
    },
    {
      title: 'Profit Opportunities for Managers',
      description: 'The platform creates opportunities for managers to profit by offering their expertise to a wider audience.',
      image: '/path-to-image-profit.jpg',
    },
    {
      title: 'Regulatory Compliance',
      description: 'The use of smart contracts can automate compliance with regulatory requirements.',
      image: '/path-to-image-regulatory.jpg',
    }
];

export default function Home() {

    const navigator = useNavigate();

    return (
        <div className='w-[100vw] h-[100vh] overflow-y-auto'>
            <div className="p-12">  
                <HeroSection title="Home"/>
                {/* Investor and Manager menu */}
                <NavigationMenu className="mb-12">
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>Investor Features</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                    <NavigationMenuLink>
                                    <div onClick={() => navigator('/funds-list')} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:cursor-pointer">
                                            <div className="text-sm font-medium leading-none">Invest</div>
                                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                                Search for funds to invest your money safely with Whale.
                                            </p>
                                        </div>
                                    </NavigationMenuLink>
                                    <NavigationMenuLink>
                                        <div onClick={() => navigator('/funds-list')} className="bg-primary text-foreground block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:cursor-pointer">
                                            <div className="text-sm font-medium leading-none">Whale Finance</div>
                                            <p className="line-clamp-2 text-sm leading-snug text-foreground">
                                                Allowing to bring decentralization into Financial Markets using ERC 6551.
                                            </p>
                                        </div>
                                    </NavigationMenuLink>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>Manager Features</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                    <NavigationMenuLink>
                                        <div onClick={() => navigator('/create-fund')} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:cursor-pointer">
                                            <div className="text-sm font-medium leading-none">Create Fund</div>
                                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                                Create a fund with Whale to manage assets and earn money by fees.
                                            </p>
                                        </div>
                                    </NavigationMenuLink>
                                    <NavigationMenuLink>
                                        <div onClick={() => navigator('/manager')} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:cursor-pointer">
                                            <div className="text-sm font-medium leading-none">Manage Fund</div>
                                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                                Swap and Bridge the assets of your funds using our technology.
                                            </p>
                                        </div>
                                    </NavigationMenuLink>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

                <h1 className="mb-6 italic text-md w-full flex justify-center">Allowing to bring decentralization into Financial Markets</h1>

                <img src={ImgBkg} alt="" className="rounded shadow-xl"/>

                <h1 className="my-12 indent-2 text-2xl w-full flex justify-center">Why Whale Finance?</h1>

                <div className="grid grid-cols-1 gap-4 justify-center my-6 md:grid-cols-3 lg:grid-cols-3">
                    {items.map((item, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <CardTitle>{item.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>{item.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>


          






                {/* <Carousel
                opts={{
                    align: "start",
                }}
                className="w-full max-w-sm m-12"
                >
                    <CarouselContent>
                        {Array.from({ length: 5 }).map((_, index) => (
                        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2">
                            <div className="p-1">
                            <Card>
                                <CardContent className="flex aspect-square items-center justify-center p-6">
                                <span className="text-3xl font-semibold">{index + 1}</span>
                                </CardContent>
                            </Card>
                            </div>
                        </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel> */}
            </div>
        </div>
    )
}