import { Tooltip } from '@heathmont/moon-core-tw';
import { GenericInfo } from '@heathmont/moon-icons-tw';
import { Table } from '@heathmont/moon-table-tw';
import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { usePolkadotContext } from '../../contexts/PolkadotContext';
import { JOINED } from '../../data-model/joined';
import useEnvironment from '../../services/useEnvironment';

const mockData = [
  { name: 'Steve thijssen', joinDate: new Date('2023-12-05'), votePower: 3, votesReceived: 36, commentsReceived: 15, donationsReceived: 2, donated: 2.4 },
  { name: 'Baha Uddin', joinDate: new Date('2023-12-24'), votePower: 2, votesReceived: 36, commentsReceived: 15, donationsReceived: 2, donated: 2.4 },
  { name: 'Arjen van Gaal', joinDate: new Date('2024-01-03'), votePower: 1, votesReceived: 36, commentsReceived: 15, donationsReceived: 2, donated: 2.4 },
  { name: 'Thomas Goethals', joinDate: new Date('2024-01-05'), votePower: 1, votesReceived: 36, commentsReceived: 15, donationsReceived: 2, donated: 2.4 }
];

const HeaderLabel = ({ children }) => <label className="flex items-center h-full">{children}</label>;

const MembersTable = ({ allJoined,goals }) => {
  const { api, GetAllDonations,GetAllIdeas,GetAllVotes, getUserInfoById } = usePolkadotContext();
  const [Data, setData] = useState([]);
  const [currency, setCurrency] = useState('');

  const columnsInitial = [
    {
      Header: <HeaderLabel>Name</HeaderLabel>,
      accessor: 'name'
    },
    {
      Header: <HeaderLabel>Join date</HeaderLabel>,
      accessor: 'joinDate'
    },
    {
      Header: (
        <HeaderLabel>
          Vote power level
          <Tooltip>
            <Tooltip.Trigger>
              <div className="">
                <GenericInfo className="ml-1" fontSize={16} />
              </div>
            </Tooltip.Trigger>
            <Tooltip.Content className="bg-gohan">
              This level is based on amount of received donations, votes, and comments within this community.
              <Tooltip.Arrow className="bg-gohan" />
            </Tooltip.Content>
          </Tooltip>
        </HeaderLabel>
      ),
      accessor: 'votePower'
    },
    {
      Header: <HeaderLabel>Votes received</HeaderLabel>,
      accessor: 'votesReceived',
      width: 100
    },
    {
      Header: <HeaderLabel>Comments received</HeaderLabel>,
      accessor: 'commentsReceived',
      width: 100
    },
    {
      Header: <HeaderLabel>Donations received</HeaderLabel>,
      accessor: 'donationsReceived',
      width: 100
    }
  ];

  const formatData = (items) =>
    items.map((item) => ({
      name: item.name,
      joinDate: <span>{format(item.joinDate, 'dd MMM yyyy')}</span>,
      votePower: item.votePower,
      votesReceived: item.votesReceived,
      commentsReceived: 15,
      donationsReceived: (
        <span>
          {item.donationsReceived} ({{ currency }} 2.40)
        </span>
      )
    }));

  const defaultColumn = useMemo(
    () => ({
      minWidth: 100,
      maxWidth: 300
    }),
    []
  );

  const columns = useMemo(() => columnsInitial, []);

  async function loadData() {
    if (api) {
      let Members = [];
      let allIdeas =await GetAllIdeas()
      for (let i = 0; i < allJoined.length; i++) {
        const element = allJoined[i];
        let userInfo = await getUserInfoById(element.user_id);
        let allIdeasIds= allIdeas.map((e)=>e.user_id == element.user_id)
     
        let allDonations =await GetAllDonations()
       let totalAmount = 0;
        let donations = allDonations.filter((e)=>allIdeasIds.indexOf(e.ideasId) != -1)
        donations.forEach((e)=>totalAmount += e.donation)
        let allVotes =await GetAllVotes()
        let votes = allVotes.filter((e)=>allIdeasIds.indexOf(e.ideasId) != -1)
        


        let UserCreatedGoals = goals.filter((e)=>Number(e.UserId) == Number(element.user_id))
        
        let totalVotes = 0;
        UserCreatedGoals.forEach(e=>totalVotes+=e.votesCount)
        
        let info = {
          name: userInfo?.fullName?.toString(),
          joinDate: element.joined_date,
          votePower: 1,
          votesReceived: votes.length,
          commentsReceived: 0,
          donationsReceived: donations.length,
          donated: totalAmount
        };

        Members.push(info);
      }

      // let formattedData = formatData(Members);

      setData(Members);
    }
  }
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setCurrency(useEnvironment.getCurrency());
  }, []);

  return (
    <>
      <Table columns={columns} rowSize="xl" data={Data} isSorting={true} defaultColumn={defaultColumn} width={800} defaultRowBackgroundColor="white" evenRowBackgroundColor="white" headerBackgroundColor="trunks" />
    </>
  );
};

export default MembersTable;
