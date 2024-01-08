import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from 'ethers';
import { WhaleFinanceAbi } from '../../contracts/WhaleFinance';
import { WhaleFinanceAddress } from '../../utils/addresses';


export default function Proposals({ signer }: 
    { signer: any;}) {
        
    const history = useNavigate();

    // interface ProposalValues {
    //     [key: number]: number;
    // }

    const [proposalValues, setProposalValues] = useState<any>([]);
    const [_, setProposalIds] = useState<any>([]);

    const handleInputChange = (proposalId: number, newValue: string) => {
        setProposalValues((prevValues:any) => ({
            ...prevValues,
            [proposalId]: Number(newValue)
        }));
    };

    // const [myproposals, setMyproposals] = useState([
    //     {
    //         proposal_id: 0,
    //         fund_id: 0,
    //         name: `Fund Name 0`,
    //         option: "G",
    //         value: 0,
    //         status: "pending",
    //     },
    //     // TESTE
    //     {
    //         proposal_id: 1,
    //         fund_id: 1,
    //         name: `Fund Name 1`,
    //         option: "A",
    //         value: 0,
    //         status: "pending",
    //     },
    //     {
    //         proposal_id: 2,
    //         fund_id: 2,
    //         name: `Fund Name 2`,
    //         option: "A",
    //         value: 0,
    //         status: "rejected",
    //     },
    //     {
    //         proposal_id: 3,
    //         fund_id: 3,
    //         name: `Fund Name 3`,
    //         option: "A",
    //         value: 0,
    //         status: "pending",
    //     },
    //     {
    //         proposal_id: 4,
    //         fund_id: 4,
    //         name: `Fund Name 4`,
    //         option: "B",
    //         value: 0,
    //         status: "awaiting result",
    //     },
    //     {
    //         proposal_id: 5,
    //         fund_id: 5,
    //         name: `Fund Name 5`,
    //         option: "A",
    //         value: 0,
    //         status: "awaiting result",
    //     },
    //     {
    //         proposal_id: 6,
    //         fund_id: 6,
    //         option: "B",
    //         name: `Fund Name 6`,
    //         value: 0,
    //         status: "accepted",
    //     },
    // ]);

    function timesTampToString(timestamp: string){
        console.log(timestamp)
        const date = new Date(Number(timestamp)*1000);

        const strDate = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
        return strDate;
    } 

    const [myproposals, setMyproposals] = useState<any>([]);
    
    async function sendVote(_id: number){
        // send the response to the smart contract
        // update the row line to awaiting result
        // set the tempValue to the number of tokens in the smart contract

        try{
            const whaleFinanceContract = new ethers.Contract(WhaleFinanceAddress, WhaleFinanceAbi, signer);
            
            const quotaAddress = await whaleFinanceContract.functions.quotasAddresses(_id);

            const quotaContract = new ethers.Contract(quotaAddress[0], WhaleFinanceAbi, signer);

            const amount = ethers.utils.parseEther(String(proposalValues[_id]));

            const txApprove = await quotaContract.functions.approve(WhaleFinanceAddress, amount);
            
            await txApprove.wait();

            const transactionVote = await whaleFinanceContract.voteForChangingOpenRedeem(_id, amount);

            await transactionVote.wait();
        
        }catch(err){
            console.log(err);
        }
    }

    async function sendWithdraw(_id: number){
        try{
            const whaleFinanceContract = new ethers.Contract(WhaleFinanceAddress, WhaleFinanceAbi, signer);
            const transactionWithdraw = await whaleFinanceContract.withdrawVotingTokens(_id);

            await transactionWithdraw.wait();


        }catch(err){
            console.log(err);
        }
    }

    async function getProposals(){
        try{
            const whaleFinanceContract = new ethers.Contract(WhaleFinanceAddress, WhaleFinanceAbi, signer);

            const numberProposalsBigNumber = await whaleFinanceContract.functions.proposalIdCounter();
            const numberProposals = ethers.utils.formatUnits(numberProposalsBigNumber[0]._hex, 0);
            console.log(numberProposals)

            //make Array from 0 to numberProposals
            const ids = Array.from(Array(Number(numberProposals)), (_,x) => x);

            setProposalIds(ids);

            console.log(ids);

            const proposals = await Promise.all(ids.map( async id => {
                const prop = await whaleFinanceContract.functions.openRedeemProposals(id);

                const fundId = prop[0];
                const fundName = await whaleFinanceContract.functions.fundsNames(fundId);

                const newTimestamp = prop[1];
                const deadline = prop[2];
                const accepted = prop[3];

                console.log(signer)

                const votesBigNumber = await whaleFinanceContract.functions.getVoterRedeemBalance(id, signer._address);

                const votes = ethers.utils.formatEther(votesBigNumber[0]._hex)



                

                return {
                    proposal_id: id,
                    fund_id: ethers.utils.formatEther(fundId._hex),
                    name: fundName[0],
                    status: "pending",
                    newTimestamp: ethers.utils.formatUnits(newTimestamp._hex, 0),
                    deadline: ethers.utils.formatUnits(deadline._hex, 0),
                    accepted: accepted,
                    votes: votes
                }
                
            }));

            console.log(proposals);



            setMyproposals(proposals);



        } catch(err){
            console.log(err);
        }

    }

    useEffect(() => {
        getProposals();
    },[]);

    return (
        <div className='w-[100vw] h-[100vh] text-gray-700 px-12 py-12 overflow-y-auto'>
            <h2 className="mb-2 text-2xl font-bold text-start ml-4 text-gray-500 dark:text-gray-100 ">
                Proposals Panel
            </h2>
            <div className='border-[1px] border-gray-300 dark:border-gray-700 text-gray-700 mt-6 rounded-md backdrop-blur-md bg-light-color/50 dark:bg-dark-color/50 '>
                <section className="flex flex-col items-center text-center mb-8">
                    <div className='flex flex-col w-full md:flex-row lg:flex-row justify-center my-10 mx-6 mb-12 text-secondary-color rounded-[20px]'>

                        {myproposals.length ? (
                            <div className="flex flex-col w-[96%] my-2 shadow-lg rounded-lg overflow-hidden">
                            <div className="flex text-left bg-gradient-to-b from-transparent to-light2-color dark:to-dark2-color border-2 border-secondary-color rounded">
                                <div className="py-3 px-6 text-center flex-1">Proposal Id</div>
                                <div className="py-3 px-6 text-center flex-1">Fund Name</div>
                                <div className="py-3 px-6 text-center flex-1">Status</div>
                                <div className="py-3 px-6 text-center flex-1">Num of Tokens</div>
                                <div className="py-3 px-6 text-center flex-1">New Proposed Date</div>
                                <div className="py-3 px-6 text-center flex-1">Your votes</div>
                                <div className="py-3 px-6 text-center flex-1">Action</div>
                            </div>
                            <div className="text-gray-700 dark:text-gray-100 text-[0.6rem] md:text-sm lg:text-sm font-light">
                                {myproposals.map((proposal: any) => (
                                    <div key={proposal.proposal_id} className="border-b h-14 items-center  flex hover:bg-gray-100 hover:dark:bg-dark2-color hover:bg-opacity-50">
                                        <div className="py-3 px-6 text-center flex-1">{proposal.proposal_id}</div>
                                        <div className="py-3 px-6 text-center flex-1">{proposal.name}</div>
                                        <div className="py-3 px-6 text-center flex-1 relative">
                                            <div className={`h-4 w-4 rounded-full absolute center-[-10px] top-1/2 transform -translate-y-1/2 ${proposal.status === "accepted" ? "bg-green-500" : proposal.status === "rejected" ? "bg-red-500" : proposal.status === "pending" ? "bg-yellow-500" : "bg-blue-500"}`}></div>
                                            {proposal.status}
                                        </div>
                                        <div className="py-3 px-6 text-left flex-1">
                                            {proposal.status === 'pending' && 
                                                <input
                                                    type="number"
                                                    id={`value-${proposal.proposal_id}`}
                                                    name={`value-${proposal.proposal_id}`}
                                                    placeholder='Num of Tokens'
                                                    value={proposalValues[proposal.proposal_id] || ''}
                                                    onChange={(e) => handleInputChange(proposal.proposal_id, e.target.value)}
                                                    className="bg-light2-color dark:bg-dark2-color text-black text-center w-full pl-4 outline-0 shadow-lg py-2 hover:bg-gray-100 hover:dark:bg-dark2-color transition duration-1000 ease-in-out"
                                                />
                                            }
                                            {proposal.status != 'pending' && 
                                                <div className="text-center">{proposal.value}</div>
                                            }
                                        </div>
                                        <div className="py-3 px-6 text-center flex-1 relative">
                                            {timesTampToString(proposal.newTimestamp)}
                                        </div>
                                        <div className="py-3 px-6 text-center flex-1 relative">
                                            {Number(proposal.votes).toFixed(2)}
                                        </div>
                                        <div className="py-3 px-6 text-left flex-1">
                                            {proposal.status === 'pending' && 
                                                <button className="w-full text-sm bg-transparent hover:bg-secondary-color font-bold hover:text-white hover:dark:text-dark-color py-2 px-4 border-2 border-secondary-color hover:border-transparent rounded"
                                                        onClick={() => sendVote(proposal.proposal_id)}>
                                                    Vote YES for the Proposal
                                                </button>
                                            }
                                            {(proposal.status === 'accepted' || proposal.status === 'rejected') && 
                                                <button className="w-full bg-transparent hover:bg-secondary-color font-bold hover:text-white hover:dark:text-dark-color py-2 px-4 border-2 border-secondary-color hover:border-transparent rounded"
                                                        onClick={() => sendWithdraw(proposal.proposal_id)}>
                                                    Withdraw Tokens
                                                </button>
                                            }
                                        </div>
                                    </div>
                                ))}
                            </div>
                            </div>
                        ):(
                            <div className="flex justify-center items-center text-gray-500 dark:text-gray-100 text-xl font-medium">
                                You have no Proposals yet
                            </div>
                        )}
                    </div>
                    <div
                        className="bg-light-color dark:bg-dark-color text-black dark:text-white font-bold rounded-full border-2 border-transparent cursor-pointer py-4 px-8 w-96 shadow-lg uppercase tracking-wider hover:bg-secondary-color hover:text-[white] hover:border-white hover:dark:bg-secondary-color hover:dark:text-[black] hover:dark:border-black transition duration-1000 ease-in-out"
                        onClick={() => history("/create-proposal")}
                        >
                        Create Proposal
                    </div>
                </section>
            </div>
        </div>
    );
}