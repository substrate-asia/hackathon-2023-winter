import Dialog from '@mui/material/Dialog';
import React, { useEffect, useState } from 'react';

import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Container from '@mui/material/Container';
import { useUtilsContext } from '../../../contexts/UtilsContext';
import useContract, { getChain } from '../../../services/useContract';

export default function VoteConviction({ show, onHide, PollIndex, goal_id, idea_id }) {
  const [Balance, setBalance] = useState('');
  const [Token, setToken] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const [isSent, setisSent] = useState(false);
  const [SelectedType, setSelectedType] = useState('aye');
  const [conviction, setConviction] = useState(1);
  const [Amount, setAmount] = useState(0);
  const [SplitAyeValue, setSplitAyeValue] = useState(0);
  const [SplitNayValue, setSplitNayValue] = useState(0);

  const [AbstainVoteValue, setAbstainVoteValue] = useState(0);
  const [AbstainAyeValue, setAbstainAyeValue] = useState(0);
  const [AbstainNayValue, setAbstainNayValue] = useState(0);
  const { contract, signerAddress, sendTransaction } = useContract();

  let alertBox = null;

  const { BatchVoteConviction, getUSDPriceForChain } = useUtilsContext();

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

  function SelectVoteType(type, btn) {
    var all_votes_types = document.querySelectorAll('.VoteType');

    all_votes_types.forEach((el) => {
      el.classList.remove('active');
    });

    setSelectedType(type);
    btn.classList.add('active');
  }
  async function VoteSubmission(e) {
    e.preventDefault();

    setisSent(false);
    alertBox = e.target.querySelector('[name=alertbox]');
    setisLoading(true);
    //If it is sending from Moonbase so it will use batch precompiles
    ShowAlert('pending', 'Voting...');
    let SplitInfo = [];
    SplitInfo[0] = SplitAyeValue * 1e18;
    SplitInfo[1] = SplitNayValue * 1e18;
    let AbstainInfo = [];
    AbstainInfo[0] = AbstainAyeValue * 1e18;
    AbstainInfo[1] = AbstainNayValue * 1e18;
    AbstainInfo[2] = AbstainVoteValue * 1e18;
    await BatchVoteConviction(goal_id, idea_id, SelectedType, PollIndex, Amount * 1e18, conviction, SplitInfo, AbstainInfo);

    ShowAlert('success', 'Voted successfully!');
    setTimeout(() => {
      window.location.reload();
    }, 1000);

    LoadData();
    setisLoading(false);
    setisSent(true);
  }
  const StyledPaper = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    color: theme.palette.text.primary
  }));
  async function LoadData() {
    const Web3 = require('web3');
    const web3 = new Web3(window.ethereum);
    let Balance = await web3.eth.getBalance(window?.ethereum?.selectedAddress?.toLocaleLowerCase());
    let token = ' ' + getChain(Number(window.ethereum.networkVersion)).nativeCurrency.symbol;
    setToken(token);
    setBalance((Balance / 1000000000000000000).toPrecision(5));
  }

  useEffect(() => {
    LoadData();
  }, [show]);

  return (
    <Dialog open={show} onClose={onHide} fullWidth aria-labelledby="contained-modal-title-vcenter" centered="true">
      <DialogTitle>Vote Conviction</DialogTitle>
      <DialogContent>
        <Container>
          <form id="doanteForm" onSubmit={VoteSubmission} autoComplete="off">
            <div name="alertbox" hidden="true">
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
            <div className="voteTypeContainer">
              <button
                type="button"
                selected
                onClick={(e) => {
                  SelectVoteType('aye', e.target);
                }}
                className="VoteType"
              >
                Aye
              </button>
              <button
                type="button"
                onClick={(e) => {
                  SelectVoteType('nay', e.target);
                }}
                className="VoteType"
              >
                Nay
              </button>
              <button
                type="button"
                onClick={(e) => {
                  SelectVoteType('split', e.target);
                }}
                className="VoteType"
              >
                Split
              </button>
              <button
                type="button"
                onClick={(e) => {
                  SelectVoteType('abstain', e.target);
                }}
                className="VoteType"
              >
                Abstain
              </button>
            </div>

            {SelectedType == 'aye' || SelectedType == 'nay' ? (
              <>
                <StyledPaper sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', my: 1, mx: 'auto', p: 2 }}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel>Amount ({Token})</InputLabel>

                    <Input name="amount" defaultValue={Amount} onChange={(e) => setAmount(Number(e.target.value))} />
                    <div>
                      <p>
                        Balance {Balance} {Token}
                      </p>
                    </div>
                  </FormControl>
                </StyledPaper>
                <StyledPaper sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', my: 1, mx: 'auto', p: 2 }}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel>Conviction</InputLabel>

                    <Select id="conviction" value={conviction} onChange={(e) => setConviction(Number(e.target.value))}>
                      <MenuItem value={0.1}>0.1x voting balance, no lockup period </MenuItem>
                      <MenuItem value={1}>1x voting balance, locked for 1x duration (1 day) </MenuItem>
                      <MenuItem value={2}>2x voting balance, locked for 2x duration (2 days) </MenuItem>
                      <MenuItem value={3}>3x voting balance, locked for 4x duration (4 days) </MenuItem>
                      <MenuItem value={4}>4x voting balance, locked for 8x duration (8 days) </MenuItem>
                      <MenuItem value={5}>5x voting balance, locked for 16x duration (16 days)</MenuItem>
                      <MenuItem value={6}>6x voting balance, locked for 32x duration (32 days)</MenuItem>
                    </Select>
                  </FormControl>
                </StyledPaper>
              </>
            ) : (
              <></>
            )}

            {SelectedType == 'split' ? (
              <>
                <StyledPaper sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', my: 1, mx: 'auto', p: 2 }}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel>Aye Vote Value ({Token})</InputLabel>

                    <Input name="aye_vote_value" defaultValue={SplitAyeValue} onChange={(e) => setSplitAyeValue(Number(e.target.value))} />
                    <div>
                      <p>
                        Balance {Balance} {Token}
                      </p>
                    </div>
                  </FormControl>
                </StyledPaper>
                <StyledPaper sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', my: 1, mx: 'auto', p: 2 }}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel>Nay Vote Value ({Token})</InputLabel>

                    <Input name="nay_vote_value" defaultValue={SplitNayValue} onChange={(e) => setSplitNayValue(Number(e.target.value))} />
                    <div>
                      <p>
                        Balance {Balance} {Token}
                      </p>
                    </div>
                  </FormControl>
                </StyledPaper>
              </>
            ) : (
              <></>
            )}
            {SelectedType == 'abstain' ? (
              <>
                <StyledPaper sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', my: 1, mx: 'auto', p: 2 }}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel>Abstain Vote Value ({Token})</InputLabel>

                    <Input name="abstain_vote_value" defaultValue={AbstainVoteValue} onChange={(e) => setAbstainVoteValue(Number(e.target.value))} />
                    <div>
                      <p>
                        Balance {Balance} {Token}
                      </p>
                    </div>
                  </FormControl>
                </StyledPaper>
                <StyledPaper sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', my: 1, mx: 'auto', p: 2 }}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel>Aye Vote Value ({Token})</InputLabel>

                    <Input name="aye_vote_value" defaultValue={AbstainAyeValue} onChange={(e) => setAbstainAyeValue(Number(e.target.value))} />
                    <div>
                      <p>
                        Balance {Balance} {Token}
                      </p>
                    </div>
                  </FormControl>
                </StyledPaper>
                <StyledPaper sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', my: 1, mx: 'auto', p: 2 }}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel>Nay Vote Value ({Token})</InputLabel>

                    <Input name="nay_vote_value" defaultValue={AbstainNayValue} onChange={(e) => setAbstainNayValue(Number(e.target.value))} />
                    <div>
                      <p>
                        Balance {Balance} {Token}
                      </p>
                    </div>
                  </FormControl>
                </StyledPaper>
              </>
            ) : (
              <></>
            )}

            <DialogActions>
              {Amount <= Balance ? (
                <>
                  <LoadingButton type="submit" name="VoteConvictionBTN" loading={isLoading} className="btn-secondary" size="medium">
                    Vote
                  </LoadingButton>
                </>
              ) : (
                <>
                  <span style={{ color: 'red' }}>Insufficent funds</span>
                </>
              )}
            </DialogActions>
          </form>
        </Container>
      </DialogContent>
    </Dialog>
  );
}
