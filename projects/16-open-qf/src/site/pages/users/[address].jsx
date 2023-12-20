import MainContainer from "@/components/containers/main";
import Backdrop from "@/components/layouts/backdrop";
import UserLayout from "@/components/layouts/userLayout";
import UserInfo from "@/components/user/info";
import UserTabs from "@/components/user/tabs";
import UserTabsContent from "@/components/user/tabs/content";
import { getRoundCategoriesList } from "@/services/rounds";
import {
  getActivityTags,
  getAddressActivityTags,
  getAddressContributions,
  getAddressProjects,
} from "@/services/user";
import { loadCommonServerSideProps, withCommonPageWrapper } from "@/utils/ssr";

const UserPage = withCommonPageWrapper(() => {
  return (
    <UserLayout>
      <Backdrop className="static h-auto top-0 z-0">
        <MainContainer className="pt-10 pb-0 space-y-10 max-sm:pb-0">
          <UserInfo />

          <UserTabs />
        </MainContainer>
      </Backdrop>

      <MainContainer className="pt-5 pb-10">
        <UserTabsContent />
      </MainContainer>
    </UserLayout>
  );
});

export default UserPage;

export async function getServerSideProps(context) {
  const { address } = context.params;

  const { result: categories } = await getRoundCategoriesList(1);

  const [{ result: activityTags }, { result: userActivityTags }] =
    await Promise.all([getActivityTags(), getAddressActivityTags(address)]);

  const { result: contributions } = await getAddressContributions(address);

  const { result: projects } = await getAddressProjects(address);

  return {
    props: {
      ...loadCommonServerSideProps(context),
      projects: projects ?? [],
      categories: categories ?? [],
      activityTags: activityTags ?? [],
      userActivityTags: userActivityTags ?? [],
      contributions: contributions ?? [],
    },
  };
}
