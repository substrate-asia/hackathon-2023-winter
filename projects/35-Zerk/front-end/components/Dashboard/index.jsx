import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Flex,
} from "@chakra-ui/react";
import HeadDash from "../comps/HeadDash";
import LegalVerificator from "./Lawyer";
import Juster from "./Juster";
import Donator from "./Donator";
import Admin from "./Admin";
export default function Dashboard() {
  const styleTabList = {
    mt: "7rem",
    mb: "7rem",
    ml: "1rem",
    mr: "1rem",
    fontSize: "xl",
  };

  return (
    <>
      <Tabs
        isManual
        variant="none"
        orientation="vertical"
        isFitted
        bgImage="section2.svg"
        bgSize="cover"
        bgRepeat="no-repeat"
      >
        <TabList>
          <Flex bgColor="Black" direction="column">
            <HeadDash sx={styleTabList} />
            <Tab sx={styleTabList}>Justers</Tab>
            <Tab sx={styleTabList}>Lawyers</Tab>
            <Tab sx={styleTabList}>Donators</Tab>
            <Tab sx={styleTabList}>Admin</Tab>
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
    </>
  );
}
