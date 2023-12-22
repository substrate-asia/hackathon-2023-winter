export default function FormInvestor(props: any) {
    return (
        <div className=''>
            <div>
                <div className=" text-secondary-color">
                    <label className="block indent-2 text-gray-500 dark:text-gray-100 font-medium md:text-lg lg:text-lg mb-2 mt-6" htmlFor="invest">
                        How many DREX do you want to invest?
                    </label>
                    <input
                        type="number"
                        id="invest"
                        name="invest"
                        placeholder='Qty of DREX'
                        value={props.invest}
                        onChange={(e) => props.setInvest(e.target.value)}
                        className="w-full bg-light-color dark:bg-dark-color md:text-lg lg:text-lg indent-6 text-black dark:text-white p-2 mt-1 rounded outline-0 shadow-lg hover:bg-gray-100 hover:dark:bg-gray-500 border-2 border-transparent focus:border-secondary-color transition duration-1000 ease-in-out"
                    />
                </div>
            </div>
        </div>
    );
}