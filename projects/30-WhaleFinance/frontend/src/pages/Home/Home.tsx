//import LogoApp from '../../assets/whale_app_logo.png';

export default function Home() {

    return (
        <div className='w-[100vw] h-[100vh] text-gray-700 px-12 py-12 overflow-y-auto'>
            <h2 className="mb-2 text-2xl font-bold text-start ml-4 text-gray-500 dark:text-gray-100">
                Home
            </h2>
            <div className="w-full h-[70vh] border-[1px] border-gray-300 dark:border-gray-700 mt-6 rounded-md backdrop-blur-md bg-cover bg-[url('././assets/whale_ocean2.png')]">
                <section className='w-full flex flex-col items-center'>
                    <p className='text-white mt-52 italic text-xl'>Decentralized Asset Management</p>
                </section>
            </div>
            <div className='border-[1px] border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-100 mt-6 rounded-md backdrop-blur-md bg-light-color/50 dark:bg-dark-color/50 '>
                <section className='w-full flex flex-col items-center'>
                    <div className='w-[100%] my-12 grid grid-cols-1 justify-center items-center md:w-[80%] md:grid-cols-2 lg:w-[60%] lg:grid-cols-2'>
                        <li className='flex justify-center'><a className="px-20 py-3 text-xm font-bold bg-secondary-color text-white hover:bg-white hover:text-secondary-color transition duration-1000 ease-in-out rounded-full uppercase" href="/fundslist">Invest in Funds</a></li>
                        <li className='flex justify-center mt-8 md:mt-0 lg:mt-0'><a className="px-20 py-3 text-xm font-bold bg-secondary-color text-white hover:bg-white hover:text-secondary-color transition duration-1000 ease-in-out rounded-full uppercase" href="/manager">Be a manager</a></li>
                    </div>
                </section>
            </div>
        </div>
    )
}