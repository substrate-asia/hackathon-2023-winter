import React from "react";
import TwitterConnect from "./twitterConnect";
import GitHubConnect from "./githubConnct";
import { useServerSideProps } from "@/context/serverSideProps";

export default function UserTabQFpowerSocialLink() {
  const { userActivityTags } = useServerSideProps();
  const tagIds = userActivityTags.map((tag) => tag.id);

  const SocialLinkItems = [
    {
      id: "isTwitterConnected",
      content: <TwitterConnect key="twitter" />,
    },
    {
      id: "isGithubConnected",
      content: <GitHubConnect key="github" />,
    },
  ];

  SocialLinkItems.sort((a, b) => {
    const aSort = tagIds.includes(a.id) ? 0 : 1;
    const bSort = tagIds.includes(b.id) ? 0 : 1;
    return aSort - bSort;
  });

  return (
    <div>
      <h3 className="mb-5 text18semibold text-text-primary">Social Link</h3>

      <ul className="space-y-3">
        {SocialLinkItems.map((item) => item.content)}
      </ul>
    </div>
  );
}
