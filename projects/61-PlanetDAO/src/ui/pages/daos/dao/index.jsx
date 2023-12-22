import { Button, Tabs } from '@heathmont/moon-core-tw';
import { ControlsPlus, GenericDelete, GenericEdit, GenericLogOut, GenericPlus, SportDarts } from '@heathmont/moon-icons-tw';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import useContract from '../../../services/useContract';
import GoalCard from '../../../components/components/GoalCard';
import Loader from '../../../components/components/Loader';
import Link from 'next/link';
import CreateGoalModal from '../../../features/CreateGoalModal';
import CommunityFeed from '../../../features/CommunityFeed';
import JoinCommunityModal from '../../../features/JoinCommunityModal';
import EmptyState from '../../../components/components/EmptyState';

export default function DAO() {
  //Variables
  const [list, setList] = useState([]);
  const [DaoURI, setDaoURI] = useState({ Title: '', Description: '', SubsPrice: 0, Start_Date: '', End_Date: '', logo: '', wallet: '', typeimg: '', allFiles: [], isOwner: false });
  const [daoId, setDaoID] = useState(-1);
  const { contract, signerAddress } = useContract();
  const [JoinmodalShow, setJoinmodalShow] = useState(false);
  const [showCreateGoalModal, setShowCreateGoalModal] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [aboutTemplate, setAboutTemplate] = useState('');
  const [tabIndex, setTabIndex] = useState(0);

  const regex = /\[(.*)\]/g;
  let m;

  useEffect(() => {
    getDaoID();
    fetchContractData();
  }, [contract]);

  async function JoinCommunity() {
    setJoinmodalShow(true);
  }

  function getDaoID() {
    const str = decodeURIComponent(window.location.search);

    while ((m = regex.exec(str)) !== null) {
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      setDaoID(Number(m[1]));
    }
  }

  function deleteDao() {
    console.log('DELETE DAO');
  }

  async function fetchContractData() {
    setLoading(true);
    //Fetching data from Smart contract
    try {
      if (contract && daoId !== undefined && daoId !== null) {
        //Load everything-----------
        const daoURI = JSON.parse(await contract.dao_uri(daoId)); //Getting dao URI

        const totalGoals = await contract.get_all_goals_by_dao_id(daoId); //Getting all goals by dao id
        const arr = [];
        for (let i = 0; i < Object.keys(totalGoals).length; i++) {
          //total dao number Iteration
          const goalid = await contract.get_goal_id_by_goal_uri(totalGoals[i]);
          let goal = totalGoals[i];
          if (goal == '') continue;
          const object = JSON.parse(goal);

          if (object) {
            arr.push({
              //Pushing all data into array
              goalId: goalid,
              Title: object.properties.Title.description,
              Description: object.properties.Description.description,
              Budget: object.properties.Budget.description,
              End_Date: object.properties.End_Date.description,
              logo: object.properties.logo.description?.url
            });
          }
        }
        setList(arr);
        setIsOwner(daoURI.properties.wallet.description.toString().toLocaleLowerCase() === signerAddress.toString().toLocaleLowerCase() ? true : false);

        let daoURIShort = {
          Title: daoURI.properties.Title.description,
          Description: daoURI.properties.Description.description,
          Start_Date: daoURI.properties.Start_Date.description,
          logo: daoURI.properties.logo.description,
          wallet: daoURI.properties.wallet.description,
          typeimg: daoURI.properties.typeimg.description,
          allFiles: daoURI.properties.allFiles.description,
          SubsPrice: daoURI.properties?.SubsPrice?.description,
          isOwner
        };

        let isJoined = await contract.is_person_joined(window?.ethereum?.selectedAddress?.toLocaleLowerCase());
        const template_html = await contract._template_uris(daoId);

        setDaoURI(daoURIShort);
        setIsJoined(isJoined);
        setLoading(false);
        setAboutTemplate(template_html);
      }
    } catch (error) {
      setLoading(false);
    }
  }

  function closeCreateGoalModal() {
    setShowCreateGoalModal(false);
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
              <h1 className="text-moon-32 font-bold">{DaoURI.Title}</h1>
              <h3 className="flex gap-2 whitespace-nowrap">
                <div className="flex">
                  Managed by &nbsp;<span className="truncate text-piccolo max-w-[120px]">{DaoURI.wallet}</span>
                </div>
                <div>•</div>
                <div>
                  <span className="text-hit font-semibold">DEV 5300000</span> p/month
                </div>
              </h3>
            </div>
            <div className="flex flex-col gap-2 absolute top-0 right-0">
              {(isOwner || isJoined) && (
                <Button iconLeft={<GenericPlus />} onClick={openCreateGoalModal}>
                  Create goal
                </Button>
              )}

              {isJoined && (
                <Button iconLeft={<GenericLogOut />} variant="secondary">
                  Leave
                </Button>
              )}
              {isOwner && (
                <Link href={`/DesignDao?[${daoId}]`}>
                  <Button iconLeft={<GenericEdit />} variant="secondary" className="w-full">
                    Edit
                  </Button>
                </Link>
              )}
              {isOwner && (
                <Button iconLeft={<GenericDelete />} className="bg-dodoria" onClick={deleteDao}>
                  Delete
                </Button>
              )}
              {!isJoined && !isOwner && (
                <Button iconLeft={<ControlsPlus />} onClick={JoinCommunity}>
                  Join
                </Button>
              )}
            </div>
          </div>
          <div className="container">
            <Tabs selectedIndex={tabIndex} onChange={setTabIndex}>
              <Tabs.List>
                <Tabs.Tab>Feed</Tabs.Tab>
                <Tabs.Tab>About</Tabs.Tab>
                <Tabs.Tab>Goals ({list.length})</Tabs.Tab>
              </Tabs.List>
            </Tabs>
          </div>
        </div>
        {tabIndex === 0 && <CommunityFeed />}
        {tabIndex === 1 && <div className="container" dangerouslySetInnerHTML={{ __html: aboutTemplate }}></div>}
        {tabIndex === 2 && (
          <div className="flex flex-col gap-8 container items-center pb-10">
            <Loader element={list.length > 0 ? list.map((listItem, index) => <GoalCard item={listItem} key={index} />) : <EmptyState icon={<SportDarts className="text-moon-48" />} label="This community doesn’t have any goals yet." />} width={768} height={236} many={3} loading={loading} />{' '}
          </div>
        )}
      </div>

      <CreateGoalModal open={showCreateGoalModal} onClose={closeCreateGoalModal} />

      <JoinCommunityModal
        SubsPrice={DaoURI.SubsPrice}
        show={JoinmodalShow}
        onHide={() => {
          setJoinmodalShow(false);
        }}
        address={DaoURI.wallet}
        title={DaoURI.Title}
        dao_id={daoId}
      />
    </>
  );
}
