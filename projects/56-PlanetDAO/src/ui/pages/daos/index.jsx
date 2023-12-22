import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import DAOCard from '../../components/components/DaoCard';
import Loader from '../../components/components/Loader';
import EmptyState from '../../components/components/EmptyState';
import useContract from '../../services/useContract';
import { Button, Modal } from '@heathmont/moon-core-tw';
import { ControlsPlus, GenericUsers } from '@heathmont/moon-icons-tw';
import CreateDaoModal from '../../features/CreateDaoModal';

export default function DAOs() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDaoModal, setShowCreateDaoModal] = useState(false);

  const { contract } = useContract();

  useEffect(() => {
    fetchContractData();
  }, [contract]);

  async function fetchContractData() {
    setLoading(true);
    //Fetching data from Smart contract
    try {
      if (contract) {
        const totalDao = await contract.get_all_daos(); //Getting total dao (Number)
        const arr = [];
        for (let i = 0; i < Object.keys(totalDao).length; i++) {
          //total dao number Iteration
          const object = JSON.parse(totalDao[i]);

          if (object) {
            arr.push({
              //Pushing all data into array
              daoId: i,
              Title: object.properties.Title.description,
              Start_Date: object.properties.Start_Date.description,
              logo: object.properties.logo.description?.url,
              wallet: object.properties.wallet.description,
              SubsPrice: object.properties?.SubsPrice?.description
            });
          }
        }
        setList(arr);
        /** TODO: Fix fetch to get completed ones as well */
        if (document.getElementById('Loading')) document.getElementById('Loading').style = 'display:none';
      }
    } catch (error) {}

    setLoading(false);
  }

  function closeModal() {
    setShowCreateDaoModal(false);
  }
  function openModal() {
    setShowCreateDaoModal(true);
  }

  return (
    <>
      <Head>
        <title>Communities</title>
        <meta name="description" content="DAO" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`flex items-center flex-col gap-8`}>
        <div className={`gap-8 flex w-full bg-gohan pt-10 pb-6 border-beerus border`}>
          <div className="container flex w-full justify-between">
            <h1 className="text-moon-32 font-bold">All communities</h1>
            <Button iconLeft={<ControlsPlus />} onClick={openModal}>
              Create community
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-8 container items-center pb-10">
          <Loader element={list.length > 0 ? list.map((listItem, index) => <DAOCard item={listItem} key={index} />) : <EmptyState icon={<GenericUsers className="text-moon-48" />} label="There are no communities created yet" />} loading={loading} width={768} height={236} many={3} type="rounded" />{' '}
        </div>
      </div>

      <CreateDaoModal open={showCreateDaoModal} onClose={closeModal} />
    </>
  );
}
