
import './App.css'
import AppRoutes from "./routes"
// import { Link } from "react-router-dom";
import React, { createContext, useState } from 'react'
import {  ConfigProvider, theme, Input } from 'antd';
import Layout from "./layout";
import { MoralisProvider } from "react-moralis"
import {ScoreContext} from "./contexts/ScoreContext";
import {getProfile} from "./api/user";

export const UserContext = createContext()
const App = () =>{
    const [score, setScore] = useState(0);
    const updateScore = () => {
        getProfile({}).then(res => {
            setScore(res.data.score);
        });
    };
    return (
        <ScoreContext.Provider value={{ score, updateScore }}>
        <MoralisProvider initializeOnMount={false}>
        <div className="App">
            <ConfigProvider
                theme={{
                    token:{
                        colorPrimary: '#FF7676',
                        colorText: '#ffffff',
                        colorIconHover: 'rgba(255, 255, 255, 0.88)',
                        colorIcon: 'rgba(255, 255, 255, 0.45)',
                        colorBgContainer: 'rgba(0, 0, 0, 0.88)',
                        colorBgElevated: 'rgba(0, 0, 0, 0.88)'
                    }
                }}
            >
                <AppRoutes />
            </ConfigProvider>

        </div>
        </MoralisProvider>
        </ScoreContext.Provider>
    )
}


export default App
