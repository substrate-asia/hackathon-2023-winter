import React, { useState, useEffect } from 'react';
import { getChain } from '../../services/useContract';
import Alert from '@mui/material/Alert';
import useContract from '../../services/useContract';
import { useUtilsContext } from '../../contexts/UtilsContext';
import { usePolkadotContext } from '../../contexts/PolkadotContext';
import vTokenAbi from '../../services/json/vTokenABI.json';
import { sendTransfer } from '../../services/wormhole/useSwap';
import { Button, IconButton, Dropdown, MenuItem, Modal } from '@heathmont/moon-core-tw';
import { ControlsClose } from '@heathmont/moon-icons-tw';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

export default function JoinCommunityModal({ SubsPrice, show, onHide, address, recieveWallet, recievetype, title, daoId }) {
  const [Balance, setBalance] = useState('');
  const [Token, setToken] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const [Amount, setAmount] = useState(0);
  const [Coin, setCoin] = useState('');
  const { sendTransaction } = useContract();
  const router = useRouter();

  let alertBox = null;
  const [transaction, setTransaction] = useState({
    link: '',
    token: ''
  });

  const { BatchJoin, getUSDPriceForChain, switchNetworkByToken, getUSDPriceForDot } = useUtilsContext();
  const { userInfo, PolkadotLoggedIn, userWalletPolkadot, userSigner, showToast, api } = usePolkadotContext();

  function ShowAlert(type = 'default', message) {
    alertBox = document.querySelector('[name=alertbox]');

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

  async function JoinSubmission(e) {
    e.preventDefault();
    console.clear();

    const daoIdNumber = Number(daoId.split('_')[1]);

    setisLoading(true);
    const id = toast.loading('Joining Community ...');
    let feed = JSON.stringify({
      daoId: daoId,
      name: userInfo?.fullName?.toString()
    });
    async function onSuccess() {
      router.push(`/daos/${daoId}`);
      LoadData();
      setisLoading(false);
      onHide({ success: true });
    }
    if (Coin == 'DOT') {
      toast.update(id, {
        render: 'Joining Community....',
        type: 'pending'
      });
      let recipient = recievetype == 'Polkadot' ? recieveWallet : address;
      const txs = [api.tx.balances.transferAllowDeath(recipient, `${Amount * 1e12}`), api._extrinsics.daos.joinCommunity(daoId, Number(window.userid), new Date().toLocaleDateString(), feed), api._extrinsics.feeds.addFeed(feed, 'join', new Date().valueOf())];

      const transfer = api.tx.utility.batch(txs).signAndSend(userWalletPolkadot, { signer: userSigner }, (status) => {
        showToast(status, id, 'Joined successfully!', () => {
          onSuccess();
        });
      });
    } else {
      let recipient = recievetype == 'Polkadot' ? address : recieveWallet;
      if (Number(window.ethereum.networkVersion) === 1287) {
        toast.update(id, {
          render: 'Sending Batch Transaction....',
          type: 'pending'
        });

        await BatchJoin(Amount, recipient, daoIdNumber, feed);
        toast.update(id, {
          render: 'Purchased Subscription successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 1000,
          closeButton: true,
          closeOnClick: true,
          draggable: true
        });
        onSuccess();
      } else {
        let output = await sendTransfer(Number(window.ethereum.networkVersion), `${Number(Amount)}`, recipient, ShowAlert);
        setTransaction({
          link: output.transaction,
          token: output?.wrappedAsset
        });

        // Saving Joined Person on smart contract
        await sendTransaction(await window.contract.populateTransaction.join_community(daoIdNumber, Number(window.userid), new Date().toLocaleDateString(), feed));
        onSuccess();
      }
    }
  }

  async function LoadData(currencyChanged = false) {
    async function setPolkadot() {
      let usdPerDot = await getUSDPriceForDot();
      setToken('DOT');
      setCoin('DOT');
      let amount = SubsPrice / Number(usdPerDot);
      setAmount(amount.toPrecision(5));
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

      setBalance(Number((Balance / 1000000000000000000).toPrecision(5)));
      let UsdEchangePrice = await getUSDPriceForChain();
      let amount = SubsPrice / Number(UsdEchangePrice);
      setAmount(amount.toPrecision(5));
    }

    if (PolkadotLoggedIn && currencyChanged == false) {
      setPolkadot();
    } else if (currencyChanged == true && Coin == 'DOT') {
      await switchNetworkByToken(Coin);
      setPolkadot();
    } else if (currencyChanged == true && Coin !== 'DOT') {
      await switchNetworkByToken(Coin);
      setMetamask();
    }
  }
  useEffect(() => {
    if (Coin !== '') LoadData(true);
  }, [Coin]);

  useEffect(() => {
    LoadData();
  }, [show]);

  return (
    <Modal open={show} onClose={onHide} fullWidth aria-labelledby="contained-modal-title-vcenter" centered="true">
      <Modal.Backdrop />
      <Modal.Panel className="bg-gohan w-[90%] max-w-[480px]">
        <div className={`flex items-center justify-center flex-col`}>
          <div className="flex justify-between items-center w-full border-b border-beerus py-4 px-6">
            <h1 className="text-moon-20 font-semibold">Join community "{title}"</h1>
            <IconButton className="text-trunks" variant="ghost" icon={<ControlsClose />} onClick={onHide} />
          </div>
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

          <div className="flex flex-col gap-3 w-full p-8">
            <div className="flex justify-between pt-8">
              <h4 className="font-semibold text-moon-18">Total</h4>
              <h4 className="font-semibold text-moon-18">{SubsPrice} USD</h4>
            </div>

            <div className="flex justify-between">
              <h4 className="font-semibold text-moon-18">Coin</h4>
              <h4 className="font-semibold text-moon-18"></h4>
              <div className="flex items-center gap-2">
                {Amount}
                <Dropdown value={Coin} onChange={setCoin}>
                  <Dropdown.Select placeholder={"Select a Currency"} >
                    {Coin}
                  </Dropdown.Select>
                  <Dropdown.Options className="bg-gohan w-48 min-w-0 w-full">
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
            </div>

            {Amount > Balance ? (
              <p className="pt-5 text-right text-dodoria">Insufficient funds</p>
            ) : (
              <p className="pt-5 text-right">
                Your balance is {Balance} {Coin}
              </p>
            )}
          </div>

          <div className="flex justify-between border-t border-beerus w-full p-6">
            <Button variant="ghost" onClick={onHide}>
              Cancel
            </Button>
            <Button id="CreateGoalBTN" type="submit" onClick={JoinSubmission} animation={isLoading && 'progress'} disabled={Amount > Balance || isLoading}>
              Join
            </Button>
          </div>
        </div>
      </Modal.Panel>
    </Modal>
  );
}
