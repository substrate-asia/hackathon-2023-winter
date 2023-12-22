import { Button } from '@heathmont/moon-core-tw';
import { ControlsPlus, GenericUsers } from '@heathmont/moon-icons-tw';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Loader from '../../components/components/Loader';
import DAOCard from '../../components/components/DaoCard';
import EmptyState from '../../components/components/EmptyState';
import CreateDaoModal from '../../features/CreateDaoModal';
import useContract from '../../services/useContract';
import { usePolkadotContext } from '../../contexts/PolkadotContext';
declare let window;
export const Joined = () => {
  const { api, GetAllDaos } = usePolkadotContext();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDaoModal, setShowCreateDaoModal] = useState(false);

  const { contract, signerAddress } = useContract();

  useEffect(() => {
    fetchContractData();
  }, [contract,api]);

  async function fetchContractData() {
    setLoading(true);
    //Fetching data from Smart contract
    try {
      if (contract && api) {
        let allDaos = await GetAllDaos();

        const totalJoined = await contract._join_ids();

        const arrList = [];
        for (let i = 0; i < Number(totalJoined); i++) {
          const joined_dao = await contract._joined_person(i)
          let foundDao = (allDaos as any).filter(e => Number(e?.id) == Number( joined_dao.daoid));
          if (joined_dao.user_id ==  Number((window).userid) && foundDao.length > 0){
            arrList.push(foundDao[0]);
          }

        }
        setList(arrList);
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
