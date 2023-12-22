import DashboardCard from "../../components/CardTest/CardTest";
import ThemeToggleButton from "../../components/ThemeToggleButton/ThemeToggleButton";

export default function Test() {
      
    return (
        <>
            <div className='w-[100vw] h-screen ml-6 mt-6 rounded-md bg-light-color dark:bg-dark-color text-gray-700 overflow-y-auto flex flex-col items-center'>
                <DashboardCard
                    title="Revenue"
                    amount={65654}
                    trend={10}
                    trendDirection="up"
                />
                <ThemeToggleButton />
                <div className="w-48 h-48 bg-light-color dark:bg-dark-color border-2 border-orange-400"></div>
            </div>
        </>
    )
}