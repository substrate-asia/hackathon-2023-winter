import ActivityCard from '../../components/components/ActivityCard';
import { Activity } from '../../data-model/activity';
import { Idea } from '../../data-model/idea';

const mockItems = [
  {
    date: new Date('2023-12-17T18:29:14+0000'),
    type: 'join',
    data: {
      name: '@arjenvgaal'
    }
  },
  {
    date: new Date('2023-12-17T18:29:14+0000'),
    type: 'badge',
    data: {
      name: '@stevethijssen',
      badge: 'First Donation'
    }
  },
  {
    date: new Date('2023-12-17T18:29:14+0000'),
    type: 'vote',
    data: {
      votesAmount: 250,
      goalTitle: 'Improve student lives',
      idea: {
        Title: 'Free WiFi for all students'
      }
    }
  },
  {
    date: new Date('2023-12-17T18:29:14+0000'),
    type: 'goal',
    data: {
      name: '@stevethijssen',
      goal: {
        Title: 'Improve student lives',
        budget: 120
      }
    }
  },
  {
    date: new Date('2023-12-17T18:29:14+0000'),
    type: 'donation',
    data: {
      donated: 100,
      goalTitle: 'Improve student lives',
      idea: {
        Title: 'Free WiFi for all students'
      }
    }
  },
  {
    date: new Date('2023-12-17T18:29:14+0000'),
    type: 'idea',
    data: {
      name: '@stevethijssen',
      goalTitle: 'Improve student lives',
      idea: {
        Title: 'Free WiFi for all students'
      }
    }
  }
] as Activity[];

const CommunityFeed = () => {
  return (
    <div className="container flex flex-col gap-2 w-full items-center pb-10">
      {mockItems.map((item, index) => (
        <ActivityCard key={index} date={item.date} type={item.type} data={item.data}></ActivityCard>
      ))}
    </div>
  );
};

export default CommunityFeed;
