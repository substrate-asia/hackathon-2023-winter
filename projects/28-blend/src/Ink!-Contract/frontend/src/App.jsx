// src/components/Routes.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Erc721  from './components/Erc721';
import Connect from './components/Connect';
import Upload from './components/Upload';
import Payment from './components/Payment';
import Name from './components/Name';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        {/* <Route path="/erc721" element={<Erc721/>} /> */}
        <Route path="/connect" element={<Connect/>} />
        <Route path="/upload" element={<Upload/>} />
        <Route path="/payment" element={<Payment/>} />
        <Route path="/name" element={<Name/>} />
        <Route path='/mint' element={<Erc721/>}/>
      </Routes>
    </Router>
  );
};

export default App;
