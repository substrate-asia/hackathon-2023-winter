import { formatDuration, intervalToDuration, isValid } from 'date-fns';
import Card from '../Card';
import { Avatar, IconButton } from '@heathmont/moon-core-tw';
import { GenericHeart, GenericIdea, GenericPending, GenericUser, ShopWallet, SportDarts, SportSpecials } from '@heathmont/moon-icons-tw';
import IdeaCard from '../IdeaCard';
import GoalCard from '../GoalCard';
import { useEffect, useState } from 'react';
import useContract from '../../../services/useContract';
import useEnvironment from '../../../services/useEnvironment';
import { usePolkadotContext } from '../../../contexts/PolkadotContext';

const JoinActivity = ({ data }) => (
  <div className="flex gap-4 w-full items-center">
    <Avatar size="lg" className="rounded-full bg-goku shrink-0">
      <GenericUser className="text-moon-32" />
    </Avatar>
    <p>
      <span className="text-piccolo">{data.name}</span> just joined this community
    </p>
  </div>
);

const BadgeActivity = ({ data }) => (
  <div className="flex gap-4 w-full items-center">
    <Avatar size="lg" className="rounded-full bg-krillin shrink-0">
      <SportSpecials className="text-moon-32" />
    </Avatar>
    <p>
      <span className="text-piccolo">{data.name}</span> just achieved his first badge for <span className="font-semibold">{data.badge}</span>
    </p>
  </div>
);

function VoteActivity({ data }) {
  const {api,GetAllIdeas} = usePolkadotContext();

  const [ideaURI, setIdeaURI] = useState({
    ideasId: 0,
    Title: '',
    donation: 0,
    votes: 0,
    logo: '',
    isVoted: false,
    isOwner: false
  });

  async function fetchContractData() {
    if (api) {
      let allIdeas = await GetAllIdeas()
      let currentIdea=allIdeas.filter(e=>e.ideasId == data.ideasid)[0]
      setIdeaURI(currentIdea);
    
    }
  }

  useEffect(() => {
    fetchContractData();
  }, [api]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-4 w-full items-center">
        <Avatar size="lg" className="rounded-full bg-dodoria-60 text-bulma shrink-0">
          <GenericHeart className="text-moon-32" />
        </Avatar>
        <p>
          <span className="font-bold">{data.votesAmount} people voted</span> on an idea for the goal <span className="font-bold">{data.goalTitle}</span>
        </p>
      </div>
      <IdeaCard item={ideaURI} className="shadow-none !bg-goku border border-beerus" preview />
    </div>
  );
}

function GoalActivity({ data }) {
  const {api,GetAllGoals} = usePolkadotContext();

  const [goalURI, setGoalURI] = useState({
    goalId: 0,
    Title: '',
    Description: '',
    Budget: '',
    End_Date: new Date(),
    logo: '',
    ideasCount: 0,
    reached: 0
  });

  async function fetchContractData() {
    if (api) {
      let allGoals = await GetAllGoals()
      let currentGoal=allGoals.filter(e=>e.goalId == data.goalid)[0]
      setGoalURI(currentGoal);
    

    }
  }

  useEffect(() => {
    fetchContractData();
  }, [api]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-4 w-full items-center">
        <Avatar size="lg" className="rounded-full bg-jiren text-bulma shrink-0">
          <SportDarts className="text-moon-32" />
        </Avatar>
        <p>
          <span className="text-piccolo">{data.name}</span> just created a goal
        </p>
      </div>
      <GoalCard item={goalURI} preview className="shadow-none !bg-goku border border-beerus" />
    </div>
  );
}

function DonationActivity({ data }) {
  const {api,GetAllIdeas} = usePolkadotContext();

  const [currency, setCurrency] = useState('');

  const [ideaURI, setIdeaURI] = useState({
    ideasId: 0,
    Title: '',
    donation: 0,
    votes: 0,
    logo: '',
    isVoted: false,
    isOwner: false
  });

  async function fetchContractData() {
    if (api) {
      let allIdeas = await GetAllIdeas()
      let currentIdea=allIdeas.filter(e=>e.ideasId == data.ideasid)[0]
      setIdeaURI(currentIdea);
    
    }
  }

  useEffect(() => {
    setCurrency(useEnvironment.getCurrency());

    fetchContractData();
  }, [api]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-4 w-full items-center">
        <Avatar size="lg" className="rounded-full bg-cell text-bulma shrink-0">
          <ShopWallet className="text-moon-32" />
        </Avatar>
        <p>
          <span className="font-bold">
            {currency} {data.donated} donated
          </span>{' '}
          on an idea for the goal <span className="font-bold">{data.goalTitle}</span>
        </p>
      </div>
      <IdeaCard item={ideaURI} className="shadow-none !bg-goku border border-beerus" preview />
    </div>
  );
}

function IdeaActivity({ data, hideGoToButton }) {
  const {api,GetAllIdeas} = usePolkadotContext();

  const [ideaURI, setIdeaURI] = useState({
    ideasId: 0,
    Title: '',
    donation: 0,
    votes: 0,
    logo: '',
    isVoted: false,
    isOwner: false
  });

  async function fetchContractData() {
    if (api) {
      let allIdeas = await GetAllIdeas()
      let currentIdea=allIdeas.filter(e=>e.ideasId == data.ideasid)[0]
      setIdeaURI(currentIdea);
    
    }
  }

  useEffect(() => {
    fetchContractData();
  }, [api]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-4 w-full items-center">
        <Avatar size="lg" className="rounded-full bg-krillin-60 text-bulma shrink-0">
          <GenericIdea className="text-moon-32" />
        </Avatar>
        <p>
          <span className="text-piccolo">{data.name}</span> just created an idea for the goal <span className="font-bold">{data.goalTitle}</span>
        </p>
      </div>
      <IdeaCard item={ideaURI} hideGoToButton={hideGoToButton} className="shadow-none !bg-goku border border-beerus" preview />
    </div>
  );
}

const ActivityCard = ({ old_date, type, data, className, hideGoToButton }) => {
  const [formattedDuration, SetformattedDuration] = useState('');

  useEffect(() => {
    if (isValid(old_date)) {
      var date = new Date();
      var now_utc = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()));
      const duration = intervalToDuration({ start: now_utc, end: old_date });
      // Format the duration

      SetformattedDuration(`${formatDuration(duration, { format: ['days', 'minutes'], zero: false })} ago`);
    } else {
      SetformattedDuration(``);
    }
  }, []);

  return (
    <Card className={`max-w-[540px] flex flex-col !p-4 relative ${className}`}>
      <div className="w-full text-trunks flex justify-between">
        <p className="text-moon-14">{formattedDuration} </p>
        <IconButton variant="ghost" icon={<GenericPending className="text-moon-32 text-trunks" />}></IconButton>
      </div>
      {type === 'join' && <JoinActivity data={data} />}
      {type === 'badge' && <BadgeActivity data={data} />}
      {type === 'vote' && <VoteActivity data={data} />}
      {type === 'goal' && <GoalActivity data={data} />}
      {type === 'donation' && <DonationActivity data={data} />}
      {type === 'idea' && <IdeaActivity data={data} hideGoToButton={hideGoToButton} />}
    </Card>
  );
};

export default ActivityCard;
