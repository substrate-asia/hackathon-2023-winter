import { useActiveProfile, useActiveWallet } from '@lens-protocol/react-web';
import { Link, NavLink } from 'react-router-dom';//NavLink, Link,

import { CATEGORIES } from '../../config';
import { LoginButton } from '../auth/LoginButton';

import { Stack, Popover, PopoverTrigger } from '@chakra-ui/react';//Box


import { ReactNode } from 'react';
import {
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Box,
  // Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  // Stack,
  useDisclosure,
  useColorModeValue,
} from '@chakra-ui/react';


export default function Navi() {
  // const { isOpen, onOpen, onClose } = useDisclosure();


  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'} w={'100%'}>
          {/* <HStack spacing={8} alignItems={'center'}> */}

          <HStack
            as={'nav'}
            spacing={4}
            display={{ base: 'none', md: 'flex' }}>
            {CATEGORIES.map(({ label, path }) => (
              <NavLink key={path} to={path} >
                {label}</NavLink>
            ))}
          </HStack>
          {/* </HStack> */}
        </Flex>
      </Box>
    </>
  )
}



export function Header() {
  const { data: wallet } = useActiveWallet();
  const { data: profile } = useActiveProfile();

  return (
    <header>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1600px',
          margin: 'auto',
          padding: '1rem',
        }}
      >
        <span>
          <Link to='/'>
            <strong>Hippocratic❤️ Island</strong>
          </Link>
        </span>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          {profile && <strong>{profile.handle}</strong>}

          <LoginButton />
        </div>
      </div>

      {
        wallet && <Navi />
      }
      


      {/* <nav>
        {CATEGORIES.map(({ path, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => (isActive ? 'current' : undefined)}
          >
            {label}
          </NavLink>
        ))}
      </nav> */}


      {/* <Box>
        <Flex
          bg={useColorModeValue('white', 'gray.800')}
          color={useColorModeValue('gray.600', 'white')}
          minH={'60px'}
          py={{ base: 2 }}
          px={{ base: 4 }}
          borderBottom={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.900')}
          align={'center'}>
          <Flex
            flex={{ base: 1, md: 'auto' }}
            ml={{ base: -2 }}
            display={{ base: 'flex', md: 'none' }}>
            <IconButton
              onClick={onToggle}
              icon={
                isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
              }
              variant={'ghost'}
              aria-label={'Toggle Navigation'}
            />
          </Flex>
          <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
            <Text
              textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
              fontFamily={'heading'}
              color={useColorModeValue('gray.800', 'white')}>
              Logo
            </Text>

            <Flex display={{ base: 'none', md: 'flex' }} ml={10}>


            </Box>
            <Stack direction={'row'} spacing={4}>
              {CATEGORIES.map((navItem) => (
                <Box key={navItem.label}>
                  <Popover trigger={'hover'} placement={'bottom-start'}>
                    <PopoverTrigger>
                      <Link
                        p={2}
                        href={navItem.path ?? '#'}
                        fontSize={'sm'}
                        fontWeight={500}
                        // color={linkColor}
                        _hover={{
                          textDecoration: 'none',
                          // color: linkHoverColor,
                        }}>
                        {navItem.label}
                      </Link>
                    </PopoverTrigger>

                  </Popover>
                </Box>
              ))}
            </Stack>


          </Flex>
        </Flex>

      </Flex> */}


    </header>
  );
}
