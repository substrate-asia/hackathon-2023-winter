// 第一个页面, 登录

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  VStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Tabs, TabList, TabPanels, Tab, TabPanel
} from '@chakra-ui/react';

import { useState, useEffect } from 'react';
//   import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { ConnectButton } from '@rainbow-me/rainbowkit';
// //   import { useRouter } from 'next/router';
import { useNavigate } from 'react-router-dom';
import { useActiveProfile } from '@lens-protocol/react-web';

export default function Index() {
  // const [showPassword, setShowPassword] = useState(false);

  const { data: profile } = useActiveProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (profile) {
      navigate("/publications");
    }

  }, [profile]);

  return (
    <Flex
      minH={'80vh'}
      align={'center'}
      justify={'center'}
    // bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack spacing={8} mx={'auto'}>
        <VStack align={'center'} spacing={4}>
          <Heading fontSize={'5xl'} textAlign={'center'}>
            No one should fight alone
          </Heading>

          <Heading fontSize={'5xl'} textAlign={'center'}>
            Join <Text display={'inline'} color={'blue.400'}>Hippocratic Island</Text> today.
          </Heading>
          <Text fontSize={'2xl'} color={'gray.600'}>
            Fighting disease together, hand in hand.
          </Text>
        </VStack>

      </Stack>
    </Flex>
  )
}


