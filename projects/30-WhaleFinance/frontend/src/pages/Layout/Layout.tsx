import { Outlet } from 'react-router-dom';
import Header from '../../components/Header/Header';
// import { useScrollDirection } from "../../hooks/use-scroll-direction";

export default function Layout({ isMetamaskInstalled, connectWallet, account, signer }: 
    { isMetamaskInstalled: boolean; connectWallet: any; account: string | null; signer: any;}) {

    // const scrollDirection = useScrollDirection(50);

    // const hiddenClass = (scrollDirection === 'down') ? 'opacity-0' : '';

    return (
        <div className='w-[100vw] md:h-[100vh] md:flex md:flex-row lg:h-[100vh] lg:flex lg:flex-row bg-gradient-to-r from-light2-color to-light-color dark:from-dark2-color dark:to-dark-color overflow-hidden relative'>
            <Header
                isMetamaskInstalled={isMetamaskInstalled}
                connectWallet={connectWallet}
                account={account}
                signer={signer}
            />
            <Outlet/>
            {/* <div className={`absolute top-0 right-0 flex items-center px-12 py-6 z-10`}>
                <ConnectWalletBtn
                    isMetamaskInstalled={isMetamaskInstalled}
                    connectWallet={connectWallet}
                    account={account}
                    signer={signer}
                />
            </div> */}
        </div>
    )
}