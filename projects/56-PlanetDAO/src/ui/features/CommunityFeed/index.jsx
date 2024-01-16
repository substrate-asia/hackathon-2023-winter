import ActivityCard from '../../components/components/ActivityCard';
import { useEffect, useState } from 'react';
import useContract from '../../services/useContract';
import { sortDateDesc } from '../../utils/sort-date';
import AddPostCard from '../../components/components/AddPostCard';
import CreatePostModal from '../CreatePostModal';
import { usePolkadotContext } from '../../contexts/PolkadotContext';
import Loader from '../../components/components/Loader';
import EmptyState from '../../components/components/EmptyState';
import { SportDarts } from '@heathmont/moon-icons-tw';

const CommunityFeed = ({ communityName, daoId }) => {
  const [loading, setLoading] = useState(false);
  const [Items, setItems] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [userName, setUserName] = useState('');
  const { contract } = useContract();
  const [showPostModal, setShowPostModal] = useState(false);
  const { api, userInfo, GetAllFeeds } = usePolkadotContext();

  async function fetchContractData() {
    setLoading(true);

    try {
      if (api) {
        let allFeeds = await GetAllFeeds();
        let currentFeeds = [];
        try {
          currentFeeds = allFeeds.filter((e) => e.data?.daoId == daoId);
        } catch (e) {
          currentFeeds = [];
        }

        setItems(sortDateDesc(currentFeeds, 'date'));

        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  }

  function closeShowPostModal(event) {
    if (event) {
      setShowPostModal(false);
    }
  }

  useEffect(() => {
    setAvatarUrl('https://' + userInfo.imgIpfs + '.ipfs.nftstorage.link');
    setUserName(userInfo.fullName);
  }, [userInfo]);

  useEffect(() => {
    fetchContractData();
  }, [api,daoId]);

  return (
    <div className="flex flex-col gap-2 w-full items-center pb-10 min-w-[540px]">
      <AddPostCard avatarUrl={avatarUrl} onClick={() => setShowPostModal(true)} />
      <Loader element={Items.length > 0 ? Items.map((item, index) => <ActivityCard key={index} old_date={item.date} type={item.type} data={item.data}></ActivityCard>) : <EmptyState icon={<SportDarts className="text-moon-48" />} label="There are no posts in the feed yet." />} width={540} height={120} many={3} loading={loading} />
      <CreatePostModal onClose={closeShowPostModal} show={showPostModal} avatarUrl={avatarUrl} userName={userName} communityName={communityName} />
    </div>
  );
};

export default CommunityFeed;
