'use client';
import { useContext, useEffect, useState } from 'react';
import { createContext } from 'react';
import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';
import polkadotConfig from './json/polkadot-config.json';
import { toast } from 'react-toastify';

const AppContext = createContext({
  api: null,
  deriveAcc: null,
  showToast: (status, id, FinalizedText, doAfter, callToastSuccess = true, events, toast) => { },
  userInfo: {},
  userWalletPolkadot: '',
  userSigner: null,
  PolkadotLoggedIn: false,
  EasyToast: (message, type, UpdateType = false, ToastId = '') => { },
  GetAllDaos: async () => { },
  GetAllJoined: async () => { },
  GetAllGoals: async () => { },
  GetAllFeeds: async () => { },
  GetAllIdeas: async () => { },
  GetAllVotes: async () => { },
  GetAllDonations: async () => { },
  GetAllUserDonations: async () => { },
  getUserInfoById: async (userid) => { },
  updateCurrentUser: () => { }
});

export function PolkadotProvider({ children }) {
  const [api, setApi] = useState();
  const [deriveAcc, setDeriveAcc] = useState(null);
  const [PolkadotLoggedIn, setPolkadotLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [userWalletPolkadot, setUserWalletPolkadot] = useState('');
  const [userSigner, setUserSigner] = useState('');

  async function showToast(status, IdOrShowAlert, FinalizedText, doAfter, callToastSuccess = true, events, ShowToast = false) {
    if (status.isInBlock) {
      if (ShowToast == false) {
      toast.update(IdOrShowAlert, { render: 'Transaction In block...', isLoading: true });
      }else {
        IdOrShowAlert('pending', 'Transaction In block...');
      }

    } else if (status.isFinalized) {
      if (callToastSuccess)
        if (ShowToast == false) {
          toast.update(IdOrShowAlert, {
            render: FinalizedText,
            type: 'success',
            isLoading: false,
            autoClose: 1000,
            closeButton: true,
            closeOnClick: true,
            draggable: true
          });
        } else {
          IdOrShowAlert('success', FinalizedText);
        }

      if (events != null) {
        doAfter(events);
      } else {
        doAfter();
      }
    }
  }

  async function getUserInfoById(userid) {
    if (api) {
      return await api.query.users.userById(userid);
    } else {
      return {};
    }
  }
  async function EasyToast(message, type, UpdateType = false, ToastId = '') {
    if (UpdateType) {
      toast.update(ToastId, {
        render: message,
        type: type,
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
        closeOnClick: true,
        draggable: true
      });
    }
  }

  async function updateCurrentUser() {
    const { web3Enable, web3Accounts, web3FromAddress } = require('@polkadot/extension-dapp');

    setPolkadotLoggedIn(true);
    await web3Enable('PlanetDAO');
    let wallet = (await web3Accounts())[0];
    const injector = await web3FromAddress(wallet.address);

    setUserSigner(injector.signer);

    setUserWalletPolkadot(wallet.address);
    window.signerAddress = wallet.address;
  }

  useEffect(() => {
    (async function () {
      try {
        const wsProvider = new WsProvider(polkadotConfig.chain_rpc);
        const _api = await ApiPromise.create({ provider: wsProvider });
        await _api.isReady;

        setApi(_api);

        const keyring = new Keyring({ type: 'sr25519' });
        const newPair = keyring.addFromUri(polkadotConfig.derive_acc);
        setDeriveAcc(newPair);

        if (window.localStorage.getItem('loggedin') == 'true') {
          let userid = window.localStorage.getItem('user_id');
          window.userid = userid;
          const userInformation = await _api.query.users.userById(userid);
          setUserInfo(userInformation);

          if (window.localStorage.getItem('login-type') == 'polkadot') {
            updateCurrentUser();
          }
        }
        console.log('Done');
      } catch (e) { }
    })();
  }, []);

  //One Time Counter

  let allVotes = [];
  let allDonations = [];
  let allIdeas = [];
  let allDaos = [];

  async function InsertData(totalDAOCount, allDAOs, prefix) {
    const arr = [];
    for (let i = 0; i < totalDAOCount; i++) {
      let object = '';
      let originalwallet = '';
      if (prefix == 'm_') {
        object = JSON.parse(allDAOs[i]);
      } else {
        if (allDAOs[i]?.daoUri) {
          object = JSON.parse(allDAOs[i].daoUri?.toString());
          originalwallet = allDAOs[i].daoWallet?.toString();
        }
      }

      if (object) {
        let user_info = await getUserInfoById(object.properties?.user_id?.description);
        arr.push({
          //Pushing all data into array
          id: i,
          daoId: prefix + i,
          Title: object.properties.Title.description,
          Start_Date: object.properties.Start_Date.description,
          user_info: user_info,
          user_id: object.properties?.user_id?.description,
          logo: object.properties.logo.description?.url,
          wallet:originalwallet,
          recievewallet:  object.properties.wallet.description,
          recievetype: prefix == 'm_' ? 'Polkadot' : 'EVM',
          SubsPrice: object.properties?.SubsPrice?.description,
          Created_Date: object.properties?.Created_Date?.description,
        });
      }
    }
    return arr;
  }

  async function fetchPolkadotDAOData() {
    //Fetching data from Parachain
    try {
      if (api) {
        let totalDAOCount = Number(await api._query.daos.daoIds());
        let totalDao = async () => {
          let arr = [];
          for (let i = 0; i < totalDAOCount; i++) {
            const element = await api._query.daos.daoById(i);
            let daoURI = element['__internal__raw'];

            arr.push(daoURI);
          }
          return arr;
        };

        let arr = InsertData(totalDAOCount, await totalDao(), 'p_');
        return arr;
      }
    } catch (error) { }
    return [];
  }
  async function fetchContractDAOData() {
    //Fetching data from Smart contract
    try {
      if (window.contract) {
        const totalDao = await window.contract.get_all_daos(); //Getting total dao (Number)
        let totalDAOCount = Object.keys(totalDao).length;
        let arr = InsertData(totalDAOCount, totalDao, 'm_');
        return arr;
      }
    } catch (error) { }

    return [];
  }
  async function GetAllDaos() {
    let arr = [];
    arr = arr.concat(await fetchPolkadotDAOData());
    arr = arr.concat(await fetchContractDAOData());
    return arr;
  }

  async function fetchPolkadotJoinedData() {
    //Fetching data from Parachain
    try {
      if (api) {
        let totalJoinedCount = Number(await api._query.daos.joinedIds());
        let arr = [];
        for (let i = 0; i < totalJoinedCount; i++) {
          const element = await api._query.daos.joinedById(i);
          let newElm = {
            id: element['__internal__raw'].id.toString(),
            daoId: element['__internal__raw'].daoid.toString(),
            user_id: element['__internal__raw'].userId.toString(),
            joined_date: element['__internal__raw'].joinedDate.toString()
          };
          arr.push(newElm);
        }
        //All DAOs Users
        let allDaos = await GetAllDaos();
        for (let i = 0; i < allDaos.length; i++) {
          const element = allDaos[i];
          let newElm = {
            id: element.daoId,
            daoId: element.daoId,
            user_id: element.user_id,
            joined_date: element.Created_Date
          };
          arr.push(newElm);
        }


        return arr;
      }
    } catch (error) { console.error(error) }
    return [];
  }
  async function fetchContractJoinedData() {
    //Fetching data from Smart contract
    try {
      if (window.contract) {
        const totalJoined = await contract._join_ids();

        const arr = [];
        for (let i = 0; i < Number(totalJoined); i++) {
          const joined_dao = await contract._joined_person(i);
          arr.push(joined_dao);
        }

        return arr;
      }
    } catch (error) { }

    return [];
  }
  async function GetAllJoined() {
    let arr = [];
    arr = arr.concat(await fetchPolkadotJoinedData());
    arr = arr.concat(await fetchContractJoinedData());
    return arr;
  }


  async function InsertGoalData(totalGoalCount, allGoals, prefix) {
    const arr = [];
    for (let i = 0; i < totalGoalCount; i++) {
      let object = '';
      let daoId = "";
      if (prefix == 'm_') {
        object = JSON.parse(allGoals[i].goal_uri);
        daoId = allGoals[i].dao_id;
      } else {
        if (allGoals[i]?.goalUri) {
          object = JSON.parse(allGoals[i].goalUri?.toString());
          daoId = allGoals[i].daoId.toString();
        }
      }
      let goalId = prefix + i;
  
      let reached = 0;
      let currentGoalIdeas = allIdeas.filter((e) => e.goalId == goalId)
      for (let i = 0; i < currentGoalIdeas.length; i++) {
        const element = (currentGoalIdeas[i]);
        reached += element.donation;
      }


      if (object) {
        arr.push({
          //Pushing all data into array
          id: i,
          goalId: goalId,
          daoId: daoId,
          Title: object.properties.Title.description,
          Description: object.properties.Description.description,
          Budget: object.properties.Budget.description,
          End_Date: object.properties.End_Date.description,
          wallet: object.properties.wallet.description,
          UserId: object.properties?.user_id?.description,
          logo: object.properties.logo.description?.url,
          type: prefix == 'm_' ? 'Polkadot' : 'EVM',
          ideasCount: currentGoalIdeas.length,
          reached: reached,
        });
      }
    }
    return arr;
  }
  async function fetchPolkadotGoalData() {
    //Fetching data from Parachain
    try {
      if (api) {
        let totalGoalCount = Number(await api._query.goals.goalIds());

        let totalGoal = async () => {
          let arr = [];
          for (let i = 0; i < totalGoalCount; i++) {
            const element = await api._query.goals.goalById(i);
            let goalURI = element['__internal__raw'];

            arr.push(goalURI);
          }
          return arr;
        };

        let arr = InsertGoalData(totalGoalCount, await totalGoal(), 'p_');
        return arr;
      }
    } catch (error) { }
    return [];
  }
  async function fetchContractGoalData() {
    //Fetching data from Smart contract
    try {
      if (window.contract) {
        const totalGoalCount = Number(await contract._goal_ids());
        let totalGoal = async () => {
          const arr = [];
          for (let i = 0; i < Number(totalGoalCount); i++) {
            const goal_info = await contract._goal_uris(i);
            arr.push(goal_info);
          }
          return arr;
        }
        let arr = InsertGoalData(totalGoalCount, await totalGoal(), 'm_');
        return arr;

      }
    } catch (error) { }

    return [];
  }
  async function GetAllGoals() {
    allIdeas = await GetAllIdeas();
    let arr = [];
    arr = arr.concat(await fetchPolkadotGoalData());
    arr = arr.concat(await fetchContractGoalData());
    return arr;
  }



  async function fetchPolkadotFeedsData() {
    //Fetching data from Parachain
    try {
      if (api) {
        let totalFeedsCount = Number(await api._query.feeds.feedsIds());
        let arr = [];
        for (let i = 0; i < totalFeedsCount; i++) {
          const element = await api._query.feeds.feedById(i);
          let newElm = {
            id: element['__internal__raw'].feedId.toString(),
            date: new Date(Number(element['__internal__raw'].date)),
            type: element['__internal__raw'].feedType.toString(),
            data: JSON.parse(element['__internal__raw'].data.toString())
          };
          arr.push(newElm);
        }

        return arr;
      }
    } catch (error) { console.error(error) }
    return [];
  }
  async function fetchContractFeedsData() {
    //Fetching data from Smart contract
    try {
      if (window.contract) {
        const totalFeeds = await contract._feed_ids();

        const arr = [];
        for (let i = 0; i < Number(totalFeeds); i++) {
          const feed = await contract._feeds(i);
          let newElm = {
            id: i,
            date: Date(Number(feed.date)),
            type: feed.Type,
            data: JSON.parse(feed.data)
          }
          arr.push(newElm);
        }

        return arr;
      }
    } catch (error) { }

    return [];
  }
  async function GetAllFeeds() {
    let arr = [];
    arr = arr.concat(await fetchPolkadotFeedsData());
    arr = arr.concat(await fetchContractFeedsData());
    return arr;
  }



  async function InsertIdeaData(totalIdeaCount, allIdeas, prefix) {
    const arr = [];
    for (let i = 0; i < totalIdeaCount; i++) {
      let object = '';
      let goalId = "";
      if (prefix == 'm_') {
        object = JSON.parse(allIdeas[i].ideas_uri);
        goalId = allIdeas[i].goal_id;
      } else {
        if (allIdeas[i]?.ideasUri) {
          object = JSON.parse(allIdeas[i].ideasUri?.toString());
          goalId = allIdeas[i].goalId.toString();
        }
      }
      let ideasId = prefix + i;

      let isvoted = false;
      let currentIdeasVotes = allVotes.filter((e) => e.ideasId == ideasId)
      for (let i = 0; i < currentIdeasVotes.length; i++) {
        const element = (currentIdeasVotes[i]);
        if (Number(element.user_id) == Number(window.userid)) isvoted = true;
      }

      let votesAmount = currentIdeasVotes.length;

      let totalDonation = 0;
      let currentIdeasDonations = allDonations.filter((e) => e.ideasId == ideasId)
      for (let i = 0; i < currentIdeasDonations.length; i++) {
        const element = (currentIdeasDonations[i]);
        totalDonation += element.donation;
      }

      if (object) {
        arr.push({
          //Pushing all data into array
          id: i,
          ideasId: ideasId,
          goalId: goalId,
          Title: object.properties.Title.description,
          Description: object.properties.Description.description,
          wallet: object.properties.wallet.description,
          recieve_wallet: object.properties.recieve_wallet.description,
          recievetype: prefix == 'm_' ? 'Polkadot' : 'EVM',
          logo: object.properties.logo.description?.url,
          Referenda: Number(object.properties.Referenda.description),
          user_id: Number(object.properties.user_id.description),
          allfiles: object.properties.allFiles,
          donation: totalDonation,
          votes: votesAmount,
          isVoted: isvoted,
          isOwner: object.properties.user_id.description == Number(window.userid) ? true : false,

          type: prefix == 'm_' ? 'Polkadot' : 'EVM',
        });
      }
    }
    return arr;
  }
  async function fetchPolkadotIdeaData() {
    //Fetching data from Parachain
    try {
      if (api) {
        let totalIdeaCount = Number(await api._query.ideas.ideasIds());

        let totalIdea = async () => {
          let arr = [];
          for (let i = 0; i < totalIdeaCount; i++) {
            const element = await api._query.ideas.ideasById(i);
            let ideaURI = element['__internal__raw'];

            arr.push(ideaURI);
          }
          return arr;
        };

        let arr = InsertIdeaData(totalIdeaCount, await totalIdea(), 'p_');
        return arr;
      }
    } catch (error) { }
    return [];
  }
  async function fetchContractIdeaData() {
    //Fetching data from Smart contract
    try {
      if (window.contract) {
        const totalIdeaCount = Number(await contract._ideas_ids());
        let totalIdea = async () => {
          const arr = [];
          for (let i = 0; i < Number(totalIdeaCount); i++) {
            const idea_info = await contract._ideas_uris(i);
            arr.push(idea_info);
          }
          return arr;
        }
        let arr = InsertIdeaData(totalIdeaCount, await totalIdea(), 'm_');
        return arr;

      }
    } catch (error) { }

    return [];
  }
  async function GetAllIdeas() {
    allVotes = await GetAllVotes();
    allDonations = await GetAllDonations();

    let arr = [];
    arr = arr.concat(await fetchPolkadotIdeaData());
    arr = arr.concat(await fetchContractIdeaData());
    return arr;
  }



  async function fetchPolkadotVotesData() {
    //Fetching data from Parachain
    try {
      if (api) {
        let totalVotesCount = Number(await api._query.ideas.votesIds());
        let arr = [];
        for (let i = 0; i < totalVotesCount; i++) {
          const element = await api._query.ideas.voteById(i);
          let newElm = {
            id: element['__internal__raw'].id.toString(),
            goalId: element['__internal__raw'].goalId.toString(),
            ideasId: element['__internal__raw'].ideasId.toString(),
            user_id: element['__internal__raw'].userId.toString()
          };
          arr.push(newElm);
        }
        return arr;
      }
    } catch (error) { console.error(error) }
    return [];
  }
  async function fetchContractVotesData() {
    //Fetching data from Smart contract
    try {
      if (window.contract) {
        const totalVotes = await contract._ideas_vote_ids();

        const arr = [];
        for (let i = 0; i < Number(totalVotes); i++) {
          const ideas_vote = await contract.all_goal_ideas_votes(i);
          let newElm = {
            id: i.toString(),
            goalId: ideas_vote.goal_id.toString(),
            ideasId: ideas_vote.ideas_id.toString(),
            user_id: (ideas_vote.user_id).toString(),
          };
          arr.push(newElm);
        }

        return arr;
      }
    } catch (error) { }

    return [];
  }
  async function GetAllVotes() {

    let arr = [];
    arr = arr.concat(await fetchPolkadotVotesData());
    arr = arr.concat(await fetchContractVotesData());
    return arr;
  }

  
  async function fetchPolkadotDonationsData() {
    //Fetching data from Parachain
    try {
      if (api) {
        let totalDonationsCount = Number(await api._query.ideas.donationsIds());
        let arr = [];
        for (let i = 0; i < totalDonationsCount; i++) {
          const element = await api._query.ideas.donationsById(i);
          let newElm = {
            id: element['__internal__raw'].id.toString(),
            ideasId: element['__internal__raw'].ideasId.toString(),
            userid: element['__internal__raw'].userid.toString(),
            donation: Number(element['__internal__raw'].donation.toString())/ 1e12,
          };
          arr.push(newElm);
        }
        return arr;
      }
    } catch (error) { console.error(error) }
    return [];
  }
  async function fetchContractDonationsData() {
    //Fetching data from Smart contract
    try {
      if (window.contract) {
        const totalDonations = await contract._donations_ids();

        const arr = [];
        for (let i = 0; i < Number(totalDonations); i++) {
          const ideas_donation = await contract._donations(i);
          let newElm = {
            id: i.toString(),
            ideasId: ideas_donation.ideas_id.toString(),
            userid: ideas_donation.userid.toString(),
            donation: Number(ideas_donation.donation) / 1e18,
          };
          arr.push(newElm);
        }

        return arr;
      }
    } catch (error) { }

    return [];
  }
  async function GetAllDonations() {

    let arr = [];
    arr = arr.concat(await fetchPolkadotDonationsData());
    arr = arr.concat(await fetchContractDonationsData());
    return arr;
  }

  async function GetAllUserDonations() {
    let allDonations = await GetAllDonations();
    let users = {};
    allDonations.forEach((elm)=>{
      if (users[elm.userid]== undefined) users[elm.userid]= 0;
      users[elm.userid] = Number(users[elm.userid] ) + elm.donation;
    })
    return users;
  }

  return <AppContext.Provider value={{ api: api, deriveAcc: deriveAcc, GetAllGoals: GetAllGoals, GetAllIdeas: GetAllIdeas, GetAllVotes: GetAllVotes, GetAllFeeds: GetAllFeeds,GetAllDonations:GetAllDonations,GetAllUserDonations:GetAllUserDonations, updateCurrentUser: updateCurrentUser, GetAllDaos: GetAllDaos, GetAllJoined: GetAllJoined, showToast: showToast, EasyToast: EasyToast, getUserInfoById: getUserInfoById, userWalletPolkadot: userWalletPolkadot, userSigner: userSigner, PolkadotLoggedIn: PolkadotLoggedIn, userInfo: userInfo }}>{children}</AppContext.Provider>;
}

export const usePolkadotContext = () => useContext(AppContext);
