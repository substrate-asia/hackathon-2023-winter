import React, { useState } from 'react';
import AcalaTokenDashboard from './Acala';
import BifrostTokenDashboard from './Bifrost';
import AcalaLogo from './assets/acala.jpg';
import BifrostLogo from './assets/bifrost.jpg';

function App() {
  const [selectedDashboard, setSelectedDashboard] = useState();

  return (
    <div style={{padding: '24px'}}>
        <div style={{display: 'flex', justifyContent: "center", gap: "30px"}}>
      <button style={{ maxWidth: '100px', maxHeight: '100px', display: 'inline-block' }} onClick={() => setSelectedDashboard('Acala')}>
        <img src={AcalaLogo} alt="Acala" style={{ width: '100%' }} />
      </button>
      <button style={{ maxWidth: '100px', maxHeight: '100px', display: 'inline-block' }} onClick={() => setSelectedDashboard('Bifrost')}>
        <img src={BifrostLogo} alt="Bifrost" style={{ width: '100%' }} />
      </button>
      </div>

      {selectedDashboard === 'Acala' && <AcalaTokenDashboard />}
      {selectedDashboard === 'Bifrost' && <BifrostTokenDashboard />}
    </div>
  );
}

export default App;