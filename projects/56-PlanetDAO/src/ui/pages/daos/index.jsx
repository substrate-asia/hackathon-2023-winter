import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import DAOCard from '../../components/components/DaoCard';
import Loader from '../../components/components/Loader';
import EmptyState from '../../components/components/EmptyState';
import useContract from '../../services/useContract';
import { Button, Modal } from '@heathmont/moon-core-tw';
import { ControlsPlus, GenericUsers } from '@heathmont/moon-icons-tw';
import CreateDaoModal from '../../features/CreateDaoModal';
import { usePolkadotContext } from '../../contexts/PolkadotContext';

export default function DAOs() {
  const { api, showToast, userWalletPolkadot,getUserInfoById, PolkadotLoggedIn } = usePolkadotContext();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDaoModal, setShowCreateDaoModal] = useState(false);

  const { contract } = useContract();

  useEffect(() => {
    fetchData()
  }, [contract, api]);
  async function fetchData() {
    let arr = [];
   arr= arr.concat(await fetchPolkadotData());
   arr= arr.concat(await fetchContractData());
    setList(arr);
  }

  async function InsertData(totalDAOCount, allDAOs, prefix) {
    const arr = [];
    for (let i = 0; i < totalDAOCount; i++) {
      //total dao number Iteration
      const object = JSON.parse(allDAOs[i]);

      if (object) {
        let user_info = await getUserInfoById(object.properties?.user_id?.description)
        arr.push({
          //Pushing all data into array
          daoId: prefix + i,
          Title: object.properties.Title.description,
          Start_Date: object.properties.Start_Date.description,
          user_info: user_info,
          logo: object.properties.logo.description?.url,
          wallet: object.properties.wallet.description,
          SubsPrice: object.properties?.SubsPrice?.description
        });
      }
    }
    return arr;
  }

  async function fetchPolkadotData() {
    setLoading(true);
    //Fetching data from Parachain
    try {
      if (api) {
        let totalDAOCount = Number(await api._query.daos.daoIds());
        let totalDao = async () => {
          let arr = [];
          for (let i = 0; i < totalDAOCount; i++) {
            const element = await api._query.daos.daoById(i);
            let daoURI = element['__internal__raw'].daoUri.toString();

            arr.push(daoURI);
          }
          return arr;
        }

        let arr = InsertData(totalDAOCount, await totalDao(), "p_");
        setLoading(false);
        return arr;
      }
    } catch (error) { }
    setLoading(false);
    return [];
  }
  async function fetchContractData() {
    setLoading(true);
    //Fetching data from Smart contract
    try {
      if (contract) {
        const totalDao = await contract.get_all_daos(); //Getting total dao (Number)
        let totalDAOCount = Object.keys(totalDao).length;
        let arr = InsertData(totalDAOCount, totalDao, "m_");
        setLoading(false);
        return arr;
      }
    } catch (error) { }

    setLoading(false);
    return [];
  }

  function closeModal() {
    setShowCreateDaoModal(false);
    fetchData();
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
