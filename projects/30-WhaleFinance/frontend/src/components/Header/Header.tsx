import ConnectWalletBtn from '../../components/ConnectWallet/ConnectWallet';
// import Logo from '../../assets/whale_logo.png';
import LogoApp from "../../assets/whale_logo_green.png";
import { AiOutlineUser, AiOutlineMenu, AiOutlineTransaction, AiOutlineFileDone } from "react-icons/ai";
import { RxMoon } from "react-icons/rx";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import NavLinkButton from '../LinkButton/LinkButton';

export default function Header({ isMetamaskInstalled, connectWallet, account, signer }: 
    { isMetamaskInstalled: boolean; connectWallet: any; account: string | null; signer: any;}) {
    
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSidebarExtended, setIsSidebarExtended] = useState(false);

    const history = useNavigate();

    const [theme, setTheme] = useLocalStorage<string>('theme', 'light');

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);

        // Update the class on document element
        const root = document.documentElement;
        root.classList.toggle('dark', newTheme === 'dark');
    };
    
    return (
        <header 
            className={`md:h-screen lg:h-screen p-3 text-fl text-white dark:text-black bg-light-color dark:bg-dark-color  ${
                isSidebarExtended ? 'md:w-[20vw] lg:w-[20vw]' : 'md:w-[10vw] lg:w-[10vw]'}`}
        >
            <div className="w-[100%] h-[100%] px-4 py-8 rounded-[16px] flex justify-between">
                <div className="w-[100%] h-[100%] flex flex-row md:flex-col lg:flex-col items-center">
                    <img className="w-[5vw] pb-[4vh] cursor-pointer" src={LogoApp} alt="Whale Finance" onClick={() => history('/')}/>
                    {/* <h1 className='pb-[6vh] text-center text-secondary-color text-xl'>whale <br></br> finance</h1> */}

                    {/* responsivo */}

                    <div className="block lg:hidden ml-[50%]">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center px-3 py-2 border rounded text-white border-white hover:text-secondary-color hover:border-secondary-color appearance-none focus:outline-none">
                            <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <title>Menu</title>
                            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                            </svg>
                        </button>
                    </div>

                    {/* sidebar menu */}
                    {isMenuOpen && (
                        <div className="fixed inset-0 flex z-40 lg:hidden" role="dialog" aria-modal="true">
                            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true"></div>
                            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-secondary-color">
                                <div className="absolute top-0 right-0 -mr-12 pt-2">
                                    <button onClick={() => setIsMenuOpen(false)} className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                        <span className="sr-only">Close sidebar</span>
                                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                                    <nav className="mt-5 flex-1 px-2 space-y-1">
                                        <div className="group flex items-center px-4 py-3 text-xl font-medium rounded-md text-white hover:text-secondary-color hover:bg-gray-100" onClick={() => history('/proposals')}>
                                            Proposals Panel
                                        </div>
                                        <div className="group flex items-center px-4 py-3 text-xl font-medium rounded-md text-white hover:text-secondary-color hover:bg-gray-100" onClick={() => history('/create-proposal')}>
                                            Create Proposal
                                        </div>
                                        <div className="group flex items-center px-4 py-3 text-xl font-medium rounded-md text-white hover:text-secondary-color hover:bg-gray-100" onClick={() => history('/investor')}>
                                            Dashboard
                                        </div>
                                        <div className="group flex items-center px-4 py-3 text-xl font-medium rounded-md text-white hover:text-secondary-color hover:bg-gray-100" onClick={() => history('/manager')}>
                                            Manager
                                        </div>
                                        <div className="group flex items-center px-4 py-3 text-xl font-medium rounded-md text-white hover:text-secondary-color hover:bg-gray-100" onClick={() => history('/fundslist')}>
                                            Funds List
                                        </div>
                                    </nav>
                                </div>
                                <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                                    <ConnectWalletBtn
                                        isMetamaskInstalled={isMetamaskInstalled}
                                        connectWallet={connectWallet}
                                        account={account}
                                        signer={signer}
                                        isSidebarExtended={isSidebarExtended}
                                        setIsSidebarExtended={setIsSidebarExtended}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* menu */}

                    <div className="hidden lg:block bg-light-color dark:bg-dark-color border-2 border-secondary-color shadow-xl py-4 mt-8 mb-[8vh] rounded-xl space-y-4 w-full"
                        onMouseOver={() => setIsSidebarExtended(true)}
                        onMouseOut={() => setIsSidebarExtended(false)}
                    >
                    {/* <ul className="inline-flex items-center space-x-5">
                        <li><div className="group relative cursor-pointer py-2">
                            <div className="px-6 lg:px-10 py-2 text-[1.2vw] hover:bg-[rgb(14,42,98)] transition duration-1000 ease-in-out"
                                onClick={() => history('/proposals')}>Proposals</div>
                            <div className="invisible absolute z-50 flex w-full flex-col bg-gray-100 py-1 my-1 px-4 text-gray-800 shadow-xl group-hover:visible">
                                <div className="my-2 text-[1vw] block border-b border-gray-100 py-1 font-semibold text-gray-500 hover:text-black md:mx-2" onClick={() => history('/proposals')}>Proposals Panel</div>                
                                <div className="my-2 text-[1vw] block border-b border-gray-100 py-1 font-semibold text-gray-500 hover:text-black md:mx-2" onClick={() => history('/create-proposal')}>Create Proposal</div>
                            </div>
                        </div></li>
                        <li><div className="px-6 lg:px-10 py-2 text-[1.2vw] hover:bg-[rgb(14,42,98)] transition duration-1000 ease-in-out"
                            onClick={() => history('/investor')}>Dashboard</div></li>
                        <li><div className="px-6 lg:px-10 py-2 text-[1.2vw] hover:bg-[rgb(14,42,98)] transition duration-1000 ease-in-out"
                        onClick={() => history("/manager")}>Manager</div></li>
                        <li><div className="px-6 lg:px-10 py-2 text-[1.2vw] hover:bg-[rgb(14,42,98)] transition duration-1000 ease-in-out" 
                        onClick={()  => history("/fundslist")} >Funds List</div></li>
                        <ConnectWalletBtn
                            isMetamaskInstalled={isMetamaskInstalled}
                            connectWallet={connectWallet}
                            account={account}
                            signer={signer}
                        />
                    </ul> */}
                        <NavLinkButton to="/fundslist" isSidebarExtended={isSidebarExtended} icon={<AiOutlineMenu />} iconClassName="text-2xl">Fundslist</NavLinkButton>
                        <NavLinkButton to="/manager" isSidebarExtended={isSidebarExtended} icon={<AiOutlineTransaction />} iconClassName="text-2xl">Manager</NavLinkButton>
                        <NavLinkButton to="/investor" isSidebarExtended={isSidebarExtended} icon={<AiOutlineUser />} iconClassName="text-2xl">Investor</NavLinkButton>
                        <NavLinkButton to="/proposals" isSidebarExtended={isSidebarExtended} icon={<AiOutlineFileDone />} iconClassName="text-2xl">Proposals</NavLinkButton>
                        <button
                            className={`flex flex-row w-full px-8 py-4 items-center text-sm font-bold text-gray-500 dark:text-gray-100 transition-all duration-150 ease-linear bg-transparent rounded outline-none active:bg-white focus:outline-none hover:bg-white-color hover:dark:bg-black-color hover:text-secondary-color hover:dark:text-secondary-color hover:cursor-pointer
                                      ${isSidebarExtended ? 'justify-start' : 'justify-center'}`}
                            onClick={toggleTheme}
                        >
                            <RxMoon className="text-2xl" />
                            {isSidebarExtended && <span className="ml-4">Theme</span>}
                        </button> 
                    </div>

                    <ConnectWalletBtn
                        isMetamaskInstalled={isMetamaskInstalled}
                        connectWallet={connectWallet}
                        account={account}
                        signer={signer}
                        isSidebarExtended={isSidebarExtended}
                        setIsSidebarExtended={setIsSidebarExtended}
                    />
                </div>
            </div>
        </header>
    );
};