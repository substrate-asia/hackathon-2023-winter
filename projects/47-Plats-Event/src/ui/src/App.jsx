import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PaymentNft from "./Page/PaymentNft";
import PaymentCrowdSponsor from "./Page/PaymentCrowdSponsor";
import ClaimNFT from "./Page/ClaimNFT";
import NotFound from "./Page/NotFound";
import RewardNFT from "./Page/RewardNFT";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/payment-nft" element={<PaymentNft />} />
        <Route path="/claim-nft" element={<ClaimNFT />} />
        <Route path="/payment-crowdsponsor" element={<PaymentCrowdSponsor />} />
        <Route path="/reward-nft" element={<RewardNFT />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
