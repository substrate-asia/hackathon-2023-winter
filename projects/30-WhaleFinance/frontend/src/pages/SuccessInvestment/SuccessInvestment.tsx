import { Player } from '@lottiefiles/react-lottie-player';
import Animation from '../../assets/congrats_animation.json';
import { useNavigate } from 'react-router-dom';

export default function SuccessInvestment() {

    const history = useNavigate();
      
    return (
        <div className='w-[100vw] h-[100vh] text-gray-700 px-12 py-12 overflow-y-auto'>
            <h2 className="mb-2 text-2xl font-bold text-start ml-4 text-gray-500 dark:text-gray-100">
                Investment Received
            </h2>
            <div className='border-[1px] border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-100 mt-6 rounded-md backdrop-blur-md bg-light-color/50 dark:bg-dark-color/50 '>
                <div className='flex flex-col justify-center items-center my-10 mx-6 mb-12 text-gray-500 dark:text-gray-100'>
                    <h2 className="flex justify-center items-center h-[12vh] mx-6 text-2xl font-bold text-center text-gray-500 dark:text-gray-100">
                    Congratulations
                    </h2>
                    <div className='w-[50%] h-auto md:w-[20%] lg:w-[12%]'>
                        <Player
                            src={Animation}
                            className="player"
                            loop
                            autoplay
                        />
                    </div>
                    <h2 className="flex justify-center items-center h-[12vh] mx-6 text-2xl text-center text-gray-500 dark:text-gray-100">
                        You invested with whale.finance
                    </h2>
                    <button
                    className="my-6 w-[90%] md:w-[55%] lg:w-[35%] bg-secondary-color text-white dark:text-black font-bold rounded-full border-2 border-transparent py-2 px-20 shadow-lg uppercase tracking-wider hover:bg-light-color hover:dark:bg-dark-color hover:text-secondary-color hover:dark:text-secondary-color hover:border-secondary-color transition duration-1000 ease-in-out" onClick={() => history('/investor')}
                    >
                    Go to my dashboard
                    </button>
                    <button
                    className="mb-6 w-[90%] md:w-[55%] lg:w-[35%] bg-secondary-color text-white dark:text-black font-bold rounded-full border-2 border-transparent py-2 px-20 shadow-lg uppercase tracking-wider hover:bg-light-color hover:dark:bg-dark-color hover:text-secondary-color hover:dark:text-secondary-color hover:border-secondary-color transition duration-1000 ease-in-out" onClick={() => history('/fundslist')}
                    >
                    Invest in more funds
                    </button>
                </div>
            </div>
        </div>
    )
}