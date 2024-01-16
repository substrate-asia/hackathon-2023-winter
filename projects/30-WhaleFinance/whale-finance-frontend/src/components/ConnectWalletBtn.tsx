import { Button } from "./ui/button";

export default function ConnectWalletBtn({ isMetamaskInstalled, connectWallet, account, signer }: { isMetamaskInstalled: boolean; connectWallet: any; account: string | null; signer: any;}) {

    return (
        <>
            {
                isMetamaskInstalled ? (
                    <Button variant="ghost" className={`w-full truncate ${signer ? "text-primary bg-primarylighter font-bold" : "" }`} onClick={connectWallet}>
                        {signer 
                        ? "Connected: " +
                        account?.substring(0, 5) +
                        "..." +
                        account?.substring(38, 42) 
                        : "Connect Wallet"
                        }
                    </Button>
                ) : (
                    <Button variant="link" className="w-full">
                        <a className="w-full h-full" href="https://metamask.io/download/">Install Metamask</a>
                    </Button>
                )
            }
        </>
    )
}