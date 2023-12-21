import {
  Comment,
  Mirror,
  Post,
  PendingPost,
  CollectState,
  isMirrorPublication,
  ContentPublication,
  AnyCriterion,
  DecryptionCriteriaType,
  useEncryptedPublication,
} from '@lens-protocol/react-web';
import { ReactNode } from 'react';
import { useInView } from 'react-cool-inview';
import { Badge, Card, CardHeader, CardBody, Flex, Avatar, Box, Heading, Text, IconButton, CardFooter, Button } from '@chakra-ui/react'
import { BiChat } from 'react-icons/bi'
import { BsHeart } from 'react-icons/bs'

import { ProfilePicture } from '../../profiles/components/ProfilePicture';
import { formatAmount } from '../../utils';

function formatDecryptionCriterion(criterion: AnyCriterion): string {
  switch (criterion.type) {
    case DecryptionCriteriaType.NFT_OWNERSHIP:
      return `own NFT ${criterion.contractAddress}`;

    case DecryptionCriteriaType.ERC20_OWNERSHIP:
      return `have ERC20 ${formatAmount(criterion.amount)}`;

    case DecryptionCriteriaType.ADDRESS_OWNERSHIP:
      return `own address ${criterion.address}`;

    case DecryptionCriteriaType.PROFILE_OWNERSHIP:
      return `own profile: ${criterion.profileId}`;

    case DecryptionCriteriaType.FOLLOW_PROFILE:
      return `follow profile ${criterion.profileId}`;

    case DecryptionCriteriaType.COLLECT_PUBLICATION:
      return `have collected ${criterion.publicationId}`;

    case DecryptionCriteriaType.COLLECT_THIS_PUBLICATION:
      return `have collected this publication`;

    case DecryptionCriteriaType.OR:
      return criterion.or.map(formatDecryptionCriterion).join(', ');

    case DecryptionCriteriaType.AND:
      return criterion.and.map(formatDecryptionCriterion).join(', ');
  }
}

type ContentProps = {
  publication: ContentPublication;
};

function Content({ publication }: ContentProps) {
  const { decrypt, data, error, isPending } = useEncryptedPublication({
    publication,
  });

  const { observe } = useInView({
    threshold: 0.5,

    onEnter: ({ unobserve }) => {
      unobserve();
      void decrypt();
    },
  });

  if (isPending) {
    return <p>Decrypting...</p>;
  }

  if (error) {
    return <p>{error.message}</p>;
  }

  if (data.hidden) {
    return <p>This publication has been hidden</p>;
  }

  return (
    <CardBody ref={observe}>
      <Text>
        {data.metadata.content}
      </Text>
      {data.decryptionCriteria && (
        <small>
          <i>
            To decrypt this publication you need to:&nbsp;
            <b>{formatDecryptionCriterion(data.decryptionCriteria)}</b>
          </i>
        </small>
      )}
    </CardBody>
  );
}

type PublicationCardProps = {
  publication: Post | Comment | Mirror | PendingPost;
};

export function PublicationCard({ reactable, publication, setSnow, idx }: PublicationCardProps) {
  if (publication.__typename === 'PendingPost') {
    return (
      <article>
        <ProfilePicture picture={publication.profile.id} />
        <p>{publication.profile.name ?? `@${publication.profile.handle}`}</p>
        <div>{publication.content}</div>
      </article>
    );
  }
  // console.log("profile pic: ", publication.profile.picture.original.url)
  const badgeName = idx  % 2 ? "Experience" : "Ask for Help"
  const badgeColor = idx  % 2 ? "green" : "red"

  return (
    <Card variant={'filled'} py={3}>
      <CardHeader py={0}>
        <Flex spacing='4'>
          <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
            <ProfilePicture picture={publication.profile.id} />
            <Box>
              <Heading size='sm'>{publication.profile.name}</Heading>
              <Text>{`@${publication.profile.handle}`}</Text>
            </Box>
            <Badge colorScheme={badgeColor}>{ badgeName }</Badge>
          </Flex>
        </Flex>
      </CardHeader>
      <Content
        publication={isMirrorPublication(publication) ? publication.mirrorOf : publication}
      />
      {
        reactable && 
        <CardFooter
        justify='space-between'
        flexWrap='wrap'
        sx={{
          '& > button': {
            minW: '136px',
          },
        }}
      >
        <Button flex='1' variant='ghost' leftIcon={<BsHeart />} onClick={() => setSnow(true)}>
          Hug
        </Button>
        <Button flex='1' variant='ghost' leftIcon={<BiChat />}>
          Comment
        </Button>
      </CardFooter>
      }
      
    </Card>
  );
}

type CollectablePublicationCardProps = {
  publication: Post | Comment;
  collectButton: ReactNode;
};

export function CollectablePublicationCard({
  publication,
  collectButton,
}: CollectablePublicationCardProps) {
  return (
    <article>
      <ProfilePicture picture={publication.profile.id} />
      <p>{publication.profile.name ?? `@${publication.profile.handle}`}</p>
      <p>
        {publication.hidden ? 'This publication has been hidden' : publication.metadata.content}
      </p>
      {collectButton}
      {publication.collectPolicy.state === CollectState.COLLECT_LIMIT_REACHED && (
        <p>
          {publication.stats.totalAmountOfCollects}/{publication.collectPolicy.collectLimit}{' '}
          collected
        </p>
      )}
      {publication.collectPolicy.state === CollectState.COLLECT_TIME_EXPIRED && (
        <p>Collectable until: {publication.collectPolicy.endTimestamp}</p>
      )}
    </article>
  );
}
