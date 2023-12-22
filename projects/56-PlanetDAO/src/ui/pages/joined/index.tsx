import { Button } from '@heathmont/moon-core-tw';
import { ControlsPlus, GenericUsers } from '@heathmont/moon-icons-tw';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Loader from '../../components/components/Loader';
import DAOCard from '../../components/components/DaoCard';
import EmptyState from '../../components/components/EmptyState';
import CreateDaoModal from '../../features/CreateDaoModal';
import useContract from '../../services/useContract';

export const Joined = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDaoModal, setShowCreateDaoModal] = useState(false);

  const { contract, signerAddress } = useContract();

  useEffect(() => {
    fetchContractData();
  }, [contract]);

  async function fetchContractData() {
    setLoading(true);
    //Fetching data from Smart contract
    try {
      if (contract) {
        const totalDao = await contract.get_all_daos();

        const arr = [];
        for (let i = 0; i < Object.keys(totalDao).length; i++) {
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
        <title>Joined communities</title>
        <meta name="description" content="DAO" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`flex items-center flex-col gap-8`}>
        <div className={`gap-8 flex w-full bg-gohan pt-10 pb-6 border-beerus border`}>
          <div className="container flex w-full justify-between">
            <h1 className="text-moon-32 font-bold">Joined communities</h1>
            <Button iconLeft={<ControlsPlus />} onClick={openModal}>
              Create community
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-8 container items-center pb-10">
          <Loader element={list.length > 0 ? list.map((listItem, index) => <DAOCard item={listItem} key={index} />) : <EmptyState icon={<GenericUsers className="text-moon-48" />} label="You haven't joined any communities yet" />} loading={loading} width={768} height={236} many={3} />{' '}
        </div>
      </div>

      <CreateDaoModal open={showCreateDaoModal} onClose={closeModal} />
    </>
  );
};

export default Joined;
