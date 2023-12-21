import { Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';

import {
  Box,
  Center,
  useColorModeValue,
  Heading,
  Text,
  Stack,
  Image,
} from '@chakra-ui/react';


function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function Breadcrumbs() {
  const { pathname } = useLocation();
  const paths = pathname.split('/').filter(Boolean);

  return (
    <div/>
    // <Center py={12}>
    //   <Box
    //     role={'group'}
    //     p={6}
    //     maxW={'330px'}
    //     w={'full'}
    //     bg={useColorModeValue('white', 'gray.800')}
    //     boxShadow={'2xl'}
    //     rounded={'lg'}
    //     pos={'relative'}
    //     zIndex={1}>
    // <div style={{ display: 'flex', flexDirection: 'row', gap: '.5rem' }}>
    //   <Link to="/">Home</Link>
    //   {paths.map((path, index) => {
    //     const to = `/${paths.slice(0, index + 1).join('/')}`;

    //     return (
    //       <Fragment key={index}>
    //         <span>/</span>
    //         <span key={to}>
    //           <Link to={to}>{capitalizeFirstLetter(path)}</Link>
    //         </span>
    //       </Fragment>
    //     );
    //   })}
    // </div>
    // </Box>
    // </Center>
  )
}
