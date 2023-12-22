import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import LoadingAnim from '../../assets/loading.json';
import { useNavigate } from 'react-router-dom';
import FormProposal from '../../components/FormProposal/FormProposal';
import { ethers } from 'ethers';
import { WhaleFinanceAbi } from '../../contracts/WhaleFinance';
import { WhaleFinanceAddress } from '../../utils/addresses';

export default function CreateProposal({ isMetamaskInstalled, signer }: 
    { isMetamaskInstalled: boolean; signer: any;}) {

    // const history = useNavigate();

    const [loading, setLoading] = React.useState(false);

    const [id, setId] = React.useState("");
    const [nameValue, setNameValue] = React.useState("a");
    const [proposalType, setProposalType] = React.useState("");
    const [newtimestamp, setNewtimestamp] = React.useState("");
    const [deadline, setDeadline] = React.useState("");

    function handleDateTimestamp(date: string) {
        const dateObj = new Date(date);
        const timestamp = dateObj.getTime()/1000;
        return timestamp;
    }

    async function handleSubmit() {
        if(proposalType === "" || newtimestamp === "" || deadline === "") {
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
        setLoading(true);

        const newtimestampTimestamp = handleDateTimestamp(newtimestamp);
        const deadlineTimestamp = handleDateTimestamp(deadline);
        const idValue = Number(id);

        console.log(nameValue);
        console.log(idValue);
        console.log(newtimestampTimestamp);
        console.log(deadlineTimestamp);

        try{
            const whaleFinanceContract = new ethers.Contract(WhaleFinanceAddress, WhaleFinanceAbi, signer);
            const txNewProposal = await whaleFinanceContract.proposeNewOpenRedeemTimestamp(
                idValue,
                newtimestampTimestamp,
                deadlineTimestamp,
                nameValue
            );

            await txNewProposal.wait();

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
        <div className='w-[100vw] h-[100vh] text-gray-700 dark:text-gray-100 px-12 py-12 overflow-y-auto'>
            <h2 className="mb-2 text-2xl font-bold text-start ml-4 text-gray-500 dark:text-gray-100">
            Create Proposal Area
            </h2>
            <div className='border-[1px] px-8 border-gray-300 dark:border-gray-700 mt-6 rounded-md backdrop-blur-md bg-light-color/50 dark:bg-dark-color/50 '>
                <FormProposal
                    id={id}
                    setId={setId}
                    proposalType={proposalType}
                    setProposalType={setProposalType}
                    newtimestamp={newtimestamp}
                    setNewtimestamp={setNewtimestamp}
                    deadline={deadline}
                    setDeadline={setDeadline}
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
    )
}