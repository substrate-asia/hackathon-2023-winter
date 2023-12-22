import { Profile } from '@lens-protocol/react-web';

import { ProfilePicture } from './ProfilePicture';
import {
  Heading,
  Avatar,
  Box,
  Center,
  Image,
  Flex,
  Text,
  Stack,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';

type ProfileCardProps = {
  profile: Profile;
};

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <Center py={6}>
      <Box
        maxW={'470px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'2xl'}
        rounded={'md'}
        overflow={'hidden'}>
        {/* <Image
          h={'120px'}
          w={'full'}
          src={
            'https://images.unsplash.com/photo-1612865547334-09cb8cb455da?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
          }
          objectFit={'cover'}
        /> */}
        <Flex justify={'center'} mt={12}>
          <Avatar
            size={'xl'}
            src={
              'https://guild.xyz/requirementLogos/lens.png'
            }
            alt={'Author'}
            css={{
              border: '2px solid white',
            }}
          />
        </Flex>
        <Box p={6} width={200}>
          <Stack spacing={0} align={'center'} mb={5}>
            <Heading fontSize={'xl'} fontWeight={500} fontFamily={'body'}>
            {profile.handle}
            </Heading>
            {/* <Text color={'gray.500'}>Frontend Developer</Text> */}
          </Stack>
        </Box>
      </Box>
    </Center>

  );
}

type SmallProfileCardProps = {
  profile: Profile;
};

export function SmallProfileCard({ profile }: SmallProfileCardProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <ProfilePicture picture={profile.id} />
      <p>{profile?.handle}</p>
    </div>
  );
}
