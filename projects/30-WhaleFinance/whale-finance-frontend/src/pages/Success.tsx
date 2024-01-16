import { Player } from '@lottiefiles/react-lottie-player';
import Animation from '../assets/congrats_animation.json';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import HeroSection from '../components/HeroSection';
import { Button } from '../components/ui/button';

export default function SuccessPage() {

    const history = useNavigate();
      
    return (
        <div className='w-[100vw] h-[100vh] overflow-y-auto'>
            <div className="p-12">
                <HeroSection title="Congratulations"/>
                <Card>
                    <CardHeader>
                        <div className='flex flex-col justify-center items-center space-y-2'>
                            <CardTitle>Thank you!</CardTitle>
                            <CardDescription>Keep using Whale Finance</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className='flex flex-col justify-center items-center space-y-16'>
                            <div className='w-[50%] h-auto md:w-[20%] lg:w-[15%]'>
                                <Player
                                    src={Animation}
                                    className="player"
                                    loop
                                    autoplay
                                />
                            </div>
                            <Button onClick={() => history('/')}>Back Home</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}