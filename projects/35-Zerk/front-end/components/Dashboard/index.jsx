import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Flex,
  Image,
  Button,
  Box,
} from "@chakra-ui/react";
import HeadDash from "../comps/HeadDash";
import LegalVerificator from "./Lawyer";
import Juster from "./Juster";
import Donator from "./Donator";
import Admin from "./Admin";
import { color } from "framer-motion";
export default function Dashboard() {
  const styleTabList = {
    mb: "1rem",
    ml: "1rem",
    mr: "1rem",
    fontSize: "md",
    color: "gray",
    _hover: { color: "#adff00" },
  };

  return (
    <Box bgImage="section2.svg" bgSize="cover" bgRepeat="no-repeat">
      <Flex p="1rem" bgColor="black" w="100vw" justify="flex-end">
        <Button
          bgColor="transparent"
          border="1px"
          borderColor="#ADFF00"
          color="#ADFF00"
        >
          Connect Wallet
        </Button>
      </Flex>
      <Tabs mt="2rem" isManual variant="lazy" orientation="vertical" isFitted>
        <TabList>
          <Flex bgColor="Black" direction="column" justify="left">
            <HeadDash sx={styleTabList} />
            <Tab sx={styleTabList}>
              <Image mr=".5rem" src="justerGrey.svg" />
              Justers
            </Tab>

            <Tab sx={styleTabList}>
              <Image mr=".5rem" src="gravelGrey.svg" />
              Lawyers
            </Tab>
            <Tab sx={styleTabList}>
              <Image mr=".5rem" src="donatorGrey.svg" />
              Donators
            </Tab>
            <Tab sx={styleTabList}>
              <Image mr=".5rem" src="adminGrey.svg" />
              Admin
            </Tab>
          </Flex>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Juster />
          </TabPanel>
          <TabPanel>
            <LegalVerificator />
          </TabPanel>
          <TabPanel>
            <Donator />
          </TabPanel>
          <TabPanel>
            <Admin />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
