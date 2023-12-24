import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { db } from '../../firebase/firebase';
// import { get, ref } from "firebase/database";
import FormInvestor from '../../components/FormInvestor/FormInvestor';
import LineChartComponent from '../../components/LineChartComponent/LineChartComponent';
import PieChartComponent from '../../components/PieChartComponent/PieChartComponent';
import DataDiv from '../../components/DataDiv/DataDiv';
import TokensTable from '../../components/TokensTable/TokensTable';

// interface PerformanceItem {
//     date: string;
//     fundId: string;
//     value: number;
// }

// interface BenchmarkItem {
//     date: string;
//     bmId: string;
//     value: number;
// }

interface CombinedDataItem {
    date: string;
    fundId: string;
    performanceValue: number;
    bmId: string;
    benchmarkValue: number;
}

interface FundData {
    id: string | undefined;
    name: any;
    description: string;
}

export default function Investor() {

    // const id = '1';

    const history = useNavigate();

    const [invest, setInvest] = React.useState('');

    const [fund, setFund] = useState<FundData | null>(null);
    const [data, setData] = useState<CombinedDataItem[]>([]);

    function handleSubmit() {

        // const body = {
        //     "value_invested": invest
        // }

    }

    const handleClick = () => {
        handleSubmit();
        history('/fundslist');
    };

    // useEffect(() => {
    //     const fetchData = async () => {
    //       try {            
    //         // Fetching data from the Performance database
    //         const performanceRef = ref(db, 'Performance');
    //         const performanceSnapshot = await get(performanceRef);
    //         const performanceData = performanceSnapshot.exists() ? performanceSnapshot.val() : [];

    //         // Fetching data from the Benchmark database
    //         const benchmarkRef = ref(db, 'BenchmarkValue');
    //         const benchmarkSnapshot = await get(benchmarkRef);
    //         const benchmarkData = benchmarkSnapshot.exists() ? benchmarkSnapshot.val() : [];

    //         // Fetching data from the Performance database
    //         const fundsRef = ref(db, 'Funds');
    //         const fundsSnapshot = await get(fundsRef);
    //         const fundsData = fundsSnapshot.exists() ? fundsSnapshot.val() : [];

    //         if (id) {
    //             const matchedFund = fundsData.find((fund: FundData) => fund.id === id);
    //             if (matchedFund) {
    //                 setFund(matchedFund);
    //             } else {
    //                 console.log("Fund not found");
    //             }
    //         } else {
    //             console.log("ID is undefined");
    //         }
                
    //         const combinedData: CombinedDataItem[] = [];

    //         performanceData.forEach((pItem: PerformanceItem) => {
    //             benchmarkData.forEach((bItem: BenchmarkItem) => {
    //                 if (pItem.date === bItem.date) {
    //                     combinedData.push({
    //                         date: pItem.date,
    //                         fundId: pItem.fundId,
    //                         performanceValue: pItem.value,
    //                         bmId: bItem.bmId,
    //                         benchmarkValue: bItem.value,
    //                     });
    //                 }
    //             });
    //         });

    //         console.log(combinedData);

    //         setData(combinedData);

    //         } catch (error) {
    //         console.error("Error reading data:", error);
    //         }
    //     };

    //     fetchData();
    // }, []);

    useEffect(() => {
        function mockData() {            
            setData([
                { date: "10-20", fundId: "0", performanceValue: 100, bmId: "0", benchmarkValue: 90 },
                { date: "11-20", fundId: "0", performanceValue: 101, bmId: "0", benchmarkValue: 91 },
                { date: "12-20", fundId: "0", performanceValue: 104, bmId: "0", benchmarkValue: 92 },
                { date: "01-20", fundId: "0", performanceValue: 97, bmId: "0", benchmarkValue: 93 },
                { date: "02-20", fundId: "0", performanceValue: 94, bmId: "0", benchmarkValue: 94 },
                { date: "03-20", fundId: "0", performanceValue: 95, bmId: "0", benchmarkValue: 95 },
                { date: "04-20", fundId: "0", performanceValue: 97, bmId: "0", benchmarkValue: 95 },
                { date: "05-20", fundId: "0", performanceValue: 93, bmId: "0", benchmarkValue: 96 },
                { date: "06-20", fundId: "0", performanceValue: 88, bmId: "0", benchmarkValue: 96 },
                { date: "07-20", fundId: "0", performanceValue: 91, bmId: "0", benchmarkValue: 97 },
                { date: "08-20", fundId: "0", performanceValue: 92, bmId: "0", benchmarkValue: 97 },
                { date: "09-20", fundId: "0", performanceValue: 89, bmId: "0", benchmarkValue: 98 },
            ])
            setFund({id: "0", name: "Fund 1", description: "Fund 1 description"} as FundData)
        }

        mockData();
    }, []);

    if (!fund) {
        return (
            <div className='w-[100vw] h-[100vh] text-gray-700 px-12 py-12 overflow-y-auto'>
                <h2 className="mb-2 text-2xl font-bold text-start ml-4 text-gray-500 dark:text-gray-100">
                    Investor Dashboard
                </h2>
                <div className='h-[100vh] border-[1px] border-gray-300 dark:border-gray-700 text-gray-700 mt-6 rounded-md backdrop-blur-md bg-light-color/50 dark:bg-dark-color/50 '>
                </div> 
            </div>  
        )
    }

    return (
        <div className='w-[100vw] h-[100vh] text-gray-700 px-12 py-12 overflow-y-auto'>
            <h2 className="mb-2 text-2xl font-bold text-start ml-4 text-gray-500 dark:text-gray-100">
                Investor Dashboard
            </h2>
            {/* <h2 className="text-4xl text-secondary-color text-center font-bold py-6 border-[1px] border-gray-300 dark:border-gray-700 mt-6 rounded-md backdrop-blur-md bg-light-color/50 dark:bg-dark-color/50">
                <img src={Avatar} alt="Avatar" className="w-10 h-10 inline-block mr-8 rounded-full" />
                {fund.name}
            </h2>
            <div className='px-8 border-[1px] border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-100 mt-6 rounded-md backdrop-blur-md bg-light-color/50 dark:bg-dark-color/50 '>
                <h3 className='font-bold text-xl mt-8'>
                    Invest Section
                </h3>
                <div className='w-[100%-8] h-[1px] mt-2 mb-8 bg-gray-300 dark:bg-gray-700'></div>
                <div className='flex flex-col mb-8 rounded-[10px] space-y-1'>
                    <div className='grid grid-cols-2'>
                        <h3 className='italic'>Your DREX Balance:</h3>
                        <div className='flex flex-row items-center justify-start'>
                            <p className='font-bold text-secondary-color'>{Number(zusdBalance).toFixed(2)}</p>
                            <img src={WhaleToken} alt="whaletoken" className='w-6 h-6 ml-2' />
                        </div>
                    </div>
                    <div className='grid grid-cols-2'>
                        <h3 className='italic'>Your quotas Balance:</h3>
                        <p className='font-bold text-secondary-color'>{Number(quotaBalance).toFixed(2)}</p>
                    </div>
                    <div className='grid grid-cols-2'>
                        <h3 className='italic'>Quota Price:</h3>
                        <p className='font-bold text-secondary-color'>{Number(quotaPrice).toFixed(2)} USD/quota</p>
                    </div>
                    
                    <div className='grid grid-cols-2'>
                        <h3 className='italic'>Total number of quotas:</h3>
                        <p className='font-bold text-secondary-color'>{Number(totalQuotas).toFixed(2)}</p>
                    </div>

                    <div className='grid grid-cols-2'>
                        <h3 className='italic'>Maturation Date</h3>
                        <p className='font-bold text-secondary-color'>{timesTampToString(openRedeem)}</p>
                    </div>
                    
                    <div className='grid grid-cols-2'>
                        <h3
                        className='italic'
                        onClick={() => window.open(`${scanUrl}/address/${quotaAddress}`)}
                        style={{
                            cursor: "pointer"
                        }}
                        >See the quota on-chain:</h3>
                        <p 
                        style={{
                            cursor: "pointer"
                        }}
                        className='font-bold text-secondary-color truncate'>{quotaAddress}</p>
                    </div>
                </div>
                <div className='mb-8 items-end gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2'>
                    <FormInvestor   
                        invest={invest}
                        setInvest={setInvest}
                    />
                    <button
                    className="h-12 w-96 bg-secondary-color text-light-color dark:text-dark-color font-bold rounded-full border-2 border-transparent py-2 px-36 shadow-lg uppercase tracking-wider hover:bg-light-color hover:dark:bg-dark-color hover:text-secondary-color hover:dark:text-secondary-color hover:border-secondary-color transition duration-1000 ease-in-out"
                    >
                    {loading ? 'Loading...' : 'Invest'}
                    </button>
                </div>
            </div> */}
            <div className='border-[1px] border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-100 mt-6 rounded-md backdrop-blur-md bg-light-color/50 dark:bg-dark-color/50 '>
                <h3 className='font-bold text-xl ml-8 mt-8'>
                    Tokens Section
                </h3>
                <div className='w-[100%-8] h-[1px] mt-2 bg-gray-300 dark:bg-gray-700 mx-8'></div>
                <div className='p-6 flex flex-col items-center justify-center'>
                    <TokensTable />
                </div>
            </div>
            <div className='border-[1px] border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-100 mt-6 rounded-md backdrop-blur-md bg-light-color/50 dark:bg-dark-color/50 '>
                <h3 className='font-bold text-xl ml-8 mt-8'>
                    Performance Section
                </h3>
                <div className='w-[100%-8] h-[1px] mt-2 mb-8 bg-gray-300 dark:bg-gray-700 mx-8'></div>
                <div className='w-[80%] md:w-[95%] lg:w-[95%] h-[500px] p-6 flex flex-col items-center justify-center'>
                    <LineChartComponent data={data} />
                </div>
            </div>
            {/* <div className='border-[1px] border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-100 mt-6 rounded-md backdrop-blur-md bg-light-color/50 dark:bg-dark-color/50 '>
                <h3 className='font-bold text-xl ml-8 mt-8'>
                    Data Section
                </h3>
                <div className='w-[100%-8] h-[1px] mt-2 mb-8 bg-gray-300 dark:bg-gray-700 mx-8'></div>
                <div className='w-[80%] md:w-[95%] lg:w-[95%] p-8 flex flex-col items-center justify-center'>
                    <DataDiv fund={fund} />
                </div>
            </div> */}
        </div>
    )
}