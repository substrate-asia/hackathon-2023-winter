import { Button, Tabs } from '@heathmont/moon-core-tw';
import { ControlsPlus, GenericEdit, GenericIdea } from '@heathmont/moon-icons-tw';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import IdeaCard from '../../../../components/components/IdeaCard';
import Loader from '../../../../components/components/Loader';
import useContract from '../../../../services/useContract';
import CreateIdeaModal from '../../../../features/CreateIdeaModal';
import EmptyState from '../../../../components/components/EmptyState';

export default function Goal() {
  //Variables
  const [list, setList] = useState([]);
  const [GoalURI, setGoalURI] = useState({
    goalId: '',
    Title: '',
    Description: '',
    Budget: '',
    End_Date: '',
    StructureLeft: [],
    StructureRight: [],
    wallet: '',
    logo: '',
    isOwner: true
  });
  const [goalId, setGoalID] = useState(-1);
  const { contract, signerAddress } = useContract();
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showCreateIdeaModal, setShowCreateIdeaModal] = useState(false);

  const regex = /\[(.*)\]/g;
  let m;
  let id = ''; //id from url

  useEffect(() => {
    const str = decodeURIComponent(window.location.search);

    while ((m = regex.exec(str)) !== null) {
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      id = m[1];
    }

    fetchContractData();
  }, [contract]);

  async function fetchContractData() {
    setLoading(true);

    try {
      if (contract && id) {
        setGoalID(Number(id));

        const goalURI = JSON.parse(await contract.goal_uri(Number(id))); //Getting total goal (Number)

        const totalIdeas = await contract.get_all_ideas_by_goal_id(Number(id)); //Getting total goal (Number)
        const arr = [];
        for (let i = 0; i < Object.keys(totalIdeas).length; i++) {
          //total goal number Iteration
          const ideasId = await contract.get_ideas_id_by_ideas_uri(totalIdeas[i]);
          const object = JSON.parse(totalIdeas[i]);
          if (object) {
            arr.push({
              //Pushing all data into array
              ideasId: ideasId,
              Title: object.properties.Title.description,
              Description: object.properties.Description.description,
              wallet: object.properties.wallet.description,
              logo: object.properties.logo.description?.url,
              allfiles: object.properties.allfiles
            });
          }
        }
        setList(arr);

        setGoalURI({
          goalId: Number(id),
          Title: goalURI.properties.Title.description,
          Description: goalURI.properties.Description.description,
          Budget: goalURI.properties.Budget.description,
          End_Date: goalURI.properties.End_Date?.description,
          wallet: goalURI.properties.wallet.description,
          logo: goalURI.properties.logo.description?.url,
          isOwner: goalURI.properties.wallet.description.toString().toLocaleLowerCase() === signerAddress.toString().toLocaleLowerCase() ? true : false
        });

        setLoading(false);

        /** TODO: Fix fetch to get completed ones as well */
        if (document.getElementById('Loading')) document.getElementById('Loading').style = 'display:none';
      }
    } catch (error) {
      setLoading(false);
      console.error('Could not load contract');
    }
  }

  function closeCreateIdeaModal() {
    setShowCreateIdeaModal(false);
  }
  function openCreateIdeaModal() {
    setShowCreateIdeaModal(true);
  }

  return (
    <>
      <Head>
        <title>Goal</title>
        <meta name="description" content="Goal" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex items-center flex-col gap-8">
        <div className="gap-8 flex flex-col w-full bg-gohan pt-10 border-beerus border">
          <div className="container flex w-full justify-between">
            <div className="flex flex-col gap-1 overflow-hidden">
              <h5 className="font-semibold">Harvard University &gt; Goals</h5>
              <h1 className="text-moon-32 font-bold">{GoalURI.Title}</h1>
              <h3 className="flex gap-2 whitespace-nowrap">
                <div>
                  <span className="text-hit font-semibold">DEV 5300000</span> of DEV 10000
                </div>
                <div>•</div>
                <div>{list.length} ideas</div>
                <div>•</div>
                <div className="flex">
                  Created by &nbsp;<span className="truncate text-piccolo max-w-[120px]">{GoalURI.wallet}</span>
                </div>
              </h3>
            </div>
            <div className="flex flex-col gap-2">
              <Button iconLeft={<ControlsPlus />} onClick={openCreateIdeaModal}>
                Create idea
              </Button>
              <Button iconLeft={<GenericEdit />} variant="secondary">
                Edit
              </Button>
            </div>
          </div>
          <div className="container">
            <Tabs selectedIndex={tabIndex} onChange={setTabIndex}>
              <Tabs.List>
                <Tabs.Tab>Description</Tabs.Tab>
                <Tabs.Tab>Ideas ({list.length})</Tabs.Tab>
              </Tabs.List>
            </Tabs>
          </div>
        </div>
        {tabIndex === 0 && <div className="container">{GoalURI.Description}</div>}
        {tabIndex === 1 && (
          <div className="flex flex-col gap-8 container items-center">
            <Loader element={list.length > 0 ? list.map((listItem, index) => <IdeaCard item={listItem} key={index} />) : <EmptyState icon={<GenericIdea className="text-moon-48" />} label="This goal doesn’t have any ideas yet." />} width={768} height={236} many={3} loading={loading} />{' '}
          </div>
        )}
      </div>
      <CreateIdeaModal show={showCreateIdeaModal} onClose={closeCreateIdeaModal} />
    </>
  );
}
