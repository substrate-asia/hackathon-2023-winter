import Image from 'next/image';
import Card from '../Card';
import { Button } from '@heathmont/moon-core-tw';
import Link from 'next/link';
import { ArrowsRightShort, SportDarts } from '@heathmont/moon-icons-tw';
import { Goal } from '../../../data-model/goal';
import { useState } from 'react';

const GoalCard = ({ item, preview }: { item: Goal; preview?: boolean }) => {
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  return (
    <Card className={`max-w-[720px] ${preview && '!bg-goku'}`}>
      <div className="flex w-full">
        <div className="rounded-moon-s-md overflow-hidden flex justify-center items-center border border-beerus" style={{ position: 'relative', width: '188px', minWidth: '188px', height: '188px' }}>
          {!showPlaceholder && <Image layout="fill" objectFit="cover" src={item.logo} onError={() => setShowPlaceholder(true)} alt="" />}
          {showPlaceholder && <SportDarts className="text-moon-48 text-trunks" />}
        </div>
        <div className="flex flex-1 flex-col gap-2 relative px-5 text-moon-16">
          <p className="font-semibold text-moon-18">{item.Title}</p>
          <div>
            <p className="font-semibold text-moon-20 text-hit">DEV {item.Budget}</p>
            <p>reached of DEV {item.Budget} goal</p>
          </div>
          <div>
            <p className="font-semibold text-moon-20 text-hit">4</p>
            <p>Ideas</p>
          </div>
          <Link href={`/daos/dao/goal?[${item.goalId}]`}>
            <Button className="absolute bottom-0 right-0" iconLeft={<ArrowsRightShort />}>
              Go to goal
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default GoalCard;
