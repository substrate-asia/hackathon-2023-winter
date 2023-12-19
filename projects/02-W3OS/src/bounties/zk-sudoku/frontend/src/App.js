import Board from "./components/board";
import React, { useEffect, useState } from "react";
import NumbersKeyboard from "./components/numbersKeyboard";
import styles from "./App.css";
import {
  useConnect,
  useContract,
  useProvider,
  useSigner,
  useNetwork,
  useSwitchNetwork,
  useAccount,
} from "wagmi";

// import { switchNetwork } from "./utils/switchNetwork";

import networks from "./utils/networks.json";

import { sudokuCalldata } from "./zkproof/sudoku/snarkjsSudoku";

import contractAddress from "./utils/contractaddress.json";

import sudokuContractAbi from "./utils/abiFiles/Sudoku/Sudoku.json";
import { InjectedConnector } from "@wagmi/core";

let sudokuBoolInitialTemp = [
  [false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false],
];

export default function Sudoku() {
  const [sudokuInitial, setSudokuInitial] = useState([]);
  const [sudoku, setSudoku] = useState([]);
  const [sudokuBoolInitial, setSudokuBoolInitial] = useState(
    sudokuBoolInitialTemp
  );
  const [selectedPosition, setSelectedPosition] = useState([]);

  const { connect } = useConnect({ connector: new InjectedConnector() });
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const [loadingVerifyBtn, setLoadingVerifyBtn] = useState(false);
  const [loadingVerifyAndMintBtn, setLoadingVerifyAndMintBtn] = useState(false);
  const [loadingStartGameBtn, setLoadingStartGameBtn] = useState(false);

  const { data: signer } = useSigner();

  const provider = useProvider();

  const contract = useContract({
    address: contractAddress.sudokuContract,
    abi: sudokuContractAbi.abi,
    signerOrProvider: signer || provider,
  });

  const contractNoSigner = useContract({
    address: contractAddress.sudokuContract,
    abi: sudokuContractAbi.abi,
    signerOrProvider: provider,
  });

  const updatePosition = (number) => {
    if (selectedPosition.length > 0) {
      if (!sudokuBoolInitial[selectedPosition[0]][selectedPosition[1]]) return;
      const temp = [...sudoku];
      temp[selectedPosition[0]][selectedPosition[1]] = number;
      setSudoku(temp);
      console.log("sudoku", sudoku);
    }
  };

  const calculateProof = async () => {
    setLoadingVerifyBtn(true);
    console.log("sudokuInitial", sudokuInitial);
    console.log("sudoku", sudoku);
    let calldata = await sudokuCalldata(sudokuInitial, sudoku);

    if (!calldata) {
      setLoadingVerifyBtn(false);
      return "Invalid inputs to generate witness.";
    }

    // console.log("calldata", calldata);

    try {
      let result;
      if (address && chain === networks.selectedChain) {
        result = await contract.verifySudoku(
          calldata[0],
          calldata[1],
          calldata[2],
          calldata[3]
        );
      } else {
        result = await contractNoSigner.verifySudoku(
          calldata[0],
          calldata[1],
          calldata[2],
          calldata[3]
        );
      }
      console.log("result", result);
      setLoadingVerifyBtn(false);
      alert("Successfully verified");
    } catch (error) {
      setLoadingVerifyBtn(false);
      alert("Wrong solution");
    }
  };

  const verifySudoku = async () => {
    console.log("Address", address);
    calculateProof();
  };

  const calculateProofAndMintNft = async () => {
    setLoadingVerifyAndMintBtn(true);
    console.log("sudokuInitial", sudokuInitial);
    console.log("sudoku", sudoku);
    let calldata = await sudokuCalldata(sudokuInitial, sudoku);

    if (!calldata) {
      setLoadingVerifyAndMintBtn(false);
      return "Invalid inputs to generate witness.";
    }

    // console.log("calldata", calldata);

    try {
      let txn = await contract.verifySudokuAndMintNft(
        calldata[0],
        calldata[1],
        calldata[2],
        calldata[3]
      );
      await txn.wait();
      setLoadingVerifyAndMintBtn(false);
      alert(
        `Successfully verified! The NFT has been minted and sent to your wallet. You can see the contract here: ${
          networks[networks.selectedChain].blockExplorerUrls[0]
        }address/${contractAddress.sudokuContract}`
      );
    } catch (error) {
      console.error(error);
      setLoadingVerifyAndMintBtn(false);
      alert("Wrong solution");
    }
  };

  const verifySudokuAndMintNft = async () => {
    console.log("Address", address);
    calculateProofAndMintNft();
  };

  const renderVerifySudoku = () => {
    return (
      <button
        className="flex justify-center items-center disabled:cursor-not-allowed space-x-3 verify-btn text-lg font-medium rounded-md px-5 py-3 w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500"
        onClick={verifySudoku}
        disabled={loadingVerifyBtn}
      >
        {loadingVerifyBtn && <div className={styles.loader}></div>}
        <span>Verify Sudoku</span>
      </button>
    );
  };

  const renderVerifySudokuAndMintNft = () => {
    const selectChainId = parseInt(networks.selectedChain);
    if (!address) {
      return (
        <button
          className="text-lg font-medium rounded-md px-5 py-3 w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500"
          onClick={() => connect()}
        >
          Connect Wallet to Verify Sudoku & Mint NFT
        </button>
      );
    } else if (address && chain.id !== selectChainId) {
      return (
        <button
          className="text-lg font-medium rounded-md px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500"
          onClick={() => switchNetwork(selectChainId)}
        >
          Switch Network to Verify Sudoku & Mint NFT
        </button>
      );
    } else {
      return (
        <button
          className="flex justify-center items-center disabled:cursor-not-allowed space-x-3 verify-btn text-lg font-medium rounded-md px-5 py-3 w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500"
          onClick={verifySudokuAndMintNft}
          disabled={loadingVerifyAndMintBtn}
        >
          {loadingVerifyAndMintBtn && <div className={styles.loader}></div>}
          <span>Verify Sudoku & Mint NFT</span>
        </button>
      );
    }
  };

  const initializeBoard = async () => {
    try {
      let board;

      if (address && chain === networks.selectedChain) {
        board = await contract.generateSudokuBoard(new Date().toString());
      } else {
        board = await contractNoSigner.generateSudokuBoard(
          new Date().toString()
        );
      }

      console.log("result", board);

      setSudokuInitial(board);

      let newArray = board.map((arr) => {
        return arr.slice();
      });
      setSudoku(newArray);

      const temp = [
        [false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false],
      ];
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
          if (board[i][j] === 0) {
            temp[i][j] = true;
          }
        }
      }
      setSudokuBoolInitial(temp);
    } catch (error) {
      console.error(error);
      alert("Failed fetching Sudoku board");
    }
  };

  const renderNewGame = () => {
    return (
      <button
        className="flex justify-center items-center disabled:cursor-not-allowed space-x-3 verify-btn text-lg font-medium rounded-md px-5 py-3 w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500"
        onClick={async () => {
          setLoadingStartGameBtn(true);
          await initializeBoard();
          setLoadingStartGameBtn(false);
        }}
        disabled={loadingStartGameBtn}
      >
        {loadingStartGameBtn && <div className={styles.loader}></div>}
        <span>New Game</span>
      </button>
    );
  };

  const renderSudoku = () => {
    if (sudoku.length !== 0) {
      return (
        <>
          <div>
            <Board
              sudoku={sudoku}
              setSelectedPosition={(pos) => setSelectedPosition(pos)}
              selectedPosition={selectedPosition}
              sudokuBoolInitial={sudokuBoolInitial}
            />
          </div>
          <div>
            <div className="flex justify-center items-center my-10">
              {renderNewGame()}
            </div>
            <NumbersKeyboard updatePosition={updatePosition} />
            <div className="flex justify-center items-center my-10">
              {renderVerifySudoku()}
            </div>
            <div className="flex justify-center items-center my-10">
              {renderVerifySudokuAndMintNft()}
            </div>
          </div>
        </>
      );
    } else {
      return (
        <div className="flex justify-center items-center space-x-3">
          <div className={styles.loader}></div>
          <div>Loading Game</div>
        </div>
      );
    }
  };

  useEffect(() => {
    console.log("Sudoku page");

    initializeBoard();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="bg-slate-900 p-10">
      <h1 className="text-center p-10 mb-5 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">
        zk-Sudoku
      </h1>
      <div className="flex flex-wrap gap-20 justify-center items-center text-slate-300">
        {renderSudoku()}
      </div>
      <div className="pd-20 flex place-content-center mt-20 text-lg text-slate-300">
        <div className="md:w-6/12">
          <div className="text-center my-5 font-semibold">Sudoku rules:</div>
          <div className="space-y-5">
            <p>
              <span className="font-semibold">Sudoku</span> (also known as
              &quot;Number Place&quot;) is a placement puzzle. The puzzle is
              most frequently a 9 x 9 grid made up of 3 x 3 subgrids (called
              &quot;regions&quot;). Some cells already contain numbers, known as
              &quot;givens&quot;.
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                The goal is to fill in the empty cells, one number in each, so
                that each column, row, and region contains the numbers 1 through
                9 exactly once.
              </li>
              <li>
                Each number in the solution therefore occurs only once in each
                of three &quot;directions&quot;, hence the &quot;single
                numbers&quot; implied by the puzzle&apos;s name.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
