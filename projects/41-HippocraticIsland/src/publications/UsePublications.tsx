import { profileId, usePublications } from '@lens-protocol/react-web';

import { ErrorMessage } from '../components/error/ErrorMessage';
import { Loading } from '../components/loading/Loading';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { PublicationCard } from './components/PublicationCard';

import { Tabs, Tab, TabList, TabPanels, TabPanel, TabIndicator, LinkOverlay, LinkBox, VStack, HStack, Button } from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom'

export function UsePublications({ tag }) {
  const metadataFilter_disease = {
    restrictPublicationLocaleTo: tag
  }

  useEffect(() => {
    console.log("metadataFilter changed: ", metadataFilter_disease)
  }, [metadataFilter_disease])

  const {
    data: publications,
    error,
    loading,
    hasMore,
    observeRef,
  } = useInfiniteScroll(usePublications({
    profileId: profileId('0x770a'),
    metadataFilter: metadataFilter_disease
  }));

  useEffect(() => {
    console.log("debug pub id ", publications)
  }, [publications])


  if (loading) return <Loading />;

  if (error) return <ErrorMessage error={error} />;

  return (
    <VStack spacing={4}>
      {publications.map((publication, idx) => (
        <LinkBox>
          <LinkOverlay as={RouterLink} to={`/publication/${publication.id}`}>
            <PublicationCard reactable={false} key={publication.id} idx={idx} publication={publication} />
          </LinkOverlay>
        </LinkBox>
      ))}
      {hasMore && <p ref={observeRef}>Loading more...</p>}
    </VStack>
  )

}

export function UsePublicationsWrapper() {
  const [tag, setTag] = useState<string>('hi')



  const CATEGORIES = [
    { name: "HIV", tag: "hi" },
    { name: "Depression", tag: "de" },
    { name: "Mania", tag: "mn" }
  ]

  const handleTabChange = (tabIdx) => {
    const selectedTag = CATEGORIES[tabIdx].tag
    console.log("debug tab change ", tabIdx, selectedTag)
    setTag(selectedTag)
  }



  return (
    <>
      <HStack justifyContent={'space-between'}>
        <Tabs my={10} onChange={handleTabChange} variant='soft-rounded'>
          <TabList>
            {CATEGORIES.map((item) => (
              <Tab key={item.tag}>{item.name}</Tab>
            ))}
          </TabList>
        </Tabs>
        <Button>Post</Button>
      </HStack>

      <UsePublications tag={tag} />
    </>
  );
}
