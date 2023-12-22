import { useEffect, useState } from 'react';
// import { db } from '../../firebase/firebase';
// import { get, ref } from "firebase/database";
import LineChartComponent from '../../components/LineChartComponent/LineChartComponent';
// import PieChartComponent from '../../components/PieChartComponent/PieChartComponent';
import { useParams } from 'react-router-dom';
import DataDiv from '../../components/DataDiv/DataDiv';
import FormSwap from '../../components/FormSwap/FormSwap';
import Avatar from '../../assets/whale_avatar2.png';
import TokensTable from '../../components/TokensTable/TokensTable';
// import axios from 'axios';

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
    // DIFFERENCE FROM FUNDID PAGE
    name: string;  
    description: string;
}

export default function DashboardId({ account, signer }: 
    { account: string | null; signer: any;}) {

    const { id } = useParams<{ id: string }>();

    const [fund, setFund] = useState<FundData | null>(null);
    const [data, setData] = useState<CombinedDataItem[]>([]);

    const [tokenA, setTokenA] = useState("DREX");
    const [tokenB, setTokenB] = useState("DREX");

    // const apiKey = import.meta.env.COINMARKET_API_KEY;
    // const [ethPrice, setEthPrice] = useState(null);

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
    //                 if (pItem.date === bItem.date && pItem.fundId === id) { // assuming `id` is string
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

        // const fetchData = async () => {
        //     try {
        //       const response = await axios.get('/v1/cryptocurrency/quotes/latest', {
        //         params: {
        //           symbol: 'ETH',
        //           convert: 'USD'
        //         },
        //         headers: {
        //             'X-CMC_PRO_API_KEY': apiKey
        //         }
        //       });
      
        //       setEthPrice(response.data.data.ETH.quote.USD.price);
        //     } catch (error) {
        //       console.error('Error fetching data: ', error);
        //     }
        // };

        // fetchData();
        mockData();
    }, []);

    if (!fund) {
        return (
            <div className='w-[100vw] h-[100vh] text-gray-700 px-12 py-12 overflow-y-auto'>
                <h2 className="mb-2 text-2xl font-bold text-start ml-4 text-gray-500 dark:text-gray-100">
                    Manager Dashboard
                </h2>
                <div className='h-[100vh] border-[1px] border-gray-300 dark:border-gray-700 text-gray-700 mt-6 rounded-md backdrop-blur-md bg-light-color/50 dark:bg-dark-color/50 '>
                </div> 
            </div> 
        )
    }

    return (
        <div className='w-[100vw] h-[100vh] text-gray-700 px-12 py-12 overflow-y-auto'>
            <h2 className="mb-2 text-2xl font-bold text-start ml-4 text-gray-500 dark:text-gray-100">
                Manager Dashboard
            </h2>
            <h2 className="text-4xl text-secondary-color text-center font-bold py-6 border-[1px] border-gray-300 dark:border-gray-700 mt-6 rounded-md backdrop-blur-md bg-light-color/50 dark:bg-dark-color/50">
                <img src={Avatar} alt="Avatar" className="w-10 h-10 inline-block mr-8 rounded-full" />
                {fund.name}
            </h2>
            <div className='border-[1px] border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-100 mt-6 rounded-md backdrop-blur-md bg-light-color/50 dark:bg-dark-color/50 '>
                <h3 className='font-bold text-xl ml-8 mt-8'>
                    Swap Section
                </h3>
                <div className='w-[100%-8] h-[1px] mt-2 mb-8 bg-gray-300 dark:bg-gray-700 mx-8'></div>
                <FormSwap   
                    tokenA={tokenA}
                    tokenB={tokenB}
                    setTokenA={setTokenA}
                    setTokenB={setTokenB}
                    signer={signer}
                    account={account}
                    fundId={id}
                />
                {/* {ethPrice ? (
                    <p>The latest price of Ethereum is ${ethPrice}</p>
                ) : (
                    <p>Loading...</p>
                )} */}
            </div>
            {/* <div className='border-[1px] border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-100 mt-6 rounded-md backdrop-blur-md bg-light-color/50 dark:bg-dark-color/50 '>
                <h3 className='font-bold text-xl ml-8 mt-8'>
                    Trade Section
                </h3>
                <div className='w-[100%-8] h-[1px] mt-2 mb-8 bg-gray-300 dark:bg-gray-700 mx-8'></div>
                <div className='w-[80%] md:w-[95%] lg:w-[95%] h-[500px] p-6 flex flex-col items-center justify-center'>
                    <LineChartComponent data={data} />
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
            <div className='border-[1px] border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-100 mt-6 rounded-md backdrop-blur-md bg-light-color/50 dark:bg-dark-color/50 '>
                <h3 className='font-bold text-xl ml-8 mt-8'>
                    Data Section
                </h3>
                <div className='w-[100%-8] h-[1px] mt-2 mb-8 bg-gray-300 dark:bg-gray-700 mx-8'></div>
                <div className='w-[80%] md:w-[95%] lg:w-[95%] p-8 flex flex-col items-center justify-center'>
                    <DataDiv fund={fund} />
                </div>
            </div>
        </div>
    )
}