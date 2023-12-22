import React from 'react';
import FormManager from '../../components/FormManager/FormManager';
import { Player } from '@lottiefiles/react-lottie-player';
import LoadingAnim from '../../assets/loading.json';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { WhaleFinanceAbi } from '../../contracts/WhaleFinance';
import { WhaleFinanceAddress } from '../../utils/addresses';

export default function CreateFund({ isMetamaskInstalled, account, signer }: 
    { isMetamaskInstalled: boolean; account: string | null; signer: any;}) {

    const history = useNavigate();

    const [name, setName] = React.useState('');
    const [ticker, setTicker] = React.useState('');
    const [admFee, setAdmFee] = React.useState(0.5);
    const [perfFee, setPerfFee] = React.useState(10);
    
    const [openInvestment, setOpenInvestment] = React.useState("");
    const [closeInvestiment, setCloseInvestiment] = React.useState("");
    const [maturationTime, setMaturationtime] = React.useState("");

    const [tokens, setTokens] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    function handleDateTimestamp(date: string) {
        const dateObj = new Date(date);
        const timestamp = dateObj.getTime()/1000;
        return timestamp;
    }

    async function handleSubmit() {
        if(openInvestment === "" || closeInvestiment === "" || maturationTime === "") {
            alert("Please fill all the fields");
            return;
        }
        if(!isMetamaskInstalled){
            alert("Please install Metamask");
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
        const closeInvestimentTimestamp = handleDateTimestamp(closeInvestiment);
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
                closeInvestimentTimestamp,
                maturationTimeTimestamp
            );

            await txNewFund.wait();
            history('/successfund');

        } catch(err){
            console.log(err);
            alert("Something went wrong! Try again");
            

        }finally{
            setLoading(false);
        }   
    }

    const handleClick = async () => {
        await handleSubmit();
    };

    return (
        <div className='w-[100vw] h-[100vh] text-gray-700 px-12 py-12 overflow-y-auto'>
            <h2 className="mb-2 text-2xl font-bold text-start ml-4 text-gray-500 dark:text-gray-100">
                Fund Creation
            </h2>
            <div className='border-[1px] border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-100 mt-6 rounded-md backdrop-blur-md bg-light-color/50 dark:bg-dark-color/50 '>
                <div className="container mx-auto px-0 py-4 mb-2 md:px-6 lg:px-6">
                    <div className='flex flex-col justify-center w-[100%] pb-6 text-secondary-color'>
                        <FormManager    name={name}
                                        setName={setName}
                                        ticker={ticker}
                                        setTicker={setTicker}
                                        admFee={admFee}
                                        setAdmFee={setAdmFee}
                                        perfFee={perfFee}
                                        setPerfFee={setPerfFee}
                                        openInvestment={openInvestment}
                                        setOpenInvestment={setOpenInvestment}
                                        closeInvestiment={closeInvestiment}
                                        setCloseInvestiment={setCloseInvestiment}
                                        maturationTime={maturationTime}
                                        setMaturationtime={setMaturationtime}
                                        tokens={tokens}
                                        setTokens={setTokens}
                        />
                        <button
                        className="w-96 mt-4 self-center bg-secondary-color dark:bg-secondary-color text-light-color dark:text-dark-color font-bold rounded-full border-2 border-transparent py-2 px-20 shadow-lg uppercase tracking-wider hover:bg-light-color hover:dark:bg-dark-color hover:text-secondary-color hover:dark:text-secondary-color hover:border-secondary-color transition duration-1000 ease-in-out" onClick={handleClick}
                        >
                        {loading ? 'Loading...' : 'Create'}
                        </button>
                        <div className='w-full flex justify-center items-center'>
                            <div className='w-[100px] h-[25px] my-4'>
                                {loading ? 
                                <Player
                                    src={LoadingAnim}
                                    className="player"
                                    loop
                                    autoplay
                                />
                                : <></>}  
                            </div>
                        </div>   
                    </div>
                </div>
            </div>
        </div>
    )
}