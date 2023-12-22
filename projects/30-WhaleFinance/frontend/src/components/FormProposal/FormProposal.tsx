export default function FormProposal(props: any) {

    return (
        <div className='my-12'>
            <div className="my-6 text-secondary-color">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 md:space-x-12 lg:space-x-12">
                <div className="flex flex-col">
                    <label className="block indent-2 text-gray-500 dark:text-gray-100 font-medium md:text-lg lg:text-lg mb-2" htmlFor="fund">
                        What will be the fund id related to your proposal?
                    </label>
                    <input
                        type="number"
                        id="id"
                        name="id"
                        placeholder='Fund ID'
                        value={props.id}
                        onChange={(e) => props.setId(e.target.value)}
                        className="  bg-light-color dark:bg-dark-color md:text-lg lg:text-lg indent-6 text-black dark:text-white p-2 mt-1 rounded outline-0 shadow-lg hover:bg-gray-100 hover:dark:bg-gray-500 border-2 border-transparent focus:border-secondary-color transition duration-1000 ease-in-out"
                    />
                    </div>
                    <div className="flex flex-col">
                    <label className="block indent-2 text-gray-500 dark:text-gray-100 font-medium md:text-lg lg:text-lg mb-2 mt-6 md:mt-0 lg:mt-0" htmlFor="proposal">
                            What will be your proposal type?
                        </label>
                        <select
                            id="proposal type"
                            name="proposal type"
                            placeholder='Proposal Type'
                            value={props.proposalType}
                            onChange={(e) => props.setProposalType(e.target.value)}
                            className=" bg-light-color dark:bg-dark-color md:text-lg lg:text-lg indent-6 text-black dark:text-white p-2 py-2.5 mt-1 rounded outline-0 shadow-lg hover:bg-gray-100 hover:dark:bg-gray-500 border-2 border-transparent focus:border-secondary-color transition duration-1000 ease-in-out"
                        >
                            <option value="changeDeadline">Change Deadline</option>
                            <option value="changeInvestment">Change Investment</option>
                        </select>
                    </div>
                </div>
                { props.proposalType === 'changeDeadline' &&
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 md:space-x-12 lg:space-x-12">
                        <div className="flex flex-col">
                        <label className="block indent-2 text-gray-500 dark:text-gray-100 font-medium md:text-lg lg:text-lg mb-2 mt-6" htmlFor="openInvestment">
                                Choose the new timestamp for investments
                            </label>
                            <input
                                type="date"
                                id="newTimestamp"
                                name="newTimestamp"
                                placeholder='New Timestamp'
                                value={props.newtimestamp}
                                onChange={(e) => props.setNewtimestamp(e.target.value)}
                                className="  bg-light-color dark:bg-dark-color md:text-lg lg:text-lg indent-6 text-black dark:text-white p-2 mt-1 rounded outline-0 shadow-lg hover:bg-gray-100 hover:dark:bg-gray-500 border-2 border-transparent focus:border-secondary-color transition duration-1000 ease-in-out"
                            />
                        </div>
                        <div className="flex flex-col">
                        <label className="block indent-2 text-gray-500 dark:text-gray-100 font-medium md:text-lg lg:text-lg mb-2 mt-6" htmlFor="closeInvestiment">
                                Choose the deadline to vote in your proposal
                            </label>
                            <input
                                type="date"
                                id="deadline"
                                name="deadline"
                                placeholder='Deadline to vote'
                                value={props.deadline}
                                onChange={(e) => props.setDeadline(e.target.value)}
                                className="  bg-light-color dark:bg-dark-color md:text-lg lg:text-lg indent-6 text-black dark:text-white p-2 mt-1 rounded outline-0 shadow-lg hover:bg-gray-100 hover:dark:bg-gray-500 border-2 border-transparent focus:border-secondary-color transition duration-1000 ease-in-out"
                            />
                        </div>
                    </div>
                }
                { props.proposalType === 'changeInvestment' &&
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 md:space-x-12 lg:space-x-12">
                        
                    </div>
                }
            </div>
        </div>
    );
}