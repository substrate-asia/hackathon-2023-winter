import Image from 'next/image';
import Card from '../Card';
import { Dao } from '../../../data-model/dao';
import { Button } from '@heathmont/moon-core-tw';
import { ArrowsRightShort, GenericUsers } from '@heathmont/moon-icons-tw';
import { intervalToDuration, isPast } from 'date-fns';
import Link from 'next/link';
import { useState } from 'react';

const DAOCard = ({ item }: { item: Dao }) => {
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  const startDate = new Date();
  const endDate = new Date(item.Start_Date); // 5 days later

  const duration = intervalToDuration({ start: startDate, end: endDate });

  // Format the duration
  let formattedDuration = '';
  formattedDuration += duration.days > 0 ? `${duration.days} days ` : '';
  formattedDuration += duration.hours > 0 ? `${duration.hours} hours ` : '';
  formattedDuration += duration.minutes > 0 ? `and ${duration.minutes} min` : '';
  formattedDuration = formattedDuration.trim();

  const hasAlreadyPast = isPast(item.Start_Date);

  return (
    <Card className="max-w-[720px]">
      <div className="flex w-full">
        <div className="rounded-moon-s-md overflow-hidden flex justify-center items-center border border-beerus" style={{ position: 'relative', width: '188px', minWidth: '188px', height: '188px' }}>
          {!showPlaceholder && <Image layout="fill" objectFit="cover" src={item.logo} onError={() => setShowPlaceholder(true)} alt="" />}
          {showPlaceholder && <GenericUsers className="text-moon-48 text-trunks" />}
        </div>
        <div className="flex flex-1 flex-col gap-2 relative px-5 text-moon-16">
          <p className="font-semibold text-moon-18">{item.Title}</p>
          <p>Subscription of ${item.SubsPrice} p/month</p>
          <p>
            Managed by <span className="text-piccolo">{item.wallet}</span>
          </p>
          {!hasAlreadyPast && <p className="text-hit font-bold">Opens in {formattedDuration}</p>}
          <Link href={`/daos/dao?[${item.daoId}]`}>
            <Button className="absolute bottom-0 right-0" iconLeft={<ArrowsRightShort />}>
              Go to community
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default DAOCard;
