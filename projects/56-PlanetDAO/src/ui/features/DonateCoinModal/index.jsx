import React, { useEffect, useState } from 'react';

import Alert from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';
import { ethers } from 'ethers';
import { useUtilsContext } from '../../contexts/UtilsContext';
import { usePolkadotContext } from '../../contexts/PolkadotContext';
import vTokenAbi from '../../services/json/vTokenABI.json';
import useContract, { getChain } from '../../services/useContract';

import { sendTransfer } from '../../services/wormhole/useSwap';
import { Button, Dropdown, IconButton, Modal } from '@heathmont/moon-core-tw';
import { ControlsClose } from '@heathmont/moon-icons-tw';
import UseFormInput from '../../components/components/UseFormInput';
import { toast } from 'react-toastify';

export default function DonateCoin({ ideasid,daoId, goalURI, show, onHide, address, recieveWallet, recievetype }) {
  const [Balance, setBalance] = useState('');
  const { userInfo, PolkadotLoggedIn, userWalletPolkadot, userSigner, showToast, api } = usePolkadotContext();
  const [CurrentChain, setCurrentChain] = useState('');
  const [CurrentChainNetwork, setCurrentChainNetwork] = useState(0);
  const [CurrentAddress, setCurrentAddress] = useState('');
  const [Coin, setCoin] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const [isSent, setisSent] = useState(false);
  const { sendTransaction } = useContract();

  let alertBox = null;
  const [transaction, setTransaction] = useState({
    link: '',
    token: ''
  });

  const { BatchDonate, switchNetworkByToken } = useUtilsContext();

  const [Amount, AmountInput] = UseFormInput({
    defaultValue: '',
    type: 'number',
    placeholder: '0.00',
    id: 'amount',
    className: 'max-w-[140px]'
  });

  function ShowAlert(type = 'default', message) {
    const pendingAlert = alertBox.children['pendingAlert'];
    const successAlert = alertBox.children['successAlert'];
    const errorAlert = alertBox.children['errorAlert'];

    alertBox.style.display = 'block';
    pendingAlert.style.display = 'none';
    successAlert.style.display = 'none';
    errorAlert.style.display = 'none';
    switch (type) {
      case 'pending':
        pendingAlert.querySelector('.MuiAlert-message').innerText = message;
        pendingAlert.style.display = 'flex';
        break;
      case 'success':
        successAlert.querySelector('.MuiAlert-message').innerText = message;
        successAlert.style.display = 'flex';
        break;
      case 'error':
        errorAlert.querySelector('.MuiAlert-message').innerText = message;
        errorAlert.style.display = 'flex';
        break;
    }
  }

  async function DonateCoinSubmission(e) {
    e.preventDefault();
    console.clear();
    setisSent(false);
    alertBox = e.target.querySelector('[name=alertbox]');
    setisLoading(true);
    ShowAlert('pending', 'Donating ...');

    let feed1 = JSON.stringify({
      name: userInfo?.fullName?.toString(),
      badge: 'First Donation'
    });

    let feed2 = JSON.stringify({
      donated: Amount,
      goalTitle: goalURI.Title,
      ideasid: ideasid,
      daoId: daoId
    });

    async function onSuccess() {
      window.location.reload();
      LoadData();
      setisLoading(false);
      setisSent(true);

      onHide({ success: true });
    }
    if (Coin == 'DOT') {
      let recipient = recievetype == 'Polkadot' ? recieveWallet : address;
      const txs = [api.tx.balances.transferAllowDeath(recipient, `${Amount * 1e12}`), api._extrinsics.ideas.addDonation(ideasid, `${Amount * 1e12}`, Number(window.userid)), api._extrinsics.feeds.addFeed(feed2, 'donation', new Date().valueOf())];

      const transfer = api.tx.utility.batch(txs).signAndSend(userWalletPolkadot, { signer: userSigner }, (status) => {
        showToast(
          status,
          ShowAlert,
          'Donation successful!',
          () => {
            onSuccess();
          },
          true,
          null,
          true
        );
      });
    } else {
      let recipient = recievetype == 'Polkadot' ? address : recieveWallet;
      if (Number(window.ethereum.networkVersion) === 1287) {
        //If it is sending from Moonbase so it will use batch precompiles
        ShowAlert('pending', 'Sending Batch Transaction....');
        await BatchDonate(Amount, recipient, ideasid, Coin, feed1, feed2);

        ShowAlert('success', 'Donation success!');
        onSuccess()
      } else {
        let output = await sendTransfer(Number(window.ethereum.networkVersion), Amount, recipient, ShowAlert);
        setTransaction({
          link: output.transaction,
          token: output?.wrappedAsset
        });

        // Saving Donation count on smart contract
        ShowAlert('pending', 'Saving information....');
        await sendTransaction(await window.contract.populateTransaction.add_donation(ideasid, `${Amount * 1e18}`, Number(window.userid), feed1, feed2));
        ShowAlert('success', 'Success!');
        onSuccess()
      }
    }
  }

  async function LoadData(currencyChanged = false) {
    async function setPolkadot() {
      if (Coin !== 'DOT') setCoin('DOT');
      const { nonce, data: balance } = await api.query.system.account(userWalletPolkadot);
      setBalance(Number(balance.free.toString()) / 1e12);
    }

    async function setMetamask() {
      const Web3 = require('web3');
      const web3 = new Web3(window.ethereum);
      let Balance = await web3.eth.getBalance(window?.ethereum?.selectedAddress?.toLocaleUpperCase());

      if (Coin !== 'DEV') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const tokenInst = new ethers.Contract(vTokenAbi.address, vTokenAbi.abi, provider);

        Balance = await tokenInst.balanceOf(window?.ethereum?.selectedAddress);
      }

      setBalance((Balance / 1000000000000000000).toFixed(5));
      setCurrentChain(getChain(Number(window.ethereum.networkVersion)).name);
      setCurrentChainNetwork(Number(window.ethereum.networkVersion));
      setCurrentAddress(window?.ethereum?.selectedAddress?.toLocaleUpperCase());
    }

    if (PolkadotLoggedIn && currencyChanged == false && Coin == '') {
      setPolkadot();
    } else if (currencyChanged == true && Coin == 'DOT') {
      await switchNetworkByToken(Coin);
      setPolkadot();
    } else if (currencyChanged == true && Coin !== 'DOT' && Coin !== '') {
      await switchNetworkByToken(Coin);
      setMetamask();
    }
  }

  function isInvalid() {
    return !Amount;
  }
  useEffect(() => {
    if (Coin !== '') LoadData(true);
  }, [Coin]);

  useEffect(() => {
    LoadData();
  }, [show]);

  return (
    <Modal open={show} onClose={onHide}>
      <Modal.Backdrop />
      <Modal.Panel className="min-w-[480px] bg-gohan">
        <div className="flex items-center justify-center flex-col">
          <div className="flex justify-between items-center w-full border-b border-beerus py-4 px-6">
            <h1 className="text-moon-20 font-semibold">Donate to idea</h1>
            <IconButton className="text-trunks" variant="ghost" icon={<ControlsClose />} onClick={onHide} />
          </div>
          <div className="flex flex-col gap-6 w-full max-h-[calc(90vh-162px)]">
            <form id="doanteForm" onSubmit={DonateCoinSubmission} autoComplete="off">
              <div name="alertbox" hidden>
                <Alert variant="filled" sx={{ my: 1 }} name="pendingAlert" severity="info">
                  Pending....
                </Alert>
                <Alert variant="filled" sx={{ my: 1 }} name="successAlert" severity="success">
                  Success....
                </Alert>
                <Alert variant="filled" sx={{ my: 1 }} name="errorAlert" severity="error">
                  Error....
                </Alert>
              </div>

              <div className="flex flex-col gap-2 py-16 px-6">
                <div className="flex items-center ">
                  <span className="font-semibold flex-1">Total</span>
                  <div className="max-w-[140px] mr-4"> {AmountInput}</div>
                  <Dropdown value={Coin} onChange={setCoin} className="max-w-[100px] ">
                    <Dropdown.Select>{Coin}</Dropdown.Select>
                    <Dropdown.Options className="bg-gohan w-48 min-w-0">
                      <Dropdown.Option value="DOT">
                        <MenuItem>DOT</MenuItem>
                      </Dropdown.Option>
                      <Dropdown.Option value="DEV">
                        <MenuItem>DEV</MenuItem>
                      </Dropdown.Option>
                      <Dropdown.Option value="xcvGLMR">
                        <MenuItem>xcvGLMR</MenuItem>
                      </Dropdown.Option>
                      <Dropdown.Option value="tBNB">
                        <MenuItem>BNB</MenuItem>
                      </Dropdown.Option>
                      <Dropdown.Option value="CELO">
                        <MenuItem>CELO</MenuItem>
                      </Dropdown.Option>
                      <Dropdown.Option value="GoerliETH">
                        <MenuItem>ETH</MenuItem>
                      </Dropdown.Option>
                    </Dropdown.Options>
                  </Dropdown>
                </div>

                <p className="text-trunks w-full text-right">Your balance is {Balance} </p>
              </div>

              <div className="flex justify-between border-t border-beerus w-full p-6">
                <Button variant="ghost" onClick={onHide}>
                  Cancel
                </Button>
                <Button animation={isLoading && 'progress'} disabled={isLoading || isInvalid()} type="submit" id="CreateGoalBTN">
                  Donate
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Modal.Panel>
    </Modal>
  );
}
