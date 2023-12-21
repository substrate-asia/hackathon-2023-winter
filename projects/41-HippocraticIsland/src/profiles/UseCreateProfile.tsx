import { useCreateProfile, useProfilesOwnedByMe } from '@lens-protocol/react-web';
import React, { useState } from "react";

import { UnauthenticatedFallback } from '../components/UnauthenticatedFallback';
import { WhenLoggedInWithProfile } from '../components/auth/WhenLoggedInWithProfile';
import { never } from '../utils';
import { ProfileCard } from './components/ProfileCard';

import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  VStack,
  Avatar,
  useColorModeValue,
  Input,
  Button,
  ButtonProps,
  Image,
  FormLabel,
  Spacer, 
  useToast
} from '@chakra-ui/react';


function FileLoader() {
  const [selectedFile, setSelectedFile] = useState<Blob | undefined>();

  function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    setSelectedFile(event.target?.files?.[0]);
  }

  function handleLoad() {
    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = function (event) {
        console.log(event.target?.result); // do something with the loaded file
      };
      reader.readAsText(selectedFile);
    }
  }

  return (

    <div>
      <input type="file" accept=".pdf,image/*" onChange={handleFile} />
      <button onClick={handleLoad} disabled={!selectedFile}>
      </button>
    </div>

  );
}

function OwnedProfiles() {
  const { data } = useProfilesOwnedByMe();

  return (
    <div>
      <Center><Heading>Owned Profiles</Heading></Center>
      <Center>
        <Stack spacing={8} direction='row'>
          {data
            ?.slice()
            .reverse()
            .map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
        </Stack>
      </Center>
    </div>

  );
}

export function CreateProfileForm() {
  const { execute: create, error, isPending } = useCreateProfile();

  const toast = useToast()


  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // const form = event.currentTarget;

    // const formData = new FormData(form);
    // const handle = (formData.get('handle') as string) ?? never();

    // await create({ handle });

    // form.reset();

    setTimeout(() => {
      toast({
        title: 'Successful',
        description: "Your info has been processed",
        status: 'success',
        position: 'top',
        duration: 3000,
        isClosable: true,
      })
    }, 2000)
  };

  return (
    <Center py={6}>
      <Box
        maxW={'445px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.900')}
        boxShadow={'2xl'}
        rounded={'md'}
        p={6}
        overflow={'hidden'}>
        <Box
          h={'210px'}
          bg={'gray.100'}
          mt={-6}
          mx={-6}
          mb={6}
          pos={'relative'}>
          <Image
            h={'full'}
            w={'full'}
            src={
              'https://images.unsplash.com/photo-1612865547334-09cb8cb455da?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
            }
            objectFit={'cover'}
          />
        </Box>
        <Stack>
          <Text
            color={'green.500'}
            textTransform={'uppercase'}
            fontWeight={800}
            fontSize={'sm'}
            letterSpacing={1.1}>
            Edit
          </Text>
          <Heading
            color={useColorModeValue('gray.700', 'white')}
            fontSize={'2xl'}
            fontFamily={'body'}>
            Edit My Profile
          </Heading>
          <Text color={'gray.500'}>
            Choose a file for New Profile (only for IMG or PDF)
          </Text>
        </Stack>
        <form onSubmit={onSubmit}>
          <fieldset>
            <VStack mt={6} spacing={4} alignItems={'left'}>
              <VStack alignItems={'left'} spacing={0}>
                <FormLabel>Profile Handle</FormLabel>
                <Input
                  name="handle"
                  minLength={5}
                  maxLength={31}
                  type="text"
                  disabled={isPending}
                  placeholder='Enter a profile handle'
                />
              </VStack>
              <VStack alignItems={'left'} spacing={0}>
                <FormLabel>Upload Disease Certification</FormLabel>
                <FileLoader />
              </VStack>
              <Spacer margin={'10px'} />
              <Button
                // marginTop={'10px'}
                /* flex={1} */
                type="submit"
                disabled={isPending}
                py={6}
                fontSize={'2xl'}
                rounded={'full'}
                bg={'blue.400'}
                color={'white'}
                boxShadow={
                  '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
                }
                _hover={{
                  bg: 'blue.500',
                }}
                _focus={{
                  bg: 'blue.500',
                }}>
                  {isPending ? 'Updating ...' : 'Confirm'}
              </Button>

              {error && <p>{error.message}</p>}
            </VStack>
          </fieldset>
        </form>
      </Box>
    </Center>
  );
}

function Middle_box() {

  return (
    <Box>
      <OwnedProfiles />
    </Box>
  )
}


export function UseCreateProfile() {
  return (
    <div>
      <WhenLoggedInWithProfile>{() => <CreateProfileForm />}</WhenLoggedInWithProfile>
      <UnauthenticatedFallback message="Log in to create new profiles" />
      {/* <Middle_box /> */}
    </div>
  );
}
