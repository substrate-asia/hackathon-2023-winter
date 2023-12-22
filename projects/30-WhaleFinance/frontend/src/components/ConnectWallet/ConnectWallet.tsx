export default function ConnectWalletBtn({ isMetamaskInstalled, connectWallet, account, signer, isSidebarExtended, setIsSidebarExtended }: { isMetamaskInstalled: boolean; connectWallet: any; account: string | null; signer: any; isSidebarExtended: boolean; setIsSidebarExtended: any;}) {

    return (
        <>
            {
                isMetamaskInstalled ? (
                    <div
                        onClick={connectWallet}
                        className={`flex flex-row w-full py-4 items-center justify-center text-sm font-bold rounded-xl border-2 border-secondary-color transition-all duration-450 ease-linear outline-none active:border-light-color active:dark:border-dark-color focus:outline-none hover:bg-secondary-color hover:cursor-pointer"
                         ${signer ? 'bg-secondary-color text-light-color dark:text-dark-color cursor-pointer' : 'cursor-pointer text-dark-color dark:text-light-color'}`}
                        onMouseOver={() => setIsSidebarExtended(true)}
                        onMouseOut={() => setIsSidebarExtended(false)}
                    >
                        {!(isSidebarExtended) ? <h3 className="text-[0.75rem]">{signer ? "Connected" : "Connect"}</h3> :
                        <h3 className='flex justify-center truncate px-4'>{signer ? "Connected: " +
                            account?.substring(0, 5) +
                            "..." +
                            account?.substring(38, 42) : "Connect Wallet"}</h3>
                        }
                    </div>
                ) : (
                    <div
                        className="flex flex-row w-full py-4 items-center justify-center text-sm font-bold rounded-xl text-dark-color dark:text-light-color border-2 border-secondary-color transition-all duration-450 ease-linear outline-none active:border-light-color active:dark:border-dark-color focus:outline-none hover:bg-secondary-color hover:cursor-pointer"
                        // ${isSidebarExtended ? 'justify-start' : 'justify-center'}`}
                        onMouseOver={() => setIsSidebarExtended(true)}
                        onMouseOut={() => setIsSidebarExtended(false)}
                    >
                        <a href="https://metamask.io/download/">Install Metamask</a>
                    </div>
                )
            }
        </>
    )
}