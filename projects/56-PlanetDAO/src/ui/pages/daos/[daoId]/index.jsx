import { Button, Tabs } from '@heathmont/moon-core-tw';
import { GenericEdit, GenericLogOut, GenericPlus, SportDarts } from '@heathmont/moon-icons-tw';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import useContract from '../../../services/useContract';
import GoalCard from '../../../components/components/GoalCard';
import Loader from '../../../components/components/Loader';
import Link from 'next/link';
import CreateGoalModal from '../../../features/CreateGoalModal';
import CommunityFeed from '../../../features/CommunityFeed';
import TopCommunityMembers from '../../../features/TopCommunityMembers';
import { usePolkadotContext } from '../../../contexts/PolkadotContext';
import EmptyState from '../../../components/components/EmptyState';
import MembersTable from '../../../features/MembersTable';
import { useRouter } from 'next/router';
import CommunitySwitcher from './CommunitySwitcher';

export default function DAO() {
  //Variables
  const [list, setList] = useState([]);
  const { api, showToast, getUserInfoById, PolkadotLoggedIn,GetAllVotes,GetAllIdeas, GetAllJoined, GetAllGoals } = usePolkadotContext();
  const [DaoURI, setDaoURI] = useState({ Title: '', Description: '', SubsPrice: 0, Start_Date: '', End_Date: '', logo: '', wallet: '', typeimg: '', allFiles: [], isOwner: false });
  const [daoIdTxt, setDaoTxtID] = useState('');
  const [daoId, setDaoID] = useState(-1);
  const { contract } = useContract();
  const [showCreateGoalModal, setShowCreateGoalModal] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [JoinedID, setJoinedID] = useState(9999);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [aboutTemplate, setAboutTemplate] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const [daoType, setDaoType] = useState('polkadot');
  const [communityMembers, setCommunityMembers] = useState([]);

  const router = useRouter();

  useEffect(() => {
    getDaoID();
    fetchData();
  }, [contract, api, router]);

  useEffect(()=>{
    (async function (){
      if (aboutTemplate != '' && window){
        setTimeout(()=>{
          let template_container = document.querySelector(".template-container");
          template_container.innerHTML = aboutTemplate;
        let joinBTN =   template_container.querySelector(".join-community-block")
        let goalBTN =   template_container.querySelector(".create-goal-block")
        if ((isOwner || isJoined) && joinBTN){
          joinBTN.setAttribute("style","display:none");
        }

        if (!(isOwner || isJoined) && goalBTN){
          goalBTN.setAttribute("style","display:none");
        }

        },500)
      }
    })();
  },[aboutTemplate,tabIndex])

  async function fetchData() {
    fetchDaoData();

    if (router.query.daoId) {
      fetchContractDataFull();
    }
  }

  function getDaoID() {
    const daoIdParam = router.query.daoId;

    if (!daoIdParam) {
      return;
    }

    const split = daoIdParam.split('_');
    const type = daoIdParam.startsWith('m_') ? 'metamask' : 'polkadot';
    const id = split[1];

    setDaoType(type);
    setDaoID(Number(id));
    setDaoTxtID(daoIdParam);
  }

  async function leaveCommunity() {
    setLeaving(true);

    try {
      // Leaving Community in Smart contract
      await sendTransaction(await window.contract.populateTransaction.leave_community(Number(JoinedID)));

      router.push('/joined');
      toast.update(ToastId, {
        render: 'Successful!',
        type: 'success',
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
        closeOnClick: true,
        draggable: true
      });

      setLeaving(false);
    } catch (error) {
      setLeaving(false);
    }
  }

  async function UpdateDaoData(dao_uri, template_html) {
    const daoURI = JSON.parse(dao_uri); //Getting dao URI

    setIsOwner(daoURI.properties?.user_id?.description.toString() === window?.userid?.toString() ? true : false);
    let user_info = await getUserInfoById(daoURI.properties?.user_id?.description);

    let allJoined = await GetAllJoined();
    let currentJoined = allJoined.filter((e) => e?.daoId == daoIdTxt.toString());
    let joinedInfo = currentJoined.filter((e) => e?.user_id.toString() == window.userid.toString());
    if (joinedInfo.length > 0) {
      setIsJoined(true);
      setJoinedID(joinedInfo.id);
    } else {
      setIsJoined(false);
      setJoinedID(9999);
    }

    setCommunityMembers(currentJoined);
    let daoURIShort = {
      Title: daoURI.properties.Title.description,
      Description: daoURI.properties.Description.description,
      Start_Date: daoURI.properties.Start_Date.description,
      logo: daoURI.properties.logo.description,
      user_info: user_info,
      wallet: daoURI.properties.wallet.description,
      typeimg: daoURI.properties.typeimg.description,
      allFiles: daoURI.properties.allFiles.description,
      SubsPrice: daoURI.properties?.SubsPrice?.description,
      isOwner
    };

    setDaoURI(daoURIShort);
    setAboutTemplate(template_html);
  }

  async function fetchDaoData() {
    setLoading(true);

    if (daoId !== undefined && daoId !== null && api && daoId != -1) {
      //Fetching data from Parachain
      if (api && daoType == 'polkadot') {
        try {
          const element = await api._query.daos.daoById(Number(daoId));
          let daoURI = element['__internal__raw'].daoUri.toString();
          let template_html = (await api._query.daos.templateById(daoId)).toString();
          UpdateDaoData(daoURI, template_html);
        } catch (e) {}
      }
      if (contract && daoType == 'metamask') {
        //Load everything-----------
        const daoURI = await contract.dao_uri(Number(daoId)); //Getting dao URI
        const template_html = await contract._template_uris(daoId);

        UpdateDaoData(daoURI, template_html);
      }
    }

    setLoading(false);
  }

  async function fetchContractDataFull() {
    setLoading(true);
    try {
      if (api && daoId !== undefined && daoId !== null) {
        //Load everything-----------

        let allGoals = await GetAllGoals();
        let currentGoals = allGoals.filter((e) => e?.daoId == daoIdTxt.toString());

        const arr = [];
        for (let i = 0; i < currentGoals.length; i++) {
          let goalElm = currentGoals[i];
          //All Ideas Count
          let allIdeas = await GetAllIdeas();
          let goalIdeas = allIdeas.filter(e=>e?.goalId.toString() == goalElm.goalId.toString())
          goalElm.ideasCount = goalIdeas.length;

          
          //All Votes Count
          let allIdeasVotes = await GetAllVotes();
          let goalvotes = allIdeasVotes.filter(e=>e?.goalId.toString() == goalElm.goalId.toString())
          goalElm.votesCount = goalvotes.length;


       


          arr.push(goalElm);
        }

        setLoading(false);
        setList(arr.reverse());
      }
    } catch (error) {}
    setLoading(false);
  }

  function closeCreateGoalModal(event) {
    if (event) {
      setShowCreateGoalModal(false);
    }
  }
  function openCreateGoalModal() {
    setShowCreateGoalModal(true);
  }

  return (
    <>
      <Head>
        <title>DAO</title>
        <meta name="description" content="DAO" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`flex items-center flex-col gap-8`}>
        <div className={`gap-8 flex flex-col w-full bg-gohan pt-10 border-beerus border`}>
          <div className="container flex w-full justify-between relative">
            <div className="flex flex-col gap-1">
              <h5 className="font-semibold">Community</h5>
              <CommunitySwitcher title={DaoURI.Title} daoId={daoIdTxt} />
              <h3 className="flex gap-2 whitespace-nowrap">
                <div className="flex">
                  Managed by &nbsp;
                  <a href={'/Profile/' + DaoURI?.user_info?.id} className="truncate text-piccolo max-w-[120px]">
                    @{DaoURI?.user_info?.fullName.toString()}
                  </a>
                </div>
                <div>•</div>
                <div>
                  <span className="text-hit font-semibold">${DaoURI.SubsPrice}</span> p/month
                </div>
              </h3>
            </div>
            <div className="flex flex-col gap-2 absolute top-0 right-0">
              {(isOwner || isJoined) && (
                <Button iconLeft={<GenericPlus />} onClick={openCreateGoalModal}>
                  Create goal
                </Button>
              )}

              {isJoined && !isOwner && (
                <Button onClick={leaveCommunity} iconLeft={<GenericLogOut />} variant="secondary" animation={leaving && 'progress'}>
                  Leave
                </Button>
              )}
              {isOwner && (
                <Link href={`/DesignDao?[${daoIdTxt}]`}>
                  <Button iconLeft={<GenericEdit />} variant="secondary" className="w-full">
                    Edit
                  </Button>
                </Link>
              )}
              {/* {isOwner && (
                <Button iconLeft={<GenericDelete />} className="bg-dodoria" onClick={deleteDao}>
                  Delete
                </Button>
              )} */}
            </div>
          </div>
          <div className="container">
            <Tabs selectedIndex={tabIndex} onChange={setTabIndex}>
              <Tabs.List>
                <Tabs.Tab>Feed</Tabs.Tab>
                <Tabs.Tab>About</Tabs.Tab>
                <Tabs.Tab>Goals ({list.length})</Tabs.Tab>
                <Tabs.Tab>Members ({communityMembers.length})</Tabs.Tab>
              </Tabs.List>
            </Tabs>
          </div>
        </div>
        {tabIndex === 0 && (
          <div className="container flex gap-6">
            <CommunityFeed communityName={DaoURI.Title} daoId={daoIdTxt} /> <TopCommunityMembers goals={list} allJoined={communityMembers} daoId={daoIdTxt} />
          </div>
        )}
        {tabIndex === 1 && <div className="template-container mt-[-2rem]" style={{'width':'100%'}}></div>}
        {tabIndex === 2 && (
          <div className="flex flex-col gap-8 container items-center pb-10">
            <Loader element={list.length > 0 ? list.map((listItem, index) => <GoalCard item={listItem} key={index} />) : <EmptyState icon={<SportDarts className="text-moon-48" />} label="This community doesn’t have any goals yet." />} width={768} height={236} many={3} loading={loading} />{' '}
          </div>
        )}
        {tabIndex === 3 && (
          <div className="flex flex-col gap-8 container items-center pb-10">
            <MembersTable allJoined={communityMembers} goals={list} />
          </div>
        )}
      </div>

      <CreateGoalModal open={showCreateGoalModal} onClose={closeCreateGoalModal} daoId={daoIdTxt} />
    </>
  );
}
