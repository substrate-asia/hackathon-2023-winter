import { Tabs } from '@heathmont/moon-core-tw';
import Stats, { ProfileStats } from './Stats';
import DAOCard from '../../components/components/DaoCard';
import GoalCard from '../../components/components/GoalCard';
import IdeaCard from '../../components/components/IdeaCard';
import { useEffect, useState } from 'react';
import useEnvironment from '../../services/useEnvironment';
import { Dao } from '../../data-model/dao';
import { Goal } from '../../data-model/goal';
import { Idea } from '../../data-model/idea';
import { JOINED } from '../../data-model/joined';
import useContract from '../../services/useContract';
import { usePolkadotContext } from '../../contexts/PolkadotContext';
import Loader from '../../components/components/Loader';

const SummaryPanel = ({ stats, loggedUser, Daos, Goals, Ideas, loading }: { stats: ProfileStats, loggedUser: boolean, Daos: Dao[], Goals: Goal[], Ideas: Idea[], loading: boolean }) => {
  const [currency, setCurrency] = useState('');
  const { api } = usePolkadotContext();

  useEffect(() => {
    setCurrency(useEnvironment.getCurrency());
  }, [api]);



  return (
    <div className="w-full flex flex-col gap-10">
      <Loader
        many={2}
        loading={loading}
        width={750}
        height={80}

        element={<Stats stats={stats} currency={currency} />} />
      <div className="flex flex-col gap-5">
        <Tabs>
          <Tabs.List>
            <Tabs.Pill className="moon-selected:bg-piccolo moon-selected:text-gohan">{loggedUser ? 'My communities' : 'Communities'}</Tabs.Pill>
            <Tabs.Pill className="moon-selected:bg-piccolo moon-selected:text-gohan">{loggedUser ? 'My goals' : 'Goals'}</Tabs.Pill>
            <Tabs.Pill className="moon-selected:bg-piccolo moon-selected:text-gohan">{loggedUser ? 'My ideas' : 'Ideas'}</Tabs.Pill>
          </Tabs.List>
          <Tabs.Panels>
            <Tabs.Panel>
              <Loader
                many={1}
                loading={loading}
                width={750}
                height={250}
                element={Daos.map((dao, index) => (
                  <DAOCard key={index} item={dao} hasJoined className="shadow-none border border-beerus" />
                ))} />
            </Tabs.Panel>
            <Tabs.Panel>
            <Loader
                many={1}
                loading={loading}
                width={750}
                height={250}
                element={Goals.map((goal, index) => (
                <GoalCard key={index} item={goal} preview className="shadow-none border border-beerus" />
              ))} />
            </Tabs.Panel>
            <Tabs.Panel>
            <Loader
            many={1}
            loading={loading}
            width={750}
            height={250}
            element={Ideas.map((idea, index) => (
                <IdeaCard key={index} item={idea} preview className="shadow-none border border-beerus" />
              ))} />
            </Tabs.Panel>
          </Tabs.Panels>
        </Tabs>
      </div>
    </div>
  );
};

export default SummaryPanel;
