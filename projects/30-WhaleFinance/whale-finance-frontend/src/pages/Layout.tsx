import { Header } from '@/components/Header';
import { Toaster } from '@/components/ui/toaster';
import { Outlet } from 'react-router-dom';
// import { useScrollDirection } from "../../hooks/use-scroll-direction";

export default function Layout({ isMetamaskInstalled, connectWallet, account, signer }: 
    { isMetamaskInstalled: boolean; connectWallet: any; account: string | null; signer: any;}) {

    // const scrollDirection = useScrollDirection(50);

    // const hiddenClass = (scrollDirection === 'down') ? 'opacity-0' : '';

    return (
        <div className='w-[100vw] md:h-[100vh] md:flex md:flex-row lg:h-[100vh] lg:flex lg:flex-row overflow-hidden relative'>
            <Header
                isMetamaskInstalled={isMetamaskInstalled}
                connectWallet={connectWallet}
                account={account}
                signer={signer}
            />
            <Outlet/>
            <Toaster />
        </div>
    )
}