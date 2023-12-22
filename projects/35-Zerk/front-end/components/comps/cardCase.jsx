import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { RotamContract } from "../../requireEnviromentVariables";
const contractABIrotam = require("../../utils/contractABIrotam.json");

export default function CardCase() {
  const [cases, setCases] = useState([]);

  const readCases = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        RotamContract,
        contractABIrotam,
        signer
      );

      const walletAddress = await signer.getAddress();
      const casesList = await contract.readCases(walletAddress);
      setCases(casesList);
    } catch (error) {
      console.error("Error reading cases:", error.message);
    }
  };

  useEffect(() => {
    readCases();
  }, []);

  return (
    <div>
      {cases.map((caseItem) => (
        <div key={caseItem.caseNumber}>
          <p>Case Number: {caseItem.caseNumber}</p>
          <p>Jurisdiction: {caseItem.jurisdiction}</p>
          <p>Price: {caseItem.price}</p>
          <p>Description: {caseItem.description}</p>
        </div>
      ))}
    </div>
  );
}
