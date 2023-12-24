import { Button } from "@heathmont/moon-core-tw";
import Head from "next/head";
import React from "react";
import useContract from '../../services/useContract';

export default function ResetDataFORM() {

  const { contract,sendTransaction, signerAddress } = useContract();

  async function resetData() {
    await sendTransaction(await window.contract.populateTransaction.reset_all());
    window.location.href='/';
  }

  function ResetDataBTN() {
    return (
      <>
        <Button
          style={{ margin: "17px 0 0px 0px", width: "100%" }}
          onClick={resetData}
        >
          Reset All Data
        </Button>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Reset All data</title>
        <meta name="description" content="Add 5 days from now to Event" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="row" style={{ height: "100vh", paddingTop: 140 }}>
        <div className="createevents col">
          <div
            style={{
              background: "transparent",
              padding: "19px",
              borderRadius: "4px",
              height: "100%",
              border: "white solid",
            }}
          >
            <ResetDataBTN />
          </div>
        </div>
      </div>
    </>
  );
}
